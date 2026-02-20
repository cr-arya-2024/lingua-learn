export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAllLessons, getUserProgress } from '@/db/queries';
import { LessonCard } from '@/components/lesson-card';
const LearnPage = async () => {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return redirect('/');
  const [lessons, userProgress] = await Promise.all([getAllLessons(), getUserProgress(user.id)]);
  if (!userProgress) { return redirect('/'); }
  return (
    <div className='flex flex-col gap-y-4 pb-10'>
      <div className='sticky top-0 bg-white pb-3 flex items-center justify-between border-b-2 mb-5'>
        <h1 className='font-bold text-lg uppercase tracking-wide text-neutral-600'>Spanish</h1>
        <div className='flex items-center gap-x-4 text-sm font-bold'>
          <span className='text-orange-500'>⚡ {userProgress.points} XP</span>
          <span className='text-rose-500'>❤️ {userProgress.hearts}</span>
          <span className='text-sky-500'>🔥 {userProgress.streak}</span>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
        {lessons.map((lesson, index) => (
          <LessonCard key={lesson.id} id={lesson.id} title={lesson.title} isCompleted={false} isLocked={index > 0} index={index} />
        ))}
      </div>
    </div>
  );
};
export default LearnPage;
