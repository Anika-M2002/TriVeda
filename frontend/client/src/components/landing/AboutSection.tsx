import React from 'react';
import { ScrollReveal, ParallaxLayer } from './ScrollReveal';
import { Leaf, FlaskConical } from 'lucide-react';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-16 md:py-24 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#10B981]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left: Text */}
          <div>
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F5C3F]/[0.08] dark:bg-emerald-500/10 text-[#1F5C3F] dark:text-emerald-400 text-sm font-medium tracking-wide uppercase mb-6 font-sans">
                About Triveda
              </span>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight font-display">
                Where Ancient Wisdom
                <br />
                <span className="text-[#10B981]">Meets Modern Science</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-sans">
                Triveda is a comprehensive digital platform that harnesses the 5,000-year-old
                principles of Ayurveda, validated and enhanced by modern biotechnology research.
                We provide personalized health management for patients, powerful clinical tools
                for Doctors, and robust administrative oversight for healthcare organizations.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/60 dark:bg-white/5 border border-[#1F5C3F]/10 dark:border-emerald-500/10 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#1F5C3F]/10 dark:bg-emerald-500/15 flex items-center justify-center">
                    <Leaf size={20} className="text-[#1F5C3F] dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground font-sans">Ayurvedic Roots</p>
                    <p className="text-xs text-muted-foreground font-sans">Tridosha-based analysis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/60 dark:bg-white/5 border border-[#1F5C3F]/10 dark:border-emerald-500/10 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 dark:bg-emerald-500/15 flex items-center justify-center">
                    <FlaskConical size={20} className="text-[#10B981] dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground font-sans">Biotech Precision</p>
                    <p className="text-xs text-muted-foreground font-sans">Data-driven wellness</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Image */}
          <ScrollReveal delay={0.2} direction="left">
            <ParallaxLayer speed={-0.15}>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden border border-[#1F5C3F]/10 dark:border-emerald-500/10 shadow-2xl shadow-black/5">
                  <img
                    src="https://images.unsplash.com/photo-1589556165541-4254aa9cfb39?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxheXVydmVkYSUyMGhlcmJzJTIwaW5ncmVkaWVudHMlMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzcyNzc4NTk4fDA&ixlib=rb-4.1.0&q=85"
                    alt="Ayurvedic herbs and natural ingredients"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 md:-left-8 bg-white/90 dark:bg-[#0A291D]/90 backdrop-blur-xl rounded-2xl p-5 border border-[#1F5C3F]/10 dark:border-emerald-500/10 shadow-xl">
                  <p className="text-3xl font-bold text-[#1F5C3F] dark:text-emerald-400 font-display">5000+</p>
                  <p className="text-sm text-muted-foreground font-sans">Years of Ayurvedic<br />Knowledge Digitized</p>
                </div>
              </div>
            </ParallaxLayer>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
