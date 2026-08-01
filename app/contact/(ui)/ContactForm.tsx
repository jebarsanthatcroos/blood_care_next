'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEnvelope,
  FaPhone,
  FaUser,
  FaPaperPlane,
  FaCheckCircle,
  FaLock,
} from 'react-icons/fa';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../lib/useAuth';
import { useLanguage } from '../../../lib/language';
import { CLAY, SHADOW } from '../../../lib/clay';
import { ClayFieldShell } from './ClayFieldShell';
import { ClaySubmitButton } from './ClaySubmitButton';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const ContactForm = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const effectiveForm = {
    ...form,
    name: form.name || user?.displayName || '',
    email: form.email || user?.email || '',
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!effectiveForm.name.trim()) newErrors.name = t('nameRequired');
    if (!effectiveForm.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(effectiveForm.email)) {
      newErrors.email = t('validEmail');
    }
    if (!effectiveForm.message.trim()) newErrors.message = t('messageRequired');
    if (effectiveForm.phone && !/^\+?[\d\s-]{10,}$/.test(effectiveForm.phone)) {
      newErrors.phone = t('validPhone');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof FormData]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      if (!db) {
        throw new Error('Firestore is not initialized');
      }

      const docRef = await addDoc(collection(db, 'contacts'), {
        ...form,
        email: user?.email || form.email,
        status: 'unread',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log('Contact message saved successfully with ID:', docRef.id);

      setSubmitted(true);

      setTimeout(() => {
        setForm({
          name: user?.displayName || '',
          email: user?.email || '',
          phone: '',
          subject: '',
          message: '',
        });
        setSubmitted(false);
      }, 5000);

    } catch (error: unknown) {
      console.error('Detailed error saving contact message:', error);

      let errorMessage = 'Failed to send message. ';

      const firebaseError = error as { code?: string; message?: string };

      if (firebaseError.code === 'permission-denied') {
        errorMessage += 'Permission denied. Please check your Firebase security rules.';
      } else if (firebaseError.code === 'unavailable') {
        errorMessage += 'Service is temporarily unavailable. Please try again.';
      } else if (firebaseError.code === 'not-found') {
        errorMessage += 'Database not found. Please check your Firebase configuration.';
      } else if (firebaseError.message?.includes('Firebase')) {
        errorMessage += 'Firebase configuration error. Please check your environment variables.';
      } else {
        errorMessage += 'Please try again later.';
      }

      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses = 'w-full px-4 py-3 rounded-2xl bg-transparent text-white placeholder-gray-600 focus:outline-none';

  return (
    <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden" style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}>
      {submitError && (
        <div
          className="mb-6 p-4 rounded-2xl text-sm"
          style={{ background: CLAY.recessed, boxShadow: SHADOW.pressedSm, color: CLAY.red }}
        >
          {submitError}
        </div>
      )}

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center py-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
              className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
              style={{ background: CLAY.recessed, boxShadow: SHADOW.pressedSm }}
            >
              <FaCheckCircle className="text-4xl" style={{ color: CLAY.teal }} />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: CLAY.text }}>{t('messageSent')}</h2>
            <p className="max-w-sm" style={{ color: CLAY.textMuted }}>
              {t('messageSentDescription')}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: CLAY.textMuted }}>
                  <FaUser style={{ color: CLAY.red }} /> {t('fullName')} <span style={{ color: CLAY.red }}>*</span>
                </label>
                <ClayFieldShell hasError={!!errors.name}>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jebarsan Thatcroos"
                    className={inputClasses}
                  />
                </ClayFieldShell>
                {errors.name && (
                  <p className="text-xs mt-1" style={{ color: CLAY.red }}>{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: CLAY.textMuted }}>
                  <FaEnvelope style={{ color: CLAY.red }} /> {t('email')} <span style={{ color: CLAY.red }}>*</span>
                  {user?.email && (
                    <span className="ml-auto normal-case text-[10px] flex items-center gap-1" style={{ color: CLAY.textMuted }}>
                      <FaLock className="text-[9px]" /> {t('fromYourAccount')}
                    </span>
                  )}
                </label>
                <ClayFieldShell hasError={!!errors.email} disabled={!!user?.email}>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    readOnly={!!user?.email}
                    placeholder="jebarsanthatcroos@gmail.com"
                    className={`${inputClasses} ${user?.email ? 'cursor-not-allowed' : ''}`}
                  />
                </ClayFieldShell>
                {errors.email && (
                  <p className="text-xs mt-1" style={{ color: CLAY.red }}>{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: CLAY.textMuted }}>
                  <FaPhone style={{ color: CLAY.red }} /> {t('phoneOptional')}
                </label>
                <ClayFieldShell hasError={!!errors.phone}>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+94 76 23 97 951"
                    className={inputClasses}
                  />
                </ClayFieldShell>
                {errors.phone && (
                  <p className="text-xs mt-1" style={{ color: CLAY.red }}>{errors.phone}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: CLAY.textMuted }}>
                  <FaPaperPlane style={{ color: CLAY.red }} /> {t('subject')}
                </label>
                <ClayFieldShell>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={`${inputClasses} appearance-none`}
                  >
                    <option value="" style={{ background: CLAY.recessed }}>{t('selectSubject')}</option>
                    <option value="general" style={{ background: CLAY.recessed }}>{t('generalInquiry')}</option>
                    <option value="donation" style={{ background: CLAY.recessed }}>{t('bloodDonation')}</option>
                    <option value="event" style={{ background: CLAY.recessed }}>{t('organizeDrive')}</option>
                    <option value="volunteer" style={{ background: CLAY.recessed }}>{t('volunteerOpportunity')}</option>
                    <option value="feedback" style={{ background: CLAY.recessed }}>{t('feedback')}</option>
                    <option value="other" style={{ background: CLAY.recessed }}>{t('other')}</option>
                  </select>
                </ClayFieldShell>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: CLAY.textMuted }}>
                {t('message')} <span style={{ color: CLAY.red }}>*</span>
              </label>
              <ClayFieldShell hasError={!!errors.message}>
                <textarea
                  name="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t('writeMessage')}
                  className={`${inputClasses} resize-none`}
                />
              </ClayFieldShell>
              {errors.message && (
                <p className="text-xs mt-1" style={{ color: CLAY.red }}>{errors.message}</p>
              )}
            </div>

            <ClaySubmitButton submitting={submitting} />
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};