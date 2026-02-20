export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
export async function POST() {
  try {
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user || !user.email) return new NextResponse('Unauthorized', { status: 401 });
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', payment_method_types: ['card'], customer_email: user.email,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      metadata: { userId: user.id },
      success_url: process.env.NEXT_PUBLIC_APP_URL + '/learn?success=true',
      cancel_url: process.env.NEXT_PUBLIC_APP_URL + '/premium',
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[STRIPE_CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
