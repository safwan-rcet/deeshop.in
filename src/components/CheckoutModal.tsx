import React, { useState, useEffect } from 'react';
import { CartItem, Order } from '../types';
import { CreditCard, QrCode, Truck, ShieldCheck, RefreshCw, CheckCircle, Info, Lock, Building, Wallet, Terminal, ExternalLink, Copy, Check } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  cartTotal: number;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  onOpenRazorpayGuide?: () => void;
}

export default function CheckoutModal({ isOpen, cartItems, cartTotal, onClose, onOrderSuccess, onOpenRazorpayGuide }: CheckoutModalProps) {
  // Form state
  const [fullName, setFullName] = useState('Muhammed Safwan VV');
  const [phone, setPhone] = useState('9895678163');
  const [addressLine, setAddressLine] = useState('Atelier Premium Residence, Connaught Place');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('110001');

  // Checkout steps & status
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment' | 'verifying'>('details');
  
  // Unique Order and Invoice details
  const [orderId, setOrderId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Merchant details
  const [merchantUpiId, setMerchantUpiId] = useState<string>(() => {
    return (import.meta.env.VITE_MERCHANT_UPI_ID as string) || 'razorpay.me/@muhammedsafwanvv';
  });

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getUpiPaymentLink());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Math
  const shippingCharge = cartTotal >= 3000 ? 0 : 150;
  const taxAmount = Math.round(cartTotal * 0.18); 
  const finalTotal = cartTotal + shippingCharge;

  // Pre-generate unique order identifiers on mount/open
  useEffect(() => {
    if (isOpen) {
      setOrderId(`DEE-${Math.floor(100000 + Math.random() * 900000)}`);
      setInvoiceNumber(`INV-2026-${Math.floor(5000 + Math.random() * 5000)}`);
    } else {
      setOrderId('');
      setInvoiceNumber('');
      setCheckoutStep('details');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateDetails = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Full Name is required';
    if (!phone.trim()) {
      errors.phone = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(phone.trim())) {
      errors.phone = 'Enter a valid 10-digit phone number';
    }
    if (!addressLine.trim()) errors.addressLine = 'Shipping address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(pincode.trim())) {
      errors.pincode = 'Enter a valid 6-digit PIN code';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDetails()) {
      setCheckoutStep('payment');
    }
  };

  // Helper to construct dynamic Google Pay / UPI Link
  const getUpiPaymentLink = () => {
    const cleanId = merchantUpiId.trim();
    if (!cleanId) return '';
    
    if (cleanId.includes('razorpay.me') || cleanId.startsWith('http://') || cleanId.startsWith('https://')) {
      let baseUrl = cleanId;
      if (!baseUrl.startsWith('http')) {
        baseUrl = `https://${baseUrl}`;
      }
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}amount=${finalTotal}&note=${encodeURIComponent(invoiceNumber || orderId)}`;
    }
    
    // Fallback or standard UPI ID address format
    return `upi://pay?pa=${encodeURIComponent(cleanId)}&pn=${encodeURIComponent("Muhammed Safwan VV")}&am=${finalTotal}&cu=INR&tn=${encodeURIComponent(invoiceNumber || orderId)}`;
  };

  const handleProceedToPay = () => {
    const paymentLink = getUpiPaymentLink();
    if (paymentLink) {
      window.open(paymentLink, '_blank');
    }
    
    // Set view to "Payment Submitted" confirmation step
    setCheckoutStep('verifying');
  };

  const handleConfirmOrder = () => {
    setIsSubmitting(true);
    
    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: [...cartItems],
      shippingAddress: {
        fullName,
        phone,
        addressLine,
        city,
        state,
        pincode
      },
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      totalAmount: finalTotal,
      shippingCharge,
      taxAmount,
      orderStatus: 'Confirmed',
      invoiceNumber
    };

    setTimeout(() => {
      onOrderSuccess(newOrder);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div id="checkout-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-beige-divider rounded-lg overflow-hidden shadow-2xl my-8 grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Column: Form & Checkout (8 cols) */}
        <div className="md:col-span-7 p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-beige-divider">
            <div>
              <span className="text-[10px] text-champagne-gold tracking-widest font-bold uppercase block">Secure Checkout</span>
              <h2 className="font-serif text-xl md:text-2xl text-charcoal font-light">
                {checkoutStep === 'details' ? 'Delivery Details' : checkoutStep === 'payment' ? 'Payment Gateway' : 'Verifying Transaction'}
              </h2>
            </div>
            <button 
              id="checkout-close-btn"
              onClick={onClose} 
              className="text-taupe-muted hover:text-charcoal hover:bg-sand-soft p-1.5 rounded-full text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          {checkoutStep === 'details' && (
            <form id="shipping-form" onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-taupe-muted block font-medium">Full Name *</label>
                <input
                  id="shipping-fullname"
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-sand-light border border-beige-divider rounded-md px-3.5 py-2 text-sm text-charcoal focus:outline-none focus:border-champagne-gold transition-colors placeholder:text-taupe-muted/50"
                />
                {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-taupe-muted block font-medium">Phone Number *</label>
                  <input
                    id="shipping-phone"
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-sand-light border border-beige-divider rounded-md px-3.5 py-2 text-sm text-charcoal focus:outline-none focus:border-champagne-gold transition-colors font-mono placeholder:text-taupe-muted/50"
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-taupe-muted block font-medium">PIN Code (6 digits) *</label>
                  <input
                    id="shipping-pincode"
                    type="text"
                    required
                    placeholder="e.g. 110001"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-sand-light border border-beige-divider rounded-md px-3.5 py-2 text-sm text-charcoal focus:outline-none focus:border-champagne-gold transition-colors font-mono placeholder:text-taupe-muted/50"
                  />
                  {formErrors.pincode && <p className="text-red-500 text-xs mt-1">{formErrors.pincode}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-taupe-muted block font-medium">Street Address *</label>
                <textarea
                  id="shipping-address"
                  required
                  placeholder="House No, Apartment, Street name, Area"
                  rows={2}
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full bg-sand-light border border-beige-divider rounded-md px-3.5 py-2 text-sm text-charcoal focus:outline-none focus:border-champagne-gold transition-colors resize-none placeholder:text-taupe-muted/50"
                />
                {formErrors.addressLine && <p className="text-red-500 text-xs mt-1">{formErrors.addressLine}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-taupe-muted block font-medium">City *</label>
                  <input
                    id="shipping-city"
                    type="text"
                    required
                    placeholder="e.g. New Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-sand-light border border-beige-divider rounded-md px-3.5 py-2 text-sm text-charcoal focus:outline-none focus:border-champagne-gold transition-colors placeholder:text-taupe-muted/50"
                  />
                  {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-taupe-muted block font-medium">State *</label>
                  <select
                    id="shipping-state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-sand-light border border-beige-divider rounded-md px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-champagne-gold transition-colors cursor-pointer"
                  >
                    {['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Kerala', 'Gujarat', 'West Bengal', 'Haryana', 'Punjab'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-beige-divider flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-xs text-taupe-muted">All purchases include verified GST invoices.</span>
                <button
                  id="checkout-to-payment-btn"
                  type="submit"
                  className="bg-charcoal hover:bg-charcoal/90 text-alabaster font-bold px-6 py-2.5 rounded-lg text-xs tracking-[0.12em] uppercase transition-colors cursor-pointer"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          )}          {checkoutStep === 'payment' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Shipping Delivery Information Badge */}
              <div className="bg-sand-soft border border-beige-divider/70 p-3.5 rounded-lg text-xs text-taupe-muted flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-charcoal font-bold uppercase tracking-wider text-[10px]">
                    <Truck className="w-3.5 h-3.5 text-champagne-gold" />
                    Delivery Address
                  </div>
                  <p className="leading-normal">
                    <span className="font-semibold text-charcoal">{fullName}</span> ({phone})<br />
                    {addressLine}, {city}, {state} - {pincode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('details')}
                  className="px-2.5 py-1 text-[10px] bg-white border border-beige-divider hover:bg-sand-light rounded font-bold uppercase text-charcoal transition-all cursor-pointer shadow-sm"
                >
                  Edit Details
                </button>
              </div>

              {/* Secure UPI / GPay Block */}
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-sand-light border border-beige-divider p-6 rounded-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-champagne-gold tracking-widest font-bold uppercase">Direct UPI Channel</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg text-charcoal font-medium">Pay securely via Google Pay / UPI</h4>
                    <p className="text-xs text-taupe-muted leading-relaxed">
                      To complete your transaction, click the <strong className="text-charcoal">"Proceed to Pay"</strong> button. This will launch Google Pay or your default UPI app.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded border border-beige-divider/70 space-y-3">
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-sand-soft">
                      <span className="text-taupe-muted font-medium">Merchant Name</span>
                      <span className="text-charcoal font-semibold">Muhammed Safwan VV</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-sand-soft">
                      <span className="text-taupe-muted font-medium">UPI Address</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-charcoal font-semibold bg-sand-soft px-2 py-0.5 rounded">{merchantUpiId}</span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-1 hover:bg-sand-soft rounded text-taupe-muted hover:text-charcoal transition-colors cursor-pointer"
                          title="Copy UPI Address"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600 animate-scaleIn" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-sand-soft">
                      <span className="text-taupe-muted font-medium">Invoice Total</span>
                      <span className="text-charcoal font-bold text-sm">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(finalTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-sand-soft">
                      <span className="text-taupe-muted font-medium">Transaction Note</span>
                      <span className="font-mono text-charcoal font-medium text-[11px]">{invoiceNumber || orderId}</span>
                    </div>
                    
                    <div className="pt-2 flex flex-wrap justify-between items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setShowQr(!showQr)}
                        className="text-champagne-gold hover:text-champagne-gold/80 transition-colors font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        {showQr ? 'Hide QR Code' : 'Show Pay QR Code'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="text-taupe-muted hover:text-charcoal transition-colors font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 animate-scaleIn" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedLink ? 'Link Copied!' : 'Copy Payment Link'}
                      </button>
                    </div>

                    {showQr && (
                      <div className="pt-3 border-t border-sand-soft flex flex-col items-center space-y-2 animate-fadeIn">
                        <div className="bg-white p-2.5 rounded-lg border border-beige-divider/70 shadow-sm inline-block">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getUpiPaymentLink())}`}
                            alt="UPI Payment QR"
                            className="w-36 h-36"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <p className="text-[10px] text-taupe-muted text-center max-w-[250px] leading-relaxed">
                          Scan with any UPI app (GPay, PhonePe, Paytm, BHIM) to pay exactly <strong className="text-charcoal font-bold">₹{finalTotal.toLocaleString('en-IN')}</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-[11px] text-taupe-muted bg-sand-soft p-3 rounded border border-beige-divider">
                  <Info className="w-3.5 h-3.5 text-champagne-gold shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <span className="text-charcoal font-semibold">Multiple Checkout Modes:</span> Click the button below, scan the QR code, or copy the merchant details to pay. Once done, the page will update so you can verify and finalize your shipping invoice.
                  </p>
                </div>
              </div>

              {/* Back & Proceed buttons */}
              <div className="pt-4 border-t border-beige-divider flex justify-between gap-3">
                <button
                  id="checkout-back-btn"
                  type="button"
                  onClick={() => setCheckoutStep('details')}
                  className="px-4 py-2.5 bg-sand-soft text-charcoal hover:bg-beige-divider rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Back to Delivery
                </button>
                <a
                  id="checkout-confirm-btn"
                  href={getUpiPaymentLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setCheckoutStep('verifying')}
                  className="px-6 py-2.5 bg-charcoal text-alabaster hover:bg-charcoal/90 font-bold rounded-lg text-xs tracking-[0.12em] uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm text-center"
                >
                  <ShieldCheck className="w-4 h-4 text-alabaster" />
                  <span>Proceed to Pay</span>
                </a>
              </div>
            </div>
          )}

          {checkoutStep === 'verifying' && (
            <div className="space-y-6 py-4 animate-fadeIn">
              <div className="bg-sand-light border border-beige-divider/80 p-6 rounded-lg text-center space-y-4">
                <div className="w-12 h-12 bg-champagne-gold/15 border border-champagne-gold/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 text-champagne-gold" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-charcoal font-medium">Payment Submitted.</h3>
                  <h4 className="text-xs text-champagne-gold font-bold uppercase tracking-widest">Your order is being verified.</h4>
                  <p className="text-xs text-taupe-muted max-w-md mx-auto leading-relaxed">
                    Once you have completed the transfer in Google Pay or your UPI client, please click the button below to secure your items and auto-generate your tax-paid GST invoice.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-beige-divider rounded-lg p-4 divide-y divide-sand-soft text-xs space-y-3">
                <div className="flex justify-between items-center pb-2">
                  <span className="text-taupe-muted">Invoice Reference</span>
                  <span className="font-mono text-charcoal font-semibold bg-sand-soft px-2.5 py-1 rounded">{invoiceNumber}</span>
                </div>
                <div className="flex justify-between items-center pt-2 pb-2">
                  <span className="text-taupe-muted">Order Identifier</span>
                  <span className="font-mono text-charcoal font-semibold">{orderId}</span>
                </div>
                <div className="flex justify-between items-center pt-2 pb-2">
                  <span className="text-taupe-muted">Amount Payable</span>
                  <span className="text-charcoal font-bold font-serif text-sm">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(finalTotal)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-taupe-muted">Delivery Address</span>
                  <span className="text-charcoal font-medium text-right max-w-[200px] truncate">{addressLine}, {city}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-beige-divider flex flex-col sm:flex-row justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('payment')}
                  className="text-taupe-muted hover:text-charcoal text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Retry Payment Link
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmOrder}
                  className="w-full sm:w-auto bg-charcoal hover:bg-charcoal/90 text-alabaster font-bold px-6 py-3 rounded-lg text-xs tracking-[0.12em] uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-alabaster" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-champagne-gold" />
                  )}
                  <span>{isSubmitting ? 'Verifying Order...' : 'Confirm Order & View Invoice'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Sidebar (5 cols) */}
        <div className="md:col-span-5 bg-sand-soft p-6 md:p-8 border-t md:border-t-0 md:border-l border-beige-divider flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-serif text-sm font-light uppercase tracking-[0.15em] text-charcoal pb-3 border-b border-beige-divider">
              Shopping Cart Summary
            </h3>

            {/* Scrollable list */}
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-start justify-between text-xs py-2 border-b border-beige-divider/60">
                  <div className="flex gap-2.5 items-center">
                    <img
                      src={item.perfume.image}
                      alt={item.perfume.name}
                      className="w-10 h-10 object-cover rounded border border-beige-divider shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-serif font-light text-charcoal">{item.perfume.name}</h4>
                      <p className="text-[10px] text-taupe-muted font-mono">
                        {item.size} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-charcoal font-semibold text-right shrink-0">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing breakdowns */}
          <div className="space-y-3 pt-6 border-t border-beige-divider">
            <div className="flex justify-between text-xs text-taupe-muted">
              <span>Cart Subtotal</span>
              <span className="font-mono text-charcoal">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-taupe-muted">
              <span>Integrated GST (18% included)</span>
              <span className="font-mono text-charcoal">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-xs text-taupe-muted">
              <span>Shipping (BlueDart Air)</span>
              <span className="font-mono text-charcoal">
                {shippingCharge === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(shippingCharge)}
              </span>
            </div>
            
            <div className="flex justify-between text-sm font-bold text-charcoal pt-2 border-t border-beige-divider">
              <span className="font-serif">Total Tax-Paid Amount</span>
              <span className="font-serif text-champagne-gold text-base font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(finalTotal)}</span>
            </div>

            <div className="bg-white border border-beige-divider p-4 rounded-lg text-[10px] text-taupe-muted space-y-1.5 mt-4">
              <p className="flex items-center gap-1 text-charcoal font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-champagne-gold shrink-0" />
                Sovereign Secure Badges
              </p>
              <p className="leading-relaxed">
                Your connection is encrypted using banking-grade 256-bit TLS protocol. Secured via SSL. Deeshop Atelier ensures non-disclosure of customer telemetry.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
