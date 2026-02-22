import Link from 'next/link';

/**
 * Shown when the user cancels or leaves Stripe Checkout without paying.
 * cancel_url is set to NEXT_PUBLIC_APP_URL/cancel
 * (middleware redirects /cancel to /en/cancel or the user's locale).
 */
export default function CancelPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😔</div>
        <h1 className="text-3xl font-bold text-slate-300 mb-2">Checkout cancelled</h1>
        <p className="text-slate-400 mb-8">
          No charge was made. You can try again whenever you&apos;re ready.
        </p>
        <Link
          href="/premium"
          className="inline-block px-8 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all"
        >
          Back to Premium
        </Link>
      </div>
    </div>
  );
}
