import React, { useState, useEffect } from 'react';
import { Perfume, CartItem, Order } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGallery from './components/ProductGallery';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import InvoiceModal from './components/InvoiceModal';
import OrderHistory from './components/OrderHistory';
import DomainSetupGuide from './components/DomainSetupGuide';
import RazorpaySetupGuide from './components/RazorpaySetupGuide';
import { ShoppingBag, Check, RefreshCw, X } from 'lucide-react';

export default function App() {
  // Persistence States
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('deeshop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('deeshop_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Modal toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDomainGuideOpen, setIsDomainGuideOpen] = useState(false);
  const [isRazorpayGuideOpen, setIsRazorpayGuideOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  // Floating notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('deeshop_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('deeshop_orders', JSON.stringify(orders));
  }, [orders]);

  // Toast notifier
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // E-commerce logic handlers
  const handleAddToCart = (perfume: Perfume, size: '50ml' | '100ml') => {
    const price = size === '100ml' ? perfume.price100ml : perfume.price50ml;
    
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.perfume.id === perfume.id && item.size === size);
      
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [...prev, { perfume, size, quantity: 1, price }];
      }
    });

    showToast(`Added ${perfume.name} (${size}) to your atelier cart.`);
  };

  const handleBuyNow = (perfume: Perfume, size: '50ml' | '100ml') => {
    // Add to cart, then trigger checkout
    const price = size === '100ml' ? perfume.price100ml : perfume.price50ml;
    const existingIdx = cart.findIndex((item) => item.perfume.id === perfume.id && item.size === size);

    if (existingIdx === -1) {
      setCart((prev) => [...prev, { perfume, size, quantity: 1, price }]);
    }
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (perfumeId: string, size: '50ml' | '100ml', newQty: number) => {
    if (newQty < 1) {
      handleRemoveItem(perfumeId, size);
      return;
    }
    setCart((prev) => 
      prev.map((item) => 
        item.perfume.id === perfumeId && item.size === size 
          ? { ...item, quantity: newQty } 
          : item
      )
    );
  };

  const handleRemoveItem = (perfumeId: string, size: '50ml' | '100ml') => {
    setCart((prev) => prev.filter((item) => !(item.perfume.id === perfumeId && item.size === size)));
    showToast('Item removed from cart.');
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart
    setIsCheckoutOpen(false);
    
    // Auto-open receipt invoice
    setActiveInvoiceOrder(newOrder);
    showToast('Order secured! Serial receipt generated.');
  };

  // Cart total computation
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Scroll helpers
  const handleScrollToProducts = () => {
    const element = document.getElementById('collection-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToContact = () => {
    const element = document.getElementById('contact-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Periodically update simulated order statuses for realism!
  // e.g. "Confirmed" -> "Shipped" after some time.
  useEffect(() => {
    if (orders.length === 0) return;

    const interval = setInterval(() => {
      setOrders((prev) => 
        prev.map((order) => {
          if (order.orderStatus === 'Confirmed') {
            return { ...order, orderStatus: 'Shipped' };
          }
          if (order.orderStatus === 'Shipped') {
            return { ...order, orderStatus: 'Out for Delivery' };
          }
          return order;
        })
      );
    }, 60000); // Check/update status every 60s for simulated realism

    return () => clearInterval(interval);
  }, [orders]);

  return (
    <div className="min-h-screen bg-alabaster text-charcoal selection:bg-champagne-gold selection:text-charcoal font-sans flex flex-col justify-between">
      
      {/* Stick Header Navigation */}
      <Navbar
        cartCount={totalQuantity}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onScrollToProducts={handleScrollToProducts}
        onScrollToContact={handleScrollToContact}
      />

      {/* Main Core Elements */}
      <main className="flex-1">
        
        {/* Full Cinematic Landing Hero */}
        <Hero
          onExploreClick={handleScrollToProducts}
          onContactClick={handleScrollToContact}
        />

        {/* Dynamic Interactive Product Showcase */}
        <ProductGallery
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />

        {/* Secure Form & Contact Info */}
        <ContactForm />

      </main>

      {/* Footer Details */}
      <Footer
        onOpenOrders={() => setIsOrdersOpen(true)}
        onScrollToProducts={handleScrollToProducts}
        onScrollToContact={handleScrollToContact}
        onOpenDomainGuide={() => setIsDomainGuideOpen(true)}
        onOpenRazorpayGuide={() => setIsRazorpayGuideOpen(true)}
      />

      {/* Floating Bottom Cart reminder */}
      {cart.length > 0 && !isCartOpen && !isCheckoutOpen && (
        <div className="fixed bottom-6 right-6 z-30 animate-bounce print:hidden">
          <button
            id="floating-cart-trigger"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-5 py-3.5 bg-charcoal text-alabaster font-bold rounded-full shadow-xl hover:bg-charcoal/90 transition-all border border-charcoal cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-alabaster" />
            <span className="text-xs tracking-wider uppercase">Bag • {totalQuantity}</span>
            <span className="font-mono text-sm pl-1 border-l border-alabaster/20">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(cartTotal)}
            </span>
          </button>
        </div>
      )}

      {/* Slide-out Cart Drawer Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        cartItems={cart}
        cartTotal={cartTotal}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Secure Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        cartItems={cart}
        cartTotal={cartTotal}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
        onOpenRazorpayGuide={() => setIsRazorpayGuideOpen(true)}
      />

      {/* Printable Tax Invoice/Receipt Modal */}
      <InvoiceModal
        isOpen={activeInvoiceOrder !== null}
        order={activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
      />

      {/* Order Status Tracking History Modal */}
      <OrderHistory
        isOpen={isOrdersOpen}
        orders={orders}
        onViewInvoice={(order) => setActiveInvoiceOrder(order)}
        onClose={() => setIsOrdersOpen(false)}
      />

      {/* GoDaddy Domain Setup Instructions Modal */}
      <DomainSetupGuide
        isOpen={isDomainGuideOpen}
        onClose={() => setIsDomainGuideOpen(false)}
      />

      {/* Razorpay Setup Instructions Modal */}
      <RazorpaySetupGuide
        isOpen={isRazorpayGuideOpen}
        onClose={() => setIsRazorpayGuideOpen(false)}
        cartTotal={cartTotal}
      />

      {/* Global Toast Notification HUD */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-white border border-beige-divider px-4 py-3.5 shadow-xl flex items-center gap-2.5 max-w-sm text-xs text-charcoal">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
