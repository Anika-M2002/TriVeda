import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Meera Patel',
    role: 'Ayurvedic Physician',
    text: 'Triveda has transformed how I manage my practice. The Dosha analysis tools are incredibly accurate, and the patient compliance tracking saves me hours every week.',
    rating: 5,
  },
  {
    name: 'Arjun Sharma',
    role: 'Patient',
    text: 'After years of trying different health apps, Triveda finally understood my body type. The personalized diet plan based on my Vata constitution has made a real difference.',
    rating: 5,
  },
  {
    name: 'Priya Verma',
    role: 'Clinic Administrator',
    text: 'Managing our multi-doctor Ayurvedic clinic became seamless with Triveda. The admin dashboard gives complete visibility into operations and patient flow.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-[#1F5C3F]/[0.03] dark:bg-emerald-500/[0.02]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center mb-12 md:mb-16">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F5C3F]/[0.08] dark:bg-emerald-500/10 text-[#1F5C3F] dark:text-emerald-400 text-sm font-medium tracking-wide uppercase mb-6 font-sans">
              Testimonials
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-display">
              Trusted by
              <br />
              <span className="text-[#10B981]">Healthcare Leaders</span>
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.1}>
              <div className="relative rounded-2xl p-7 md:p-8 border bg-white/70 dark:bg-white/[0.03] border-[#1F5C3F]/[0.08] dark:border-emerald-500/10 backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-[#1F5C3F]/[0.08] dark:bg-emerald-500/10 flex items-center justify-center mb-5">
                  <Quote size={18} className="text-[#1F5C3F] dark:text-emerald-400" />
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-[#10B981] text-[#10B981]" />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1 font-sans">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-[#1F5C3F]/[0.08] dark:border-emerald-500/10">
                  <div className="w-10 h-10 rounded-full bg-[#1F5C3F]/10 dark:bg-emerald-500/15 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#1F5C3F] dark:text-emerald-400 font-display">
                      {t.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground font-sans">{t.name}</p>
                    <p className="text-xs text-muted-foreground font-sans">{t.role}</p>
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
