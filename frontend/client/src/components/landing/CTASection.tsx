import React from 'react';
import { useLocation } from 'wouter';
import { ScrollReveal, ParallaxLayer } from './ScrollReveal';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  const [, navigate] = useLocation();

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-[#1F5C3F] dark:bg-[#0A291D]" />
          <ParallaxLayer speed={-0.2} className="absolute inset-0">
            <div
              className="absolute inset-0 opacity-20 dark:opacity-10"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </ParallaxLayer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#10B981]/20 blur-[100px]" />

          <div className="relative z-10 py-20 md:py-28 px-8 md:px-16 text-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight font-display">
                Begin Your Healing
                <br />
                Journey Today
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <p className="text-lg text-white/70 max-w-xl mx-auto mb-10 leading-relaxed font-sans">
                Join thousands of patients and practitioners who are transforming healthcare
                with the power of Ayurveda and Biotech.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  className="group flex items-center gap-2 bg-white text-[#1F5C3F] rounded-full px-8 py-3.5 text-base font-semibold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/20 font-sans"
                  onClick={() => navigate('/login')}
                >
                  Sign Up Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  className="flex items-center gap-2 text-white border border-white/30 rounded-full px-8 py-3.5 text-base font-medium hover:bg-white/10 transition-all hover:scale-105 font-sans"
                  onClick={() => navigate('/login')}
                >
                  Request a Demo
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
