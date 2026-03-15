import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { UserPlus, ClipboardList, Stethoscope, TrendingUp } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: UserPlus,
    title: 'Create Your Profile',
    description:
      'Sign up and complete your Prakriti assessment. Our system analyses your Tridosha balance to build a personalized health baseline.',
  },
  {
    num: '02',
    icon: ClipboardList,
    title: 'Get Your Wellness Plan',
    description:
      'Receive AI-generated diet plans, herbal recommendations, and daily routines tailored specifically to your Ayurvedic constitution.',
  },
  {
    num: '03',
    icon: Stethoscope,
    title: 'Connect with Doctors',
    description:
      'Book consultations with certified Ayurvedic physicians who can review your data, adjust protocols, and monitor your progress.',
  },
  {
    num: '04',
    icon: TrendingUp,
    title: 'Track & Thrive',
    description:
      'Monitor your healing trajectory, maintain compliance streaks, and watch your health metrics improve over time with visual analytics.',
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative py-16 md:py-24 overflow-hidden bg-[#1F5C3F]/[0.03] dark:bg-emerald-500/[0.02]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center mb-12 md:mb-16">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F5C3F]/[0.08] dark:bg-emerald-500/10 text-[#1F5C3F] dark:text-emerald-400 text-sm font-medium tracking-wide uppercase mb-6 font-sans">
              How It Works
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-display">
              Your Path to
              <br />
              <span className="text-[#10B981]">Holistic Wellness</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto font-sans">
              Four simple steps to begin your personalized Ayurvedic healthcare journey.
            </p>
          </ScrollReveal>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 0.1}>
                <div className="relative group">
                  <div className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-full bg-[#1F5C3F] dark:bg-emerald-500 flex items-center justify-center shadow-md flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-white dark:text-[#051F15] font-display">
                        {step.num}
                      </span>
                    </div>

                    <div>
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#0A291D] border-2 border-[#1F5C3F]/15 dark:border-emerald-500/20 flex items-center justify-center group-hover:border-[#10B981]/40 transition-colors duration-300 shadow-lg shadow-black/5 mb-4">
                        <step.icon size={26} className="text-[#1F5C3F] dark:text-emerald-400" />
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-3 font-display">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
