import React from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Leaf, Mail, MapPin } from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';

const footerLinks: Record<string, string[]> = {
  Product: ['Features', 'How It Works', 'Pricing', 'Security'],
  Company: ['About Us', 'Careers', 'Blog', 'Press'],
  Resources: ['Documentation', 'Help Center', 'API Reference', 'Community'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'HIPAA Compliance'],
};

export default function FooterSection() {
  return (
    <footer className="relative pt-16 md:pt-20 pb-8 border-t border-[#1F5C3F]/[0.08] dark:border-emerald-500/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 md:gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <a href="#" className="no-underline mb-5 inline-flex">
                <BrandLogo textClassName="text-xl" iconClassName="h-9 w-9" />
              </a>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs font-sans">
                Bridging ancient Ayurvedic wisdom with modern biotechnology for a healthier,
                more balanced world.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Mail size={14} className="text-[#10B981]" />
                  <span className="font-sans">hello@triveda.health</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <MapPin size={14} className="text-[#10B981]" />
                  <span className="font-sans">Bangalore, India</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links], i) => (
            <div key={title}>
              <ScrollReveal delay={i * 0.05}>
                <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide font-sans">
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors font-sans"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#1F5C3F]/[0.08] dark:border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-sans">
            &copy; {new Date().getFullYear()} Triveda Health Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Leaf size={12} className="text-[#10B981]" />
            <span className="font-sans">Built with care for holistic wellness</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
