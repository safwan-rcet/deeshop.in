import React from 'react';
import { Order } from '../types';
import { Printer, Check, ShoppingBag, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

export default function InvoiceModal({ isOpen, order, onClose }: InvoiceModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div id="invoice-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto print:bg-white print:p-0">
      <div className="relative w-full max-w-2xl bg-white border border-beige-divider rounded-lg overflow-hidden shadow-2xl my-8 print:border-0 print:shadow-none print:my-0 print:bg-white print:text-black">
        
        {/* Header - Hidden on Print */}
        <div className="p-4 bg-sand-soft border-b border-beige-divider flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-champagne-gold" />
            <span className="font-serif text-sm font-light text-charcoal uppercase tracking-widest">
              Secured Transaction Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 bg-white border border-beige-divider text-taupe-muted hover:text-charcoal rounded hover:bg-sand-soft transition-colors cursor-pointer"
              title="Print Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              id="close-invoice-btn"
              onClick={onClose}
              className="text-taupe-muted hover:text-charcoal transition-colors p-1.5 hover:bg-white rounded-full cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-6 md:p-8 space-y-6 print:p-0 print:text-neutral-900">
          
          {/* Logo and Invoice Details */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-beige-divider print:border-neutral-200 pb-6">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-light tracking-tight text-charcoal print:text-black">
                  deeshop<span className="text-champagne-gold font-sans font-medium">.in</span>
                </span>
              </div>
              <p className="text-xs text-taupe-muted mt-1 print:text-neutral-500">
                Premium Luxury Fragrance Atelier<br />
                support@deeshop.in | New Delhi, India<br />
                GSTIN: 07AADCD3321D1ZH (Simulated)
              </p>
            </div>
            
            <div className="text-left sm:text-right text-xs space-y-1">
              <h3 className="font-serif text-lg font-light text-champagne-gold print:text-black uppercase">
                Tax Invoice
              </h3>
              <p className="text-charcoal print:text-neutral-700">
                <span className="font-medium text-taupe-muted print:text-neutral-500">Invoice No:</span> {order.invoiceNumber}
              </p>
              <p className="text-charcoal print:text-neutral-700">
                <span className="font-medium text-taupe-muted print:text-neutral-500">Date:</span> {order.date}
              </p>
              <p className="text-charcoal print:text-neutral-700">
                <span className="font-medium text-taupe-muted print:text-neutral-500">Order ID:</span> {order.id}
              </p>
              <p className="mt-2 inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider rounded print:border print:border-emerald-500 print:text-emerald-600">
                {order.paymentStatus === 'Paid' ? 'Payment Captured' : 'Payment on Delivery'}
              </p>
            </div>
          </div>

          {/* Billing & Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-taupe-muted print:text-neutral-700">
            <div>
              <h4 className="font-semibold text-charcoal print:text-neutral-500 uppercase tracking-wider mb-2">
                Delivered To
              </h4>
              <p className="font-bold text-charcoal print:text-black text-sm">{order.shippingAddress.fullName}</p>
              <p className="mt-1 text-taupe-muted">{order.shippingAddress.addressLine}</p>
              <p className="text-taupe-muted">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="mt-1 text-taupe-muted print:text-neutral-500">Phone: {order.shippingAddress.phone}</p>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal print:text-neutral-500 uppercase tracking-wider mb-2">
                Transaction Details
              </h4>
              <p><span className="font-medium text-taupe-muted">Gateway:</span> {order.paymentMethod === 'UPI' ? 'Google Pay / UPI' : 'Direct Payment'}</p>
              <p><span className="font-medium text-taupe-muted">Transaction ID:</span> TXN-{order.id.split('-')[1]?.toUpperCase() || 'DEE9938'}</p>
              <p><span className="font-medium text-taupe-muted">Security:</span> 256-Bit SSL Secured Encryption</p>
              <p className="mt-1 text-taupe-muted print:text-neutral-500">Delivery via: BlueDart Premium Air</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-beige-divider print:border-neutral-300 text-taupe-muted print:text-neutral-600 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3 px-1">Description of Perfume</th>
                  <th className="py-3 px-2 text-center">Size</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Unit Price</th>
                  <th className="py-3 px-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-divider/60 print:divide-neutral-200">
                {order.items.map((item, index) => (
                  <tr key={index} className="text-charcoal print:text-neutral-800">
                    <td className="py-3 px-1 font-serif font-light">
                      {item.perfume.name} <span className="text-taupe-muted print:text-neutral-500 font-sans text-[10px]">({item.perfume.concentration})</span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono">{item.size}</td>
                    <td className="py-3 px-2 text-center font-mono">{item.quantity}</td>
                    <td className="py-3 px-2 text-right font-mono">{formattedAmount(item.price)}</td>
                    <td className="py-3 px-1 text-right font-mono">{formattedAmount(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="border-t border-beige-divider print:border-neutral-300 pt-4 flex justify-end">
            <div className="w-full sm:w-64 space-y-2 text-xs text-taupe-muted print:text-neutral-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-charcoal print:text-neutral-800">{formattedAmount(order.totalAmount - order.shippingCharge - order.taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% integrated):</span>
                <span className="font-mono text-charcoal print:text-neutral-800">{formattedAmount(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping (BlueDart Air):</span>
                <span className="font-mono text-charcoal print:text-neutral-800">
                  {order.shippingCharge === 0 ? 'FREE' : formattedAmount(order.shippingCharge)}
                </span>
              </div>
              <div className="flex justify-between border-t border-beige-divider print:border-neutral-300 pt-2 text-sm font-bold text-charcoal print:text-black">
                <span>Total Tax-Paid:</span>
                <span className="font-serif text-champagne-gold print:text-black font-semibold">{formattedAmount(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer Receipt Note */}
          <div className="border-t border-beige-divider print:border-neutral-200 pt-6 text-center text-[10px] text-taupe-muted space-y-1">
            <p className="font-medium text-charcoal print:text-neutral-600">
              Thank you for choosing deeshop.in — Curators of Sovereign Scents.
            </p>
            <p>
              This is a secure electronic tax receipt generated by our billing engine. No physical signature is required.
            </p>
            <p className="text-[9px]">
              For support, please contact help@deeshop.in. deeshop.in and the names Imperial & Kaaaf are registered trademarks.
            </p>
          </div>

        </div>

        {/* Back Button - Hidden on Print */}
        <div className="p-4 bg-sand-soft border-t border-beige-divider flex flex-col sm:flex-row gap-2 justify-between items-center print:hidden">
          <span className="text-[11px] text-taupe-muted flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            PDF copy generated. Download available.
          </span>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none bg-white hover:bg-sand-soft border border-beige-divider text-charcoal px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button
              id="invoice-back-store-btn"
              onClick={onClose}
              className="flex-1 sm:flex-none bg-charcoal hover:bg-charcoal/90 text-alabaster font-bold px-5 py-2.5 rounded-lg text-xs tracking-[0.12em] uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-alabaster" />
              Continue Shopping
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
