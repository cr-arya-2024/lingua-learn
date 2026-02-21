'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Trophy, ShoppingBag, Target, Crown, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const items = [
  { label: 'Learn', href: '/learn', icon: Home },
  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { label: 'Quests', href: '/quests', icon: Target },
  { label: 'Shop', href: '/shop', icon: ShoppingBag },
];

export const Sidebar = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const sb = createClient();
    await sb.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className={cn('flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col gap-y-2 bg-[#1a1a1a] border-neutral-800', className)}>
      <Link href='/learn' className='pt-8 pl-4 pb-7 flex items-center gap-x-3'>
        <span className='text-2xl font-extrabold text-green-500 tracking-wide'>LinguaLearn</span>
      </Link>
      <div className='flex flex-col gap-y-2 flex-1'>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn('flex items-center gap-x-3 h-[52px] px-4 rounded-xl font-bold text-neutral-400 hover:bg-neutral-800 transition-all',
              pathname === item.href && 'bg-neutral-800 text-green-500 border-2 border-green-900')}
          >
            <item.icon className='h-6 w-6' />{item.label}
          </Link>
        ))}
      </div>
      <div className='p-4 space-y-3'>
        <Link href='/premium' className='flex items-center justify-center gap-x-2 w-full h-12 bg-yellow-500 hover:bg-yellow-400 text-white font-bold rounded-xl transition-all'>
          <Crown className='h-5 w-5' /> Get Premium
        </Link>
        <button
          onClick={handleLogout}
          className='flex items-center justify-center gap-x-2 w-full h-10 border-2 border-neutral-700 text-neutral-400 hover:text-rose-400 hover:border-rose-800 font-bold rounded-xl transition-all'
        >
          <LogOut className='h-4 w-4' /> Logout
        </button>
      </div>
    </div>
  );
};
