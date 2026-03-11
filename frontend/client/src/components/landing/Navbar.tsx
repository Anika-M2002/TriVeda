import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Menu, X } from 'lucide-react';
import { useLocation } from 'wouter';
import BrandLogo from '@/components/common/BrandLogo';

interface NavbarProps {
  visible: boolean;
}

export default function Navbar({ visible }: NavbarProps) {
  const [, navigate] = useLocation();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('triveda-theme') || 'system';
  });
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('triveda-theme', theme);

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mq.matches);
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For You', href: '#who-its-for' },
  ];

  const currentThemeIcon = themeOptions.find((t) => t.value === theme);
  const nextTheme = () => {
    const idx = themeOptions.findIndex((t) => t.value === theme);
    setTheme(themeOptions[(idx + 1) % themeOptions.length].value);
  };

  if (!visible) return null;

  return (
    <motion.nav
      className={`fixed top-4 left-4 right-4 md:left-8 md:right-8 lg:left-12 lg:right-12 h-16 rounded-full z-40 flex items-center justify-between px-5 md:px-8 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 dark:bg-[#0A291D]/80 backdrop-blur-xl border border-[#1F5C3F]/10 dark:border-emerald-500/10 shadow-lg shadow-black/5'
          : 'bg-white/50 dark:bg-[#0A291D]/50 backdrop-blur-md border border-white/20 dark:border-white/5'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Logo */}
      <a href="#" className="no-underline">
        <BrandLogo textClassName="text-xl" iconClassName="h-9 w-9" />
      </a>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground rounded-full hover:bg-[#1F5C3F]/5 dark:hover:bg-emerald-500/10 transition-colors font-sans"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Right Side: Theme + CTA */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={nextTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-secondary/80 hover:bg-secondary text-foreground/70 hover:text-foreground transition-all hover:scale-105 active:scale-95"
          title={`Current: ${currentThemeIcon?.label}. Click to switch.`}
        >
          {currentThemeIcon && <currentThemeIcon.icon size={16} />}
        </button>

        {/* Get Started Button */}
        <button
          className="hidden md:flex items-center gap-2 bg-[#1F5C3F] dark:bg-emerald-500 text-white dark:text-[#051F15] rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-[#1F5C3F]/90 dark:hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#1F5C3F]/20 dark:shadow-emerald-500/20 font-sans"
          onClick={() => navigate('/login')}
        >
          Get Started
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-secondary/80 text-foreground/70 hover:text-foreground transition-all"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 mx-2 rounded-2xl bg-white/95 dark:bg-[#0A291D]/95 backdrop-blur-xl border border-[#1F5C3F]/10 dark:border-emerald-500/10 shadow-xl p-4"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground rounded-xl hover:bg-[#1F5C3F]/5 dark:hover:bg-emerald-500/10 transition-colors font-sans"
                >
                  {link.label}
                </a>
              ))}
              <button
                className="mt-2 w-full bg-[#1F5C3F] dark:bg-emerald-500 text-white dark:text-[#051F15] rounded-full py-3 text-sm font-semibold transition-all"
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/login');
                }}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
