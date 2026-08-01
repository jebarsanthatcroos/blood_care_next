/* eslint-disable react-hooks/purity */
'use client';

export const dynamic = 'force-static';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  AuthProvider,
  updateProfile,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { getFirebaseAuth, getFirebaseDb, getFirebaseProviders } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineGlobeAlt,
  HiOutlineUserAdd,
} from 'react-icons/hi';
import { RiErrorWarningLine, RiCheckboxCircleLine, RiHeartPulseLine } from 'react-icons/ri';
import { useLanguage } from '../../lib/language';


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
      {[...Array(50)].map((_, i) => (
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
    </div>
  );
}

function PasswordStrength({ password, t }: { password: string; t: (k: string) => string }) {
  if (!password) return null;

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  const getBarColor = (index: number) => {
    if (index >= score) return 'bg-white/10';
    const colors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-[#00C5A8]', 'bg-emerald-500'];
    return colors[score];
  };

  const getLabel = () => {
    const labels = ['', t('passwordWeak'), t('passwordFair'), t('passwordGood'), t('passwordStrong')];
    return labels[score];
  };

  const getLabelColor = () => {
    const colors = ['', 'text-red-400', 'text-yellow-400', 'text-[#00C5A8]', 'text-emerald-400'];
    return colors[score];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 space-y-1.5"
    >
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${getBarColor(i)}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
      <motion.p
        className={`text-xs font-medium ${getLabelColor()}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {getLabel()}
      </motion.p>
    </motion.div>
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

export default function SignUpPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    country: '',
    emailPreferences: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    country: '',
  });

  // Redirect if already signed in
  useEffect(() => {
    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) return;

    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) router.push('/');
    });
    return () => unsub();
  }, [router]);

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setError('');
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const validateForm = () => {
    let isValid = true;
    const errors = { username: '', email: '', password: '', country: '' };

    if (!form.username.trim()) {
      errors.username = t('validation_username_required');
      isValid = false;
    } else if (form.username.length < 3) {
      errors.username = t('validation_username_len');
      isValid = false;
    }

    if (!form.email.trim()) {
      errors.email = t('validation_email_required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = t('validation_email_invalid');
      isValid = false;
    }

    if (!form.password) {
      errors.password = t('validation_password_required');
      isValid = false;
    } else if (form.password.length < 8) {
      errors.password = t('validation_password_len');
      isValid = false;
    }

    if (!form.country.trim()) {
      errors.country = t('validation_country_required');
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  async function handleOAuth(provider: AuthProvider) {
    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) {
      setError(t('registration_failed'));
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signInWithPopup(firebaseAuth, provider);
    } catch (e: unknown) {
      if (e instanceof FirebaseError && e.code === 'auth/operation-not-allowed') {
        setError(t('oauthNotEnabled'));
      } else {
        setError(e instanceof Error ? e.message : t('oauthFailed'));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) {
      setError(t('registration_failed'));
      return;
    }

    const firebaseDb = getFirebaseDb();
    if (!firebaseDb) {
      setError(t('registration_failed'));
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.username });

      // Persist additional user data to Firestore
      await setDoc(doc(firebaseDb, 'users', cred.user.uid), {
        username: form.username,
        email: form.email,
        country: form.country,
        emailPreferences: form.emailPreferences,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'patient',
        isActive: true,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        switch (e.code) {
          case 'auth/email-already-in-use':
            setError(t('err_email_in_use'));
            break;
          case 'auth/weak-password':
            setError(t('err_weak_password'));
            break;
          case 'auth/operation-not-allowed':
            setError(t('err_operation_not_allowed'));
            break;
          default:
            setError(e.message || t('registration_failed'));
        }
      } else {
        setError(t('registration_failed'));
      }
    } finally {
      setLoading(false);
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
          <p className="text-xs text-gray-500 mt-1">{t('tagline')}</p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-linear-to-br from-[#1A1F2E]/90 to-[#0A0F1A]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-1">{t('createAccount')}</h2>
            <p className="text-xs text-gray-400">{t('createAccountSub')}</p>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                const providers = getFirebaseProviders();
                if (!providers.googleProvider) {
                  setError(t('registration_failed'));
                  return;
                }
                handleOAuth(providers.googleProvider);
              }}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:border-white/20 disabled:opacity-50"
            >
              <FcGoogle size={18} />
              {t('google')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                const providers = getFirebaseProviders();
                if (!providers.githubProvider) {
                  setError(t('registration_failed'));
                  return;
                }
                handleOAuth(providers.githubProvider);
              }}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:border-white/20 disabled:opacity-50"
            >
              <FaGithub size={18} />
              {t('github')}
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#1A1F2E] px-3 text-xs text-gray-500">{t('orEmail')}</span>
            </div>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 flex items-start gap-2 rounded-xl bg-[#00C5A8]/10 border border-[#00C5A8]/30 px-3 py-2.5 text-sm text-[#00C5A8]"
              >
                <RiCheckboxCircleLine size={17} className="mt-0.5 shrink-0" />
                {t('successCreated')}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <AnimatedField
                id="username"
                label={t('username')}
                icon={<HiOutlineUser size={17} />}
                error={fieldErrors.username}
              >
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="jebarsan"
                  className="w-full rounded-xl bg-white/5 border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition focus:border-[#00C5A8] focus:outline-none focus:ring-2 focus:ring-[#00C5A8]/20"
                  value={form.username}
                  onChange={(e) => setField('username', e.target.value)}
                />
              </AnimatedField>

              <AnimatedField
                id="country"
                label={t('country')}
                icon={<HiOutlineGlobeAlt size={17} />}
                error={fieldErrors.country}
              >
                <input
                  id="country"
                  type="text"
                  required
                  autoComplete="country-name"
                  placeholder="Sri Lanka"
                  className="w-full rounded-xl bg-white/5 border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition focus:border-[#00C5A8] focus:outline-none focus:ring-2 focus:ring-[#00C5A8]/20"
                  value={form.country}
                  onChange={(e) => setField('country', e.target.value)}
                />
              </AnimatedField>
            </div>

            <AnimatedField
              id="email"
              label={t('emailLabel')}
              icon={<HiOutlineMail size={17} />}
              error={fieldErrors.email}
            >
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="jebarsanthatcroos@gmail.com"
                className="w-full rounded-xl bg-white/5 border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition focus:border-[#00C5A8] focus:outline-none focus:ring-2 focus:ring-[#00C5A8]/20"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
              />
            </AnimatedField>

            <AnimatedField
              id="password"
              label={t('passwordLabel')}
              icon={<HiOutlineLockClosed size={17} />}
              error={fieldErrors.password}
            >
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder={t('passwordPlaceholder')}
                  className="w-full rounded-xl bg-white/5 border border-white/10 py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-500 transition focus:border-[#00C5A8] focus:outline-none focus:ring-2 focus:ring-[#00C5A8]/20"
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#00C5A8]"
                >
                  {showPw ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                </button>
              </div>
            </AnimatedField>
            
            <PasswordStrength password={form.password} t={t} />

            {/* Email Preferences */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-2.5 pt-1"
            >
              <input
                id="emailPreferences"
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 accent-[#00C5A8]"
                checked={form.emailPreferences}
                onChange={(e) => setField('emailPreferences', e.target.checked)}
              />
              <label htmlFor="emailPreferences" className="text-xs text-gray-400 leading-snug">
                {t('receiveUpdates')}
              </label>
            </motion.div>

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
              <HiOutlineUserAdd size={17} className="relative z-10" />
              <span className="relative z-10">
                {loading ? t('creatingAccount') : t('createAccountBtn')}
              </span>
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
            {t('alreadyHave')}{' '}
            <Link
              href="/signin"
              className="font-medium text-[#00C5A8] transition hover:text-[#00C5A8]/80"
            >
              {t('signIn')}
            </Link>
          </p>
          <p className="text-xs text-gray-600 mt-3">
            {t('byContinuing')} {' '}
            <Link href="/terms" className="underline underline-offset-2 hover:text-gray-400">
              {t('terms')}
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-gray-400">
              {t('privacy')}
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