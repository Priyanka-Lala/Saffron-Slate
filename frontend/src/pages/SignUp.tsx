import { useState } from 'react';
import type { NavigateFn } from '../data';
import { ForkKnifeIcon, EyeIcon, GoogleIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';

interface SignUpProps {
  navigate: NavigateFn;
}

export default function SignUp({ navigate }: SignUpProps) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pwMatch = password && confirmPw && password === confirmPw;
  const pwMismatch = confirmPw && password !== confirmPw;

  const canSubmit = agreed && name && email && password && pwMatch && !isSubmitting;

  const handleSubmit = async () => {
    setError('');
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!pwMatch) {
      setError("Passwords don't match.");
      return;
    }
    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      navigate('home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-gold/5" />
        <div className="absolute -bottom-32 -left-16 w-[420px] h-[420px] rounded-full bg-gold/5" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center mb-3 shadow-sm">
            <ForkKnifeIcon className="w-5 h-5 text-charcoal" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Saffron & Slate</h1>
          <p className="text-muted text-sm mt-1">Join a community that loves to cook.</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-warm-border shadow-sm p-8">
          <h2 className="font-serif text-xl font-bold text-charcoal mb-6">Create Account</h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm"
                />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal">
                  <EyeIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full px-4 py-3 pr-10 rounded-xl border bg-cream focus:outline-none text-charcoal placeholder:text-muted text-sm ${
                    pwMismatch ? 'border-red-400 focus:border-red-400' : pwMatch ? 'border-green-400 focus:border-green-400' : 'border-warm-border focus:border-gold'
                  }`}
                />
                <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal">
                  <EyeIcon className="w-4 h-4" />
                </button>
              </div>
              {pwMismatch && <p className="text-xs text-red-500 mt-1">Passwords don&apos;t match.</p>}
              {pwMatch && <p className="text-xs text-green-600 mt-1">Passwords match ✓</p>}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded"
              />
              <span className="text-xs text-charcoal-mid leading-relaxed">
                I agree to the{' '}
                <span className="font-semibold text-gold cursor-pointer hover:text-gold-dark">Terms of Service</span>
                {' '}and{' '}
                <span className="font-semibold text-gold cursor-pointer hover:text-gold-dark">Privacy Policy</span>
              </span>
            </label>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full bg-gold hover:bg-gold-dark disabled:opacity-50 disabled:cursor-not-allowed text-charcoal font-semibold py-3 rounded-full transition-colors shadow-sm"
            >
              {isSubmitting ? 'Creating account…' : 'Create Account'}
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

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <button onClick={() => navigate('login')} className="font-semibold text-gold hover:text-gold-dark transition-colors">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
