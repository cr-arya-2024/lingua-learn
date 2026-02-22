'use client';

import { useState } from 'react';

/** Display-only plan; price IDs are resolved server-side from env. */
export type PlanItem = {
  id: 'monthly' | 'yearly' | 'lifetime';
  name: string;
  price: string;
  period: string;
  description: string;
  popular: boolean;
  savings: string | null;
};

type PremiumPlanButtonsProps = {
  plans: PlanItem[];
};

/**
 * Calls POST /api/create-checkout-session with planKey (monthly/yearly/lifetime).
 * API uses process.env.PRICE_MONTHLY, PRICE_YEARLY, PRICE_LIFETIME — never sent to client.
 */
async function startCheckout(planKey: PlanItem['id']): Promise<void> {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planKey }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create checkout session');
  }

  const url = data.url;
  if (url) {
    window.location.href = url;
    return;
  }

  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!pk || !pk.startsWith('pk_')) {
    throw new Error(
      'Checkout URL was not returned. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local and restart the dev server.'
    );
  }
  const { loadStripe } = await import('@stripe/stripe-js');
  const stripe = await loadStripe(pk);
  if (!stripe) throw new Error('Failed to load Stripe');
  const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
  if (error) throw new Error(error.message);
}

export function PremiumPlanButtons({ plans }: PremiumPlanButtonsProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onClick = async (plan: PlanItem) => {
    setError(null);
    setLoadingId(plan.id);
    try {
      await startCheckout(plan.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoadingId(null);
    }
  };

  return (
    <>
      <div className="grid gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative p-5 rounded-2xl border transition-all ${
              plan.popular
                ? 'bg-yellow-500/10 border-yellow-500/60'
                : 'bg-[#2a2a2a] border-[#3a3a3a]'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            {plan.savings && !plan.popular && (
              <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {plan.savings}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-lg">{plan.name}</h3>
                <p className="text-sm text-slate-400">{plan.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => onClick(plan)}
                disabled={!!loadingId}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-70 ${
                  plan.popular
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-black'
                    : 'bg-green-500 hover:bg-green-400 text-white'
                }`}
              >
                {loadingId === plan.id ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Redirecting…
                  </span>
                ) : (
                  `Get ${plan.name} Plan`
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}
    </>
  );
}
