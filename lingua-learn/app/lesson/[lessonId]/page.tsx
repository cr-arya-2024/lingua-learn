export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getLessonById, getUserProgress, getUserPremiumStatus, getExercisesForLesson } from '@/db/queries';
import { Quiz } from './quiz';

type Props = { params: { lessonId: string } };

const LessonPage = async ({ params }: Props) => {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return redirect('/');

  const [lesson, userProgress, isPremium, exercises] = await Promise.all([
    getLessonById(params.lessonId),
    getUserProgress(user.id),
    getUserPremiumStatus(user.id),
    getExercisesForLesson(params.lessonId),
  ]);

  if (!lesson || !userProgress) return redirect('/learn');
  if (userProgress.hearts === 0 && !isPremium) return redirect('/shop');

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonExercises={exercises || []}
      initialHearts={userProgress.hearts}
      initialPercentage={0}
      userSubscription={isPremium}
    />
  );
};

export default LessonPage;
