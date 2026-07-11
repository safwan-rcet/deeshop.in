import React from 'react';
import { PERFUMES } from '../data';
import { Perfume } from '../types';
import ProductCard from './ProductCard';

interface ProductGalleryProps {
  onAddToCart: (perfume: Perfume, size: '50ml' | '100ml') => void;
  onBuyNow: (perfume: Perfume, size: '50ml' | '100ml') => void;
}

export default function ProductGallery({ onAddToCart, onBuyNow }: ProductGalleryProps) {
  return (
    <section id="collection-section" className="py-20 bg-alabaster border-t border-beige-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Block */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] text-champagne-gold font-bold uppercase tracking-[0.25em] block">
            The Atelier Formulations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-light tracking-wide">
            Sovereign Scent Collection
          </h2>
          <p className="text-xs sm:text-sm text-taupe-muted leading-relaxed font-sans">
            Meticulously composed over years of formulation, these two signature creations represent the twin pillars of deeshop.in — the rich, spicy resinous wood of <span className="text-charcoal font-semibold">Imperial</span> and the bracing, fresh-aquatic musk of <span className="text-charcoal font-semibold">Kaaaf</span>.
          </p>
        </div>

        {/* Bento Grid layout for two items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {PERFUMES.map((perfume) => (
            <ProductCard
              key={perfume.id}
              perfume={perfume}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
