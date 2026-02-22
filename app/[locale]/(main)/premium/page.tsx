import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserPremiumStatus } from '@/db/queries';
import Link from 'next/link';
import { PremiumPlanButtons, type PlanItem } from '@/components/premium-plan-buttons';

const FEATURES = [
  { icon: '❤️', title: 'Unlimited Hearts', description: 'Never run out of hearts. Practice as much as you want.' },
  { icon: '📊', title: 'Progress Tracking', description: 'Detailed analytics and insights about your learning journey.' },
  { icon: '🏆', title: 'Leaderboard Boosts', description: 'Earn 2x XP to dominate the leaderboard.' },
  { icon: '🚀', title: 'Ad-Free Experience', description: 'Learn without interruptions or distractions.' },
  { icon: '📚', title: 'Offline Mode', description: 'Download lessons and practice anywhere, even without internet.' },
  { icon: '🌟', title: 'All Languages', description: 'Unlock access to all available language courses.' },
];

// Server-only: read env to decide which plans to show. Price IDs are never sent to the client.
function getPlans(): PlanItem[] {
  const PRICE_MONTHLY = (process.env.PRICE_MONTHLY ?? '').trim();
  const PRICE_YEARLY = (process.env.PRICE_YEARLY ?? '').trim();
  const PRICE_LIFETIME = (process.env.PRICE_LIFETIME ?? '').trim();

  const all: PlanItem[] = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$6.99',
      period: '/month',
      description: 'Billed monthly',
      popular: false,
      savings: null,
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$4.17',
      period: '/month',
      description: 'Billed $49.99/year',
      popular: true,
      savings: 'Save 40%',
    },
    {
      id: 'lifetime',
      name: 'Lifetime Access',
      price: '$99.99',
      period: 'one-time',
      description: 'Pay once, use forever',
      popular: false,
      savings: 'Best Deal',
    },
  ];

  return all.filter((p) => {
    const id = p.id as 'monthly' | 'yearly' | 'lifetime';
    const env =
  // Debug (remove after confirming): server-side env check
  if (process.env.NODE_ENV === 'development') {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    console.log('[premium] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY on server:', pk ? `${pk.slice(0, 12)}...` : 'NOT SET');
  }
      id === 'monthly' ? PRICE_MONTHLY : id === 'yearly' ? PRICE_YEARLY : PRICE_LIFETIME;
    return env.startsWith('price_') && !env.includes('XXXXXXXX');
  });
}

export default async function PremiumPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  let isPremium = false;
  try {
    const premiumStatus = await getUserPremiumStatus();
    isPremium = !!premiumStatus;
  } catch (e) {
    console.error(e);
  }

  if (isPremium) {
    return (
      <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
        <div className="max-w-2xl mx-auto w-full px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌟</div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-3">You have Super!</h1>
            <p className="text-slate-400 mb-8">You are already enjoying all premium benefits.</p>
            <Link
              href="/learn"
              className="inline-block px-8 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all"
            >
              Continue Learning
            </Link>
          </div>

          <div className="grid gap-4">
            {FEATURES.map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-[#2a2a2a] rounded-xl border border-green-500/30">
                <div className="text-2xl flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="font-bold text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
                <div className="ml-auto text-green-400">✓</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-2xl mx-auto w-full px-4 py-8">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-bold mb-2">
            Upgrade to <span className="text-yellow-400">Super</span>
          </h1>
          <p className="text-slate-400">Take your language learning to the next level</p>
        </div>

        <div className="grid gap-4 mb-8">
          {FEATURES.map((feature, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-[#2a2a2a] rounded-xl border border-[#3a3a3a]">
              <div className="text-2xl flex-shrink-0">{feature.icon}</div>
              <div>
                <h3 className="font-bold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-center">Choose Your Plan</h2>
          {(() => {
            const plans = getPlans();
            if (plans.length === 0) {
              return (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-sm">
                  No plans configured. Add PRICE_MONTHLY and PRICE_YEARLY (and optionally PRICE_LIFETIME) to .env.local.
                </div>
              );
            }
            return <PremiumPlanButtons plans={plans} />;
          })()}
        </div>

        <div className="text-center">
          <p className="text-slate-500 text-xs mb-2">Secure payment powered by Stripe</p>
          <p className="text-slate-500 text-xs">Cancel anytime. No questions asked.</p>
        </div>
      </div>
    </div>
  );
}
