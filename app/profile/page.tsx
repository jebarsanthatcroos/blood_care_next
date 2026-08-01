/* eslint-disable react-hooks/set-state-in-effect */
'use client';

export const dynamic = 'force-static';

import React, { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { 
  onAuthStateChanged, 
  User, 
  updateProfile, 
  verifyBeforeUpdateEmail,
  sendEmailVerification
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaCamera, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaShieldAlt,
  FaHeartbeat,
  FaBell,
  FaLock,
  FaGlobe
} from 'react-icons/fa';
import { TbHexagon3D, TbMedicalCross } from 'react-icons/tb';
import { MdVerified } from 'react-icons/md';



function AnimatedBackground() {
  const [particles, setParticles] = useState<{ x: string; y: string; delay: number; duration: number }[]>([]);

  useEffect(() => {
    setParticles(
      [...Array(30)].map(() => ({
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        delay: Math.random() * 10,
        duration: Math.random() * 10 + 10,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient orbs */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-[#0047FF] rounded-full filter blur-[120px]"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-150 h-150 bg-[#00C5A8] rounded-full filter blur-[100px]"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-0 w-125 h-125 bg-[#7B2FFF] rounded-full filter blur-[100px]"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.08, 0.05]
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
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-linear-to-r from-[#0047FF] to-[#00C5A8]"
          initial={{
            x: p.x,
            y: p.y,
            opacity: 0,
          }}
          animate={{
            y: [p.y, `${(parseFloat(p.y) + 20) % 100}%`],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}



function EditableField({ 
  label, 
  value, 
  icon: Icon, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel,
  onChange,
  disabled,
  helperText
}: { 
  label: string; 
  value: string; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; 
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  helperText?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      
      {isEditing ? (
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="text"
              value={value}
              onChange={onChange}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00C5A8] focus:ring-2 focus:ring-[#00C5A8]/20 transition-all"
              autoFocus
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSave}
            className="p-3 rounded-xl bg-[#00C5A8] text-white"
          >
            <FaSave className="text-sm" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="p-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30"
          >
            <FaTimes className="text-sm" />
          </motion.button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl group">
          <div className="flex items-center gap-3">
            <Icon className="text-gray-500 text-sm" />
            <span className="text-white">{value || 'Not set'}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onEdit}
            disabled={disabled}
            className="text-gray-500 hover:text-[#00C5A8] transition-colors disabled:opacity-50"
          >
            <FaEdit className="text-sm" />
          </motion.button>
        </div>
      )}
      
      {helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}



export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [memberSince, setMemberSince] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFormData({
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
        });
        
        if (currentUser.metadata.creationTime) {
          setMemberSince(new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }));
        }
      } else {
        router.push('/signin');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.createdAt?.toDate) {
            setMemberSince(data.createdAt.toDate().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }));
          }
        } else {
          await setDoc(userDocRef, {
            email: user.email,
            displayName: user.displayName || '',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setSaving(true);
    setMessage(null);
    
    try {
      if (editingField === 'name' && formData.displayName !== user.displayName) {
        await updateProfile(user, { displayName: formData.displayName });
        
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { 
          displayName: formData.displayName, 
          updatedAt: new Date() 
        });
        
        setMessage({ type: 'success', text: 'Display name updated successfully!' });
      }
      
      if (editingField === 'email' && formData.email !== user.email) {
        await verifyBeforeUpdateEmail(user, formData.email);
        setPendingEmail(formData.email);
        setMessage({ 
          type: 'success', 
          text: `Verification email sent to ${formData.email}. Please verify your new email address.` 
        });
        setFormData(prev => ({ ...prev, email: user.email || '' }));
      }
      
      setTimeout(() => setMessage(null), 5000);
    } catch (error: unknown) {
      let errorMessage = 'Failed to update profile';
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/operation-not-allowed') {
          errorMessage = 'Please verify your email before changing it.';
        } else if (error.code === 'auth/requires-recent-login') {
          errorMessage = 'Please sign out and sign back in to change this information.';
        } else {
          errorMessage = error.message;
        }
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
      setEditingField(null);
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;
    try {
      await sendEmailVerification(user);
      setMessage({ type: 'success', text: 'Verification email resent! Check your inbox.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Resend failed' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Avatar upload isn't wired up to storage yet.
    setMessage({ type: 'error', text: 'Avatar upload feature coming soon!' });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03060F] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <TbHexagon3D className="text-6xl text-[#0047FF]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03060F] relative overflow-hidden pt-20 pb-12">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Verification Banner */}
        <AnimatePresence>
          {user && !user.emailVerified && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3 text-yellow-400">
                  <FaExclamationCircle />
                  <span className="text-sm">Please verify your email to access all features.</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResendVerification}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-all"
                >
                  Resend Verification
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pending Email Banner */}
        <AnimatePresence>
          {pendingEmail && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 text-blue-400">
                <FaEnvelope />
                <span className="text-sm">Verification email sent to {pendingEmail}. Please verify to complete the change.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-6"
        >
          {/* Cover Photo with gradient */}
          <div className="relative h-48 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-[#0047FF] via-[#00C5A8] to-[#7B2FFF] opacity-30" />
            <div className="absolute inset-0 bg-linear-to-t from-[#03060F] to-transparent" />
            
            {/* Upload button */}
            <label className="absolute bottom-4 right-4 cursor-pointer z-10">
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all cursor-pointer"
              >
                <FaCamera className="text-white text-sm" />
              </motion.div>
            </label>
          </div>
          
          {/* Avatar and Info */}
          <div className="relative px-6 -mt-16">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="relative">
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      width={120}
                      height={120}
                      className="rounded-full ring-4 ring-[#0047FF] shadow-2xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-linear-to-br from-[#0047FF] to-[#7B2FFF] flex items-center justify-center ring-4 ring-[#0047FF] shadow-2xl">
                      <span className="text-4xl font-bold text-white">
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <motion.div
                    className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#00C5A8] border-2 border-[#03060F] flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <MdVerified className="text-white text-xs" />
                  </motion.div>
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                  <h1 className="text-3xl font-bold bg-linear-to-r from-white to-[#00C5A8] bg-clip-text text-transparent">
                    {user?.displayName || 'User'}
                  </h1>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    user?.emailVerified 
                      ? 'bg-[#00C5A8]/20 text-[#00C5A8] border border-[#00C5A8]/30'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {user?.emailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
                <div className="flex items-center gap-2 justify-center md:justify-start mt-2">
                  <FaCalendarAlt className="text-[#00C5A8] text-xs" />
                  <span className="text-xs text-gray-500">Member since {memberSince}</span>
                </div>
              </div>
              
              {/* Shield Badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
              >
                <FaShieldAlt className="text-[#00C5A8] text-sm" />
                <span className="text-xs text-gray-400">HIPAA Compliant</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Message Alert */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl backdrop-blur-sm border flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-[#00C5A8]/10 border-[#00C5A8]/30 text-[#00C5A8]'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
              <span className="text-sm">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Personal Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-linear-to-br from-[#1A1F2E]/90 to-[#0A0F1A]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#0047FF]/20 flex items-center justify-center">
              <FaUser className="text-[#00C5A8] text-lg" />
            </div>
            <h2 className="text-xl font-bold text-white">Personal Information</h2>
          </div>
          
          <div className="space-y-6">
            <EditableField
              label="DISPLAY NAME"
              value={formData.displayName}
              icon={FaUser}
              isEditing={editingField === 'name'}
              onEdit={() => setEditingField('name')}
              onSave={handleUpdateProfile}
              onCancel={() => {
                setEditingField(null);
                setFormData(prev => ({ ...prev, displayName: user?.displayName || '' }));
              }}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            />
            
            <EditableField
              label="EMAIL ADDRESS"
              value={formData.email}
              icon={FaEnvelope}
              isEditing={editingField === 'email'}
              onEdit={() => setEditingField('email')}
              onSave={handleUpdateProfile}
              onCancel={() => {
                setEditingField(null);
                setFormData(prev => ({ ...prev, email: user?.email || '' }));
              }}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!user?.emailVerified}
              helperText={!user?.emailVerified ? "Verify your current email to enable changes" : ""}
            />
          </div>
        </motion.div>
        
        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-linear-to-br from-[#1A1F2E]/90 to-[#0A0F1A]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#7B2FFF]/20 flex items-center justify-center">
              <FaLock className="text-[#7B2FFF] text-lg" />
            </div>
            <h2 className="text-xl font-bold text-white">Security Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <FaGlobe className="text-gray-500" />
                <div>
                  <p className="text-white text-sm font-medium">Session Management</p>
                  <p className="text-xs text-gray-500">Manage active sessions and devices</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
              >
                Manage
              </motion.button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <FaBell className="text-gray-500" />
                <div>
                  <p className="text-white text-sm font-medium">Notifications</p>
                  <p className="text-xs text-gray-500">Email and push notification preferences</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
              >
                Configure
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Save Changes FAB */}
        <AnimatePresence>
          {editingField && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdateProfile}
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-linear-to-r from-[#0047FF] to-[#7B2FFF] text-white font-medium flex items-center gap-2 shadow-lg shadow-[#0047FF]/30 hover:shadow-xl transition-all disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <FaSave />
                    </motion.div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Changes
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Health Tip Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-linear-to-r from-[#0047FF]/10 to-[#00C5A8]/10 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF3C6E]/20 flex items-center justify-center">
              <FaHeartbeat className="text-[#FF3C6E] text-lg" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Health Tip of the Day</p>
              <p className="text-xs text-gray-400">Stay hydrated! Drinking adequate water helps maintain energy levels and supports overall health.</p>
            </div>
            <TbMedicalCross className="text-[#00C5A8] text-2xl opacity-50" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}