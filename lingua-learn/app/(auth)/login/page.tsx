'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const sb = createClient();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); } else { router.push('/learn'); router.refresh(); }
  };
  const handleGoogle = async () => { await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } }); };
  return (
    <div className='h-full flex items-center justify-center p-6'>
      <div className='w-full max-w-md space-y-6 bg-white p-10 rounded-2xl border-2 shadow-sm'>
        <div className='text-center'><h1 className='text-2xl font-bold'>Login</h1><p className='text-slate-500 text-sm'>Welcome back!</p></div>
        <form onSubmit={handleLogin} className='space-y-4'>
          <input type='email' placeholder='Email' className='w-full p-3 border-2 rounded-xl' value={email} onChange={e => setEmail(e.target.value)} required />
          <input type='password' placeholder='Password' className='w-full p-3 border-2 rounded-xl' value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p className='text-rose-500 text-sm'>{error}</p>}
          <button disabled={loading} className='w-full h-12 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all'>Login</button>
        </form>
        <button onClick={handleGoogle} className='w-full h-12 border-2 font-bold rounded-xl hover:bg-slate-50 transition-all'>Continue with Google</button>
        <p className='text-center text-sm'>Don&apos;t have an account? <Link href='/signup' className='text-sky-500 font-bold'>Sign up</Link></p>
      </div>
    </div>
  );
}
