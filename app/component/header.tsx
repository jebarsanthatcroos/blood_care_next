'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import {
  FaHeartbeat,
  FaTint,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaGlobe,
  FaUserShield,
} from 'react-icons/fa';
import { useAuth } from '../../lib/useAuth';
import { CLAY, SHADOW, usePressable } from '../../lib/clay';
import type { User } from 'firebase/auth';
import { useLanguage } from '../../lib/language';

interface NavItem {
  href: string;
  label: string;
  labelKey?: Parameters<ReturnType<typeof useLanguage>['t']>[0];
  icon: React.ElementType;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  glowColor?: string;
}

/* ---------------------------------------------------------------------- */
/* Logo                                                                    */
/* ---------------------------------------------------------------------- */

function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false);
  const { isPressed, pressHandlers } = usePressable();

  return (
    <Link
      href="/"
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 relative">
        {/* Clay squircle icon */}
        <motion.div
          className="relative w-11 h-11 rounded-[16px]"
          style={{
            background: `linear-gradient(145deg, ${CLAY.surface}, #12141C)`,
            boxShadow: isPressed ? SHADOW.pressed : isHovered ? SHADOW.raisedHover : SHADOW.raised,
            transition: 'box-shadow 150ms ease',
          }}
          animate={{ scale: isPressed ? 0.94 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          {...pressHandlers}
        >
          <div
            className="absolute inset-0 rounded-[16px] opacity-70"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${CLAY.red}33, transparent 60%), radial-gradient(circle at 70% 70%, ${CLAY.purple}33, transparent 60%)`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src="/Logo.jpg" alt="Logo" width={24} height={24} className="w-6 h-6 rounded-md" />
          </div>
        </motion.div>

        {/* Wordmark */}
        <div className="relative">
          <span
            className="font-bold text-xl bg-linear-to-r from-[#E8687A] via-[#FF9AA8] to-[#B39DFB] bg-clip-text text-transparent"
            style={{ backgroundSize: '200% auto' }}
          >
            BloodCare
          </span>
        </div>

        {/* Pulse heart badge — a small pressed clay dot */}
        <motion.div
          className="absolute -top-1.5 -right-3 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: CLAY.surface, boxShadow: SHADOW.pressedSm }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <FaHeartbeat className="text-[#E8687A] text-[9px]" />
        </motion.div>
      </div>
    </Link>
  );
}

/* ---------------------------------------------------------------------- */
/* Desktop nav link                                                        */
/* ---------------------------------------------------------------------- */

function AnimatedNavLink({ href, label, icon: Icon, glowColor = '#E8687A' }: NavItem) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const [isHovered, setIsHovered] = useState(false);
  const { isPressed, pressHandlers } = usePressable();

  const shadow = isActive || isPressed ? SHADOW.pressedSm : isHovered ? SHADOW.raisedSm : SHADOW.flat;

  return (
    <Link href={href}>
      <motion.div
        className="relative px-4 py-2 rounded-2xl flex items-center gap-2"
        style={{
          background: isActive ? `${glowColor}14` : 'transparent',
          boxShadow: shadow,
          color: isActive ? CLAY.text : CLAY.textMuted,
          transition: 'box-shadow 150ms ease, background 150ms ease, color 150ms ease',
        }}
        onMouseEnter={() => setIsHovered(true)}
        whileTap={{ scale: 0.96 }}
        {...pressHandlers}
        onMouseLeave={() => {
          setIsHovered(false);
          pressHandlers.onMouseLeave();
        }}
      >
        <Icon className="text-sm" style={{ color: isActive ? glowColor : undefined }} />
        <span className="text-sm font-medium">{label}</span>
      </motion.div>
    </Link>
  );
}

/* ---------------------------------------------------------------------- */
/* User dropdown                                                           */
/* ---------------------------------------------------------------------- */

function UserDropdown({ user, isAdmin, onSignOut }: { user: User; isAdmin: boolean; onSignOut: () => void }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { isPressed, pressHandlers } = usePressable();

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-3 pl-2 pr-4 py-2 rounded-full"
        style={{
          background: CLAY.surface,
          boxShadow: isPressed || isOpen ? SHADOW.pressedSm : SHADOW.raisedSm,
          transition: 'box-shadow 150ms ease',
        }}
        {...pressHandlers}
      >
        {/* Avatar */}
        <div className="relative">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt="Avatar"
              width={36}
              height={36}
              className="rounded-full"
              style={{ boxShadow: SHADOW.pressedSm }}
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(145deg, ${CLAY.red}, ${CLAY.purple})`,
                boxShadow: SHADOW.flat,
              }}
            >
              <span className="text-white font-bold text-sm">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
            style={{ background: CLAY.teal, borderColor: CLAY.bg }}
          />
        </div>

        <div className="text-left hidden sm:block">
          <p className="text-xs font-medium" style={{ color: CLAY.text }}>
            {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
          </p>
        </div>

        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <svg className="w-4 h-4" style={{ color: CLAY.textMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute right-0 mt-3 w-64 rounded-3xl overflow-hidden"
            style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}
          >
            <div className="px-4 py-3" style={{ boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.04)' }}>
              <p className="text-xs" style={{ color: CLAY.textMuted }}>{t('signedInAs')}</p>
              <p className="text-sm font-medium truncate" style={{ color: CLAY.text }}>{user.email}</p>
            </div>

            <div className="py-2 px-2 space-y-1">
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
                  <FaUserCircle className="group-hover:text-[#5FE3CE] transition-colors" style={{ color: CLAY.textMuted }} />
                  <span className="text-sm" style={{ color: CLAY.text }}>{t('dashboard')}</span>
                </div>
              </Link>
              <Link href="/profile" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
                  <FaUserCircle className="group-hover:text-[#5FE3CE] transition-colors" style={{ color: CLAY.textMuted }} />
                  <span className="text-sm" style={{ color: CLAY.text }}>{t('profile')}</span>
                </div>
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
                    <FaUserShield className="group-hover:text-[#B39DFB] transition-colors" style={{ color: CLAY.textMuted }} />
                    <span className="text-sm" style={{ color: CLAY.text }}>{t('adminDashboard')}</span>
                  </div>
                </Link>
              )}
            </div>

            <div className="p-2" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
              <button
                onClick={() => {
                  onSignOut();
                  setIsOpen(false);
                }}
                className="w-full"
              >
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-red-500/10 transition-colors cursor-pointer group">
                  <FaSignOutAlt className="text-red-400" />
                  <span className="text-sm text-red-400">{t('signOut')}</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Mobile menu                                                             */
/* ---------------------------------------------------------------------- */

function MobileMenu({ items, user, isAdmin, onClose, onSignOut }: {
  items: NavItem[];
  user: User | null;
  isAdmin: boolean;
  onClose: () => void;
  onSignOut: () => void;
}) {
  const pathname = usePathname();
  const { t, toggleLanguage, language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden mx-4 mb-4 rounded-[28px] overflow-hidden"
      style={{ background: CLAY.surface, boxShadow: SHADOW.raised }}
    >
      <div className="px-3 py-4 space-y-2">
        <button
          type="button"
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold"
          style={{ color: CLAY.textMuted, boxShadow: SHADOW.flat }}
        >
          <span className="flex items-center gap-2"><FaGlobe /> Language</span>
          <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
        </button>
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={item.href} onClick={onClose}>
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{
                    boxShadow: isActive ? SHADOW.pressedSm : 'none',
                    color: isActive ? CLAY.text : CLAY.textMuted,
                  }}
                >
                  <Icon className="text-sm" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="ml-auto w-1.5 h-6 rounded-full"
                      style={{ background: `linear-gradient(180deg, ${CLAY.red}, ${CLAY.teal})` }}
                      layoutId="mobileActive"
                    />
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: items.length * 0.05 }}
          >
            <Link href="/admin" onClick={onClose}>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{
                  boxShadow: pathname === '/admin' ? SHADOW.pressedSm : 'none',
                  color: pathname === '/admin' ? CLAY.text : CLAY.textMuted,
                }}
              >
                <FaUserShield className="text-sm" />
                <span className="font-medium">{t('admin')}</span>
              </div>
            </Link>
          </motion.div>
        )}

        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 mt-2"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              {user.photoURL ? (
                <Image src={user.photoURL} alt="Avatar" width={40} height={40} className="rounded-full" style={{ boxShadow: SHADOW.pressedSm }} />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(145deg, ${CLAY.red}, ${CLAY.purple})` }}
                >
                  <span className="text-white font-bold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm font-medium" style={{ color: CLAY.text }}>
                  {user.displayName || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs" style={{ color: CLAY.textMuted }}>{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all"
            >
              <FaSignOutAlt />
              <span>{t('signOut')}</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 mt-2 space-y-2"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
          >
            <Link href="/signin" onClick={onClose}>
              <div
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl"
                style={{ color: CLAY.textMuted, boxShadow: SHADOW.flat }}
              >
                {t('signIn')}
              </div>
            </Link>
            <Link href="/signup" onClick={onClose}>
              <div
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-white font-medium"
                style={{ background: `linear-gradient(145deg, ${CLAY.red}, ${CLAY.purple})`, boxShadow: SHADOW.raisedSm }}
              >
                {t('signUp')}
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------------- */
/* Nav config + main component                                             */
/* ---------------------------------------------------------------------- */

const navItems: NavItem[] = [
  { href: '/', label: 'Home', labelKey: 'home', icon: FaGlobe, glowColor: '#E8687A' },
  { href: '/features', label: 'Why Donate', labelKey: 'whyDonate', icon: FaTint, glowColor: '#5FE3CE' },
  { href: '/donate', label: 'Donate Now', labelKey: 'donateNow', icon: FaHeartbeat, glowColor: '#B39DFB' },
  { href: '/contact', label: 'Contact', labelKey: 'contact', icon: FaGlobe, glowColor: '#E8687A' },
  { href: '/dashboard', label: 'Dashboard', labelKey: 'dashboard', icon: FaUserCircle, requiresAuth: true, glowColor: '#5FE3CE' },
];

function ClayCTAButton({ href, label }: { href: string; label: string }) {
  const { isPressed, pressHandlers } = usePressable();
  return (
    <Link href={href}>
      <motion.button
        className="px-5 py-2 rounded-2xl text-white font-medium"
        style={{
          background: `linear-gradient(145deg, ${CLAY.red}, ${CLAY.purple})`,
          boxShadow: isPressed ? SHADOW.pressedSm : SHADOW.raisedSm,
          transition: 'box-shadow 150ms ease',
        }}
        animate={{ scale: isPressed ? 0.96 : 1 }}
        {...pressHandlers}
      >
        {label}
      </motion.button>
    </Link>
  );
}

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const scrollY = useMotionValue(0);
  const { isPressed: toggleIsPressed, pressHandlers: togglePressHandlers } = usePressable();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      scrollY.set(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const filteredNavItems = navItems
    .filter((item) => !item.requiresAuth || !!user)
    .map((item) => ({ ...item, label: item.labelKey ? t(item.labelKey) : item.label }));

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-4 left-4 right-4 z-50 rounded-[28px] transition-all duration-500"
        style={{
          background: CLAY.bg,
          boxShadow: scrolled ? SHADOW.raisedHover : SHADOW.raised,
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <AnimatedLogo />

            <div className="hidden md:flex items-center md:gap-1 lg:gap-2">
              {filteredNavItems.map((item) => (
                <AnimatedNavLink key={item.href} {...item} />
              ))}
            </div>

            <div className="hidden md:flex items-center md:gap-2 lg:gap-4">
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold"
                style={{ color: CLAY.textMuted, boxShadow: SHADOW.flat }}
                aria-label="Change language"
              >
                <FaGlobe /> {language === 'en' ? 'தமிழ்' : 'English'}
              </button>
              {user ? (
                <UserDropdown user={user} isAdmin={isAdmin} onSignOut={handleSignOut} />
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/signin">
                    <button className="px-4 py-2 rounded-2xl transition-all" style={{ color: CLAY.textMuted }}>
                      Sign In
                    </button>
                  </Link>
                  <ClayCTAButton href="/signup" label="Sign Up" />
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                color: CLAY.textMuted,
                boxShadow: toggleIsPressed || isMenuOpen ? SHADOW.pressedSm : SHADOW.flat,
                transition: 'box-shadow 150ms ease',
              }}
              animate={{ scale: toggleIsPressed ? 0.94 : 1 }}
              {...togglePressHandlers}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <FaTimes className="text-xl" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <FaBars className="text-xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu (rendered below the floating nav slab) */}
      <div className="fixed top-[88px] left-0 right-0 z-40">
        <AnimatePresence>
          {isMenuOpen && (
                <MobileMenu
              items={filteredNavItems}
              user={user}
              isAdmin={isAdmin}
              onClose={() => setIsMenuOpen(false)}
              onSignOut={handleSignOut}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Spacer */}
      <div className="h-24" />
    </>
  );
}