import React from 'react';
import { ArrowDown, ShieldCheck, Truck, Sparkles, Award, BookOpen } from 'lucide-react';
import heroBg from '../assets/images/deeshop_hero_1783708423475.jpg';

interface HeroProps {
  onExploreClick: () => void;
  onContactClick: () => void;
}

export default function Hero({ onExploreClick, onContactClick }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-alabaster py-16">
      
      {/* Background Image with Dark Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="deeshop.in Luxury Perfumes background"
          className="w-full h-full object-cover opacity-15 scale-105 filter grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-alabaster via-alabaster/70 to-alabaster" />
        <div className="absolute inset-0 bg-gradient-to-r from-alabaster via-transparent to-alabaster" />
      </div>

      {/* Decorative Gold Elements */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-champagne-gold/5 rounded-full filter blur-3xl z-0" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-champagne-gold/3 rounded-full filter blur-3xl z-0" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
        
        {/* Brand Pre-title */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sand-soft border border-beige-divider rounded-full text-champagne-gold text-[10px] font-bold uppercase tracking-[0.25em]">
          <Sparkles className="w-3 h-3 text-champagne-gold animate-pulse" />
          <span>Sovereign Scents Atelier • deeshop.in</span>
        </div>

        {/* Playfair Display luxury Heading */}
        <div className="space-y-4">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-charcoal font-light tracking-tight leading-none">
            The Science of <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-champagne-gold to-charcoal italic">
              Sovereign Fragrances
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-taupe-muted font-sans leading-relaxed tracking-wide">
            Welcome to the online sanctuary of <span className="text-charcoal font-semibold">deeshop.in</span>. We craft high-concentration, master-perfumed scents that capture presence, evoke raw memories, and command complete attention. Discover our legacy formulations: <span className="text-champagne-gold font-serif font-semibold italic">Imperial</span> & <span className="text-champagne-gold font-serif font-semibold italic">Kaaaf</span>.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            id="hero-explore-btn"
            onClick={onExploreClick}
            className="w-full sm:w-auto bg-charcoal hover:bg-charcoal/90 text-alabaster font-bold px-10 py-4 text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore The Collection</span>
            <ArrowDown className="w-4 h-4 text-alabaster" />
          </button>
          
          <button
            id="hero-contact-btn"
            onClick={onContactClick}
            className="w-full sm:w-auto bg-white hover:bg-sand-soft text-charcoal border border-beige-divider font-semibold px-10 py-4 text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-champagne-gold" />
            <span>The Atelier Story</span>
          </button>
        </div>

        {/* Distinguishing badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-beige-divider max-w-4xl mx-auto text-left">
          
          <div className="flex gap-3.5 items-start">
            <div className="p-2.5 bg-sand-soft rounded-lg text-champagne-gold shrink-0 border border-beige-divider">
              <Award className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-charcoal">Extrait de Parfum</h4>
              <p className="text-xs text-taupe-muted mt-1">Extraordinary 30% concentration oil formulations. Outlasting ordinary designers.</p>
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="p-2.5 bg-sand-soft rounded-lg text-champagne-gold shrink-0 border border-beige-divider">
              <Truck className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-charcoal">Free Premium Shipping</h4>
              <p className="text-xs text-taupe-muted mt-1">Insured BlueDart Express delivery across India. Safely dispatched in 12 hours.</p>
            </div>
          </div>

          <div className="flex gap-3.5 items-start">
            <div className="p-2.5 bg-sand-soft rounded-lg text-champagne-gold shrink-0 border border-beige-divider">
              <ShieldCheck className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-charcoal">Tax-Paid GST Invoices</h4>
              <p className="text-xs text-taupe-muted mt-1">Every order includes a verified printable tax-compliant serial invoice.</p>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
