import React from 'react';
import { Order } from '../types';
import { Package, Receipt, ShieldAlert, Truck } from 'lucide-react';

interface OrderHistoryProps {
  isOpen: boolean;
  orders: Order[];
  onViewInvoice: (order: Order) => void;
  onClose: () => void;
}

export default function OrderHistory({ isOpen, orders, onViewInvoice, onClose }: OrderHistoryProps) {
  if (!isOpen) return null;

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Shipped': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Out for Delivery': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Delivered': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div id="order-history-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-beige-divider rounded-lg overflow-hidden shadow-2xl my-8">
        
        {/* Decorative Champagne Gold top border */}
        <div className="h-1 w-full bg-champagne-gold" />

        {/* Header */}
        <div className="p-6 border-b border-beige-divider flex justify-between items-center bg-sand-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border border-beige-divider rounded-lg text-champagne-gold shrink-0">
              <Package className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-charcoal font-light tracking-wide">
                Your Orders & Tracking
              </h2>
              <p className="text-xs text-taupe-muted">
                Track your premium deliveries via BlueDart Air cargo
              </p>
            </div>
          </div>
          <button 
            id="close-order-history-btn"
            onClick={onClose}
            className="text-taupe-muted hover:text-charcoal transition-colors p-2 hover:bg-white rounded-full cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {orders.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-sand-soft border border-beige-divider rounded-full text-taupe-muted">
                <ShieldAlert className="w-10 h-10 text-taupe-muted" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-charcoal font-medium">No orders found in this session.</p>
                <p className="text-xs text-taupe-muted max-w-sm">Place an order for Imperial or Kaaaf perfumes using our integrated secure checkout simulator!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-sand-light rounded-lg border border-beige-divider overflow-hidden">
                  
                  {/* Card Header */}
                  <div className="bg-sand-soft px-4 py-3 border-b border-beige-divider flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <span className="text-taupe-muted block text-[10px]">ORDER ID</span>
                        <span className="font-mono text-charcoal font-semibold">{order.id}</span>
                      </div>
                      <div>
                        <span className="text-taupe-muted block text-[10px]">ORDER DATE</span>
                        <span className="text-charcoal font-medium">{order.date}</span>
                      </div>
                      <div>
                        <span className="text-taupe-muted block text-[10px]">TOTAL</span>
                        <span className="text-champagne-gold font-bold font-mono">{formattedAmount(order.totalAmount)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <button
                        onClick={() => onViewInvoice(order)}
                        className="flex items-center gap-1 text-charcoal hover:text-champagne-gold hover:underline font-semibold bg-white px-2.5 py-1.5 rounded border border-beige-divider shadow-sm cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5 text-taupe-muted" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="p-4 space-y-3.5 divide-y divide-beige-divider/60">
                    {order.items.map((item, index) => (
                      <div key={index} className={`flex items-start justify-between gap-3 text-xs ${index > 0 ? 'pt-3.5' : ''}`}>
                        <div className="flex gap-3">
                          <img
                            src={item.perfume.image}
                            alt={item.perfume.name}
                            className="w-12 h-12 object-cover rounded border border-beige-divider shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-serif text-sm font-light text-charcoal">{item.perfume.name}</h4>
                            <p className="text-taupe-muted text-[11px] mt-0.5">{item.perfume.concentration}</p>
                            <p className="text-taupe-muted text-[10px] font-mono mt-0.5">{item.size} • Qty {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-mono text-charcoal font-medium">
                          {formattedAmount(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Timeline simulator */}
                  <div className="bg-white px-4 py-4 border-t border-beige-divider flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    
                    {/* BlueDart Logistics Tracking */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-1.5 text-taupe-muted">
                        <Truck className="w-4 h-4 text-champagne-gold animate-bounce" />
                        <span className="font-semibold text-charcoal">BlueDart Air Express tracking</span>
                        <span className="text-[10px] font-mono text-taupe-muted">#BD-{(order.id.split('-')[1] || '8839')}</span>
                      </div>
                      
                      {/* Interactive Step-Indicators */}
                      <div className="grid grid-cols-4 gap-2 relative pt-2">
                        {/* Horizontal Line background */}
                        <div className="absolute top-[15px] left-4 right-4 h-0.5 bg-beige-divider z-0" />
                        
                        {/* Progressive overlay line */}
                        <div className="absolute top-[15px] left-4 h-0.5 bg-champagne-gold z-0 transition-all duration-1000" style={{ width: order.orderStatus === 'Confirmed' ? '12.5%' : order.orderStatus === 'Shipped' ? '37.5%' : order.orderStatus === 'Out for Delivery' ? '62.5%' : '87.5%' }} />

                        {[
                          { label: 'Confirmed', desc: 'Secure order captured', check: true },
                          { label: 'Shipped', desc: 'Delhi Hub departure', check: order.orderStatus !== 'Confirmed' },
                          { label: 'In Transit', desc: 'Cargo aircraft loading', check: order.orderStatus === 'Out for Delivery' || order.orderStatus === 'Delivered' },
                          { label: 'Delivered', desc: 'Handed to receiver', check: order.orderStatus === 'Delivered' }
                        ].map((step, idx) => (
                          <div key={idx} className="flex flex-col items-center text-center relative z-10">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] border font-bold ${step.check ? 'bg-charcoal text-alabaster border-charcoal' : 'bg-white text-taupe-muted border-beige-divider'}`}>
                              {step.check ? '✓' : idx + 1}
                            </div>
                            <span className="text-[10px] font-bold text-charcoal mt-1 block leading-tight">{step.label}</span>
                            <span className="text-[8px] text-taupe-muted mt-0.5 block leading-tight hidden sm:block">{step.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-sand-soft border-t border-beige-divider flex justify-end gap-3">
          <button
            id="close-order-history-footer"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-white text-charcoal border border-beige-divider hover:bg-sand-soft rounded-lg transition-colors cursor-pointer"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
}
