import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';

interface ForgotPasswordPageProps {
  onSwitchToLogin: () => void;
}

export default function ForgotPasswordPage({ onSwitchToLogin }: ForgotPasswordPageProps) {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const busy = submitting || isLoading;

  return (
    <div className="min-h-screen bg-[#07070A] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel rounded-3xl border-white/5 p-8 flex flex-col gap-7 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#A855F7]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.15)]">
              <Mail className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-serif text-white tracking-wider">DiscoveryOS</span>
              <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">Reset Password</span>
            </div>
          </div>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 relative z-10"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">Check your inbox</p>
                <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                  If an account exists for <strong className="text-zinc-300">{email}</strong>, you will receive a password reset link shortly.
                </p>
              </div>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-[#8B5CF6] hover:text-[#A855F7] transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Sign In</span>
              </button>
            </motion.div>
          ) : (
            <>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <p className="text-[10px] text-zinc-400 leading-relaxed text-center relative z-10">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearError(); }}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-600 font-mono focus:border-[#8B5CF6]/50 outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(139,92,246,0.25)]"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{busy ? 'Sending...' : 'Send Reset Link'}</span>
                </button>
              </form>

              <div className="flex items-center justify-center relative z-10">
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-[#8B5CF6] transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
