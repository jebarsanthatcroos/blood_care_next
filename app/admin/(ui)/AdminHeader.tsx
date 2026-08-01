'use client';

import { motion } from 'framer-motion';
import { FaHeartbeat } from 'react-icons/fa';

export const AdminHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff5364]/25 bg-[#ff5364]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff8b96]">
            <FaHeartbeat />
            BloodBank Portal
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Operations overview
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Keep donor registrations moving, respond to messages, and protect every connection that can save a life.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#101d2d]/70 px-4 py-3 text-sm text-slate-300">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
          Live operations
        </div>
      </div>
    </motion.div>
  );
};