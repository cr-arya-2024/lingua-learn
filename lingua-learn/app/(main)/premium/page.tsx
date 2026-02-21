import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserPremiumStatus } from '@/db/queries';
import Link from 'next/link';

const FEATURES = [
  { icon: '❤️', title: 'Unlimited Hearts', description: 'Never run out of hearts. Practice as much as you want.' },
  { icon: '📊', title: 'Progress Tracking', description: 'Detailed analytics and insights about your learning journey.' },
  { icon: '🏆', title: 'Leaderboard Boosts', description: 'Earn 2x XP to dominate the leaderboard.' },
  { icon: '🚀', title: 'Ad-Free Experience', description: 'Learn without interruptions or distractions.' },
  { icon: '📚', title: 'Offline Mode', description: 'Download lessons and practice anywhere, even without internet.' },
  { icon: '🌟', title: 'All Languages', description: 'Unlock access to all available language courses.' },
];

const PLANS = [
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
    name: 'Lifetime',
    price: '$99.99',
    period: 'one-time',
    description: 'Pay once, use forever',
    popular: false,
    savings: 'Best Deal',
  },
];

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
          <div className="grid gap-4">
            {PLANS.map(plan => (
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
                <form action="/api/stripe/checkout" method="POST" className="mt-4">
                  <input type="hidden" name="plan" value={plan.id} />
                  <button
                    type="submit"
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                      plan.popular
                        ? 'bg-yellow-500 hover:bg-yellow-400 text-black'
                        : 'bg-green-500 hover:bg-green-400 text-white'
                    }`}
                  >
                    Get {plan.name} Plan
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-500 text-xs mb-2">Secure payment powered by Stripe</p>
          <p className="text-slate-500 text-xs">Cancel anytime. No questions asked.</p>
        </div>
      </div>
    </div>
  );
}
