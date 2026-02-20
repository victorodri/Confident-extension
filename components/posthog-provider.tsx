'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initAnalytics, capturePageView } from '@/lib/analytics';

export function PosthogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Inicializar Posthog una sola vez
    initAnalytics();
  }, []);

  useEffect(() => {
    // Capturar page view en cada navegación
    if (pathname) {
      capturePageView(pathname);
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
