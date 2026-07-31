/* eslint-disable react-hooks/purity */
'use client';

export const dynamic = 'force-static';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  AuthProvider,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

import { auth, googleProvider, githubProvider } from '../lib/firebase';
import { useLanguage } from '../lib/language';

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineLogin,
} from 'react-icons/hi';
import { 
  RiErrorWarningLine, 
  RiCheckboxCircleLine,
  RiHeartPulseLine 
} from 'react-icons/ri';
import { TbHexagon3D } from 'react-icons/tb';

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient orbs */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-[#0047FF] rounded-full filter blur-[120px]"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.12, 0.08]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-150 h-150 bg-[#00C5A8] rounded-full filter blur-[100px]"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-0 w-125 h-125 bg-[#7B2FFF] rounded-full filter blur-[100px]"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.07, 0.05]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 71, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 71, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Floating particles */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-linear-to-r from-[#0047FF] to-[#00C5A8]"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0,
          }}
          animate={{
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 10,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      
      {/* Animated hexagon pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...Array(5)].map((_, i) => (
          <TbHexagon3D
            key={i}
            className="absolute text-9xl"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}



function AnimatedField({
  id,
  label,
  icon,
  children,
  error,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-gray-400 uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative group">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C5A8] transition-colors">
          {icon}
        </span>
        {children}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 mt-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}



export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.push('/');
    });
    return () => unsub();
  }, [router]);

  const validateForm = () => {
    let isValid = true;
    if (!email.trim()) {
      setEmailError(t('emailRequired'));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t('validEmail'));
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!password) {
      setPasswordError(t('passwordRequired'));
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t('passwordMinLength'));
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  async function handleOAuth(provider: AuthProvider) {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (e: unknown) {
      if (e instanceof FirebaseError && e.code === 'auth/operation-not-allowed') {
        setError(t('oauthNotEnabled'));
      } else {
        setError(e instanceof Error ? e.message : t('oauthSignInFailed'));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        switch (e.code) {
          case 'auth/user-not-found':
            setError(t('noAccountFound'));
            break;
          case 'auth/wrong-password':
            setError(t('wrongPassword'));
            break;
          case 'auth/too-many-requests':
            setError(t('tooManyRequests'));
            break;
          default:
            setError(e.message || t('signInFailed'));
        }
      } else {
        setError(t('signInFailed'));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError(t('enterEmailAboveForgotPassword'));
      return;
    }
    setError('');
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (e: unknown) {
      setError(e instanceof FirebaseError ? e.message : t('resetEmailFailed'));
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#03060F] relative overflow-hidden flex items-center justify-center py-12 px-4">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-[#0047FF] to-[#7B2FFF] shadow-lg shadow-[#0047FF]/30 mb-4"
          >
           <Image
                     src="/Logo.jpg"
                     alt="Logo"
                     width={24}
                     height={24}
                     className="w-16 h-16 object-cover rounded-md"
                     />
          </motion.div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-white to-[#00C5A8] bg-clip-text text-transparent">
            e-MedCare Hub
          </h1>
          <p className="text-xs text-gray-500 mt-1">{t('healthcareManagementPlatform')}</p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-linear-to-br from-[#1A1F2E]/90 to-[#0A0F1A]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-1">{t('welcomeBack')}</h2>
            <p className="text-xs text-gray-400">{t('signInDashboard')}</p>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleOAuth(googleProvider)}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:border-white/20 disabled:opacity-50"
            >
              <FcGoogle size={18} />
              {t('signInWithGoogle')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleOAuth(githubProvider)}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:border-white/20 disabled:opacity-50"
            >
              <FaGithub size={18} />
              {t('signInWithGitHub')}
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#1A1F2E] px-3 text-xs text-gray-500">
                {t('orContinueWithEmail')}
              </span>
            </div>
          </div>

          {/* Error Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2.5 text-sm text-red-400"
              >
                <RiErrorWarningLine size={17} className="mt-0.5 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {resetSent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 flex items-start gap-2 rounded-xl bg-[#00C5A8]/10 border border-[#00C5A8]/30 px-3 py-2.5 text-sm text-[#00C5A8]"
              >
                <RiCheckboxCircleLine size={17} className="mt-0.5 shrink-0" />
                {t('passwordResetSent')}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatedField
              id="email"
              label={t('emailAddress')}
              icon={<HiOutlineMail size={17} />}
              error={emailError}
            >
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t('emailPlaceholder')}
                className="w-full rounded-xl bg-white/5 border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition focus:border-[#00C5A8] focus:outline-none focus:ring-2 focus:ring-[#00C5A8]/20"
                value={email}
                onChange={(e) => { setError(''); setEmailError(''); setEmail(e.target.value); }}
              />
            </AnimatedField>

            <AnimatedField
              id="password"
              label={t('passwordLabel')}
              icon={<HiOutlineLockClosed size={17} />}
              error={passwordError}
            >
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder={t('passwordPlaceholder')}
                  className="w-full rounded-xl bg-white/5 border border-white/10 py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-500 transition focus:border-[#00C5A8] focus:outline-none focus:ring-2 focus:ring-[#00C5A8]/20"
                  value={password}
                  onChange={(e) => { setError(''); setPasswordError(''); setPassword(e.target.value); }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? t('hidePassword') : t('showPassword')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#00C5A8]"
                >
                  {showPw ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                </button>
              </div>
            </AnimatedField>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-xs font-medium text-[#00C5A8] transition hover:text-[#00C5A8]/80 disabled:opacity-60"
              >
                {resetLoading ? t('sending') : t('forgotPassword')}
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full py-2.5 rounded-xl bg-linear-to-r from-[#0047FF] to-[#7B2FFF] text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#0047FF]/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            >
              {/* Button shine effect */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: loading ? '-100%' : '100%' }}
                transition={{ duration: 1.5, repeat: loading ? 0 : Infinity }}
              />
              <HiOutlineLogin size={17} className="relative z-10" />
              <span className="relative z-10">{loading ? t('signingIn') : t('signIn')}</span>
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-500">
            {t('noAccountYet')}{' '}
            <Link
              href="/signup"
              className="font-medium text-[#00C5A8] transition hover:text-[#00C5A8]/80"
            >
              {t('createOne')}
            </Link>
          </p>
          <p className="text-xs text-gray-600 mt-3">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline underline-offset-2 hover:text-gray-400">
              {t('terms')}
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-gray-400">
              {t('privacyPolicy')}
            </Link>
          </p>
        </motion.div>

        {/* Decorative Heartbeat */}
        <motion.div
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <RiHeartPulseLine className="text-[#FF3C6E] text-xl opacity-50" />
        </motion.div>
      </div>
    </div>
  );
}