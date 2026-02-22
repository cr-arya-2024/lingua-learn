/**
 * i18n.ts - Translation utilities
 * Note: This file cannot use fs module because locale-context.tsx imports it on the client side.
 * For server-side translation loading, use app/[locale]/layout.tsx which has access to require('fs')
 */

const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'hi'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Get a nested translation value by dot notation key
 * @param obj - Object to search
 * @param key - Dot notation key (e.g., "landing.title")
 * @returns Value or undefined if not found
 */
export function getNestedValue(obj: Record<string, any>, key: string): any {
  return key.split('.').reduce((current, prop) => current?.[prop], obj);
}

/**
 * Translate a key using pre-loaded translations
 * This is a client-side version that works with translation objects passed from server
 * @param key - Dot notation key (e.g., "landing.title")
 * @param translations - Pre-loaded translations object
 * @param locale - Current locale for fallback
 * @returns Translated string or the key itself if not found
 */
export function t(key: string, translations: Record<string, any>, locale: Locale = 'en'): string {
  // Get value from provided translations
  let value = getNestedValue(translations, key);

  // Return the value or the key as a last resort
  return value || key;
}

/**
 * Validate if a locale is supported
 * @param locale - Locale string to validate
 * @returns true if locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

/**
 * Get the default locale
 */
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Get all supported locales
 */
export const getSupportedLocales = (): Locale[] => [...SUPPORTED_LOCALES];
