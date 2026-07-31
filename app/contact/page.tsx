/* eslint-disable react-hooks/set-state-in-effect */
'use client';

export const dynamic = 'force-static';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEnvelope,
  FaPhone,
  FaClock,
  FaUser,
  FaPaperPlane,
  FaCheckCircle,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaLock,
} from 'react-icons/fa';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../lib/useAuth';
import { CLAY, SHADOW, usePressable } from '../lib/clay';
import { useLanguage } from '../lib/language';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  details: string | string[];
  link?: string;
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

function ClaySubmitButton({ submitting }: { submitting: boolean }) {
  const { t } = useLanguage();
  const { isPressed, pressHandlers } = usePressable();
  return (
    <motion.button
      type="submit"
      disabled={submitting}
      className="w-full py-3.5 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed"
      style={{
        background: `linear-gradient(145deg, ${CLAY.red}, ${CLAY.purple})`,
        boxShadow: submitting ? SHADOW.pressedSm : isPressed ? SHADOW.pressedSm : SHADOW.raisedSm,
        opacity: submitting ? 0.6 : 1,
        transition: 'box-shadow 150ms ease, opacity 150ms ease',
      }}
      animate={{ scale: isPressed && !submitting ? 0.98 : 1 }}
      {...pressHandlers}
    >
      {submitting ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t('sending')}
        </>
      ) : (
        <>
          <FaPaperPlane /> {t('sendMessage')}
        </>
      )}
    </motion.button>
  );
}

function ClaySocialIcon({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
  const { isPressed, pressHandlers } = usePressable();
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2 }}
      className="w-10 h-10 rounded-2xl flex items-center justify-center"
      style={{
        background: CLAY.surface,
        color: CLAY.textMuted,
        boxShadow: isPressed ? SHADOW.pressedSm : SHADOW.raisedSm,
        transition: 'box-shadow 150ms ease, color 150ms ease',
      }}
      aria-label={label}
      {...pressHandlers}
    >
      <Icon className="w-4 h-4" />
    </motion.a>
  );
}

export default function ContactPage() {
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

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      email: user.email || prev.email,
      name: prev.name || user.displayName || '',
    }));
  }, [user]);

  const contactInfo: ContactInfo[] = [
    {
      icon: <HiOutlinePhone className="w-6 h-6" />,
      title: t('phone'),
      details: ['+94 76 23 97 951', '+94 70 239 7952'],
      link: 'tel:+94762397951',
    },
    {
      icon: <HiOutlineMail className="w-6 h-6" />,
      title: t('email'),
      details: ['gwu-hict-2020-42@gwu.ac.lk', 'gwu-hict-2020-38@gwu.ac.lk'],
      link: 'mailto:gwu-hict-2022-42@gwu.ac.lk',
    },
    {
      icon: <HiOutlineLocationMarker className="w-6 h-6" />,
      title: t('location'),
      details: ['No 23, Thalaimannar', 'Mannar, Sri Lanka'],
    },
    {
      icon: <FaClock className="w-6 h-6" />,
      title: t('workingHours'),
      details: ['Mon - Fri: 8:00 AM - 8:00 PM', 'Sat: 9:00 AM - 5:00 PM', 'Sun: Closed'],
    },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!form.name.trim()) newErrors.name = t('nameRequired');
    if (!form.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t('validEmail');
    }
    if (!form.message.trim()) newErrors.message = t('messageRequired');
    if (form.phone && !/^\+?[\d\s-]{10,}$/.test(form.phone)) {
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

      console.log('Attempting to save to Firebase...');
      console.log('Form data:', form);

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Detailed error saving contact message:', error);

      let errorMessage = 'Failed to send message. ';

      if (error.code === 'permission-denied') {
        errorMessage += 'Permission denied. Please check your Firebase security rules.';
      } else if (error.code === 'unavailable') {
        errorMessage += 'Service is temporarily unavailable. Please try again.';
      } else if (error.code === 'not-found') {
        errorMessage += 'Database not found. Please check your Firebase configuration.';
      } else if (error.message?.includes('Firebase')) {
        errorMessage += 'Firebase configuration error. Please check your environment variables.';
      } else {
        errorMessage += 'Please try again later.';
      }

      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.674357682451!2d79.7248248!3d9.0933521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe0b278aebd407%3A0x4774656e4a90f7f2!2sDivisional%20Hospital%20Talaimannar!5e0!3m2!1sen!2slk!4v1690000000000!5m2!1sen!2slk";

  const inputClasses = 'w-full px-4 py-3 rounded-2xl bg-transparent text-white placeholder-gray-600 focus:outline-none';

  return (
    <main className="relative min-h-screen overflow-hidden pt-28 pb-20 px-4 sm:px-6" style={{ background: CLAY.bg }}>
      <div className="relative z-10 max-w-6xl mx-auto">
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
            <FaEnvelope className="text-xs" style={{ color: CLAY.red }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: CLAY.textMuted }}>
              {t('getInTouch')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: CLAY.text }}>
            {t('contactUs')}
          </h1>
          <p className="max-w-xl mx-auto" style={{ color: CLAY.textMuted }}>
            {t('contactDescription')}
          </p>
        </motion.div>

        {/* Contact Info Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              className="relative rounded-3xl p-6"
              style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: CLAY.recessed, boxShadow: SHADOW.pressedSm, color: CLAY.red }}
              >
                {info.icon}
              </div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: CLAY.text }}>{info.title}</h3>
              {Array.isArray(info.details) ? (
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm" style={{ color: CLAY.textMuted }}>
                      {detail}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: CLAY.textMuted }}>{info.details}</p>
              )}
              {info.link && (
                <a
                  href={info.link}
                  className="mt-3 inline-block text-xs transition-colors"
                  style={{ color: CLAY.red }}
                >
                  {t('contactNow')}
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 relative rounded-3xl p-6 sm:p-10 overflow-hidden"
            style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}
          >
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
          </motion.div>

          {/* Sidebar - Map & Social */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Map */}
            <div className="relative rounded-3xl p-6 overflow-hidden" style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: CLAY.text }}>{t('findUs')}</h3>
              <div className="relative w-full h-64 rounded-2xl overflow-hidden" style={{ boxShadow: SHADOW.pressedSm }}>
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                  title="Divisional Hospital, Talaimannar Location"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="relative rounded-3xl p-6" style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: CLAY.text }}>{t('connectWithUs')}</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <ClaySocialIcon key={index} href={social.href} label={social.label} icon={social.icon} />
                ))}
              </div>
            </div>

            {/* Quick Response */}
            <div className="relative rounded-3xl p-6" style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: CLAY.text }}>{t('quickResponse')}</h3>
              <p className="text-sm mb-4" style={{ color: CLAY.textMuted }}>
                {t('quickResponseDescription')}
              </p>
              <div className="flex items-center gap-2 text-xs" style={{ color: CLAY.textMuted }}>
                <FaClock style={{ color: CLAY.red }} />
                <span>{t('availableHours')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}