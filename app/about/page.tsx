'use client';

export const dynamic = 'force-static';
import { motion } from 'framer-motion';
import {
  FaHeartbeat,
  FaTint,
  FaUsers,
  FaHospital,
  FaHandHoldingHeart,
  FaShieldAlt,
  FaClock,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const stats = [
  { icon: FaTint, label: 'Lives Saved', value: '2,400+' },
  { icon: FaUsers, label: 'Registered Donors', value: '5,800+' },
  { icon: FaHospital, label: 'Partner Hospitals', value: '32' },
  { icon: FaMapMarkerAlt, label: 'Cities Covered', value: '18' },
];

const values = [
  {
    icon: FaHeartbeat,
    title: 'Our Mission',
    description:
      'Connect willing donors with patients in need, quickly and reliably, so that no one waits too long for the blood that could save their life.',
  },
  {
    icon: FaShieldAlt,
    title: 'Safety First',
    description:
      'Every donation follows strict screening and handling protocols set by our partner hospitals and health authorities.',
  },
  {
    icon: FaClock,
    title: 'Always Available',
    description:
      'Our platform runs around the clock, so a request for blood is matched with nearby donors as soon as it comes in.',
  },
  {
    icon: FaHandHoldingHeart,
    title: 'Community Driven',
    description:
      'Built by and for the community — every donor profile, every request, and every match brings us closer as a network of people helping people.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Register',
    description: 'Sign up as a donor with your blood type, city, and contact details.',
  },
  {
    number: '02',
    title: 'Get Matched',
    description: 'When someone nearby needs your blood type, we reach out to you directly.',
  },
  {
    number: '03',
    title: 'Donate',
    description: 'Visit the partner hospital or clinic at a time that works for you.',
  },
  {
    number: '04',
    title: 'Save a Life',
    description: 'Your donation reaches a patient in need, often within hours.',
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#03060F] overflow-hidden pt-28 pb-20 px-4 sm:px-6">
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
        className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-75 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #E11D2E10 0%, transparent 65%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF3C6E]/10 border border-[#FF3C6E]/20 text-[#FF3C6E] text-sm font-medium mb-4">
            <FaTint className="text-xs" />
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Every Drop Counts
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We&apos;re a platform dedicated to bridging the gap between blood donors
            and the patients who need them most, one connection at a time.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/3 border border-white/10 rounded-xl p-6 text-center"
            >
              <stat.icon className="text-[#FF3C6E] text-2xl mx-auto mb-3" />
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Values */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-black text-white text-center mb-10"
          >
            What Drives Us
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -2 }}
                className="bg-white/3 border border-white/10 rounded-xl p-6"
              >
                <div className="w-11 h-11 rounded-lg bg-[#FF3C6E]/10 flex items-center justify-center mb-4">
                  <value.icon className="text-[#FF3C6E] text-lg" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-black text-white text-center mb-10"
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white/3 border border-white/10 rounded-xl p-6"
              >
                <span className="text-[#FF3C6E]/30 text-4xl font-black">{step.number}</span>
                <h3 className="text-white font-bold text-lg mt-2 mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-white/3 border border-white/10 rounded-2xl p-10 sm:p-14"
        >
          <FaHandHoldingHeart className="text-[#FF3C6E] text-3xl mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Ready to Make a Difference?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-6">
            Join our network of donors today. It takes a few minutes to register,
            and it could save someone&apos;s life tomorrow.
          </p>
          <a
            href="/Donate"
            className="inline-block px-8 py-3 bg-[#FF3C6E] hover:bg-[#E11D2E] rounded-lg text-white font-bold transition-colors"
          >
            Become a Donor
          </a>
        </motion.div>
      </div>
    </main>
  );
}