import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { upsertUserPremium } from '@/db/queries';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new NextResponse('Webhook Error: ' + message, { status: 400 });
  }

  const session = event.data.object as unknown as Record<string, unknown>;

  if (event.type === 'checkout.session.completed') {
    const subscriptionId = (session.subscription as string);
    const metadata = session.metadata as Record<string, string> | null;
    if (!metadata?.userId) {
      return new NextResponse('User id required', { status: 400 });
    }
    await upsertUserPremium(
      metadata.userId,
      session.customer as string,
      subscriptionId,
      true
    );
  }

  if (event.type === 'customer.subscription.deleted') {
    console.log('Subscription cancelled for', session.customer);
  }

  return new NextResponse(null, { status: 200 });
}
