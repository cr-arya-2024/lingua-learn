import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getTopTenUsers, getUserProgress } from '@/db/queries';

export default async function LeaderboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  let topUsers: any[] = [];
  let userProgress = null;

  try {
    [topUsers, userProgress] = await Promise.all([
      getTopTenUsers(),
      getUserProgress(user.id),
    ]);
  } catch (e) {
    console.error(e);
  }

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-2xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🏆</span>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
        </div>
        <p className="text-slate-400 mb-8">Top learners this week ranked by XP</p>

        <div className="bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] overflow-hidden">
          {topUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <div className="text-5xl mb-4">🏆</div>
              <p className="text-lg font-medium">No rankings yet</p>
              <p className="text-sm mt-1">Be the first to earn XP!</p>
            </div>
          ) : (
            <ul>
              {topUsers.map((entry: any, index: number) => {
                const isCurrentUser = entry.user_id === user.id;
                const username = entry.profiles?.username || `User ${index + 1}`;
                const avatarUrl = entry.profiles?.avatar_url;
                return (
                  <li
                    key={entry.user_id || index}
                    className={`flex items-center gap-4 px-6 py-4 border-b border-[#3a3a3a] last:border-b-0 transition-all ${
                      isCurrentUser ? 'bg-green-500/10 border-l-4 border-l-green-500' : 'hover:bg-[#333]'
                    }`}
                  >
                    <div className="w-8 text-center font-bold text-lg">
                      {index < 3 ? medals[index] : <span className="text-slate-500">{index + 1}</span>}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
                      ) : (
                        username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold truncate ${
                        isCurrentUser ? 'text-green-400' : 'text-white'
                      }`}>
                        {username} {isCurrentUser && <span className="text-xs text-green-500">(You)</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-yellow-400">{entry.points ?? 0}</div>
                      <div className="text-xs text-slate-500">XP</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {userProgress && (
          <div className="mt-6 p-4 bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400">Your XP</div>
              <div className="text-xl font-bold text-yellow-400">{userProgress.points ?? 0}</div>
            </div>
            <div className="text-sm text-slate-400">
              Keep practicing to climb the ranks!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
