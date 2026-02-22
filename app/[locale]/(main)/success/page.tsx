import Link from 'next/link';

/**
 * Shown after the user completes Stripe Checkout successfully.
 * success_url is set to NEXT_PUBLIC_APP_URL/success?session_id={CHECKOUT_SESSION_ID}
 * (middleware redirects /success to /en/success or the user's locale).
 */
export default function SuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-400 mb-2">Payment successful</h1>
        <p className="text-slate-400 mb-8">
          Thank you for upgrading. Your premium benefits are now active.
        </p>
        <Link
          href="/learn"
          className="inline-block px-8 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all"
        >
          Continue to Learn
        </Link>
      </div>
    </div>
  );
}
