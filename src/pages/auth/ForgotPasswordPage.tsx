import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#171717] dark:bg-[#101113] dark:text-[#F5F5F5] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-md">
            A
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">
            Password Recovery
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your corporate email address to receive secure reset instructions.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] p-6 shadow-sm space-y-4">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Recovery Link Dispatched
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                If an active personnel account matches <strong className="text-slate-700 dark:text-slate-300">{email}</strong>, a secure reset token has been delivered.
              </p>
              <Link to="/login" className="inline-block pt-3">
                <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Corporate Email"
                type="email"
                required
                placeholder="name@apexglobal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Button type="submit" variant="primary" className="w-full">
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Return to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
