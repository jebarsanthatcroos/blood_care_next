'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTint, FaHeartbeat, FaArrowRight, FaHome, FaSearch } from 'react-icons/fa';

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-[#03060F] overflow-hidden flex items-center justify-center">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #E11D2E15 0%, transparent 65%)' }}
      />

      <section className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-32 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF3C6E]/10 border border-[#FF3C6E]/20 text-[#FF3C6E] text-sm font-medium mb-6"
        >
          <FaHeartbeat className="text-xs" />
          Page not found
        </motion.span>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 120 }}
          className="relative w-24 h-24 mx-auto mb-8 rounded-2xl bg-white/3 border border-white/10 flex items-center justify-center"
        >
          <FaTint className="text-[#FF3C6E] text-4xl" />
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#03060F] border border-white/10 flex items-center justify-center"
          >
            <FaSearch className="text-gray-400 text-xs" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-5xl sm:text-7xl font-black text-white leading-tight mb-4"
        >
          4
          <span className="bg-linear-to-r from-[#E11D2E] via-[#FF3C6E] to-[#7B2FFF] bg-clip-text text-transparent">
            0
          </span>
          4
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-gray-400 text-lg max-w-md mx-auto mb-10"
        >
          This page went missing, but lives are still being saved every minute. Let&apos;s
          get you back on track.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-3.5 rounded-lg bg-linear-to-r from-[#E11D2E] to-[#7B2FFF] text-white font-bold shadow-lg hover:shadow-[#E11D2E]/40 transition-all"
            >
              <FaHome className="text-sm" />
              Back to Home
            </motion.button>
          </Link>
          <Link href="/donate">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-3.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 font-medium transition-all"
            >
              Donate Now
              <FaArrowRight className="text-sm" />
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}