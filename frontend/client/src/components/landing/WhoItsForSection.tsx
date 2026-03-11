import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Heart, Stethoscope, Settings } from 'lucide-react';

const audiences = [
  {
    icon: Heart,
    title: 'For Patients',
    subtitle: 'Your Wellness, Personalized',
    description:
      'Access your Dosha profile, follow customized diet and lifestyle plans, track your healing journey, manage medications, and book appointments with Ayurvedic physicians — all from one intuitive dashboard.',
    features: ['Dosha Profile & Analysis', 'Personalized Diet Plans', 'Medication Tracking', 'Healing Progress Insights'],
    image:
      'https://images.unsplash.com/photo-1627744514030-28d5c0170fba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxheXVydmVkYSUyMGhlcmJzJTIwaW5ncmVkaWVudHMlMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzcyNzc4NTk4fDA&ixlib=rb-4.1.0&q=85',
    accent: '#1F5C3F',
  },
  {
    icon: Stethoscope,
    title: 'For Doctors',
    subtitle: 'Clinical Precision, Ayurvedic Depth',
    description:
      'Manage patients with powerful clinical tools. View comprehensive Dosha analyses, create treatment protocols, generate diet charts, monitor compliance, and access a vast Ayurvedic food & herb database.',
    features: ['Patient Dashboard', 'Treatment Protocols', 'Diet Chart Generator', 'Compliance Analytics'],
    image:
      'https://images.pexels.com/photos/8313224/pexels-photo-8313224.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    accent: '#10B981',
  },
  {
    icon: Settings,
    title: 'For Admins',
    subtitle: 'Full Control, Total Visibility',
    description:
      'Oversee the entire platform with administrative tools. Manage user roles, monitor system performance, configure clinical settings, handle billing, and ensure regulatory compliance across the organization.',
    features: ['User Management', 'System Configuration', 'Billing & Reports', 'Audit & Compliance'],
    image:
      'https://images.unsplash.com/photo-1581056771085-3ce30d907416?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHwyfHxiaW90ZWNoJTIwbGFib3JhdG9yeSUyMHJlc2VhcmNoJTIwY2xlYW58ZW58MHx8fHwxNzcyNzc4NTk4fDA&ixlib=rb-4.1.0&q=85',
    accent: '#0D9488',
  },
];

export default function WhoItsForSection() {
  return (
    <section
      id="who-its-for"
      className="relative py-16 md:py-24 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center mb-12 md:mb-16">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F5C3F]/[0.08] dark:bg-emerald-500/10 text-[#1F5C3F] dark:text-emerald-400 text-sm font-medium tracking-wide uppercase mb-6 font-sans">
              Who It's For
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-display">
              Built for
              <br />
              <span className="text-[#10B981]">Every Stakeholder</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto font-sans">
              Whether you're seeking wellness, providing care, or managing operations, Triveda has you covered.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {audiences.map((audience, i) => (
            <ScrollReveal key={audience.title} delay={i * 0.12}>
              <div className="group relative rounded-3xl overflow-hidden border border-[#1F5C3F]/[0.08] dark:border-emerald-500/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={audience.image}
                    alt={audience.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-5 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm border"
                      style={{ backgroundColor: `${audience.accent}20`, borderColor: `${audience.accent}30` }}
                    >
                      <audience.icon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">
                        {audience.title}
                      </h3>
                      <p className="text-xs text-white/70 font-sans">
                        {audience.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-7 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 font-sans">
                    {audience.description}
                  </p>

                  <div className="mt-auto space-y-2.5">
                    {audience.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2.5">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${audience.accent}15` }}
                        >
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6L5 9L10 3"
                              stroke={audience.accent}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-foreground/80 font-sans">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
