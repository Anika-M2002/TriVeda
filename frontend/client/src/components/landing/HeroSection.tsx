import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

const heroImages = [
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1476673160081-cf065f3b9218?auto=format&fit=crop&w=1920&q=80',
];

export default function HeroSection() {
  const [, navigate] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {heroImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${image}')` }}
            initial={false}
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1 : 1.1,
            }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 via-40% to-background to-90%" />
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#10B981]/10 dark:bg-[#10B981]/5 blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center pt-8 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1F5C3F]/20 dark:bg-emerald-500/20 border border-[#1F5C3F]/30 dark:border-emerald-500/40 text-[#1F5C3F] dark:text-emerald-300 text-sm font-semibold mb-8 backdrop-blur-sm shadow-lg font-sans">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            Ayurveda Reimagined with Biotech
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[0.95] mb-4 font-display"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          Healing with
          <br />
          <span className="text-[#10B981]">Precision</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-[560px] mx-auto mb-6 leading-relaxed font-sans"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Triveda bridges the ancient science of Ayurveda with cutting-edge biotechnology,
          delivering personalized wellness for every individual.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            className="bg-[#1F5C3F] dark:bg-emerald-500 text-white dark:text-[#051F15] rounded-full px-8 py-3.5 text-base font-semibold hover:bg-[#1F5C3F]/90 dark:hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#1F5C3F]/25 dark:shadow-emerald-500/25 font-sans"
            onClick={() => navigate('/login')}
          >
            Start Your Journey
          </button>
          <a
            href="#about"
            className="flex items-center gap-2 bg-white/80 dark:bg-white/10 text-[#1F5C3F] dark:text-white rounded-full px-6 py-3.5 text-base font-semibold border border-[#1F5C3F]/20 dark:border-white/20 hover:bg-white dark:hover:bg-white/20 transition-all hover:scale-105 backdrop-blur-sm shadow-lg font-sans"
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </section>
  );
}
