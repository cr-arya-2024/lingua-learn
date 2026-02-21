'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const sb = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await sb.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + '/auth/callback' },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // Try immediate sign in (works if email confirmation is disabled)
    const { error: loginError } = await sb.auth.signInWithPassword({ email, password });
    if (!loginError) {
      router.push('/learn');
      return;
    }

    // Email confirmation required
    setIsSuccess(true);
    setMessage('Account created! Check your email to confirm, then login.');
    setLoading(false);
  };

  const handleGoogle = async () => {
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
  };

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 bg-white p-10 rounded-2xl border-2 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-slate-500 text-sm">Join LinguaLearn today</p>
        </div>
        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="text-5xl">&#x1F4E7;</div>
            <p className="text-green-600 font-semibold">{message}</p>
            <Link href="/login" className="block w-full h-12 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all flex items-center justify-center">
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border-2 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              className="w-full p-3 border-2 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {message && <p className="text-rose-500 text-sm font-semibold">{message}</p>}
            <button
              disabled={loading}
              className="w-full h-12 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        )}
        {!isSuccess && (
          <>
            <button onClick={handleGoogle} className="w-full h-12 border-2 font-bold rounded-xl hover:bg-slate-50 transition-all">
              Continue with Google
            </button>
            <p className="text-center text-sm">Already have an account? <Link href="/login" className="text-sky-500 font-bold">Login</Link></p>
          </>
        )}
      </div>
    </div>
  );
}
