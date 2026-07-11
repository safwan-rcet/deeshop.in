import React, { useState } from 'react';
import { Perfume } from '../types';
import { Star, ShieldCheck, ShoppingBag, Eye, Info, Sparkles } from 'lucide-react';

interface ProductCardProps {
  key?: string;
  perfume: Perfume;
  onAddToCart: (perfume: Perfume, size: '50ml' | '100ml') => void;
  onBuyNow: (perfume: Perfume, size: '50ml' | '100ml') => void;
}

export default function ProductCard({ perfume, onAddToCart, onBuyNow }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml'>('100ml');
  const [activeTab, setActiveTab] = useState<'notes' | 'details' | 'ingredients'>('notes');
  const [isHovered, setIsHovered] = useState(false);

  const currentPrice = selectedSize === '100ml' ? perfume.price100ml : perfume.price50ml;

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div
      id={`product-card-${perfume.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white border border-beige-divider rounded-lg overflow-hidden hover:border-champagne-gold/60 transition-all duration-500 shadow-sm group flex flex-col justify-between"
    >
      
      {/* Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-[#F7F6F2] flex items-center justify-center">
        {/* Gender / Concentration Tag */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          <span className="px-2.5 py-0.5 bg-white/95 text-champagne-gold text-[9px] font-bold uppercase tracking-wider rounded border border-beige-divider shadow-sm">
            {perfume.concentration}
          </span>
          <span className="px-2 py-0.5 bg-sand-soft/90 text-charcoal/60 text-[8px] font-medium tracking-wide rounded">
            {perfume.gender}
          </span>
        </div>

        {/* Longevity indicator badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2 py-0.5 bg-white/95 text-[9px] text-charcoal/80 rounded border border-beige-divider font-mono">
            {perfume.longevity} Wear
          </span>
        </div>

        {/* Premium Real Product Image */}
        <img
          src={perfume.image}
          alt={`${perfume.name} - ${perfume.tagline}`}
          className="w-full h-full object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Product Information Body */}
      <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
        
        {/* Title, rating, and description */}
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-serif text-2xl text-charcoal font-light tracking-wide group-hover:text-champagne-gold transition-colors">
                {perfume.name}
              </h3>
              <p className="text-[10px] text-champagne-gold uppercase tracking-[0.2em] font-semibold font-mono mt-0.5">
                {perfume.olfactoryFamily}
              </p>
            </div>
            {/* Reviews */}
            <div className="flex items-center gap-1.5 bg-sand-light px-2 py-1 rounded border border-beige-divider">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              <span className="text-xs text-charcoal font-bold font-mono leading-none">{perfume.rating}</span>
              <span className="text-[9px] text-taupe-muted">({perfume.reviewsCount})</span>
            </div>
          </div>

          <p className="text-xs text-taupe-muted leading-relaxed font-sans pt-1">
            {perfume.description}
          </p>
        </div>

        {/* Interactive Tabs: Olfactory Pyramid, Details, Ingredients */}
        <div className="border border-beige-divider rounded-lg overflow-hidden bg-sand-light/30">
          <div className="flex bg-sand-soft border-b border-beige-divider text-[10px] font-bold uppercase tracking-[0.12em] text-taupe-muted">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-2 text-center border-r border-beige-divider transition-all cursor-pointer ${activeTab === 'notes' ? 'text-charcoal bg-white font-bold' : 'hover:text-charcoal'}`}
            >
              Olfactory Pyram.
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-2 text-center border-r border-beige-divider transition-all cursor-pointer ${activeTab === 'details' ? 'text-charcoal bg-white font-bold' : 'hover:text-charcoal'}`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-2 text-center transition-all cursor-pointer ${activeTab === 'ingredients' ? 'text-charcoal bg-white font-bold' : 'hover:text-charcoal'}`}
            >
              Formula
            </button>
          </div>

          <div className="p-3.5 min-h-[140px] text-xs space-y-3 bg-white/40">
            
            {/* Olfactory Pyramid Tab */}
            {activeTab === 'notes' && (
              <div className="space-y-3 text-charcoal/90">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-champagne-gold font-bold uppercase tracking-wider block">Top Notes (First 30m)</span>
                  <p className="text-xs font-serif italic text-charcoal">{perfume.topNotes.join(', ')}</p>
                </div>
                <div className="space-y-0.5 border-t border-beige-divider pt-1.5">
                  <span className="text-[9px] text-champagne-gold font-bold uppercase tracking-wider block">Heart Notes (30m - 4h)</span>
                  <p className="text-xs font-serif italic text-charcoal">{perfume.heartNotes.join(', ')}</p>
                </div>
                <div className="space-y-0.5 border-t border-beige-divider pt-1.5">
                  <span className="text-[9px] text-champagne-gold font-bold uppercase tracking-wider block">Base Notes (4h - 12h+)</span>
                  <p className="text-xs font-serif italic text-charcoal">{perfume.baseNotes.join(', ')}</p>
                </div>
              </div>
            )}

            {/* Sillage & Longevity Tab */}
            {activeTab === 'details' && (
              <div className="space-y-3 text-charcoal/90">
                <p className="text-xs leading-relaxed text-taupe-muted">
                  {perfume.longDescription.substring(0, 110)}...
                </p>
                <div className="grid grid-cols-2 gap-3 border-t border-beige-divider pt-3 text-[11px]">
                  <div>
                    <span className="text-taupe-muted block uppercase text-[9px] tracking-wide">Projection</span>
                    <span className="font-semibold text-charcoal">{perfume.sillage}</span>
                  </div>
                  <div>
                    <span className="text-taupe-muted block uppercase text-[9px] tracking-wide">Concentration</span>
                    <span className="font-semibold text-champagne-gold">{perfume.concentration}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Ingredients Tab */}
            {activeTab === 'ingredients' && (
              <div className="space-y-2">
                <span className="text-[9px] text-taupe-muted font-bold uppercase block">Safe & Compliant Formulation</span>
                <p className="text-[11px] text-charcoal/80 leading-relaxed font-mono italic">
                  {perfume.ingredients.join(', ')}.
                </p>
                <p className="text-[9px] text-taupe-muted/80">
                  Formulated in adherence with IFRA international guidelines. Includes protective UV stabilizers to prevent degradation of premium natural oils.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Size Selection Toggle */}
        <div className="space-y-2">
          <span className="text-[10px] text-taupe-muted font-bold uppercase tracking-[0.15em] block">Select Size</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              id={`size-50ml-${perfume.id}`}
              onClick={() => setSelectedSize('50ml')}
              className={`py-2 text-center rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${selectedSize === '50ml' ? 'bg-charcoal text-alabaster border-charcoal' : 'bg-white border-beige-divider text-charcoal/70 hover:text-charcoal'}`}
            >
              50ml • {formattedAmount(perfume.price50ml)}
            </button>
            <button
              id={`size-100ml-${perfume.id}`}
              onClick={() => setSelectedSize('100ml')}
              className={`py-2 text-center rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${selectedSize === '100ml' ? 'bg-charcoal text-alabaster border-charcoal' : 'bg-white border-beige-divider text-charcoal/70 hover:text-charcoal'}`}
            >
              100ml • {formattedAmount(perfume.price100ml)}
            </button>
          </div>
        </div>

        {/* Price & Action Elements */}
        <div className="pt-3 border-t border-beige-divider flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] text-taupe-muted font-bold uppercase tracking-[0.12em] block">Price</span>
            <span className="font-serif text-2xl font-light text-charcoal">
              {formattedAmount(currentPrice)}
            </span>
          </div>

          <div className="flex gap-2 flex-1 justify-end">
            {/* Add to Cart */}
            <button
              id={`add-to-cart-${perfume.id}`}
              onClick={() => onAddToCart(perfume, selectedSize)}
              className="px-4 py-2.5 bg-sand-soft hover:bg-beige-divider text-charcoal border border-beige-divider rounded-lg text-xs font-bold transition-colors cursor-pointer"
              title="Add to Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            {/* Buy Now (Direct to Gateway) */}
            <button
              id={`buy-now-${perfume.id}`}
              onClick={() => onBuyNow(perfume, selectedSize)}
              className="px-5 py-2.5 bg-charcoal hover:bg-charcoal/90 text-alabaster font-bold rounded-lg text-xs tracking-[0.15em] uppercase transition-colors flex-1 text-center cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
