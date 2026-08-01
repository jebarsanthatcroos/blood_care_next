'use client';
import { motion } from 'framer-motion';
import {
  FaClock,
} from 'react-icons/fa';
import { ContactInfoCard } from './ContactInfoCard';
import { useLanguage } from '../../../lib/language';
import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';

export const ContactInfoGrid = () => {
  const { t } = useLanguage();

  const contactInfo = [
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
    >
      {contactInfo.map((info, index) => (
        <ContactInfoCard key={index} {...info} />
      ))}
    </motion.div>
  );
};