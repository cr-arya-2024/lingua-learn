export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAllLessons, getOrCreateUserProgress } from '@/db/queries';
import { LessonCard } from '@/components/lesson-card';
import { CourseSelection } from '@/components/course-selection';

const LearnPage = async () => {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return redirect('/');

  const [lessons, userProgress] = await Promise.all([
    getAllLessons(),
    getOrCreateUserProgress(user.id),
  ]);

  if (!userProgress) return redirect('/');

  // New user with no course selected - show course selection
  if (!userProgress.active_course_id) {
    return <CourseSelection />;
  }

  return (
    <div className='flex flex-col gap-y-4 pb-10 bg-[#1a1a1a] min-h-screen text-white'>
      <div className='sticky top-0 bg-[#1a1a1a] pb-3 flex items-center justify-between border-b-2 border-neutral-800 mb-5 px-6 pt-6'>
        <h1 className='font-bold text-lg uppercase tracking-wide text-neutral-400'>Spanish</h1>
        <div className='flex items-center gap-x-4 text-sm font-bold'>
          <span className='text-orange-500'>&#x1F525; {userProgress.points} XP</span>
          <span className='text-rose-500'>&#x2764;&#xFE0F; {userProgress.hearts}</span>
          <span className='text-sky-500'>&#x1F525; {userProgress.streak}</span>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6'>
        {lessons.length > 0 ? lessons.map((lesson, index) => (
          <LessonCard
            key={lesson.id}
            id={lesson.id}
            title={lesson.title}
            isCompleted={false}
            isLocked={index > 0}
            index={index}
          />
        )) : (
          <div className="col-span-full text-center py-10">
            <p className="text-neutral-400">No lessons available yet. Start by creating some lessons in your database!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnPage;
