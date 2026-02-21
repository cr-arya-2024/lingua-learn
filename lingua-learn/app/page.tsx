export const dynamic = 'force-dynamic';grep -r "FeedWrapper"ls lingua-learn/components
 lingua-learn

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Zap, Smile, Rocket } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
export default async function Home() {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (user) return redirect('/learn');
  return (
    <div className='flex flex-col min-h-screen'>
      <nav className='h-[70px] w-full border-b-2 border-slate-200 px-6 flex items-center justify-between'>
        <span className='text-2xl font-extrabold text-green-500 tracking-wide'>LinguaLearn</span>
        <Link href='/login' className='font-bold text-slate-600 hover:text-slate-800 transition-all'>I already have an account</Link>
      </nav>
      <main className='flex-1 flex flex-col items-center justify-center text-center px-4 gap-y-8 max-w-[988px] mx-auto'>
        <h1 className='text-4xl lg:text-5xl font-bold text-neutral-700'>Learn languages for <span className='text-green-500'>free</span>, forever.</h1>
        <p className='text-xl text-neutral-500'>Fun, effective and personalized language learning.</p>
        <div className='flex flex-col sm:flex-row gap-4 w-full max-w-sm'>
          <Link href='/signup' className='flex-1 flex items-center justify-center h-14 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl text-lg transition-all'>Get Started</Link>
          <Link href='/login' className='flex-1 flex items-center justify-center h-14 border-2 border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-lg transition-all'>Login</Link>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 w-full'>
          <div className='flex flex-col items-center gap-y-3 p-6 border-2 rounded-xl'>
            <div className='bg-green-100 p-4 rounded-full'><Zap className='h-8 w-8 text-green-500' /></div>
            <h3 className='font-bold text-lg'>Fun & Effective</h3>
            <p className='text-sm text-slate-500'>Game-like lessons that keep you motivated every day.</p>
          </div>
          <div className='flex flex-col items-center gap-y-3 p-6 border-2 rounded-xl'>
            <div className='bg-sky-100 p-4 rounded-full'><Smile className='h-8 w-8 text-sky-500' /></div>
            <h3 className='font-bold text-lg'>Science-based</h3>
            <p className='text-sm text-slate-500'>Proven methods to help you learn faster and remember more.</p>
          </div>
          <div className='flex flex-col items-center gap-y-3 p-6 border-2 rounded-xl'>
            <div className='bg-orange-100 p-4 rounded-full'><Rocket className='h-8 w-8 text-orange-500' /></div>
            <h3 className='font-bold text-lg'>Personalized</h3>
            <p className='text-sm text-slate-500'>Lessons adapted to your specific learning level and goals.</p>
          </div>
        </div>
      </main>
      <footer className='border-t-2 p-6 text-center text-slate-400 text-sm'>
        &copy; {new Date().getFullYear()} LinguaLearn. All rights reserved.
      </footer>
    </div>
  );
}
