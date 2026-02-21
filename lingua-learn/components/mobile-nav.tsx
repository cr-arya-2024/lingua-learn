'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Zap, ShoppingBag } from 'lucide-react';

const links = [
  { href: '/learn', label: 'Learn', icon: Home },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/quests', label: 'Quests', icon: Zap },
  { href: '/shop', label: 'Shop', icon: ShoppingBag },
];

export const MobileNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-white lg:hidden">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-1 flex-col items-center gap-y-1 py-3 text-xs font-medium transition-colors ${
            pathname === href
              ? 'text-green-600'
              : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
};
