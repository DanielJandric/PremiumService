import { prisma } from '@/server/db';
import { supabaseAdmin } from '@/server/supabaseAdmin';
import { renderHtmlToPdf } from '@/server/pdf/renderer';
import { defaultClassicCH } from '@/server/templates/classicCH';
import { renderTemplate } from '@/server/templates/merge';
import { env } from '@/server/env';
import { computeTotals, formatCurrency, formatDateISOToCH, quoteOrInvoiceSchema } from '@domain/index';
import { nextNumber } from '@/server/numbering';

function getTodayLocalISODate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function createDocument(payload: unknown, options: { validated: boolean }) {
  // Server-side default for issueDate if omitted by client/LLM
  const prefilled =
    payload && typeof payload === 'object'
      ? { ...(payload as any), issueDate: (payload as any).issueDate ?? getTodayLocalISODate() }
      : payload;

  const parsed = quoteOrInvoiceSchema.safeParse(prefilled);
  if (!parsed.success) throw new Error('Invalid payload');
  if (!options.validated) throw new Error('Validation gating not satisfied');
  const data = parsed.data;

  const number = data.number ?? (await nextNumber(data.kind));
  const totals = computeTotals(data.items);

  // Pick the most recently created template if available, otherwise fallback
  const selectedTemplate = await prisma.template.findFirst({ orderBy: { createdAt: 'desc' } });
  const candidateHtml = selectedTemplate?.htmlSource;
  const supportsV2 = !!candidateHtml && candidateHtml.includes('{{titleKind}}') && candidateHtml.includes('formatted.vatRatePercent');
  const htmlSource = supportsV2 ? (selectedTemplate!.htmlSource as string) : defaultClassicCH.htmlSource;
  const cssSource = supportsV2 ? (selectedTemplate!.css as string) : defaultClassicCH.css;
  const brand = (selectedTemplate?.brand as any) ?? defaultClassicCH.brand;

  const year = new Date(data.issueDate).getFullYear();
  const id = crypto.randomUUID();
  const fileName = `${number}-${id}.pdf`;
  const pdfPath = `documents/${data.kind}/${year}/${fileName}`;

  // Render HTML from template
  const itemsForTemplate = data.items.map((it) => {
    const vatRate = it.vatRate ?? 0.081;
    const lineSubtotal = it.quantity * it.unitPrice;
    const lineVat = lineSubtotal * vatRate;
    const lineTotal = lineSubtotal + lineVat;
    return {
      ...it,
      vatRate,
      amount: lineTotal,
      formatted: {
        quantity: String(it.quantity),
        unitPrice: formatCurrency(it.unitPrice, data.currency),
        vatRatePercent: `${Math.round(vatRate * 1000) / 10}%`,
        amount: formatCurrency(lineTotal, data.currency),
      },
    };
  });
  const templateData = {
    // Prefer seller provided data, then fill missing from template brand
    company: {
      name: data.seller.name ?? brand?.company?.name,
      address: data.seller.address ?? brand?.company?.address,
      email: data.seller.email ?? brand?.company?.email,
      vatNumber: brand?.company?.vatNumber,
      logoUrl: brand?.logoUrl || '/template/logo.png',
    },
    brand: { primaryColor: brand?.primaryColor ?? '#0b1f1a' },
    payment: brand?.payment,
    buyer: data.buyer,
    number,
    issueDate: formatDateISOToCH(data.issueDate),
    dueDate: data.dueDate ? formatDateISOToCH(data.dueDate) : undefined,
    items: itemsForTemplate,
    totals: {
      subtotal: formatCurrency(totals.subtotal, data.currency),
      vat: formatCurrency(totals.vat, data.currency),
      total: formatCurrency(totals.total, data.currency),
    },
    notes: data.notes,
    terms: brand?.terms ?? 'Paiement à 30 jours. Intérêts de retard 5% p.a.',
    titleKind: data.kind === 'facture' ? 'Facture' : 'Devis',
  };
  const mergedHtml = renderTemplate(htmlSource, templateData as any);
  const pdf = await renderHtmlToPdf({ html: mergedHtml, css: cssSource });

  // Upload to Supabase Storage
  const { error } = await supabaseAdmin.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(pdfPath, pdf, { contentType: 'application/pdf', upsert: false });
  if (error) throw error;

  const publicUrl = supabaseAdmin.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(pdfPath).data.publicUrl;

  const created = await prisma.document.create({
    data: {
      kind: data.kind,
      number,
      customer: data.buyer as any,
      items: data.items as any,
      currency: data.currency,
      subtotal: totals.subtotal,
      vat: totals.vat,
      total: totals.total,
      pdfPath,
      pdfPublicUrl: publicUrl,
      issueDate: new Date(data.issueDate),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      templateId: selectedTemplate?.id ?? null,
    },
  });

  return created;
}

