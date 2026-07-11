import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ContactMessage } from '../types';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');
  const [sentMessage, setSentMessage] = useState<ContactMessage | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      const newMessage: ContactMessage = {
        name,
        email,
        phone,
        message,
        date: new Date().toLocaleDateString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      };
      
      setSentMessage(newMessage);
      setIsSubmitting(false);
      setSubmitStatus('success');

      // Clear fields
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1500);
  };

  return (
    <section id="contact-section" className="py-20 bg-alabaster border-t border-beige-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Block: Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] text-champagne-gold font-bold uppercase tracking-[0.2em] block">
                Direct Atelier Channels
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-light tracking-wide">
                Get in Touch
              </h2>
              <p className="text-xs sm:text-sm text-taupe-muted leading-relaxed font-sans">
                Do you have a question regarding olfactory concentrations, GoDaddy domain routing, or corporate wholesale ordering for <span className="text-charcoal font-semibold">deeshop.in</span>? Contact our customer care agents directly or drop a secure message.
              </p>
            </div>

            {/* Structured contact channels */}
            <div className="space-y-6">
              
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-sand-soft border border-beige-divider rounded-lg text-champagne-gold shrink-0">
                  <Mail className="w-5 h-5 text-champagne-gold" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-taupe-muted">Electronic Mail</h4>
                  <p className="text-sm font-semibold text-charcoal">support@deeshop.in</p>
                  <p className="text-[11px] text-taupe-muted/80">Replies within 4 hours, guaranteed.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-sand-soft border border-beige-divider rounded-lg text-champagne-gold shrink-0">
                  <Phone className="w-5 h-5 text-champagne-gold" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-taupe-muted">Atelier Hotline</h4>
                  <p className="text-sm font-semibold text-charcoal">+91 98765 43210</p>
                  <p className="text-[11px] text-taupe-muted/80">Available Mon - Sat (10:00 AM - 7:00 PM IST).</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-sand-soft border border-beige-divider rounded-lg text-champagne-gold shrink-0">
                  <MapPin className="w-5 h-5 text-champagne-gold" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-taupe-muted">Atelier Office</h4>
                  <p className="text-sm font-semibold text-charcoal">deeshop.in Atelier Office</p>
                  <p className="text-[11px] text-taupe-muted">Connaught Place, New Delhi, Delhi - 110001, India.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Block: Secure Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-beige-divider p-6 sm:p-8 rounded-lg shadow-sm space-y-6">
            
            <div className="border-b border-beige-divider pb-4">
              <span className="text-[9px] text-champagne-gold bg-sand-soft px-2.5 py-1 rounded font-bold uppercase tracking-wider border border-beige-divider">Secured via TLS</span>
              <h3 className="font-serif text-lg text-charcoal font-medium mt-2">Atelier Inquiry Portal</h3>
            </div>

            {submitStatus === 'idle' ? (
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-taupe-muted block font-medium">Your Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Kabir Sen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-sand-light border border-beige-divider rounded-md px-3.5 py-2 text-sm text-charcoal focus:outline-none focus:border-champagne-gold transition-colors placeholder:text-taupe-muted/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-taupe-muted block font-medium">Email Address *</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="e.g. kabir@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-sand-light border border-beige-divider rounded-md px-3.5 py-2 text-sm text-charcoal focus:outline-none focus:border-champagne-gold transition-colors placeholder:text-taupe-muted/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-taupe-muted block font-medium">Phone Number (Optional)</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="10-digit number"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-sand-light border border-beige-divider rounded-md px-3.5 py-2 text-sm text-charcoal focus:outline-none focus:border-champagne-gold transition-colors font-mono placeholder:text-taupe-muted/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-taupe-muted block font-medium">Your Message *</label>
                  <textarea
                    id="contact-message"
                    required
                    placeholder="Tell us what you are looking for..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-sand-light border border-beige-divider rounded-md px-3.5 py-2 text-sm text-charcoal focus:outline-none focus:border-champagne-gold transition-colors resize-none placeholder:text-taupe-muted/50"
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-charcoal hover:bg-charcoal/90 disabled:bg-beige-divider disabled:text-taupe-muted text-alabaster font-bold py-3.5 px-4 rounded-lg text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-alabaster border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-alabaster" />
                      <span>Transmit Inquiry</span>
                    </>
                  )}
                </button>

              </form>
            ) : (
              <div className="space-y-5 py-4">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-800">
                    <span className="font-semibold text-emerald-900 text-sm block">Message Successfully Transmitted!</span>
                    Your inquiry has been relayed to <span className="font-mono text-champagne-gold font-bold">support@deeshop.in</span> via our secure SMTP gateway. An automated responder ticket has been registered.
                  </div>
                </div>

                {/* Simulated Auto-Responder Ticket display */}
                {sentMessage && (
                  <div className="bg-sand-light rounded-lg border border-beige-divider p-4 text-xs space-y-3 font-mono text-charcoal">
                    <div className="flex justify-between border-b border-beige-divider pb-2 text-[10px] text-taupe-muted font-bold uppercase">
                      <span>Server Auto-Responder Response Log</span>
                      <span>{sentMessage.date}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <p><span className="text-taupe-muted">Ticket ID:</span> <span className="text-champagne-gold font-bold">#DEE-TKT-{Math.floor(1000 + Math.random() * 9000)}</span></p>
                      <p><span className="text-taupe-muted">Recipient Name:</span> {sentMessage.name}</p>
                      <p><span className="text-taupe-muted">Recipient Email:</span> {sentMessage.email}</p>
                    </div>

                    <div className="bg-white p-3 rounded border border-beige-divider text-[11px] leading-relaxed text-charcoal/90">
                      &quot;Greetings, {sentMessage.name}. Thank you for contacting deeshop.in. Your inquiry concerning our premium fragrances has been prioritized. A specialist from our Connaught Place Atelier will contact you via email shortly.&quot;
                    </div>

                    <button
                      onClick={() => setSubmitStatus('idle')}
                      className="text-[10px] text-champagne-gold hover:text-charcoal font-bold uppercase tracking-[0.12em] block hover:underline cursor-pointer"
                    >
                      ← Submit another inquiry
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-taupe-muted pt-2 border-t border-beige-divider">
              <ShieldCheck className="w-4 h-4 text-champagne-gold" />
              <span>Double-encrypted 256-Bit SSL connection</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
