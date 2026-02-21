import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProgress } from '@/db/queries';

const QUESTS = [
  {
    id: 1,
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🌱',
    xpReward: 20,
    type: 'daily',
    requiredXP: 1,
  },
  {
    id: 2,
    title: 'Earn 20 XP',
    description: 'Earn 20 XP in a single day',
    icon: '⚡',
    xpReward: 10,
    type: 'daily',
    requiredXP: 20,
  },
  {
    id: 3,
    title: 'Earn 50 XP',
    description: 'Earn 50 XP in a single day',
    icon: '🔥',
    xpReward: 25,
    type: 'daily',
    requiredXP: 50,
  },
  {
    id: 4,
    title: 'Weekly Champion',
    description: 'Earn 200 XP this week',
    icon: '🏆',
    xpReward: 100,
    type: 'weekly',
    requiredXP: 200,
  },
  {
    id: 5,
    title: 'Marathon Learner',
    description: 'Earn 500 XP this week',
    icon: '🎯',
    xpReward: 200,
    type: 'weekly',
    requiredXP: 500,
  },
  {
    id: 6,
    title: '7 Day Streak',
    description: 'Practice 7 days in a row',
    icon: '🗓️',
    xpReward: 50,
    type: 'weekly',
    requiredXP: 0,
  },
];

export default async function QuestsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  let userProgress = null;
  try {
    userProgress = await getUserProgress(user.id);
  } catch (e) {
    console.error(e);
  }

  const currentXP = userProgress?.points ?? 0;
  const dailyQuests = QUESTS.filter(q => q.type === 'daily');
  const weeklyQuests = QUESTS.filter(q => q.type === 'weekly');

  function QuestCard({ quest }: { quest: typeof QUESTS[0] }) {
    const progress = quest.requiredXP > 0 
      ? Math.min((currentXP / quest.requiredXP) * 100, 100) 
      : 0;
    const completed = quest.requiredXP > 0 ? currentXP >= quest.requiredXP : false;

    return (
      <div className={`p-5 rounded-2xl border transition-all ${
        completed
          ? 'bg-green-500/10 border-green-500/50'
          : 'bg-[#2a2a2a] border-[#3a3a3a]'
      }`}>
        <div className="flex items-center gap-4 mb-3">
          <div className="text-3xl">{quest.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white">{quest.title}</h3>
              {completed && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">✓ Done</span>}
            </div>
            <p className="text-sm text-slate-400">{quest.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-yellow-400 font-bold">+{quest.xpReward}</div>
            <div className="text-xs text-slate-500">XP</div>
          </div>
        </div>
        {quest.requiredXP > 0 && (
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{Math.min(currentXP, quest.requiredXP)} / {quest.requiredXP} XP</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-[#3a3a3a] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  completed ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-2xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📋</span>
          <h1 className="text-3xl font-bold">Quests</h1>
        </div>
        <p className="text-slate-400 mb-8">Complete quests to earn bonus XP rewards</p>

        <div className="mb-4 p-4 bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] flex items-center justify-between">
          <div className="text-sm text-slate-400">Your Total XP</div>
          <div className="text-xl font-bold text-yellow-400">{currentXP} XP</div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-orange-400">⚡</span> Daily Quests
          </h2>
          <div className="grid gap-4">
            {dailyQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">🏆</span> Weekly Quests
          </h2>
          <div className="grid gap-4">
            {weeklyQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
