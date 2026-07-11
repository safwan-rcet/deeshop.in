import React from 'react';
import { CartItem } from '../types';
import { ShoppingBag, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  cartItems: CartItem[];
  cartTotal: number;
  onClose: () => void;
  onUpdateQuantity: (perfumeId: string, size: '50ml' | '100ml', newQty: number) => void;
  onRemoveItem: (perfumeId: string, size: '50ml' | '100ml') => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  cartItems,
  cartTotal,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  if (!isOpen) return null;

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl border-l border-beige-divider">
        
        {/* Header */}
        <div className="p-5 border-b border-beige-divider flex justify-between items-center bg-sand-soft">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-champagne-gold" />
            <span className="font-serif text-lg font-light text-charcoal">Your Atelier Cart</span>
            <span className="bg-charcoal text-alabaster text-xs font-mono font-bold px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button 
            id="close-cart-btn"
            onClick={onClose}
            className="text-taupe-muted hover:text-charcoal p-1.5 hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Items list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-12 h-12 rounded-full border border-beige-divider flex items-center justify-center text-taupe-muted bg-sand-soft">
                👜
              </div>
              <div className="space-y-1">
                <p className="text-sm font-serif font-medium text-charcoal">Your Cart is Empty</p>
                <p className="text-xs text-taupe-muted max-w-xs">Select your preferred sizes of Imperial or Kaaaf and add them to initiate a luxury sensory voyage.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={`${item.perfume.id}-${item.size}`} className="bg-sand-light p-4 rounded-lg border border-beige-divider flex gap-3 items-start justify-between">
                  <div className="flex gap-3">
                    <img
                      src={item.perfume.image}
                      alt={item.perfume.name}
                      className="w-14 h-14 object-cover rounded border border-beige-divider shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] text-champagne-gold uppercase tracking-widest font-bold block">{item.perfume.concentration}</span>
                      <h4 className="font-serif text-sm font-light text-charcoal">{item.perfume.name}</h4>
                      <p className="text-xs text-taupe-muted font-mono">{item.size} • {formattedAmount(item.price)}</p>
                      
                      {/* Quantity selector (+/-) */}
                      <div className="flex items-center border border-beige-divider rounded bg-white w-24 h-7 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.perfume.id, item.size, item.quantity - 1)}
                          className="flex-1 text-center text-sm font-semibold hover:bg-sand-soft text-taupe-muted hover:text-charcoal transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center text-xs font-mono font-bold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.perfume.id, item.size, item.quantity + 1)}
                          className="flex-1 text-center text-sm font-semibold hover:bg-sand-soft text-taupe-muted hover:text-charcoal transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Total Price & Remove icon */}
                  <div className="flex flex-col items-end justify-between h-20">
                    <span className="font-mono text-xs font-bold text-charcoal">
                      {formattedAmount(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.perfume.id, item.size)}
                      className="text-taupe-muted hover:text-red-600 p-1 rounded hover:bg-white transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout action */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-beige-divider bg-sand-soft space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-taupe-muted">
                <span>Subtotal (Integrated GST included)</span>
                <span className="font-mono text-charcoal">{formattedAmount(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-taupe-muted">
                <span>Delivery (BlueDart Air)</span>
                <span className="font-mono text-charcoal">
                  {cartTotal >= 3000 ? <span className="text-emerald-700 font-bold">FREE</span> : formattedAmount(150)}
                </span>
              </div>
              <div className="flex justify-between border-t border-beige-divider pt-2 text-sm font-bold text-charcoal">
                <span className="font-serif">Estimated Total</span>
                <span className="font-serif text-charcoal font-semibold">{formattedAmount(cartTotal + (cartTotal >= 3000 ? 0 : 150))}</span>
              </div>
            </div>

            <button
              id="drawer-checkout-btn"
              onClick={onCheckout}
              className="w-full bg-charcoal hover:bg-charcoal/90 text-alabaster font-bold py-3.5 px-4 rounded-lg text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <span>Initiate Secure Checkout</span>
              <ArrowRight className="w-4 h-4 text-alabaster" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-taupe-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-champagne-gold" />
              <span>256-Bit SSL Secured Transaction Protocol</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
