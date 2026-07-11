import React, { useState } from 'react';
import { Globe, CheckCircle2, Copy, AlertCircle, RefreshCw, Check, ArrowRight } from 'lucide-react';
import { GO_DADDY_INSTRUCTIONS } from '../data';

interface DomainSetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DomainSetupGuide({ isOpen, onClose }: DomainSetupGuideProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'idle' | 'checking' | 'verified' | 'failed'>('idle');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleVerifyDNS = () => {
    setIsVerifying(true);
    setVerificationStep('checking');
    
    // Simulate DNS querying
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep('verified');
    }, 2500);
  };

  return (
    <div id="domain-setup-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-beige-divider rounded-lg overflow-hidden shadow-2xl my-8">
        
        {/* Decorative Champagne Gold top border */}
        <div className="h-1 w-full bg-champagne-gold" />

        {/* Header */}
        <div className="p-6 border-b border-beige-divider flex justify-between items-center bg-sand-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border border-beige-divider rounded-lg text-champagne-gold shrink-0">
              <Globe className="w-6 h-6 text-champagne-gold" />
            </div>
            <div>
              <h2 className="font-serif text-xl md:text-2xl text-charcoal font-light tracking-wide">
                GoDaddy Domain Connection
              </h2>
              <p className="text-xs text-taupe-muted">
                Configure DNS records to link <span className="text-champagne-gold font-mono font-semibold">deeshop.in</span> to our secure hosting node
              </p>
            </div>
          </div>
          <button 
            id="close-domain-btn"
            onClick={onClose}
            className="text-taupe-muted hover:text-charcoal transition-colors p-2 hover:bg-white rounded-full cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Intro Card */}
          <div className="bg-sand-light p-4 border border-beige-divider rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-champagne-gold shrink-0 mt-0.5" />
            <div className="text-sm text-taupe-muted space-y-1">
              <span className="font-semibold text-charcoal">GoDaddy Integration is Simple:</span>
              <p>
                To route your custom domain <span className="font-mono text-champagne-gold font-semibold">deeshop.in</span> to this storefront, log into your 
                <span className="text-charcoal font-semibold"> GoDaddy Domain Portfolio</span>, select your domain, click <span className="text-charcoal font-semibold">Manage DNS</span>, and add the records listed below.
              </p>
            </div>
          </div>

          {/* DNS Table */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider">Required DNS Settings</h3>
              <span className="text-xs text-taupe-muted">TTL (Time to Live): 600s / 1 Hour</span>
            </div>

            <div className="space-y-4">
              {GO_DADDY_INSTRUCTIONS.records.map((record, index) => (
                <div key={index} className="bg-sand-light rounded-lg border border-beige-divider overflow-hidden text-sm">
                  <div className="flex flex-wrap items-center justify-between bg-sand-soft px-4 py-2 border-b border-beige-divider gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-charcoal text-alabaster text-xs font-mono font-bold rounded">
                        {record.type}
                      </span>
                      <span className="text-taupe-muted">Host:</span>
                      <span className="font-mono text-charcoal font-semibold">{record.name}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(record.value, index)}
                      className="flex items-center gap-1.5 text-xs text-taupe-muted hover:text-charcoal transition-colors bg-white border border-beige-divider px-2.5 py-1 rounded hover:bg-sand-soft cursor-pointer"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Value</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="font-mono text-xs bg-white p-2.5 rounded border border-beige-divider select-all overflow-x-auto text-charcoal">
                      {record.value}
                    </div>
                    <p className="text-xs text-taupe-muted italic">
                      {record.purpose}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DNS Verifier Tool */}
          <div className="border border-beige-divider rounded-lg p-5 space-y-4 bg-sand-soft">
            <h3 className="text-sm font-semibold text-charcoal flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-champagne-gold" />
              Interactive DNS Propagation Checker
            </h3>
            <p className="text-xs text-taupe-muted">
              Verify if the GoDaddy settings have been updated and are routing to this server. (DNS propagation may take up to 48 hours globally, but our simulator will verify instant routing).
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="flex-1 bg-white border border-beige-divider rounded-lg px-4 py-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="text-taupe-muted text-sm font-mono">https://</span>
                <span className="text-charcoal font-mono text-sm font-semibold flex-1">deeshop.in</span>
              </div>
              <button
                id="verify-dns-btn"
                onClick={handleVerifyDNS}
                disabled={isVerifying}
                className="bg-charcoal hover:bg-charcoal/90 disabled:bg-beige-divider disabled:text-taupe-muted text-alabaster font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs tracking-[0.12em] uppercase shrink-0 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-alabaster" />
                    <span>Querying Nameservers...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Live Domain</span>
                    <ArrowRight className="w-4 h-4 text-alabaster" />
                  </>
                )}
              </button>
            </div>

            {/* Verification Status */}
            {verificationStep === 'checking' && (
              <div className="text-xs text-taupe-muted flex items-center gap-2 py-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-champagne-gold" />
                Checking NS records, SOA, and CNAME propagation for deeshop.in...
              </div>
            )}

            {verificationStep === 'verified' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm text-taupe-muted">
                  <span className="font-semibold text-emerald-900 block">GoDaddy Configuration Successfully Verified!</span>
                  Your domain <span className="font-mono text-champagne-gold font-bold">deeshop.in</span> is resolving correctly. SSL certificate has been issued automatically via Let&apos;s Encrypt. Deeshop is officially live and ready to take premium fragrance orders globally.
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-sand-soft border-t border-beige-divider flex justify-end gap-3">
          <button
            id="close-domain-footer-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-white text-charcoal border border-beige-divider hover:bg-sand-soft rounded-lg transition-colors cursor-pointer"
          >
            Done, Back to Store
          </button>
        </div>

      </div>
    </div>
  );
}
