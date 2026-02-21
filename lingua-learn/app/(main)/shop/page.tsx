'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SHOP_ITEMS = [
  {
    id: 'hearts_refill',
    title: 'Refill Hearts',
    description: 'Restore all your hearts to full (5 hearts)',
    icon: '❤️',
    price: 350,
    currency: 'gems',
    badge: 'Popular',
    badgeColor: 'bg-red-500',
  },
  {
    id: 'streak_freeze',
    title: 'Streak Freeze',
    description: 'Protect your streak for one day when you miss practice',
    icon: '❄️',
    price: 200,
    currency: 'gems',
    badge: 'Useful',
    badgeColor: 'bg-blue-500',
  },
  {
    id: 'double_xp',
    title: 'Double XP Boost',
    description: 'Earn 2x XP for the next 15 minutes of practice',
    icon: '⚡',
    price: 100,
    currency: 'gems',
    badge: null,
    badgeColor: '',
  },
  {
    id: 'timed_challenge',
    title: 'Timed Challenge',
    description: 'Unlock a special timed challenge for bonus XP',
    icon: '⏱️',
    price: 50,
    currency: 'gems',
    badge: 'New',
    badgeColor: 'bg-green-500',
  },
];

const GEM_PACKS = [
  { id: 'gems_200', gems: 200, price: '$1.99', popular: false },
  { id: 'gems_500', gems: 500, price: '$3.99', popular: true },
  { id: 'gems_1200', gems: 1200, price: '$7.99', popular: false },
  { id: 'gems_2500', gems: 2500, price: '$14.99', popular: false },
];

export default function ShopPage() {
  const router = useRouter();
  const [gems] = useState(0);
  const [activeTab, setActiveTab] = useState<'items' | 'gems'>('items');
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const handlePurchase = async (itemId: string) => {
    setPurchasing(itemId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPurchasing(null);
    alert('This feature requires Stripe integration to be fully set up. Visit /premium to upgrade!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-2xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🛒</span>
          <h1 className="text-3xl font-bold">Shop</h1>
        </div>
        <p className="text-slate-400 mb-6">Spend your gems on power-ups and extras</p>

        <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💎</span>
            <div>
              <div className="text-sm text-slate-400">Your Gems</div>
              <div className="text-xl font-bold text-blue-400">{gems}</div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('gems')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold rounded-xl transition-all"
          >
            Get More Gems
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('items')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'items'
                ? 'bg-green-500 text-white'
                : 'bg-[#2a2a2a] text-slate-400 hover:bg-[#333]'
            }`}
          >
            Shop Items
          </button>
          <button
            onClick={() => setActiveTab('gems')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'gems'
                ? 'bg-blue-500 text-white'
                : 'bg-[#2a2a2a] text-slate-400 hover:bg-[#333]'
            }`}
          >
            Buy Gems
          </button>
        </div>

        {activeTab === 'items' ? (
          <div className="grid gap-4">
            {SHOP_ITEMS.map(item => (
              <div key={item.id} className="p-5 bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] hover:border-[#4a4a4a] transition-all">
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{item.title}</h3>
                      {item.badge && (
                        <span className={`text-xs text-white px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{item.description}</p>
                    <button
                      onClick={() => handlePurchase(item.id)}
                      disabled={purchasing === item.id || gems < item.price}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        gems >= item.price
                          ? 'bg-blue-500 hover:bg-blue-400 text-white'
                          : 'bg-[#3a3a3a] text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {purchasing === item.id ? (
                        <span className="animate-pulse">Processing...</span>
                      ) : (
                        <>
                          <span>💎</span>
                          <span>{item.price} Gems</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {GEM_PACKS.map(pack => (
              <div
                key={pack.id}
                className={`p-5 rounded-2xl border transition-all ${
                  pack.popular
                    ? 'bg-blue-500/10 border-blue-500/50'
                    : 'bg-[#2a2a2a] border-[#3a3a3a] hover:border-[#4a4a4a]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">💎</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-400">{pack.gems}</span>
                        <span className="text-slate-400">Gems</span>
                        {pack.popular && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Best Value</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePurchase(pack.id)}
                    disabled={purchasing === pack.id}
                    className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50"
                  >
                    {purchasing === pack.id ? 'Processing...' : pack.price}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
