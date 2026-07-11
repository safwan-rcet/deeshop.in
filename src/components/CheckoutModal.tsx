import React, { useState, useEffect } from 'react';
import { CartItem, Order } from '../types';
import { CreditCard, QrCode, Truck, ShieldCheck, RefreshCw, CheckCircle, Info, Lock, Building, Wallet, Terminal } from 'lucide-react';

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
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('');

  // Checkout steps & status
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Stripe' | 'COD'>('UPI');
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment' | 'verifying'>('details');
  const [upiTimer, setUpiTimer] = useState(300); // 5 minutes count down
  const [upiStatus, setUpiStatus] = useState<'pending' | 'success'>('pending');
  
  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Razorpay Gateway Simulator States
  const [showRazorpaySim, setShowRazorpaySim] = useState(false);
  const [rzpMethod, setRzpMethod] = useState<'card' | 'upi' | 'netbanking' | 'wallet'>('upi');
  const [rzpCardNumber, setRzpCardNumber] = useState('4242 4242 4242 4242');
  const [rzpCardExpiry, setRzpCardExpiry] = useState('12/28');
  const [rzpCardCvv, setRzpCardCvv] = useState('123');
  const [rzpUpiId, setRzpUpiId] = useState('customer@okhdfcbank');
  const [rzpBank, setRzpBank] = useState('SBI');
  const [rzpWallet, setRzpWallet] = useState('Paytm');
  const [rzpStep, setRzpStep] = useState<'select' | 'processing' | 'success'>('select');
  const [rzpLogs, setRzpLogs] = useState<string[]>([]);

  // Math
  const shippingCharge = cartTotal >= 3000 ? 0 : 150;
  const taxAmount = Math.round(cartTotal * 0.18); 
  const finalTotal = cartTotal + shippingCharge;

  // Countdown timer for UPI QR
  useEffect(() => {
    if (checkoutStep === 'payment' && paymentMethod === 'UPI' && upiTimer > 0) {
      const timer = setInterval(() => {
        setUpiTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [checkoutStep, paymentMethod, upiTimer]);

  // Simulate auto-payment recognition for Razorpay UPI (after 12 seconds)
  useEffect(() => {
    if (checkoutStep === 'payment' && paymentMethod === 'UPI' && upiStatus === 'pending') {
      const autoPay = setTimeout(() => {
        setUpiStatus('success');
      }, 12000);
      return () => clearTimeout(autoPay);
    }
  }, [checkoutStep, paymentMethod, upiStatus]);

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

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const handlePaymentSubmit = () => {
    if (paymentMethod === 'Stripe') {
      const errors: Record<string, string> = {};
      if (cardNumber.replace(/\s/g, '').length !== 16) errors.card = 'Invalid 16-digit card number';
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) errors.expiry = 'Use MM/YY';
      if (cardCvv.length !== 3) errors.cvv = 'CVV must be 3 digits';
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
    }

    setCheckoutStep('verifying');
    setIsSubmitting(true);

    // Simulate payment processing
    setTimeout(() => {
      const orderId = `DEE-${Math.floor(100000 + Math.random() * 900000)}`;
      const invoiceNumber = `INV-2026-${Math.floor(5000 + Math.random() * 5000)}`;
      
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
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
        totalAmount: finalTotal,
        shippingCharge,
        taxAmount,
        orderStatus: 'Confirmed',
        invoiceNumber
      };

      onOrderSuccess(newOrder);
      setIsSubmitting(false);
    }, 3000);
  };

  const triggerSuccessfulOrder = (method: 'UPI' | 'Stripe' | 'COD') => {
    setCheckoutStep('verifying');
    setIsSubmitting(true);
    
    const orderId = `DEE-${Math.floor(100000 + Math.random() * 900000)}`;
    const invoiceNumber = `INV-2026-${Math.floor(5000 + Math.random() * 5000)}`;
    
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
      paymentMethod: method,
      paymentStatus: method === 'COD' ? 'Pending' : 'Paid',
      totalAmount: finalTotal,
      shippingCharge,
      taxAmount,
      orderStatus: 'Confirmed',
      invoiceNumber
    };

    setTimeout(() => {
      onOrderSuccess(newOrder);
      setIsSubmitting(false);
      setShowRazorpaySim(false);
    }, 2000);
  };

  const handleStartRazorpaySim = () => {
    setRzpStep('select');
    setRzpLogs([
      `[${new Date().toLocaleTimeString()}] Initialized Razorpay standard secure overlay v1.2`,
      `[${new Date().toLocaleTimeString()}] Order ID: order_dev_${Math.floor(100000 + Math.random() * 900000)}`,
      `[${new Date().toLocaleTimeString()}] Amount to pay: ₹${finalTotal.toLocaleString('en-IN')}`
    ]);
    setShowRazorpaySim(true);
  };

  const handleRazorpayPaymentSimSubmit = () => {
    setRzpStep('processing');
    const addLog = (msg: string, delay: number) => {
      setTimeout(() => {
        setRzpLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
      }, delay);
    };

    addLog("Initiating SSL handshake with api.razorpay.com...", 300);
    addLog(`Authorizing via instrument: ${rzpMethod.toUpperCase()}`, 700);
    
    if (rzpMethod === 'card') {
      addLog(`Sending tokenized card payload ending in ${rzpCardNumber.slice(-4)}`, 1100);
      addLog("Waiting for 3D-Secure 2.0 banking approval page...", 1500);
      addLog("🟢 OTP / Biometric authentication approved successfully!", 2200);
    } else if (rzpMethod === 'upi') {
      addLog(`Sending collect request to virtual payment address: ${rzpUpiId}`, 1100);
      addLog("Awaiting customer response on UPI smartphone device application...", 1600);
      addLog("🟢 UPI Payment Authorized by customer PSP app!", 2200);
    } else if (rzpMethod === 'netbanking') {
      addLog(`Redirecting securely to ${rzpBank} retail netbanking server...`, 1100);
      addLog("Customer successfully logged in & signed transaction token.", 1700);
      addLog("🟢 Bank confirms clearance of funds transfer.", 2200);
    } else {
      addLog(`Contacting e-Wallet proxy server for ${rzpWallet}...`, 1100);
      addLog("Deducting available currency reserves from mobile account.", 1700);
      addLog("🟢 Wallet balance adjusted successfully.", 2200);
    }

    addLog("Signing transaction metadata with server-side HMAC-SHA256 signature...", 2800);
    addLog("Capturing payment reference: pay_rzpSim_" + Math.floor(10000000 + Math.random() * 90000000), 3200);
    
    setTimeout(() => {
      setRzpStep('success');
      setTimeout(() => {
        // Trigger actual success order
        triggerSuccessfulOrder(rzpMethod === 'card' ? 'Stripe' : 'UPI');
      }, 1000);
    }, 3800);
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
          )}

          {checkoutStep === 'payment' && (
            <div className="space-y-6">
              {/* Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-sand-soft border border-beige-divider rounded-lg text-xs">
                <button
                  id="pay-tab-upi"
                  type="button"
                  onClick={() => { setPaymentMethod('UPI'); setFormErrors({}); }}
                  className={`py-2 px-3 rounded flex flex-col sm:flex-row items-center justify-center gap-1.5 font-semibold transition-all cursor-pointer ${paymentMethod === 'UPI' ? 'bg-charcoal text-alabaster' : 'text-taupe-muted hover:text-charcoal'}`}
                >
                  <QrCode className="w-4 h-4 shrink-0" />
                  <span>Razorpay UPI</span>
                </button>
                <button
                  id="pay-tab-stripe"
                  type="button"
                  onClick={() => { setPaymentMethod('Stripe'); setFormErrors({}); }}
                  className={`py-2 px-3 rounded flex flex-col sm:flex-row items-center justify-center gap-1.5 font-semibold transition-all cursor-pointer ${paymentMethod === 'Stripe' ? 'bg-charcoal text-alabaster' : 'text-taupe-muted hover:text-charcoal'}`}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>Stripe Secure</span>
                </button>
                <button
                  id="pay-tab-cod"
                  type="button"
                  onClick={() => { setPaymentMethod('COD'); setFormErrors({}); }}
                  className={`py-2 px-3 rounded flex flex-col sm:flex-row items-center justify-center gap-1.5 font-semibold transition-all cursor-pointer ${paymentMethod === 'COD' ? 'bg-charcoal text-alabaster' : 'text-taupe-muted hover:text-charcoal'}`}
                >
                  <Truck className="w-4 h-4 shrink-0" />
                  <span>Cash on Delivery</span>
                </button>
              </div>

              {/* UPI QR Payment Block */}
              {paymentMethod === 'UPI' && (
                <div className="space-y-4">
                  <div className="bg-sand-light border border-beige-divider p-4 rounded-lg flex flex-col sm:flex-row items-center gap-6">
                    <div className="bg-white p-3 rounded-lg border border-beige-divider shadow-sm shrink-0 flex flex-col items-center justify-center relative">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=deeshop@ybl%26pn=DeeShop%2520Atelier%26am=1.00%26cu=INR%26tn=Order"
                        alt="UPI QR Code"
                        className="w-32 h-32"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[9px] text-taupe-muted font-bold tracking-wider uppercase mt-1">Razorpay Secured</span>
                    </div>

                    <div className="flex-1 space-y-3 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        <span className="text-xs text-taupe-muted font-medium">Scan with BHIM, GPay, PhonePe, or Paytm</span>
                      </div>
                      <h4 className="font-medium text-charcoal text-base">Pay securely via UPI QR Code</h4>
                      <p className="text-xs text-taupe-muted leading-relaxed">
                        Scan the dynamically generated Razorpay QR with any UPI app on your smartphone to complete the transaction of <span className="text-champagne-gold font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(finalTotal)}</span>.
                      </p>
                      
                      {upiStatus === 'pending' ? (
                        <div className="text-xs font-mono text-taupe-muted bg-white px-3 py-1.5 border border-beige-divider rounded inline-block">
                          Awaiting Payment Recognition... {formatTimer(upiTimer)}
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded text-xs flex items-center justify-center sm:justify-start gap-1.5 animate-pulse">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold">UPI Payment Instantly Captured!</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-[11px] text-taupe-muted bg-sand-soft p-3 rounded border border-beige-divider">
                    <Info className="w-3.5 h-3.5 text-champagne-gold shrink-0 mt-0.5" />
                    <p>
                      <span className="text-charcoal font-semibold">Simulator Assist:</span> The UPI gateway detects simulated payments automatically in 12 seconds. To speed it up, you can click the &quot;Confirm Order&quot; button directly.
                    </p>
                  </div>

                  {onOpenRazorpayGuide && (
                    <div className="bg-sand-light border border-beige-divider p-3.5 rounded-lg text-xs text-taupe-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <span>
                        <span className="text-charcoal font-semibold">Store Administration:</span> Learn how to connect your live Indian Razorpay merchant account with real secure API keys.
                      </span>
                      <button 
                        type="button"
                        onClick={onOpenRazorpayGuide}
                        className="text-champagne-gold hover:text-champagne-gold/80 transition-colors font-bold uppercase tracking-wider text-[10px] shrink-0 cursor-pointer border border-beige-divider px-3 py-1 bg-white rounded"
                      >
                        Setup Developer Suite
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Stripe Payment Block */}
              {paymentMethod === 'Stripe' && (
                <div className="space-y-4 bg-sand-light border border-beige-divider p-5 rounded-lg">
                  <div className="flex items-center justify-between border-b border-beige-divider pb-3">
                    <span className="text-xs font-semibold text-taupe-muted uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-champagne-gold" />
                      Stripe secure element (TLS 1.3)
                    </span>
                    <span className="text-[10px] text-champagne-gold bg-white border border-beige-divider px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">Test Environment</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-taupe-muted block font-medium">Card Number</label>
                      <div className="relative">
                        <input
                          id="stripe-card-num"
                          type="text"
                          maxLength={19}
                          placeholder="4242  4242  4242  4242 (Any Visa test card)"
                          value={cardNumber}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                            const matches = v.match(/\d{4,16}/g);
                            const match = (matches && matches[0]) || '';
                            const parts = [];
                            for (let i = 0, len = match.length; i < len; i += 4) {
                              parts.push(match.substring(i, i + 4));
                            }
                            if (parts.length > 0) {
                              setCardNumber(parts.join('  '));
                            } else {
                              setCardNumber(v);
                            }
                          }}
                          className="w-full bg-white border border-beige-divider rounded-md pl-3 pr-10 py-2 text-sm text-charcoal font-mono focus:outline-none focus:border-champagne-gold transition-colors"
                        />
                        <CreditCard className="w-4 h-4 text-taupe-muted absolute right-3 top-3" />
                      </div>
                      {formErrors.card && <p className="text-red-500 text-xs mt-1">{formErrors.card}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] text-taupe-muted block font-medium">Expiry Date</label>
                        <input
                          id="stripe-card-expiry"
                          type="text"
                          maxLength={5}
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/[^0-9]/g, '');
                            if (v.length > 2) {
                              v = `${v.substring(0, 2)}/${v.substring(2, 4)}`;
                            }
                            setCardExpiry(v);
                          }}
                          className="w-full bg-white border border-beige-divider rounded-md px-3 py-2 text-sm text-charcoal font-mono focus:outline-none focus:border-champagne-gold"
                        />
                        {formErrors.expiry && <p className="text-red-500 text-xs mt-1">{formErrors.expiry}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-taupe-muted block font-medium">CVV / CVC</label>
                        <input
                          id="stripe-card-cvv"
                          type="password"
                          maxLength={3}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full bg-white border border-beige-divider rounded-md px-3 py-2 text-sm text-charcoal font-mono focus:outline-none focus:border-champagne-gold"
                        />
                        {formErrors.cvv && <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cash on Delivery Block */}
              {paymentMethod === 'COD' && (
                <div className="bg-sand-light border border-beige-divider p-5 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal text-sm">Pay Cash upon BlueDart Safe Delivery</h4>
                      <p className="text-xs text-taupe-muted">No advance payment required. Cash or UPI accepted at door.</p>
                    </div>
                  </div>
                  <p className="text-xs text-taupe-muted leading-relaxed pt-2 border-t border-beige-divider">
                    Your package will be dispatched within 12 hours via <span className="text-charcoal font-semibold">BlueDart Premium Air courier</span>. You will receive SMS updates on the registered mobile: <span className="text-champagne-gold font-bold font-mono">{phone}</span> with tracking links.
                  </p>
                </div>
              )}

              {/* Back & Submit buttons */}
              <div className="pt-4 border-t border-beige-divider flex justify-between gap-3">
                <button
                  id="checkout-back-btn"
                  type="button"
                  onClick={() => setCheckoutStep('details')}
                  className="px-4 py-2.5 bg-sand-soft text-charcoal hover:bg-beige-divider rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Back to Delivery
                </button>
                <button
                  id="checkout-confirm-btn"
                  type="button"
                  onClick={paymentMethod === 'COD' ? handlePaymentSubmit : handleStartRazorpaySim}
                  className="px-6 py-2.5 bg-charcoal text-alabaster hover:bg-charcoal/90 font-bold rounded-lg text-xs tracking-[0.12em] uppercase transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-alabaster" />
                  <span>{paymentMethod === 'COD' ? 'Confirm and Order' : 'Pay via Razorpay'}</span>
                </button>
              </div>
            </div>
          )}

          {checkoutStep === 'verifying' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-champagne-gold animate-spin" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-charcoal uppercase tracking-wider">Securing Transaction...</h4>
                <p className="text-xs text-taupe-muted max-w-sm">
                  Connecting to banking gateway. Validating 3D secure tokens and transmitting double-encrypted invoice telemetry. Please do not close or reload.
                </p>
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

      {/* Interactive Razorpay Gateway Simulator Overlay */}
      {showRazorpaySim && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto font-sans">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl my-8">
            
            {/* Top Security Status Bar */}
            <div className="bg-slate-950 px-4 py-2 flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-500" />
                SECURE END-TO-END ENCRYPTED GATEWAY (TLS 1.3)
              </span>
              <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider">Razorpay Sandbox</span>
            </div>

            {/* Simulated Razorpay Brand Header */}
            <div className="p-6 bg-[#0c1322] border-b border-slate-800 flex justify-between items-center">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm tracking-tighter">R</div>
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-wide">Deeshop Atelier</h3>
                    <p className="text-[10px] text-slate-400">Order ID: order_rzp_{Math.floor(100000 + Math.random() * 900000)}</p>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Amount to Pay</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(finalTotal)}
                </span>
              </div>
            </div>

            {rzpStep === 'select' && (
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[280px]">
                {/* Method selector list (5 cols) */}
                <div className="md:col-span-5 bg-slate-950 border-r border-slate-800 flex flex-col divide-y divide-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setRzpMethod('upi')}
                    className={`p-4 flex items-center gap-3 text-left transition-all cursor-pointer ${rzpMethod === 'upi' ? 'bg-indigo-950/40 text-indigo-400 font-bold border-l-4 border-indigo-500' : 'text-slate-300 hover:bg-slate-900'}`}
                  >
                    <QrCode className="w-4 h-4 shrink-0 text-indigo-400" />
                    <div>
                      <span className="block font-medium">UPI / QR Settle</span>
                      <span className="text-[9px] text-slate-500 font-light block">GPay, PhonePe, Paytm</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRzpMethod('card')}
                    className={`p-4 flex items-center gap-3 text-left transition-all cursor-pointer ${rzpMethod === 'card' ? 'bg-indigo-950/40 text-indigo-400 font-bold border-l-4 border-indigo-500' : 'text-slate-300 hover:bg-slate-900'}`}
                  >
                    <CreditCard className="w-4 h-4 shrink-0 text-indigo-400" />
                    <div>
                      <span className="block font-medium">Card Payment</span>
                      <span className="text-[9px] text-slate-500 font-light block">Visa, Mastercard, RuPay</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRzpMethod('netbanking')}
                    className={`p-4 flex items-center gap-3 text-left transition-all cursor-pointer ${rzpMethod === 'netbanking' ? 'bg-indigo-950/40 text-indigo-400 font-bold border-l-4 border-indigo-500' : 'text-slate-300 hover:bg-slate-900'}`}
                  >
                    <Building className="w-4 h-4 shrink-0 text-indigo-400" />
                    <div>
                      <span className="block font-medium">Netbanking</span>
                      <span className="text-[9px] text-slate-500 font-light block">All Indian Retail Banks</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRzpMethod('wallet')}
                    className={`p-4 flex items-center gap-3 text-left transition-all cursor-pointer ${rzpMethod === 'wallet' ? 'bg-indigo-950/40 text-indigo-400 font-bold border-l-4 border-indigo-500' : 'text-slate-300 hover:bg-slate-900'}`}
                  >
                    <Wallet className="w-4 h-4 shrink-0 text-indigo-400" />
                    <div>
                      <span className="block font-medium">Digital Wallet</span>
                      <span className="text-[9px] text-slate-500 font-light block">Paytm, Mobikwik</span>
                    </div>
                  </button>
                </div>

                {/* Details Form Pane (7 cols) */}
                <div className="md:col-span-7 p-6 bg-slate-900 flex flex-col justify-between text-xs space-y-4">
                  
                  {/* UPI Inputs */}
                  {rzpMethod === 'upi' && (
                    <div className="space-y-4">
                      <div className="bg-slate-950 p-3.5 rounded border border-slate-800 text-center space-y-2">
                        <span className="text-[9px] text-indigo-400 font-bold tracking-widest block uppercase">Simulated Instant QR Code</span>
                        <div className="inline-block bg-white p-2 rounded-lg">
                          <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=deeshop@ybl%26am=1.00%26cu=INR"
                            alt="Razorpay Test QR"
                            className="w-24 h-24"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          Scan to auto-fill the test sequence or specify your test UPI address below:
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-semibold uppercase">Enter VPA / UPI ID</label>
                        <input
                          type="text"
                          value={rzpUpiId}
                          onChange={(e) => setRzpUpiId(e.target.value)}
                          placeholder="e.g. customer@okhdfcbank"
                          className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Card Inputs */}
                  {rzpMethod === 'card' && (
                    <div className="space-y-3">
                      <span className="text-[9px] text-indigo-400 font-bold tracking-widest block uppercase">Credit or Debit Card Settle</span>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-semibold uppercase">Card Number</label>
                        <input
                          type="text"
                          value={rzpCardNumber}
                          onChange={(e) => setRzpCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-semibold uppercase">Expiry Date</label>
                          <input
                            type="text"
                            value={rzpCardExpiry}
                            onChange={(e) => setRzpCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 block font-semibold uppercase">CVV / CVC</label>
                          <input
                            type="password"
                            value={rzpCardCvv}
                            onChange={(e) => setRzpCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Netbanking Inputs */}
                  {rzpMethod === 'netbanking' && (
                    <div className="space-y-3">
                      <span className="text-[9px] text-indigo-400 font-bold tracking-widest block uppercase">Select Netbanking Provider</span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak', 'PNB'].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setRzpBank(b)}
                            className={`p-3 rounded border text-left transition-all ${rzpBank === b ? 'bg-indigo-950/40 border-indigo-500 text-indigo-400 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Wallet Inputs */}
                  {rzpMethod === 'wallet' && (
                    <div className="space-y-3">
                      <span className="text-[9px] text-indigo-400 font-bold tracking-widest block uppercase">Select Mobile Wallet</span>
                      
                      <div className="space-y-2">
                        {['Paytm Wallet', 'PhonePe Wallet', 'Mobikwik Balance', 'Amazon Pay'].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setRzpWallet(w)}
                            className={`w-full p-2.5 rounded border text-left flex justify-between items-center transition-all ${rzpWallet === w ? 'bg-indigo-950/40 border-indigo-500 text-indigo-400 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                          >
                            <span>{w}</span>
                            <span className="text-[10px] text-emerald-400">Pre-linked</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Bottom Pay Button */}
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <button
                      type="button"
                      onClick={handleRazorpayPaymentSimSubmit}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/20 text-xs uppercase tracking-wider"
                    >
                      <ShieldCheck className="w-4 h-4 text-white" />
                      <span>Pay securely {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(finalTotal)}</span>
                    </button>

                    <div className="flex items-center justify-center gap-4 text-[9px] text-slate-500 uppercase tracking-widest">
                      <span>✓ 100% SECURED</span>
                      <span>✓ DIRECT BANKING CHANNEL</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* PROCESSING LOADER STATE */}
            {rzpStep === 'processing' && (
              <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
                <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin" />
                <div className="space-y-1.5">
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider">Securing Direct Bank Transfer...</h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Exchanging token handshakes, checking VPA/Card credentials, and performing double HMAC security validation.
                  </p>
                </div>
              </div>
            )}

            {/* SUCCESS CONFIRMED STATE */}
            {rzpStep === 'success' && (
              <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px] bg-indigo-950/20">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-base uppercase tracking-widest">Payment Captured!</h4>
                  <p className="text-xs text-slate-300">
                    Razorpay Reference signature validated. Confirming delivery parameters...
                  </p>
                </div>
              </div>
            )}

            {/* LIVE CONSOLE LOG STREAM */}
            <div className="bg-slate-950 border-t border-slate-800 p-4 space-y-2">
              <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono tracking-widest border-b border-slate-900 pb-1.5">
                <span>GATEWAY SYSTEM TELEMETRY LOGGER</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  ONLINE
                </span>
              </div>
              <div className="font-mono text-[9px] space-y-1 max-h-[100px] overflow-y-auto text-indigo-300/80 scrollbar-thin">
                {rzpLogs.map((log, i) => (
                  <p key={i} className="leading-relaxed font-light break-all">{log}</p>
                ))}
              </div>
            </div>

            {/* Cancel Button */}
            <div className="bg-slate-950 px-4 py-3 flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-800">
              <span>Customer IP: 106.210.{Math.floor(10 + Math.random() * 89)}.{Math.floor(10 + Math.random() * 89)}</span>
              <button
                type="button"
                onClick={() => setShowRazorpaySim(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-semibold px-2 py-1 rounded bg-slate-900 hover:bg-slate-800"
              >
                Cancel Settle
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
