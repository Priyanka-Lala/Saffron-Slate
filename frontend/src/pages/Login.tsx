import { useState } from 'react';
import type { NavigateFn } from '../data';
import { ForkKnifeIcon, EyeIcon } from '../components/Icons';
import { GoogleIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  navigate: NavigateFn;
}

export default function Login({ navigate }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gold/5" />
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-gold/5" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center mb-3 shadow-sm">
            <ForkKnifeIcon className="w-5 h-5 text-charcoal" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Saffron & Slate</h1>
          <p className="text-muted text-sm mt-1">Welcome back — your recipes are waiting.</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-warm-border shadow-sm p-8">
          <h2 className="font-serif text-xl font-bold text-charcoal mb-6">Log In</h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider">Password</label>
                <button
                  onClick={() => navigate('forgot-password')}
                  className="text-xs font-semibold text-gold hover:text-gold-dark transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Your password"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm"
                />
                <button
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal transition-colors"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold py-3 rounded-full transition-colors shadow-sm mt-1 disabled:opacity-60"
            >
              {isSubmitting ? 'Logging in…' : 'Log In'}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-warm-border" />
            <span className="text-xs text-muted font-medium">or</span>
            <div className="flex-1 h-px bg-warm-border" />
          </div>

          {/* Google — not wired up yet, see README */}
          <button
            disabled
            title="Google login is coming soon"
            className="w-full flex items-center justify-center gap-3 border border-warm-border bg-card text-charcoal-mid/50 font-semibold py-3 rounded-full text-sm cursor-not-allowed"
          >
            <GoogleIcon className="w-4 h-4" />
            Continue with Google (coming soon)
          </button>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-muted mt-6">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => navigate('signup')}
            className="font-semibold text-gold hover:text-gold-dark transition-colors"
          >
            Create one for free
          </button>
        </p>
      </div>
    </div>
  );
}
