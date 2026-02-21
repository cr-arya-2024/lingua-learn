import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProgress } from '@/db/queries';
import Link from 'next/link';

export default async function LearnPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  let userProgress = null;
  try {
    userProgress = await getUserProgress(user.id);
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-2xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Your Daily Practice</h1>
        <p className="text-slate-400 mb-8">Keep your streak going! Complete a lesson today.</p>
        
        <div className="grid gap-4">
          <Link href="/courses" className="block p-6 bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] hover:border-green-500 transition-all group">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🌍</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold group-hover:text-green-400 transition-colors">
                  {userProgress?.active_course_id ? 'Continue Learning' : 'Start a New Course'}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {userProgress?.active_course_id 
                    ? 'Pick up where you left off'
                    : 'Choose a language to begin your journey'}
                </p>
              </div>
              <div className="text-slate-600 group-hover:text-green-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a]">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-orange-400">{userProgress?.streak_days ?? 0}</div>
              <div className="text-slate-400 text-sm">Day Streak</div>
            </div>
            <div className="p-5 bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a]">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-yellow-400">{userProgress?.points ?? 0}</div>
              <div className="text-slate-400 text-sm">Total XP</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Link href="/leaderboard" className="p-4 bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] hover:border-blue-500 transition-all text-center">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-xs text-slate-400">Leaderboard</div>
            </Link>
            <Link href="/quests" className="p-4 bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] hover:border-purple-500 transition-all text-center">
              <div className="text-2xl mb-1">📋</div>
              <div className="text-xs text-slate-400">Quests</div>
            </Link>
            <Link href="/shop" className="p-4 bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] hover:border-pink-500 transition-all text-center">
              <div className="text-2xl mb-1">🛒</div>
              <div className="text-xs text-slate-400">Shop</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
