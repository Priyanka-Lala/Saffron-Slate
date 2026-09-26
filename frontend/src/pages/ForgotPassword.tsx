import { useState } from 'react';
import type { NavigateFn } from '../data';
import { ForkKnifeIcon } from '../components/Icons';
import { forgotPassword } from '../api/auth';

interface ForgotPasswordProps {
  navigate: NavigateFn;
}

export default function ForgotPassword({ navigate }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) return;
    setIsSubmitting(true);
    try {
      // The backend always returns success here (even for an unknown
      // email) so we can't tell if the account exists — that's
      // intentional, it stops this form being used to check which
      // emails are registered.
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gold/5" />
        <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-gold/5" />
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center mb-3 shadow-sm">
            <ForkKnifeIcon className="w-5 h-5 text-charcoal" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Saffron & Slate</h1>
        </div>

        <div className="bg-card rounded-2xl border border-warm-border shadow-sm p-8">
          {!sent ? (
            <>
              <div className="mb-6">
                <h2 className="font-serif text-xl font-bold text-charcoal mb-2">Reset Your Password</h2>
                <p className="text-muted text-sm leading-relaxed">
                  Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-mid uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-warm-border bg-cream focus:outline-none focus:border-gold text-charcoal placeholder:text-muted text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold-dark disabled:opacity-60 text-charcoal font-semibold py-3 rounded-full transition-colors shadow-sm"
                >
                  {isSubmitting ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Check Your Inbox</h3>
              <p className="text-muted text-sm leading-relaxed mb-1">
                We&apos;ve sent a reset link to
              </p>
              <p className="font-semibold text-charcoal text-sm mb-6">{email}</p>
              <p className="text-xs text-muted">Didn&apos;t receive it? Check your spam folder or{' '}
                <button onClick={() => setSent(false)} className="text-gold font-semibold hover:text-gold-dark">try again</button>.
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('login')}
            className="text-sm font-semibold text-muted hover:text-charcoal transition-colors"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
