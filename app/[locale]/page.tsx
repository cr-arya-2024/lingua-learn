import Link from 'next/link';
import { Locale, isValidLocale, DEFAULT_LOCALE, getNestedValue } from '@/lib/i18n';

// This must be imported at build time to load translations
import translations from '@/locales/en.json';

type Props = {
  params: { locale: string };
};

// Get all supported locales for static generation
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'fr' },
    { locale: 'hi' },
  ];
}

// Function to load locale JSON at build time
function getLocaleData(locale: Locale): Record<string, any> {
  try {
    // Try to require the locale-specific file
    return require(`@/locales/${locale}.json`);
  } catch {
    // Fallback to English if locale file doesn't exist
    return require('@/locales/en.json');
  }
}

export default function LocalizedPage({ params }: Props) {
  const locale = (isValidLocale(params.locale) ? params.locale : DEFAULT_LOCALE) as Locale;
  
  // Load translations for this locale
  const localeTranslations = getLocaleData(locale);
  
  // Helper function for getting translations on server
  const getText = (key: string) => {
    return getNestedValue(localeTranslations, key) || getNestedValue(translations, key) || key;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] text-white">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Locale Switcher */}
        <div className="mb-8 flex justify-center gap-2">
          {['en', 'es', 'fr', 'hi'].map((loc) => (
            <Link
              key={loc}
              href={`/${loc}`}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                locale === loc
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              {loc.toUpperCase()}
            </Link>
          ))}
        </div>

        {/* Landing Section */}
        <h1 className="text-5xl font-bold mb-4 text-green-400">{getText('landing.title')}</h1>
        <p className="text-xl text-gray-300 mb-8">{getText('landing.subtitle')}</p>
        <Link
          href={`/${locale}/learn`}
          className="inline-block px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all text-lg"
        >
          {getText('landing.cta_button')}
        </Link>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-800 rounded-xl">
            <div className="text-3xl mb-2">🎓</div>
            <h3 className="font-bold mb-2 text-green-400">Personalized Learning</h3>
            <p className="text-gray-400 text-sm">Learn at your own pace with adaptive lessons</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl">
            <div className="text-3xl mb-2">🔥</div>
            <h3 className="font-bold mb-2 text-green-400">Build Your Streak</h3>
            <p className="text-gray-400 text-sm">Stay motivated with daily challenges</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl">
            <div className="text-3xl mb-2">🌍</div>
            <h3 className="font-bold mb-2 text-green-400">Global Community</h3>
            <p className="text-gray-400 text-sm">Connect with learners worldwide</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-16 flex justify-center gap-4 text-sm text-gray-400">
          <Link href={`/${locale}/login`} className="hover:text-green-400 transition-colors">
            {getText('navbar.home')}
          </Link>
          <span>•</span>
          <Link href={`/${locale}/learn`} className="hover:text-green-400 transition-colors">
            {getText('navbar.courses')}
          </Link>
          <span>•</span>
          <a href="#" className="hover:text-green-400 transition-colors">
            {getText('footer.about')}
          </a>
          <span>•</span>
          <a href="#" className="hover:text-green-400 transition-colors">
            {getText('footer.contact')}
          </a>
        </div>
      </div>
    </div>
  );
}
