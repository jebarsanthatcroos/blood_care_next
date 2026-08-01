'use client';

export const dynamic = 'force-static';

import { motion } from 'framer-motion';
import { CLAY } from '../../lib/clay';
import {
  ContactHeader,
  ContactInfoGrid,
  ContactForm,
  ContactSidebar,
} from './(ui)';

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pt-28 pb-20 px-4 sm:px-6" style={{ background: CLAY.bg }}>
      <div className="relative z-10 max-w-6xl mx-auto">
        <ContactHeader />
        <ContactInfoGrid />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <ContactForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <ContactSidebar />
          </motion.div>
        </div>
      </div>
    </main>
  );
}