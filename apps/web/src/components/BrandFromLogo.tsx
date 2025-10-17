"use client";
import { useEffect } from 'react';

// Lightweight client applier using brand.ts logic copied from NewWebSite if available.
export default function BrandFromLogo() {
  useEffect(() => {
    // Lightweight client-side color hinting: set CSS vars from data attributes on <html> if provided
    try {
      const root = document.documentElement;
      const primary = root.getAttribute('data-brand-primary');
      const accent = root.getAttribute('data-brand-accent');
      if (primary) root.style.setProperty('--brand', primary);
      if (accent) root.style.setProperty('--accent', accent);
    } catch {}
  }, []);
  return null;
}


