/* eslint-disable react-hooks/set-state-in-effect */
'use client';

export const dynamic = 'force-static';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTint,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaCalendarAlt,
  FaLock,
} from 'react-icons/fa';
import { useAuth } from '../lib/useAuth';
import { useLanguage } from '../lib/language';
import { CLAY, SHADOW, usePressable } from '../lib/clay';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface FormData {
  fullName: string;
  bloodType: string;
  phone: string;
  email: string;
  city: string;
  preferredDate: string;
  message: string;
}

function ClayFieldShell({
  children,
  hasError,
  disabled,
}: {
  children: React.ReactNode;
  hasError?: boolean;
  disabled?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="rounded-2xl transition-shadow duration-150"
      style={{
        background: CLAY.recessed,
        boxShadow: hasError
          ? `${SHADOW.pressedSm}, inset 0 0 0 1.5px ${CLAY.red}`
          : isFocused
          ? `${SHADOW.pressedSm}, inset 0 0 0 1.5px ${CLAY.teal}66`
          : SHADOW.pressedSm,
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {children}
    </div>
  );
}


function BloodTypeChip({
  type,
  selected,
  onSelect,
}: {
  type: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const { isPressed, pressHandlers } = usePressable();
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className="py-2.5 rounded-2xl text-sm font-bold"
      style={{
        background: selected ? `linear-gradient(145deg, ${CLAY.red}, ${CLAY.purple})` : CLAY.surface,
        color: selected ? '#FFFFFF' : CLAY.textMuted,
        boxShadow: selected || isPressed ? SHADOW.pressedSm : SHADOW.raisedSm,
        transition: 'box-shadow 150ms ease, color 150ms ease',
      }}
      animate={{ scale: isPressed ? 0.95 : 1 }}
      {...pressHandlers}
    >
      {type}
    </motion.button>
  );
}

function ClaySubmitButton({ submitting, disabled }: { submitting: boolean; disabled: boolean }) {
  const { isPressed, pressHandlers } = usePressable();
  const { t } = useLanguage();
  return (
    <motion.button
      type="submit"
      disabled={submitting || disabled}
      className="w-full py-3.5 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed"
      style={{
        background: `linear-gradient(145deg, ${CLAY.red}, ${CLAY.purple})`,
        boxShadow: submitting || disabled ? SHADOW.pressedSm : isPressed ? SHADOW.pressedSm : SHADOW.raisedSm,
        opacity: submitting || disabled ? 0.5 : 1,
        transition: 'box-shadow 150ms ease, opacity 150ms ease',
      }}
      animate={{ scale: isPressed && !submitting && !disabled ? 0.98 : 1 }}
      {...pressHandlers}
    >
      {submitting ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t('submitting')}
        </>
      ) : (
        t('registerAsDonor')
      )}
    </motion.button>
  );
}

function ClayGhostButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const { isPressed, pressHandlers } = usePressable();
  return (
    <motion.button
      onClick={onClick}
      className="mt-6 px-5 py-2.5 rounded-2xl text-sm"
      style={{
        background: CLAY.surface,
        color: CLAY.textMuted,
        boxShadow: isPressed ? SHADOW.pressedSm : SHADOW.raisedSm,
        transition: 'box-shadow 150ms ease',
      }}
      animate={{ scale: isPressed ? 0.96 : 1 }}
      {...pressHandlers}
    >
      {children}
    </motion.button>
  );
}

export default function DonatePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState<FormData>({
    fullName: '',
    bloodType: '',
    phone: '',
    email: '',
    city: '',
    preferredDate: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      email: user.email || prev.email,
      fullName: prev.fullName || user.displayName || '',
    }));
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof FormData]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    if (submitError) setSubmitError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!form.bloodType) {
      newErrors.bloodType = 'Please select a blood type';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!form.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      if (!user) {
        throw new Error('Please sign in before registering as a donor.');
      }

      const token = await user.getIdToken();
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          bloodType: form.bloodType,
          phone: form.phone.trim(),
          city: form.city.trim(),
          preferredDate: form.preferredDate || '',
          message: form.message.trim() || '',
        }),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || 'Donor registration request failed.');
      }
      const result = await response.json();

      console.log('Donor registered successfully with ID:', result.id);

      setSubmitted(true);

      setTimeout(() => {
        setForm({
          fullName: '',
          bloodType: '',
          phone: '',
          email: user?.email || '',
          city: '',
          preferredDate: '',
          message: '',
        });
        setSubmitted(false);
      }, 8000);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error registering donor:', error);

      let errorMessage = 'Failed to register. ';
      if (error.code === 'permission-denied') {
        errorMessage += 'Permission denied. Please check Firebase security rules.';
      } else if (error.code === 'unavailable') {
        errorMessage += 'Service unavailable. Please try again.';
      } else if (error.code === 'not-found') {
        errorMessage += 'Database not found. Check Firebase configuration.';
      } else if (error.message?.includes('Firebase')) {
        errorMessage += 'Firebase configuration error.';
      } else if (error.message) {
        errorMessage = error.message;
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
    <main className="relative min-h-screen overflow-hidden pt-28 pb-20 px-4 sm:px-6" style={{ background: CLAY.bg }}>
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: CLAY.surface, boxShadow: SHADOW.pressedSm }}
          >
            <FaTint className="text-xs" style={{ color: CLAY.red }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: CLAY.textMuted }}>
              {t('becomeDonor')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: CLAY.text }}>
            {t('registerDonate')} Blood
          </h1>
          <p className="max-w-xl mx-auto" style={{ color: CLAY.textMuted }}>
            {t('registrationDescription')}
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-3xl p-6 sm:p-10 overflow-hidden"
          style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}
        >
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl text-sm flex items-start gap-2"
              style={{ background: CLAY.recessed, boxShadow: SHADOW.pressedSm, color: CLAY.red }}
            >
              <span className="mt-0.5">⚠️</span>
              <span>{submitError}</span>
            </motion.div>
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
                <h2 className="text-2xl font-bold mb-2" style={{ color: CLAY.text }}>{t('thankYou')}</h2>
                <p className="max-w-sm" style={{ color: CLAY.textMuted }}>
                  {t('donorRegistrationReceived')} {' '}
                  <span style={{ color: CLAY.text }}>{form.email || form.phone}</span> to
                  {' '}{t('confirmDonationSlot')}
                </p>
                <ClayGhostButton
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      fullName: '',
                      bloodType: '',
                      phone: '',
                      email: user?.email || '',
                      city: '',
                      preferredDate: '',
                      message: '',
                    });
                    setErrors({});
                  }}
                >
                  {t('registerAnotherDonor')}
                </ClayGhostButton>
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
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: CLAY.textMuted }}>
                    <FaUser style={{ color: CLAY.red }} /> {t('fullName')} <span style={{ color: CLAY.red }}>*</span>
                  </label>
                  <ClayFieldShell hasError={!!errors.fullName}>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Jebarsan Thatcroos"
                      className={inputClasses}
                    />
                  </ClayFieldShell>
                  {errors.fullName && (
                    <p className="text-xs mt-1" style={{ color: CLAY.red }}>{errors.fullName}</p>
                  )}
                </div>

                {/* Blood Type */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: CLAY.textMuted }}>
                    <FaTint style={{ color: CLAY.red }} /> {t('bloodType')} <span style={{ color: CLAY.red }}>*</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {bloodTypes.map((type) => (
                      <BloodTypeChip
                        key={type}
                        type={type}
                        selected={form.bloodType === type}
                        onSelect={() => {
                          setForm({ ...form, bloodType: type });
                          if (errors.bloodType) {
                            setErrors({ ...errors, bloodType: '' });
                          }
                        }}
                      />
                    ))}
                  </div>
                  {errors.bloodType && (
                    <p className="text-xs mt-1" style={{ color: CLAY.red }}>{errors.bloodType}</p>
                  )}
                </div>

                {/* Phone + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: CLAY.textMuted }}>
                      <FaPhone style={{ color: CLAY.red }} /> {t('phoneNumber')} <span style={{ color: CLAY.red }}>*</span>
                    </label>
                    <ClayFieldShell hasError={!!errors.phone}>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+94 76 239 7951"
                        className={inputClasses}
                      />
                    </ClayFieldShell>
                    {errors.phone && (
                      <p className="text-xs mt-1" style={{ color: CLAY.red }}>{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: CLAY.textMuted }}>
                      <FaEnvelope style={{ color: CLAY.red }} /> {t('email')}
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

                {/* City + Preferred Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: CLAY.textMuted }}>
                      <FaMapMarkerAlt style={{ color: CLAY.red }} /> {t('city')} <span style={{ color: CLAY.red }}>*</span>
                    </label>
                    <ClayFieldShell hasError={!!errors.city}>
                      <input
                        type="text"
                        name="city"
                        required
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Kalmunai"
                        className={inputClasses}
                      />
                    </ClayFieldShell>
                    {errors.city && (
                      <p className="text-xs mt-1" style={{ color: CLAY.red }}>{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: CLAY.textMuted }}>
                      <FaCalendarAlt style={{ color: CLAY.red }} /> {t('preferredDate')}
                    </label>
                    <ClayFieldShell>
                      <input
                        type="date"
                        name="preferredDate"
                        value={form.preferredDate}
                        onChange={handleChange}
                        className={`${inputClasses} scheme-dark`}
                      />
                    </ClayFieldShell>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: CLAY.textMuted }}>
                    {t('additionalNotes')}
                  </label>
                  <ClayFieldShell>
                    <textarea
                      name="message"
                      rows={3}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Any health conditions or special notes..."
                      className={`${inputClasses} resize-none`}
                    />
                  </ClayFieldShell>
                </div>

                <ClaySubmitButton submitting={submitting} disabled={!form.bloodType} />
                {!form.bloodType && (
                  <p className="text-xs text-center" style={{ color: CLAY.textMuted }}>
                    {t('selectBloodType')}
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}