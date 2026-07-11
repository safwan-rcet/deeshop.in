import React from 'react';
import { Heart, Landmark } from 'lucide-react';

interface FooterProps {
  onOpenOrders: () => void;
  onScrollToProducts: () => void;
  onScrollToContact: () => void;
  onOpenDomainGuide: () => void;
  onOpenRazorpayGuide: () => void;
}

export default function Footer({
  onOpenOrders,
  onScrollToProducts,
  onScrollToContact,
  onOpenDomainGuide,
  onOpenRazorpayGuide
}: FooterProps) {
  return (
    <footer className="bg-white border-t border-beige-divider text-taupe-muted text-xs py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-10 border-b border-beige-divider">
          
          {/* Logo & Slogan (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-2xl font-light tracking-[0.15em] uppercase text-charcoal block">
              deeshop<span className="text-champagne-gold font-sans">.in</span>
            </span>
            <p className="text-xs text-taupe-muted max-w-sm leading-relaxed">
              deeshop.in is a premier Indian perfume atelier, crafting highly concentrated luxury formulations. Experience the sovereign depth of Imperial & Kaaaf fragrances, designed to endure.
            </p>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-charcoal">Navigation</h4>
            <ul className="space-y-2.5 text-taupe-muted">
              <li>
                <button onClick={onScrollToProducts} className="hover:text-champagne-gold transition-colors cursor-pointer text-left">
                  The Collection
                </button>
              </li>
              <li>
                <button onClick={onOpenOrders} className="hover:text-champagne-gold transition-colors cursor-pointer text-left">
                  Track Deliveries
                </button>
              </li>
              <li>
                <button onClick={onScrollToContact} className="hover:text-champagne-gold transition-colors cursor-pointer text-left">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={onOpenDomainGuide} className="hover:text-champagne-gold transition-colors cursor-pointer text-left font-medium text-champagne-gold/90">
                  GoDaddy Domain Setup
                </button>
              </li>
              <li>
                <button onClick={onOpenRazorpayGuide} className="hover:text-champagne-gold transition-colors cursor-pointer text-left font-medium text-champagne-gold/90">
                  Razorpay Payments Setup
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier Customer Care & Location (4 cols) */}
          <div className="md:col-span-4 space-y-3 bg-sand-soft p-5 border border-beige-divider rounded-lg">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-champagne-gold flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5" />
              The New Delhi Atelier
            </h4>
            <p className="text-[11px] text-taupe-muted leading-relaxed">
              Experience our curated sensory voyage. Open Monday through Saturday, 11:00 AM to 8:00 PM. Deliveries processed via BlueDart Air courier in 12 hours.
            </p>
            <p className="text-[10px] text-charcoal font-medium">
              Connaught Place, New Delhi, India
            </p>
          </div>

        </div>

        {/* Bottom copyright block */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-taupe-muted">
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 items-center">
            <span>© {new Date().getFullYear()} deeshop.in. All Rights Reserved.</span>
            <span className="hidden sm:inline text-beige-divider">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in Connaught Place, New Delhi
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Landmark className="w-3.5 h-3.5 text-taupe-muted" />
            <span className="text-[10px]">Secure 256-Bit SSL Encryption Active</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
