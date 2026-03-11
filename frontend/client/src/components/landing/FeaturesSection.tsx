import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Activity, BookOpen, Calendar, Shield, Pill, Apple, BarChart3, Users, Leaf, Clock } from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Dosha Analysis',
    description: 'AI-powered Prakriti assessment based on Tridosha theory to understand your unique constitution.',
    size: 'large',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Apple,
    title: 'Personalized Diet Plans',
    description: 'Custom nutrition recommendations aligned with your dosha balance.',
    size: 'small',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Pill,
    title: 'Herbal Medications',
    description: 'Evidence-backed Ayurvedic formulations tracked and managed digitally.',
    size: 'small',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Calendar,
    title: 'Appointment Management',
    description: 'Seamless scheduling between patients and Ayurvedic practitioners.',
    size: 'small',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: BookOpen,
    title: 'Healing Protocols',
    description: 'Structured Panchakarma and daily routine guides with progress tracking.',
    size: 'large',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: BarChart3,
    title: 'Health Analytics',
    description: 'Track your healing trajectory with visual compliance reports and dosha trends.',
    size: 'small',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Shield,
    title: 'Allergy & Safety',
    description: 'Intelligent herb-drug interaction checks and allergy management.',
    size: 'small',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Users,
    title: 'Community Wellness',
    description: 'Connect with practitioners and fellow wellness seekers on your journey.',
    size: 'small',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Leaf,
    title: 'Seasonal Routines',
    description: 'Ritucharya guidance adapting your lifestyle to seasonal changes for optimal health.',
    size: 'small',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Clock,
    title: 'Daily Dinacharya',
    description: 'Personalized daily routine schedules aligned with natural circadian rhythms.',
    size: 'small',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-16 md:py-24 overflow-hidden"
    >
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] rounded-full bg-[#10B981]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center mb-12 md:mb-16">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F5C3F]/[0.08] dark:bg-emerald-500/10 text-[#1F5C3F] dark:text-emerald-400 text-sm font-medium tracking-wide uppercase mb-6 font-sans">
              Features
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-display">
              Everything You Need
              <br />
              <span className="text-[#10B981]">In One Platform</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto font-sans">
              A complete suite of tools built for holistic healthcare management.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature, i) => (
            <ScrollReveal
              key={feature.title}
              delay={i * 0.06}
              className={feature.size === 'large' ? 'lg:col-span-2' : ''}
            >
              <div
                className={`group relative rounded-2xl p-6 md:p-8 border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 cursor-default overflow-hidden h-full
                  border-[#1F5C3F]/[0.08] dark:border-emerald-500/10
                  hover:border-[#1F5C3F]/20 dark:hover:border-emerald-500/20 hover:shadow-xl hover:shadow-[#1F5C3F]/5 dark:hover:shadow-emerald-500/5`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${feature.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-white/80 dark:hidden" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#051F15]/90 via-[#051F15]/85 to-[#051F15]/80 hidden dark:block" />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#1F5C3F]/15 dark:bg-emerald-500/20 flex items-center justify-center mb-5 group-hover:bg-[#1F5C3F]/25 dark:group-hover:bg-emerald-500/30 transition-colors backdrop-blur-sm">
                    <feature.icon size={22} className="text-[#1F5C3F] dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 font-display">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                    {feature.description}
                  </p>
                </div>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#10B981]/10 to-transparent" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
