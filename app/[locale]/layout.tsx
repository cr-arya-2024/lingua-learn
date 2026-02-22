import { ReactNode } from 'react';
import { LocaleProvider } from '@/lib/locale-context';
import { isValidLocale, DEFAULT_LOCALE, Locale } from '@/lib/i18n';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'fr' },
    { locale: 'hi' },
  ];
}

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function LocalizedLayout({ children, params }: Props) {
  const locale = (isValidLocale(params.locale) ? params.locale : DEFAULT_LOCALE) as Locale;

  return (
    <LocaleProvider initialLocale={locale}>
      {children}
    </LocaleProvider>
  );
}
