import { prisma } from './db';

export async function nextNumber(kind: 'devis' | 'facture'): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `${kind === 'devis' ? 'DEV' : 'FAC'}-${year}-`;
  const sequence = await prisma.$transaction(async (tx) => {
    const existing = await tx.sequence.findUnique({
      where: { kind_prefix: { kind, prefix } },
    });
    if (existing) {
      const updated = await tx.sequence.update({
        where: { id: existing.id },
        data: { counter: existing.counter + 1 },
      });
      return { prefix, counter: updated.counter };
    }
    const created = await tx.sequence.create({
      data: { kind, prefix, counter: 1 },
    });
    return { prefix, counter: created.counter };
  });
  const padded = `${sequence.counter}`.padStart(3, '0');
  return `${prefix}${padded}`;
}

