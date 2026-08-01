'use client';

import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import { CLAY, SHADOW, usePressable } from '../../../lib/clay';
import { useLanguage } from '../../../lib/language';

export const ClaySubmitButton = ({ submitting }: { submitting: boolean }) => {
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
};