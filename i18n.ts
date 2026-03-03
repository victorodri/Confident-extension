import { getRequestConfig } from 'next-intl/server';

// Idiomas soportados
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

// Idioma por defecto: Español
export const defaultLocale: Locale = 'es';

export default getRequestConfig(async ({ requestLocale }) => {
  // El locale puede venir del requestLocale o usar el default
  let locale = await requestLocale;

  // Si no hay locale o no es válido, usar el default
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
