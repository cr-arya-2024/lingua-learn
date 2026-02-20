'use client';
import Link from 'next/link';
import { Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
type Props = { id: string; title: string; isCompleted: boolean; isLocked: boolean; index: number; };
export const LessonCard = ({ id, title, isCompleted, isLocked, index }: Props) => {
  return (
    <Link href={isLocked ? '#' : '/lesson/' + id} className={cn('relative flex flex-col items-center justify-center gap-y-2 transition-all duration-200', isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:-translate-y-1')}>
      <div className={cn('h-[100px] w-[100px] rounded-full border-b-8 flex items-center justify-center', isCompleted ? 'bg-green-500 border-green-600' : 'bg-sky-400 border-sky-500', isLocked && 'bg-neutral-200 border-neutral-400')}>
        {isCompleted ? <Check className='h-10 w-10 text-white stroke-[3]' /> : isLocked ? <Lock className='h-10 w-10 text-neutral-400' /> : <span className='text-white text-2xl font-bold'>{index + 1}</span>}
      </div>
      <p className='font-bold text-neutral-700 text-center capitalize'>{title}</p>
      {!isCompleted && !isLocked && <div className='absolute -top-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-xl uppercase tracking-wide animate-bounce'>Start</div>}
    </Link>
  );
};
