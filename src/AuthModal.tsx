'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Mail, Lock, Phone, KeyRound, Sparkles, CheckCircle2, UserCheck, ArrowRight, RotateCcw } from 'lucide-react';
import type { ConfirmationResult } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMethod = 'email' | 'phone';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const {
    user,
    isFirebaseAvailable,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    setupRecaptcha,
    sendPhoneVerificationCode,
    confirmPhoneCode,
    logOut,
  } = useAuth();

  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone Auth State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [codeSent, setCodeSent] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const formatAuthError = (err: unknown): string => {
    if (!(err instanceof Error)) return 'Authentication failed. Please try again.';
    const msg = err.message || '';
    if (msg.includes('CONFIGURATION_NOT_FOUND') || msg.includes('configuration-not-found')) {
      return 'Firebase Authentication is not activated yet in project "unko-e97d1". In your Firebase Console, click "Authentication" -> "Get Started".';
    }
    if (msg.includes('operation-not-allowed')) {
      return 'Sign-in provider is disabled. Please enable it in Firebase Console -> Authentication -> Sign-in method.';
    }
    if (msg.includes('invalid-phone-number')) {
      return 'Invalid phone number format. Please include your country code (e.g. +1 555-555-5555 or +91 9876543210).';
    }
    if (msg.includes('invalid-verification-code')) {
      return 'Incorrect 6-digit SMS verification code. Please check your text messages.';
    }
    if (msg.includes('code-expired')) {
      return 'Verification code has expired. Please request a new one.';
    }
    if (msg.includes('quota-exceeded')) {
      return 'SMS quota exceeded for today. Please add testing phone numbers in the Firebase Console.';
    }
    if (msg.includes('popup-closed-by-user')) {
      return 'Sign-in popup was closed.';
    }
    if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
      return 'Invalid credentials. Please verify and try again.';
    }
    if (msg.includes('email-already-in-use')) {
      return 'This email is already registered. Please sign in instead.';
    }
    return msg;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err: unknown) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const verifier = setupRecaptcha('recaptcha-container');
      if (!verifier) {
        throw new Error('reCAPTCHA verification failed to initialize. Ensure network connectivity.');
      }
      const confirmation = await sendPhoneVerificationCode(phoneNumber.trim(), verifier);
      setConfirmationResult(confirmation);
      setCodeSent(true);
    } catch (err: unknown) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setErrorMsg('');
    setLoading(true);

    try {
      await confirmPhoneCode(confirmationResult, verificationCode.trim());
      onClose();
    } catch (err: unknown) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setErrorMsg('');
      await signInWithGoogle();
      onClose();
    } catch (err: unknown) {
      setErrorMsg(formatAuthError(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#351522] border border-[#6E1835] shadow-[0_10px_35px_rgba(0,0,0,0.7)] p-6 overflow-hidden">
        {/* Invisible reCAPTCHA container for Phone Auth */}
        <div id="recaptcha-container" />

        {/* Decorative corner glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#22D3EE]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#6E1835]/40 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#B8A9AF] hover:text-[#F8FAFC] hover:bg-[#3A1422] transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#6E1835] text-[#22D3EE] mb-3 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">
            {user && !user.isAnonymous
              ? 'Your Profile'
              : authMethod === 'phone'
              ? 'Phone Verification'
              : isRegister
              ? 'Create Account'
              : 'Welcome Back'}
          </h2>
          <p className="text-sm text-[#B8A9AF] mt-1">
            {user && !user.isAnonymous
              ? 'Synchronized across all your devices'
              : 'Save your learning streaks and character masteries'}
          </p>
        </div>

        {/* User is Already Authenticated */}
        {user && !user.isAnonymous ? (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-[#240D16] border border-[#6E1835]/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6E1835] flex items-center justify-center text-[#22D3EE] font-bold text-lg">
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-semibold text-[#F8FAFC] truncate">
                  {user.displayName}
                </div>
                <div className="text-xs text-[#B8A9AF] truncate">{user.email}</div>
              </div>
              <CheckCircle2 size={20} className="text-[#4ADE80] ml-auto shrink-0" />
            </div>

            <div className="text-xs text-[#4ADE80] bg-[#4ADE80]/10 border border-[#4ADE80]/30 rounded-lg p-3">
              ✓ Cloud Sync is active. Your character masteries and quiz scores are continuously synchronized.
            </div>

            <button
              onClick={async () => {
                await logOut();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#3A1422] hover:bg-[#6E1835] text-[#FB7185] hover:text-white border border-[#6E1835] transition-all font-medium text-sm"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {!isFirebaseAvailable && (
              <div className="p-3 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-xs text-[#67E8F9] flex items-center gap-2">
                <UserCheck size={16} className="shrink-0" />
                <span>Guest Mode is fully enabled! All progress is safely stored right now in your browser.</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-lg bg-[#FB7185]/15 border border-[#FB7185]/40 text-xs text-[#FB7185]">
                {errorMsg}
              </div>
            )}

            {/* Google Sign In Option */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-[#240D16] hover:bg-[#3A1422] border border-[#6E1835] text-[#F8FAFC] font-medium text-sm flex items-center justify-center gap-3 transition-all hover:border-[#22D3EE]/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.6.4-2.4L1.6 7c-.8 1.6-1.3 3.4-1.3 5.3 0 1.9.5 3.7 1.3 5.3l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.9C3.5 20.1 7.4 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Auth Method Selector (Email vs Phone) */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#240D16] border border-[#6E1835] rounded-xl text-xs font-semibold my-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email');
                  setErrorMsg('');
                }}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  authMethod === 'email'
                    ? 'bg-[#6E1835] text-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                    : 'text-[#B8A9AF] hover:text-[#F8FAFC]'
                }`}
              >
                <Mail size={13} />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setErrorMsg('');
                }}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  authMethod === 'phone'
                    ? 'bg-[#6E1835] text-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                    : 'text-[#B8A9AF] hover:text-[#F8FAFC]'
                }`}
              >
                <Phone size={13} />
                <span>Phone SMS</span>
              </button>
            </div>

            {/* EMAIL AUTH FORM */}
            {authMethod === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#B8A9AF] mb-1">Email</label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E7A83]"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="learner@example.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#240D16] border border-[#6E1835] text-[#F8FAFC] text-sm placeholder-[#8E7A83] focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#B8A9AF] mb-1">Password</label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E7A83]"
                    />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#240D16] border border-[#6E1835] text-[#F8FAFC] text-sm placeholder-[#8E7A83] focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#22D3EE] hover:bg-[#67E8F9] text-[#240D16] font-semibold text-sm transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50"
                >
                  {loading ? 'Processing...' : isRegister ? 'Sign Up' : 'Sign In'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-xs text-[#B8A9AF] hover:text-[#22D3EE] transition-colors"
                  >
                    {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
                  </button>
                </div>
              </form>
            )}

            {/* PHONE AUTH FORM */}
            {authMethod === 'phone' && (
              <div className="space-y-3">
                {!codeSent ? (
                  <form onSubmit={handleSendPhoneCode} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[#B8A9AF] mb-1">
                        Phone Number (With Country Code)
                      </label>
                      <div className="relative">
                        <Phone
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E7A83]"
                        />
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value)}
                          placeholder="+1 555-555-5555"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#240D16] border border-[#6E1835] text-[#F8FAFC] text-sm placeholder-[#8E7A83] focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-colors font-mono"
                        />
                      </div>
                      <p className="text-[11px] text-[#8E7A83] mt-1">
                        Format: <code className="text-[#22D3EE]">+ [country_code] [number]</code> (e.g. +1..., +81..., +91...)
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !phoneNumber.trim()}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#22D3EE] hover:bg-[#67E8F9] text-[#240D16] font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50"
                    >
                      <span>{loading ? 'Sending SMS code...' : 'Send Verification Code'}</span>
                      <ArrowRight size={15} />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyPhoneCode} className="space-y-3">
                    <div className="p-3 rounded-xl bg-[#240D16] border border-[#6E1835]/60 text-xs text-[#B8A9AF] flex items-center justify-between">
                      <span>SMS code sent to: <strong className="text-[#F8FAFC]">{phoneNumber}</strong></span>
                      <button
                        type="button"
                        onClick={() => {
                          setCodeSent(false);
                          setVerificationCode('');
                        }}
                        className="text-[#22D3EE] hover:underline flex items-center gap-1"
                      >
                        <RotateCcw size={11} />
                        <span>Change</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#B8A9AF] mb-1">
                        6-Digit Verification Code
                      </label>
                      <div className="relative">
                        <KeyRound
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E7A83]"
                        />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={verificationCode}
                          onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="123456"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#240D16] border border-[#6E1835] text-[#F8FAFC] text-center font-mono tracking-widest text-lg placeholder-[#8E7A83] focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || verificationCode.length !== 6}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#4ADE80] hover:bg-[#22c55e] text-[#240D16] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(74,222,128,0.3)] disabled:opacity-50"
                    >
                      <span>{loading ? 'Verifying...' : 'Verify & Sign In'}</span>
                      <CheckCircle2 size={16} />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
