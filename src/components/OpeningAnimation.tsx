import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { MagnifyingGlassLogo } from './MagnifyingGlassLogo';
import { ArrowRight, Eye, ShieldAlert, Sparkles } from 'lucide-react';

interface OpeningAnimationProps {
  language: Language;
  onFinish: () => void;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({
  language,
  onFinish,
}) => {
  const [phase, setPhase] = useState<'lens' | 'stamp' | 'ready'>('lens');

  useEffect(() => {
    // Stage 1: Lens focus & radar pulse
    const timer1 = setTimeout(() => {
      setPhase('stamp');
    }, 1000);

    // Stage 2: Suspicious title reveal
    const timer2 = setTimeout(() => {
      setPhase('ready');
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const title = language === 'bn' ? 'সাসপিশাস' : 'SUSPICIOUS';
  const subtitle =
    language === 'bn'
      ? 'গোপন ইম্পোস্টার খুঁজে বের করার রোমাঞ্চকর খেলা'
      : 'Who is blending in? Who knows the secret?';

  return (
    <motion.div
      id="opening-splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col items-center justify-between px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] select-none overflow-hidden font-sans"
    >
        {/* Subtle Ambient Background Grid & Radar Sweep */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Top Skip Bar */}
        <div className="w-full max-w-md flex justify-end items-center relative z-10 pt-2">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            onClick={onFinish}
            className="text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:text-white px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 backdrop-blur flex items-center gap-1.5 transition-all"
          >
            <span>{language === 'bn' ? 'স্কিপ করুন' : 'Skip'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Center Mystery Stage */}
        <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 w-full max-w-md">
          {/* Animated Concentric Radar Rings */}
          <div className="relative mb-6 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{
                scale: [0.8, 1.3, 1.6],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="absolute w-36 h-36 rounded-full border border-neutral-600/50 pointer-events-none"
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.9, 1.5, 1.9],
                opacity: [0.4, 0.15, 0],
              }}
              transition={{
                duration: 2.2,
                delay: 0.5,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="absolute w-44 h-44 rounded-full border border-neutral-700/40 pointer-events-none"
            />

            {/* Central Magnifying Glass Logo with Motion */}
            <motion.div
              initial={{ scale: 0, rotate: -30, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="relative z-10 shadow-2xl rounded-3xl"
            >
              <MagnifyingGlassLogo size="xl" withContainer={true} />
            </motion.div>
          </div>

          {/* Title & Tagline with Reveal Stagger */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-2"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-medium text-neutral-300 uppercase tracking-widest mb-1">
              <Eye className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>{language === 'bn' ? 'রহস্য ও অনুসন্ধান' : 'Mystery & Deduction'}</span>
            </div>

            <motion.h1
              initial={{ letterSpacing: '0.25em', filter: 'blur(4px)' }}
              animate={{ letterSpacing: '0.08em', filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
              className="text-3xl sm:text-4xl font-semibold text-white tracking-wider"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-xs sm:text-sm text-neutral-400 max-w-xs mx-auto leading-relaxed font-normal"
            >
              {subtitle}
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom Interactive Tap Cue */}
        <div className="w-full max-w-md pb-4 text-center relative z-10">
          <motion.button
            id="btn-enter-game"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            onClick={onFinish}
            className="w-full py-3.5 px-4 rounded-2xl bg-white text-neutral-950 font-medium text-sm shadow-xl hover:bg-neutral-100 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{language === 'bn' ? 'খেলায় প্রবেশ করুন' : 'Enter Game'}</span>
            <ArrowRight className="w-4 h-4 text-neutral-900" />
          </motion.button>
        </div>
      </motion.div>
  );
};
