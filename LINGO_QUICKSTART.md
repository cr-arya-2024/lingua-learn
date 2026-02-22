# Lingo.dev Quickstart for LinguaLearn

## 🚀 Get Started in 5 Minutes

### Step 1: Install & Setup
```bash
npm install
cp .env.example .env.local
```

### Step 2: Add Lingo.dev API Key
Edit `.env.local` and add your Lingo.dev API key:
```
LINGO_API_KEY=your_key_here
```

### Step 3: Generate Translations
```bash
npm run i18n:translate
```

This command:
- ✅ Reads English strings from `locales/en.json`
- ✅ Generates Spanish (es), French (fr), Hindi (hi) translations
- ✅ Creates/updates `locales/es.json`, `locales/fr.json`, `locales/hi.json`
- ✅ Generates `i18n.lock` for consistency tracking

### Step 4: Run the App
```bash
npm run dev
```

Visit:
- `http://localhost:3000/en` → English
- `http://localhost:3000/es` → Spanish
- `http://localhost:3000/fr` → French
- `http://localhost:3000/hi` → Hindi

## 📁 File Structure

```
i18n.json                    # Lingo.dev config
locales/
  ├── en.json               # Source (English)
  ├── es.json               # Generated (Spanish)
  ├── fr.json               # Generated (French)
  └── hi.json               # Generated (Hindi)
lib/
  ├── i18n.ts               # Translation helpers
  └── locale-context.tsx    # React context
middleware.ts               # Locale routing
app/[locale]/              # Localized routes
```

## 💻 Use Translations

### In Server Components:
```tsx
import { t } from '@/lib/i18n';

export default function Page({ params }: { params: { locale: string } }) {
  return <h1>{t('landing.title', params.locale as Locale)}</h1>;
}
```

### In Client Components:
```tsx
'use client';
import { useLocale } from '@/lib/locale-context';
import { t } from '@/lib/i18n';

export function Component() {
  const { locale } = useLocale();
  return <h1>{t('landing.title', locale)}</h1>;
}
```

## 🌐 Locale Switcher

Add buttons to switch languages:
```tsx
<button onClick={() => setLocale('es')}>Español</button>
<button onClick={() => setLocale('fr')}>Français</button>
<button onClick={() => setLocale('hi')}>हिन्दी</button>
```

The middleware automatically redirects and sets cookies.

## 📝 Add New Strings

1. Edit `locales/en.json`:
```json
{
  "new_section": {
    "title": "New Title",
    "description": "New Description"
  }
}
```

2. Run translation:
```bash
npm run i18n:translate
```

3. Commit:
```bash
git add locales/ i18n.lock
git commit -m "Add new translations"
```

## ✅ Verify Setup

After running `npm run i18n:translate`, check:
- ✅ `locales/es.json` exists and has translations
- ✅ `locales/fr.json` exists and has translations
- ✅ `locales/hi.json` exists and has translations
- ✅ `i18n.lock` file is created

All should be committed to git!

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `i18n.json` | Lingo.dev CLI configuration |
| `locales/en.json` | Source English strings |
| `locales/[es,fr,hi].json` | Auto-generated translations |
| `lib/i18n.ts` | Translation helper functions |
| `lib/locale-context.tsx` | React locale context provider |
| `middleware.ts` | Locale detection & routing |
| `app/[locale]/layout.tsx` | Localized layout wrapper |
| `app/[locale]/page.tsx` | Example localized page |

## 🔧 Troubleshooting

**Q: No translations generated?**
- Check `.env.local` has `LINGO_API_KEY` set
- Ensure `locales/en.json` has content
- Try: `npm install && npm run i18n:translate`

**Q: Middleware not routing locales?**
- Clear `.next`: `rm -rf .next`
- Restart dev server: `npm run dev`
- Check URL: should be `localhost:3000/en`, not `localhost:3000`

**Q: Missing translations on page?**
- Verify `t()` is using correct locale parameter
- Check translation key exists in `locales/[locale].json`
- Clear browser cache and hard refresh

## 📚 Learn More

- [Lingo.dev Docs](https://docs.lingo.dev)
- [i18n Setup Guide](./I18N_SETUP.md)
- [App Router Docs](https://nextjs.org/docs/app)

## 🎉 Next Steps

- ✅ Run `npm run i18n:translate`
- ✅ Commit `locales/` and `i18n.lock`
- ✅ Test locale switching in browser
- ✅ Add more translations as needed
