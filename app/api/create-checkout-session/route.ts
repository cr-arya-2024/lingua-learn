import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

// Price IDs from .env.local only (never sent to client). Stripe Dashboard → Products → Prices.
const PRICE_MONTHLY = (process.env.PRICE_MONTHLY ?? '').trim();
const PRICE_YEARLY = (process.env.PRICE_YEARLY ?? '').trim();
const PRICE_LIFETIME = (process.env.PRICE_LIFETIME ?? '').trim();

const PLAN_KEYS = ['monthly', 'yearly', 'lifetime'] as const;
type PlanKey = (typeof PLAN_KEYS)[number];

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) throw new Error('NEXT_PUBLIC_APP_URL is not set in .env.local');
  return url.replace(/\/$/, '');
};

function getPriceIdForPlan(planKey: PlanKey): string | null {
  switch (planKey) {
    case 'monthly':
      return PRICE_MONTHLY.startsWith('price_') ? PRICE_MONTHLY : null;
    case 'yearly':
      return PRICE_YEARLY.startsWith('price_') ? PRICE_YEARLY : null;
    case 'lifetime':
      return PRICE_LIFETIME.startsWith('price_') && !PRICE_LIFETIME.includes('XXXXXXXX') ? PRICE_LIFETIME : null;
    default:
      return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_placeholder')) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY is not set. Add it to .env.local from Stripe Dashboard → API keys.' },
        { status: 500 }
      );
    }

    const baseUrl = getBaseUrl();

    const body = await req.json();
    const planKey = typeof body?.planKey === 'string' ? body.planKey.trim().toLowerCase() : '';

    if (!PLAN_KEYS.includes(planKey as PlanKey)) {
      return NextResponse.json(
        { error: 'Missing or invalid planKey. Use "monthly", "yearly", or "lifetime".' },
        { status: 400 }
      );
    }

    const priceId = getPriceIdForPlan(planKey as PlanKey);
    if (!priceId) {
      const envKey = planKey === 'yearly' ? 'PRICE_YEARLY' : planKey === 'monthly' ? 'PRICE_MONTHLY' : 'PRICE_LIFETIME';
      return NextResponse.json(
        { error: `${envKey} is not configured` },
        { status: 400 }
      );
    }

    // priceId for yearly comes from process.env.PRICE_YEARLY above (never sent to client)

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const envKey = planKey === 'yearly' ? 'PRICE_YEARLY' : planKey === 'monthly' ? 'PRICE_MONTHLY' : 'PRICE_LIFETIME';

    let mode: 'subscription' | 'payment';
    try {
      const price = await stripe.prices.retrieve(priceId);
      mode = price.recurring ? 'subscription' : 'payment';
    } catch (priceErr: unknown) {
      const err = priceErr as { statusCode?: number; message?: string };
      const is404 = err?.statusCode === 404;
      const msg = is404
        ? `${envKey} not found in Stripe. Check that the value in .env.local exists in the same Stripe account as your secret key (Dashboard → Products → Prices).`
        : (err?.message || 'Invalid price ID or Stripe error');
      console.error('[create-checkout-session] price retrieve failed:', err?.statusCode, err?.message);
      return NextResponse.json(
        { error: msg },
        { status: 400 }
      );
    }

    let session;
    try {
      session = await stripe.checkout.sessions.create({
        mode,
        payment_method_types: ['card'],
        customer_email: user.email,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/cancel`,
        metadata: { userId: user.id },
      });
    } catch (sessionErr: unknown) {
      const err = sessionErr as { statusCode?: number; message?: string };
      const is404 = err?.statusCode === 404;
      const msg = is404
        ? `${envKey} not found in Stripe. Update .env.local with a valid price ID from Dashboard → Products → Prices.`
        : (err?.message || 'Failed to create checkout session');
      console.error('[create-checkout-session] session create failed:', err?.statusCode, err?.message);
      return NextResponse.json(
        { error: msg },
        { status: 400 }
      );
    }

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: unknown) {
    console.error('[create-checkout-session]', error);
    const message =
      error && typeof (error as { message?: string }).message === 'string'
        ? (error as { message: string }).message
        : 'Failed to create checkout session';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
