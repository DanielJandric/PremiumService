export const defaultClassicCH = {
  name: 'Classic CH',
  htmlSource: `
    <div style="font-family: Inter, system-ui, sans-serif; font-size: 12px; color: #0b1f1a;">
      <header style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:48px; border-bottom:4px solid {{brand.primaryColor}}; padding-bottom:12px;">
        <div style="display:flex; gap:12px; align-items:flex-start;">
          {{#if company.logoUrl}}<img src="{{company.logoUrl}}" style="height:96px; object-fit:contain;" />{{/if}}
          <div style="margin-top:12mm;">
            <h1 style="font-size:20px; margin:0;">{{company.name}}</h1>
            <div>{{company.address}}</div>
            {{#if company.email}}<div>{{company.email}}</div>{{/if}}
            {{#if company.vatNumber}}<div>TVA: {{company.vatNumber}}</div>{{/if}}
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:20px; font-weight:700; letter-spacing:0.5px;">{{titleKind}}</div>
          <div style="opacity:0.8;">N° {{number}}</div>
          <div style="opacity:0.8;">Date: {{issueDate}}</div>
          {{#if dueDate}}<div style="opacity:0.8;">Échéance: {{dueDate}}</div>{{/if}}
        </div>
      </header>

      <section style="margin-bottom:16px;">
        <div style="font-weight:600;">Client</div>
        <div>{{buyer.name}}</div>
        <div>{{buyer.address}}</div>
        {{#if buyer.email}}<div>{{buyer.email}}</div>{{/if}}
      </section>

      <table style="width:100%; border-collapse:collapse; margin-top:12px;">
        <thead>
          <tr style="background: {{brand.primaryColor}}; color: white;">
            <th style="text-align:left; padding:8px;">Description</th>
            <th style="text-align:right; padding:8px;">Qté</th>
            <th style="text-align:right; padding:8px;">PU</th>
            <th style="text-align:right; padding:8px;">TVA</th>
            <th style="text-align:right; padding:8px;">Montant</th>
          </tr>
        </thead>
        <tbody>
          {{#each items}}
          <tr style="border-bottom:1px solid #e5e7eb;">
            <td style="padding:8px;">{{this.description}}</td>
            <td style="padding:8px; text-align:right;">{{this.formatted.quantity}}</td>
            <td style="padding:8px; text-align:right;">{{this.formatted.unitPrice}}</td>
            <td style="padding:8px; text-align:right;">{{this.formatted.vatRatePercent}}</td>
            <td style="padding:8px; text-align:right;">{{this.formatted.amount}}</td>
          </tr>
          {{/each}}
        </tbody>
      </table>

      <section style="margin-top:16px; margin-left:auto; width:320px;">
        <div style="display:flex; justify-content:space-between;"><span>Sous-total</span><span>{{totals.subtotal}}</span></div>
        <div style="display:flex; justify-content:space-between;"><span>TVA</span><span>{{totals.vat}}</span></div>
        <div style="display:flex; justify-content:space-between; font-weight:700;"><span>Total</span><span>{{totals.total}}</span></div>
      </section>

      {{#if notes}}
      <section style="margin-top:16px;">
        <div style="font-weight:600;">Notes</div>
        <div>{{notes}}</div>
      </section>
      {{/if}}

      <footer style="margin-top:24px; font-size:11px; color:#374151;">
        <div style="font-weight:600;">Paiement</div>
        <div>IBAN {{payment.iban}} – BIC {{payment.bic}} – {{payment.bank}} – Devise {{payment.currency}}</div>
        {{#if terms}}<div style="margin-top:8px; white-space:pre-wrap;">{{terms}}</div>{{/if}}
      </footer>
    </div>
  `,
  css: `
    @page { margin: 20mm; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  `,
  brand: {
    logoUrl: '/logo-transparent.png',
    primaryColor: '#0b1f1a',
    company: {
      name: 'Premium Solution',
      address: 'Route de la Combaz 11, Crans-Montana, 3963, Suisse',
      email: 'info@premium-solution.ch',
      vatNumber: 'CHE-123.456.789 MWST',
    },
    payment: {
      iban: 'CH12 3456 7890 1234 5678 9',
      bic: 'POFICHBEXXX',
      bank: 'PostFinance SA',
      currency: 'CHF',
    },
    terms:
      'Paiement à 30 jours. Intérêts de retard 5% p.a. en cas de non-paiement.',
  },
};

