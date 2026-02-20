'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { X, Heart, CheckCircle2, XCircle } from 'lucide-react';
import { Exercise } from '@/db/queries';
import { submitAnswer, finishLesson } from '@/actions/user-progress';
import { useExitModal } from '@/store/use-exit-modal';
import { useHeartsModal } from '@/store/use-hearts-modal';
import { cn } from '@/lib/utils';
type Props = { initialLessonId: string; initialLessonExercises: Exercise[]; initialHearts: number; initialPercentage: number; userSubscription: boolean; };
export const Quiz = ({ initialLessonId, initialLessonExercises, initialHearts, initialPercentage, userSubscription }: Props) => {
  const { open: openExit } = useExitModal();
  const { open: openHearts } = useHeartsModal();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);
  const [exercises] = useState(initialLessonExercises);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [status, setStatus] = useState<'none' | 'correct' | 'wrong'>('none');
  const [textAnswer, setTextAnswer] = useState('');
  const currentExercise = exercises[activeIndex];
  if (!currentExercise) {
    return (
      <div className='flex flex-col items-center justify-center h-full gap-y-8 text-center py-20'>
        <div className='text-8xl'>🎉</div>
        <h1 className='text-3xl font-bold text-neutral-700'>Lesson Complete!</h1>
        <p className='text-neutral-500'>You earned 10 XP and updated your streak.</p>
        <button onClick={() => { startTransition(() => { finishLesson(initialLessonId).then(() => router.push('/learn')); }); }} disabled={pending} className='px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl text-lg transition-all'>
          Continue
        </button>
      </div>
    );
  }
  const isTranslate = currentExercise.type === 'TRANSLATE';
  const options = currentExercise.options || [];
  const getAnswer = () => isTranslate ? textAnswer : (selectedOption || '');
  const onContinue = () => {
    if (status === 'correct' || status === 'wrong') {
      setActiveIndex(i => i + 1); setStatus('none'); setSelectedOption(undefined); setTextAnswer(''); return;
    }
    const answer = getAnswer();
    if (!answer) return;
    const isCorrect = answer.toLowerCase().trim() === currentExercise.correct_answer.toLowerCase().trim();
    startTransition(() => {
      submitAnswer(initialLessonId, currentExercise.id, answer, isCorrect).then(res => {
        if (res?.error === 'no_hearts') { openHearts(); return; }
        if (isCorrect) { setStatus('correct'); setPercentage(p => p + 100 / exercises.length); }
        else { setStatus('wrong'); if (!userSubscription) setHearts(h => Math.max(0, h - 1)); }
      });
    });
  };
  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center gap-x-4 px-6 py-4 border-b-2'>
        <button onClick={openExit} className='text-slate-400 hover:text-slate-600'><X /></button>
        <div className='flex-1 bg-slate-200 rounded-full h-3'><div className='bg-green-500 h-3 rounded-full transition-all' style={{ width: percentage + '%' }} /></div>
        <div className='flex items-center gap-x-1 text-rose-500 font-bold'><Heart className='fill-rose-500 h-5 w-5' />{hearts}</div>
      </div>
      <div className='flex-1 flex items-center justify-center px-6'>
        <div className='max-w-[600px] w-full flex flex-col gap-y-8'>
          <h2 className='text-2xl font-bold text-neutral-700 text-center'>{isTranslate ? 'Translate this sentence' : 'Select the correct option'}</h2>
          <div className='bg-slate-50 border-2 rounded-xl p-4 text-lg font-semibold text-center'>{currentExercise.question}</div>
          {isTranslate ? (
            <input value={textAnswer} onChange={e => setTextAnswer(e.target.value)} placeholder='Type your answer...' className='w-full p-4 border-2 rounded-xl text-lg' disabled={status !== 'none'} />
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {options.map(opt => (
                <button key={opt} onClick={() => { if (status === 'none') setSelectedOption(opt); }} className={cn('p-4 border-2 rounded-xl font-bold text-left transition-all', selectedOption === opt && status === 'none' && 'border-sky-400 bg-sky-50', status === 'correct' && opt === currentExercise.correct_answer && 'border-green-500 bg-green-50', status === 'wrong' && opt === selectedOption && 'border-rose-500 bg-rose-50')}>{opt}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={cn('px-6 py-4 border-t-2 flex items-center justify-between', status === 'correct' && 'bg-green-50 border-green-200', status === 'wrong' && 'bg-rose-50 border-rose-200')}>
        <div>
          {status === 'correct' && <div className='flex items-center gap-x-2 text-green-600 font-bold text-lg'><CheckCircle2 className='h-6 w-6' /> Correct!</div>}
          {status === 'wrong' && <div className='flex items-center gap-x-2 text-rose-600 font-bold text-lg'><XCircle className='h-6 w-6' /> Correct: {currentExercise.correct_answer}</div>}
        </div>
        <button onClick={onContinue} disabled={pending || (!getAnswer() && status === 'none')} className={cn('px-8 py-3 rounded-xl font-bold text-white transition-all', status === 'wrong' ? 'bg-rose-500 hover:bg-rose-400' : 'bg-green-500 hover:bg-green-400', (!getAnswer() && status === 'none') && 'opacity-50 cursor-not-allowed')}>
          {status === 'none' ? 'Check' : 'Continue'}
        </button>
      </div>
    </div>
  );
};
