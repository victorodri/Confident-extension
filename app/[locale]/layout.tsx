import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Suspense } from 'react';
import '../globals.css';
import { PosthogProvider } from '@/components/posthog-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Confident — Tu confidente en cada conversación importante',
    template: '%s | Confident'
  },
  description: 'Extensión de Chrome con IA que te sugiere qué decir en tiempo real durante videollamadas. Coach especializado para entrevistas, ventas y presentaciones.',
  keywords: ['entrevistas', 'coaching', 'IA', 'ventas', 'Google Meet', 'asistente'],
  authors: [{ name: 'Victor Rodríguez' }],
  creator: 'Confident',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://tryconfident.com',
    title: 'Confident — Tu confidente en conversaciones importantes',
    description: 'IA que te sugiere qué decir en tiempo real. Especializado para entrevistas, ventas y presentaciones.',
    siteName: 'Confident',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Confident — Tu confidente silencioso',
    description: 'IA que te sugiere qué decir en tiempo real durante videollamadas.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Obtener mensajes del locale actual usando getMessages de next-intl
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Suspense fallback={null}>
            <PosthogProvider>
              {children}
            </PosthogProvider>
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
