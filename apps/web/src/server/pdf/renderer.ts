import path from 'node:path';
import { chromium, Browser } from 'playwright';
import { env } from '@/server/env';

let browserPromise: Promise<Browser> | null = null;

async function getBrowser() {
  if (!browserPromise) {
    browserPromise = chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  }
  return browserPromise;
}

export async function renderHtmlToPdf(options: {
  html: string;
  css?: string;
  baseUrl?: string;
}): Promise<Buffer> {
  const browser = await getBrowser();
  const context = await browser.newContext();
  const page = await context.newPage();
  const base = options.baseUrl ?? env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>${
    options.css ? `<style>${options.css}</style>` : ''
  }<base href="${base}"></head><body>${options.html}</body></html>`;
  await page.setContent(html, { waitUntil: 'networkidle', timeout: 30000 });
  // Best effort: wait for images if any; do not fail the whole render on timeout
  try {
    await page.waitForFunction(
      () => Array.from(document.images).every((i) => i.complete && (i.naturalHeight || 0) > 0),
      undefined,
      { timeout: 10000 }
    );
  } catch {}
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
  });
  await context.close();
  return Buffer.from(pdf);
}

