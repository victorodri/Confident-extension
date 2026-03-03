'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n';

export function LanguageSelector() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = params.locale as string;

  const switchLocale = (newLocale: string) => {
    // Replace the current locale in the pathname with the new one
    const segments = pathname.split('/');
    segments[1] = newLocale; // locale is always the first segment after /
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            currentLocale === locale
              ? 'bg-purple-100 text-purple-700 font-medium'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          aria-label={`Switch to ${locale === 'es' ? 'Spanish' : 'English'}`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
