'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const sb = createClient();
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + '/auth/callback' } });
    if (error) { setMessage(error.message); } else { setMessage('Check your email to confirm your account!'); }
    setLoading(false);
  };
  return (
    <div className='h-full flex items-center justify-center p-6'>
      <div className='w-full max-w-md space-y-6 bg-white p-10 rounded-2xl border-2 shadow-sm'>
        <div className='text-center'><h1 className='text-2xl font-bold'>Create Account</h1><p className='text-slate-500 text-sm'>Join LinguaLearn today</p></div>
        <form onSubmit={handleSignup} className='space-y-4'>
          <input type='email' placeholder='Email' className='w-full p-3 border-2 rounded-xl' value={email} onChange={e => setEmail(e.target.value)} required />
          <input type='password' placeholder='Password' className='w-full p-3 border-2 rounded-xl' value={password} onChange={e => setPassword(e.target.value)} required />
          {message && <p className='text-sm font-bold text-sky-500'>{message}</p>}
          <button disabled={loading} className='w-full h-12 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all'>Sign Up</button>
        </form>
        <p className='text-center text-sm'>Already have an account? <Link href='/login' className='text-sky-500 font-bold'>Login</Link></p>
      </div>
    </div>
  );
}
