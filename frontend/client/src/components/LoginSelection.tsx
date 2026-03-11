import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { User, Stethoscope, Shield, ArrowLeft } from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';

const roles = [
  {
    type: 'patient',
    icon: User,
    title: 'Patient',
    description: 'Access your Dosha profile, personalized diet plans, track your healing journey, and book appointments.',
    accent: '#1F5C3F',
    gradient: 'from-[#1F5C3F]/10 to-[#10B981]/5',
    borderHover: 'hover:border-[#1F5C3F]/40 dark:hover:border-emerald-500/40',
  },
  {
    type: 'doctor',
    icon: Stethoscope,
    title: 'Doctor',
    description: 'Manage patients, create treatment protocols, generate diet charts, and monitor compliance analytics.',
    accent: '#10B981',
    gradient: 'from-[#10B981]/10 to-[#0D9488]/5',
    borderHover: 'hover:border-[#10B981]/40 dark:hover:border-emerald-400/40',
  },
  {
    type: 'admin',
    icon: Shield,
    title: 'Admin',
    description: 'Oversee the platform, manage users, configure system settings, handle billing and ensure compliance.',
    accent: '#0D9488',
    gradient: 'from-[#0D9488]/10 to-[#1F5C3F]/5',
    borderHover: 'hover:border-[#0D9488]/40 dark:hover:border-teal-400/40',
  },
];

export default function LoginSelection() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="w-full px-6 md:px-12 py-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors font-sans"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-4xl">
          {/* Title */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
              <div className="flex items-center justify-center mb-6">
                <BrandLogo textClassName="text-2xl" iconClassName="h-10 w-10" />
              </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 font-display">
              Welcome to TriVeda
            </h1>
            <p className="text-lg text-muted-foreground font-sans">
              Choose how you'd like to sign in
            </p>
          </motion.div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {roles.map((role, i) => (
              <motion.button
                key={role.type}
                onClick={() => navigate(`/login/${role.type}`)}
                className={`group relative rounded-2xl p-7 md:p-8 border border-[#1F5C3F]/[0.08] dark:border-emerald-500/10 bg-gradient-to-br ${role.gradient} dark:from-white/[0.03] dark:to-white/[0.01] backdrop-blur-sm text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 ${role.borderHover} cursor-pointer`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300"
                  style={{ backgroundColor: `${role.accent}15` }}
                >
                  <role.icon size={26} style={{ color: role.accent }} />
                </div>

                {/* Text */}
                <h3 className="text-xl font-bold text-foreground mb-2 font-display">
                  {role.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                  {role.description}
                </p>

                {/* Bottom Arrow Indicator */}
                <div className="mt-5 flex items-center gap-2 text-sm font-semibold font-sans transition-colors" style={{ color: role.accent }}>
                  Continue as {role.title}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <path
                      d="M3 8H13M13 8L9 4M13 8L9 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
