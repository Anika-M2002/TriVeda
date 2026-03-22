import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoIntroProps {
  onComplete: () => void;
}

export default function VideoIntro({ onComplete }: VideoIntroProps) {
  const [phase, setPhase] = useState<'logo' | 'fading' | 'done'>('logo');

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setPhase('fading');
    }, 2200);

    const doneTimer = setTimeout(() => {
      setPhase('done');
      setTimeout(() => onComplete(), 600);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#051F15] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl"
                initial={{
                  x: Math.random() * 100 - 50 + '%',
                  y: Math.random() * 100 - 50 + '%',
                  scale: 0.5,
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * 100 - 50 + '%',
                  y: Math.random() * 100 - 50 + '%',
                  scale: [0.5, 1.2, 0.8],
                  opacity: [0, 0.6, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  ease: 'easeInOut',
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>

          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
            animate={
              phase === 'fading'
                ? { opacity: 0, scale: 1.1, filter: 'blur(8px)', y: -20 }
                : { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }
            }
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-14 h-14 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center backdrop-blur-sm"
                initial={{ rotate: -180, scale: 0, borderRadius: '50%' }}
                animate={{
                  rotate: 0,
                  scale: 1,
                  borderRadius: '12px',
                  boxShadow:
                    phase === 'logo'
                      ? [
                          '0 0 0px rgba(16, 185, 129, 0)',
                          '0 0 30px rgba(16, 185, 129, 0.4)',
                          '0 0 15px rgba(16, 185, 129, 0.2)',
                        ]
                      : '0 0 0px rgba(16, 185, 129, 0)',
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.34, 1.56, 0.64, 1],
                  boxShadow: { duration: 1.5, repeat: Infinity, repeatType: 'reverse' },
                }}
              >
                <motion.svg
                  width="32"
                  height="32"
                  viewBox="0 0 28 28"
                  fill="none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
                >
                  <motion.path
                    d="M14 2C14 2 6 6 6 14C6 18 8 22 14 26C20 22 22 18 22 14C22 6 14 2 14 2Z"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    fill="#10B981"
                    fillOpacity="0.15"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: 'easeInOut', delay: 0.4 }}
                  />
                  <motion.path
                    d="M14 8V20M10 12C10 12 12 14 14 14C16 14 18 12 18 12"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.7 }}
                  />
                </motion.svg>
              </motion.div>

              <div className="overflow-hidden">
                <motion.span
                  className="text-4xl md:text-5xl font-bold text-white inline-block font-display"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                  Tri<span className="text-emerald-400">Veda</span>
                </motion.span>
              </div>
            </div>

            <motion.p
              className="mt-4 px-4 text-center text-emerald-300/70 text-xs sm:text-sm tracking-[0.18em] sm:tracking-[0.3em] uppercase font-sans max-w-[90vw] break-words"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              Ancient Wisdom, Modern Science
            </motion.p>

            <motion.div
              className="mt-6 flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400/60"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
