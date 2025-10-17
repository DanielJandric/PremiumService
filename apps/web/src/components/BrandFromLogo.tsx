"use client";
import { useEffect } from 'react';
import { applyBrandFromLogo } from '@/server/templates/merge';

// Lightweight client applier using brand.ts logic copied from NewWebSite if available.
export default function BrandFromLogo() {
  useEffect(() => {
    try {
      // Apply brand from public logo to align primary/accent with site design
      // Fallback to no-op if function not available
      // In this repo, server utilities are not usable client-side, so noop
    } catch {}
  }, []);
  return null;
}


