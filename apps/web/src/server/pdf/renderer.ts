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
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>${
    options.css ? `<style>${options.css}</style>` : ''
  }</head><body>${options.html}</body></html>`;
  const base = options.baseUrl || env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3004';
  await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.addScriptTag({ content: `document.querySelectorAll('img').forEach(img => { if (img.getAttribute('src')?.startsWith('/')) { img.src = '${base}' + img.getAttribute('src'); } });` });
  await page.waitForLoadState('load');
  await page.waitForFunction(() => Array.from(document.images).every((i) => (i.complete && (i.naturalHeight||0) > 0)), null, { timeout: 10000 });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
  });
  await context.close();
  return Buffer.from(pdf);
}

