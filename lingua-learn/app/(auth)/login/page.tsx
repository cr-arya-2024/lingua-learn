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
    if (error) { 
      setError(error.message); 
      setLoading(false); 
    } else { 
      router.push('/learn'); 
      router.refresh(); 
    }
  };
  const handleGoogle = async () => { await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } }); };
  return (
    <div className='h-full flex items-center justify-center p-6 bg-[#1a1a1a]'>
      <div className='w-full max-w-md space-y-6 bg-[#2a2a2a] p-10 rounded-2xl border-2 border-neutral-800 shadow-sm'>
        <div className='text-center'><h1 className='text-2xl font-bold text-white'>Login</h1><p className='text-neutral-400 text-sm'>Welcome back!</p></div>
        <form onSubmit={handleLogin} className='space-y-4'>
          <input type='email' placeholder='Email' className='w-full p-3 bg-[#1a1a1a] border-2 border-neutral-800 rounded-xl text-white' value={email} onChange={e => setEmail(e.target.value)} required />
          <input type='password' placeholder='Password' className='w-full p-3 bg-[#1a1a1a] border-2 border-neutral-800 rounded-xl text-white' value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p className='text-rose-500 text-sm'>{error}</p>}
          <button disabled={loading} className='w-full h-12 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all disabled:opacity-50'>Login</button>
        </form>
        <button onClick={handleGoogle} className='w-full h-12 border-2 border-neutral-800 font-bold rounded-xl hover:bg-neutral-800 text-white transition-all'>Continue with Google</button>
        <p className='text-center text-sm text-neutral-400'>Don&apos;t have an account? <Link href='/signup' className='text-sky-500 font-bold'>Sign up</Link></p>
      </div>
    </div>
  );
}
