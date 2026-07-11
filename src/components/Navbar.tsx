import React from 'react';
import { ShoppingBag, Package } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onScrollToProducts: () => void;
  onScrollToContact: () => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  onOpenOrders,
  onScrollToProducts,
  onScrollToContact
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-alabaster/90 backdrop-blur-md border-b border-beige-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-1.5 focus:outline-none cursor-pointer group"
        >
          <span className="text-xl sm:text-2xl font-light tracking-[0.2em] uppercase text-charcoal">
            deeshop<span className="text-champagne-gold font-normal font-sans">.in</span>
          </span>
          {/* Subtle live indicator */}
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-champagne-gold/50 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-champagne-gold"></span>
          </span>
        </button>

        {/* Navigation Menu Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/75">
          <button 
            onClick={onScrollToProducts}
            className="hover:text-champagne-gold pb-1 border-b border-transparent hover:border-charcoal transition-all cursor-pointer"
          >
            The Collection
          </button>

          <button 
            onClick={onOpenOrders}
            className="hover:text-champagne-gold flex items-center gap-1 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Track Orders</span>
          </button>

          <button 
            onClick={onScrollToContact}
            className="hover:text-champagne-gold pb-1 border-b border-transparent hover:border-charcoal transition-all cursor-pointer"
          >
            Contact Atelier
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Track Orders (Mobile & Desktop Icon) */}
          <button
            onClick={onOpenOrders}
            className="p-2 text-charcoal/70 hover:text-charcoal hover:bg-sand-soft rounded-full transition-colors cursor-pointer"
            title="Track Deliveries"
          >
            <Package className="w-5 h-5" />
          </button>

          {/* Secure Shopping Cart Trigger */}
          <button
            id="navbar-cart-trigger"
            onClick={onOpenCart}
            className="relative p-2.5 bg-sand-soft hover:bg-beige-divider text-charcoal rounded-full transition-all border border-beige-divider hover:border-champagne-gold/30 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-charcoal/80" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-charcoal text-alabaster font-sans text-[10px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center border border-alabaster">
                {cartCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
}
