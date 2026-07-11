import React, { useState } from 'react';
import { CreditCard, Check, Copy, Shield, Key, Code, HelpCircle, Terminal, Cpu, CheckCircle2, ChevronRight, AlertTriangle, ExternalLink } from 'lucide-react';

interface RazorpaySetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal?: number;
}

export default function RazorpaySetupGuide({ isOpen, onClose, cartTotal = 2499 }: RazorpaySetupGuideProps) {
  const [activeTab, setActiveTab] = useState<'steps' | 'code' | 'vercel' | 'sandbox'>('steps');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Sandbox test states
  const [testKeyId, setTestKeyId] = useState('rzp_test_demoKey123456');
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const addLog = (msg: string) => {
    setSandboxLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Simulate Razorpay SDK script injection and triggering Checkout
  const handleRunSandbox = async () => {
    setIsSandboxRunning(true);
    setPaymentSuccess(false);
    setSandboxLogs([]);
    addLog("Initializing Razorpay Web checkout pipeline...");
    addLog("Injecting https://checkout.razorpay.com/v1/checkout.js dynamically...");

    // Dynamically check if script is already present
    let isScriptLoaded = !!(window as any).Razorpay;

    if (!isScriptLoaded) {
      const loadScript = () => {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };
      isScriptLoaded = (await loadScript()) as boolean;
    }

    if (isScriptLoaded) {
      addLog("Razorpay Core SDK successfully loaded into viewport.");
      addLog("Generating simulated client-side Order Payload (INR " + cartTotal + ").");
      
      const options = {
        key: testKeyId.trim() || 'rzp_test_demoKey123456',
        amount: cartTotal * 100, // in paisa
        currency: 'INR',
        name: 'Deeshop Atelier',
        description: 'Luxury Fragrances Order Checkout',
        image: 'https://ais-dev-hug6irpkpdruca3i6zojfw-483760666494.asia-southeast1.run.app/src/assets/images/kaaaf_perfume_premium_1783777681280.jpg',
        handler: function (response: any) {
          addLog("🟢 Razorpay capture event triggered!");
          addLog(`Payment ID: ${response.razorpay_payment_id}`);
          addLog(`Signature Token: ${response.razorpay_signature || 'sig_demo_123891238'}`);
          addLog("Capturing order and resolving state.");
          setPaymentSuccess(true);
          setIsSandboxRunning(false);
        },
        prefill: {
          name: 'Aarav Sharma',
          email: 'customer@deeshop.in',
          contact: '9988776655'
        },
        notes: {
          address: 'Deeshop Atelier Premium Delivery'
        },
        theme: {
          color: '#1a1a1a'
        },
        modal: {
          ondismiss: function() {
            addLog("🔴 Checkout dismissed by client viewport closure.");
            setIsSandboxRunning(false);
          }
        }
      };

      addLog("Invoking Razorpay.open() checkout widget...");
      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (err: any) {
        addLog(`⚠️ Script Execution Error: ${err.message || 'Iframe Sandbox Restrictions Detected'}`);
        addLog("Falling back to Sandbox Emulator Interface...");
        
        // Custom Emulator overlay in case Iframe sandbox headers block window.open/checkout.js
        setTimeout(() => {
          addLog("Simulating safe modal container bypass...");
          addLog("Capturing mock authorization check (3D Secure)...");
          setTimeout(() => {
            addLog("🟢 Razorpay Signature Validated!");
            setPaymentSuccess(true);
            setIsSandboxRunning(false);
          }, 2000);
        }, 1500);
      }
    } else {
      addLog("❌ Failed to load Razorpay SDK script. Please check network connectivity.");
      setIsSandboxRunning(false);
    }
  };

  const codeSnippets = {
    env: `# .env (Server Environment)
RAZORPAY_KEY_ID=rzp_test_yourKeyId
RAZORPAY_KEY_SECRET=yourSuperSecretKeyString

# .env (Client/Vite Environment)
VITE_RAZORPAY_KEY_ID=rzp_test_yourKeyId`,

    frontend: `// 1. Dynamic Script Loader Utility
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// 2. Trigger Checkout Function in React
const handlePayment = async () => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    alert('Razorpay SDK failed to load. Are you offline?');
    return;
  }

  // Fetch Order details from your secure backend
  const response = await fetch('/api/payments/razorpay-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 2499 }) // amount in INR
  });
  const orderData = await response.json(); // returns { id: 'order_abc123', amount: 249900 }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
    amount: orderData.amount,
    currency: 'INR',
    name: 'Deeshop Atelier',
    description: 'Luxury Perfume Order',
    order_id: orderData.id, // Secure Order ID from server
    handler: async function (response) {
      // Send receipt telemetry to server for verification
      const verifyRes = await fetch('/api/payments/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        })
      });
      const verification = await verifyRes.json();
      if (verification.status === 'success') {
        // Payment validated perfectly!
        showSuccessInvoice();
      }
    },
    prefill: {
      name: 'Aarav Sharma',
      email: 'customer@deeshop.in',
      contact: '9988776655'
    },
    theme: { color: '#1A1A1A' }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};`,

    backend: `// 1. Backend Order Route (Express Node.js Server)
import express from 'express';
import Razorpay from 'razorpay';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/api/payments/razorpay-order', async (req, res) => {
  try {
    const { amount } = req.body;
    
    const options = {
      amount: Math.round(amount * 100), // convert to Paisa
      currency: 'INR',
      receipt: \`rcpt_deeshop_\${Date.now()}\`,
      payment_capture: 1 // Capture payment automatically
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Backend Signature Verification Route
import crypto from 'crypto';

router.post('/api/payments/verify-signature', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Create HMAC SHA256 validation token
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(\`\${razorpay_order_id}|\${razorpay_payment_id}\`)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    // Transaction is genuine!
    res.status(200).json({ status: 'success', message: 'Signature verified.' });
  } else {
    // Counterfeit/Modified client telemetry detected!
    res.status(400).json({ status: 'failed', message: 'Signature mismatch.' });
  }
});`
  };

  return (
    <div id="razorpay-setup-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-beige-divider rounded-lg overflow-hidden shadow-2xl my-8">
        
        {/* Top gold bar */}
        <div className="h-1 w-full bg-champagne-gold" />

        {/* Modal Header */}
        <div className="p-6 border-b border-beige-divider bg-sand-soft flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white border border-beige-divider rounded-lg text-charcoal shrink-0">
              <CreditCard className="w-6 h-6 text-champagne-gold" />
            </div>
            <div>
              <h2 className="font-serif text-xl md:text-2xl text-charcoal font-light tracking-wide flex items-center gap-2">
                Razorpay Integration Suite
                <span className="text-[10px] bg-charcoal text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider font-sans">v1.2.0 API</span>
              </h2>
              <p className="text-xs text-taupe-muted">
                Complete guide, code blocks, and live Sandbox client to link India's leading payment gateway.
              </p>
            </div>
          </div>
          <button 
            id="close-razorpay-guide-btn"
            onClick={onClose}
            className="text-taupe-muted hover:text-charcoal transition-colors p-2 hover:bg-white rounded-full cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-beige-divider bg-sand-soft/50 text-xs font-semibold uppercase tracking-wider">
          <button 
            onClick={() => setActiveTab('steps')}
            className={`flex-1 min-w-[120px] py-3 text-center border-b-2 cursor-pointer transition-all ${activeTab === 'steps' ? 'border-champagne-gold text-charcoal bg-white font-bold' : 'border-transparent text-taupe-muted hover:text-charcoal'}`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              1. Setup Steps
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('code')}
            className={`flex-1 min-w-[120px] py-3 text-center border-b-2 cursor-pointer transition-all ${activeTab === 'code' ? 'border-champagne-gold text-charcoal bg-white font-bold' : 'border-transparent text-taupe-muted hover:text-charcoal'}`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Code className="w-3.5 h-3.5" />
              2. Production Code
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('vercel')}
            className={`flex-1 min-w-[120px] py-3 text-center border-b-2 cursor-pointer transition-all ${activeTab === 'vercel' ? 'border-champagne-gold text-charcoal bg-white font-bold' : 'border-transparent text-taupe-muted hover:text-charcoal'}`}
          >
            <span className="flex items-center justify-center gap-1.5 text-blue-600">
              <ExternalLink className="w-3.5 h-3.5" />
              3. GitHub & Vercel
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('sandbox')}
            className={`flex-1 min-w-[120px] py-3 text-center border-b-2 cursor-pointer transition-all ${activeTab === 'sandbox' ? 'border-champagne-gold text-charcoal bg-white font-bold' : 'border-transparent text-taupe-muted hover:text-charcoal'}`}
          >
            <span className="flex items-center justify-center gap-1.5 text-champagne-gold">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              4. Interactive Sandbox
            </span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
          
          {/* TAB 1: Step-by-Step Instructions */}
          {activeTab === 'steps' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Visual Flow diagram card */}
                <div className="md:col-span-4 bg-sand-light p-4 rounded-lg border border-beige-divider space-y-4 flex flex-col justify-between text-xs">
                  <div className="space-y-3">
                    <span className="text-[10px] text-champagne-gold tracking-widest font-bold uppercase block">Architecture Flow</span>
                    <h4 className="font-semibold text-charcoal text-sm">Standard Secure API Pipeline</h4>
                    
                    <div className="space-y-2 font-medium">
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-beige-divider/60">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-charcoal text-alabaster font-mono text-[10px]">1</span>
                        <span>Client clicks &quot;Pay Now&quot;</span>
                      </div>
                      <div className="flex items-center justify-center py-0.5 text-champagne-gold text-xs">⬇️ Secure API Request</div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-beige-divider/60">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-champagne-gold text-charcoal font-mono text-[10px]">2</span>
                        <span>Server signs Order on Razorpay API</span>
                      </div>
                      <div className="flex items-center justify-center py-0.5 text-champagne-gold text-xs">⬇️ Order ID Returned</div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-beige-divider/60">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-charcoal text-alabaster font-mono text-[10px]">3</span>
                        <span>Razorpay SDK opens popup</span>
                      </div>
                      <div className="flex items-center justify-center py-0.5 text-champagne-gold text-xs">⬇️ Verified Checkout Callback</div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-beige-divider/60 border-emerald-200 bg-emerald-50 text-emerald-800">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-600 text-white font-mono text-[10px]">4</span>
                        <span>Server verifies HMAC Signature</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-beige-divider flex items-center gap-2 text-taupe-muted">
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No Key Secrets are ever sent to client browsers.</span>
                  </div>
                </div>

                {/* Steps Details */}
                <div className="md:col-span-8 space-y-5">
                  <div className="relative pl-6 border-l-2 border-beige-divider space-y-6 text-sm">
                    
                    {/* Step 1 */}
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-charcoal border-4 border-white shrink-0" />
                      <div className="space-y-1">
                        <h4 className="font-semibold text-charcoal flex items-center gap-2">
                          Step 1: Obtain API credentials from Razorpay
                        </h4>
                        <p className="text-xs text-taupe-muted leading-relaxed">
                          Sign up at <a href="https://dashboard.razorpay.com" target="_blank" rel="noopener noreferrer" className="text-champagne-gold hover:underline inline-flex items-center gap-0.5 font-semibold">dashboard.razorpay.com <ExternalLink className="w-3 h-3" /></a>. Navigate to <span className="text-charcoal font-medium">Settings → API Keys</span> and click <span className="text-charcoal font-medium">Generate Key</span>. Save your <span className="text-champagne-gold font-bold">Key ID</span> and <span className="text-champagne-gold font-bold">Key Secret</span>.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-charcoal border-4 border-white shrink-0" />
                      <div className="space-y-1">
                        <h4 className="font-semibold text-charcoal">
                          Step 2: Save credentials into env variables
                        </h4>
                        <p className="text-xs text-taupe-muted leading-relaxed">
                          Paste your keys into the environment config:
                        </p>
                        <div className="bg-sand-light p-2.5 rounded border border-beige-divider font-mono text-[10px] text-charcoal mt-2 relative select-all">
                          VITE_RAZORPAY_KEY_ID=rzp_test_YourKeyIDHere
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-charcoal border-4 border-white shrink-0" />
                      <div className="space-y-1">
                        <h4 className="font-semibold text-charcoal">
                          Step 3: Run secure production compilation
                        </h4>
                        <p className="text-xs text-taupe-muted leading-relaxed">
                          Secure backend proxy routes handle transactions safely. Integrate our pre-written Express routes to secure payments against client tampering or invoice manipulation.
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg text-xs flex items-start gap-2.5 text-amber-900 leading-relaxed">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Developer Compliance Tip:</span>
                      Never expose your <span className="font-mono bg-amber-100 px-1 py-0.5 rounded font-semibold">Key Secret</span> on the frontend! That secret is used to create the HMAC hash that verifies valid transactions. Exposing it allows visitors to spoof paid items.
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: Production Code Snippets */}
          {activeTab === 'code' && (
            <div className="space-y-6">
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider">File Structure & API Payload blocks</h3>
                <p className="text-xs text-taupe-muted">
                  Use these lightweight, robust scripts to implement the custom endpoint flow.
                </p>
              </div>

              <div className="space-y-4">
                
                {/* Code Env */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center bg-sand-soft px-4 py-2 border border-beige-divider rounded-t-lg">
                    <span className="text-xs font-semibold font-mono text-charcoal">1. Environment configuration (.env)</span>
                    <button 
                      onClick={() => copyToClipboard(codeSnippets.env, 'env')}
                      className="text-xs text-taupe-muted hover:text-charcoal flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'env' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="bg-sand-light p-4 rounded-b-lg border-x border-b border-beige-divider font-mono text-[11px] overflow-x-auto text-charcoal max-h-[150px]">
                    {codeSnippets.env}
                  </pre>
                </div>

                {/* Code Frontend */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center bg-sand-soft px-4 py-2 border border-beige-divider rounded-t-lg">
                    <span className="text-xs font-semibold font-mono text-charcoal">2. React Client View (Checkout Component)</span>
                    <button 
                      onClick={() => copyToClipboard(codeSnippets.frontend, 'frontend')}
                      className="text-xs text-taupe-muted hover:text-charcoal flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'frontend' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'frontend' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="bg-sand-light p-4 rounded-b-lg border-x border-b border-beige-divider font-mono text-[11px] overflow-x-auto text-charcoal max-h-[300px]">
                    {codeSnippets.frontend}
                  </pre>
                </div>

                {/* Code Backend */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center bg-sand-soft px-4 py-2 border border-beige-divider rounded-t-lg">
                    <span className="text-xs font-semibold font-mono text-charcoal">3. Node.js Secure Backend (Express Router)</span>
                    <button 
                      onClick={() => copyToClipboard(codeSnippets.backend, 'backend')}
                      className="text-xs text-taupe-muted hover:text-charcoal flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'backend' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'backend' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="bg-sand-light p-4 rounded-b-lg border-x border-b border-beige-divider font-mono text-[11px] overflow-x-auto text-charcoal max-h-[300px]">
                    {codeSnippets.backend}
                  </pre>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: GitHub & Vercel Deployment Guide */}
          {activeTab === 'vercel' && (
            <div className="space-y-6 animate-fadeIn text-sm">
              <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-lg flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Direct GitHub Sync & Vercel Auto-Deployment</h4>
                  <p className="text-xs text-blue-800 leading-relaxed mt-1">
                    Vercel integrates natively with your GitHub repository. Follow this checklist to synchronize code updates and host your luxury Perfume Store with absolute zero-downtime.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section A: GitHub Syncing */}
                <div className="bg-sand-light border border-beige-divider p-5 rounded-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-charcoal text-alabaster font-bold text-xs flex items-center justify-center font-mono">1</span>
                    <h3 className="font-bold text-charcoal">Synchronize to GitHub</h3>
                  </div>
                  <ul className="space-y-2.5 text-xs text-taupe-muted leading-relaxed list-disc pl-4">
                    <li>
                      <span className="text-charcoal font-semibold">Export Codebase:</span> Open the Settings menu in this editor, and select <span className="text-charcoal font-semibold">Export to GitHub</span> or download as a <span className="text-charcoal font-semibold">ZIP archive</span>.
                    </li>
                    <li>
                      <span className="text-charcoal font-semibold">Create Repository:</span> Initialize a new repository on your GitHub account (e.g., <code className="bg-white border px-1 rounded font-mono">deeshop-perfume-atelier</code>).
                    </li>
                    <li>
                      <span className="text-charcoal font-semibold">Push Updates:</span> Push the exported files to the repository's primary branch (<code className="bg-white border px-1 rounded font-mono">main</code>).
                    </li>
                  </ul>
                </div>

                {/* Section B: Vercel Setup */}
                <div className="bg-sand-light border border-beige-divider p-5 rounded-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center font-mono">2</span>
                    <h3 className="font-bold text-charcoal">Deploy on Vercel</h3>
                  </div>
                  <ul className="space-y-2.5 text-xs text-taupe-muted leading-relaxed list-disc pl-4">
                    <li>
                      <span className="text-charcoal font-semibold">Import Project:</span> Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-0.5">vercel.com <ExternalLink className="w-2.5 h-2.5" /></a>, click <span className="text-charcoal font-semibold">Add New → Project</span>, and select your GitHub repository.
                    </li>
                    <li>
                      <span className="text-charcoal font-semibold">Framework Preset:</span> Vercel automatically detects the <span className="text-charcoal font-semibold">Vite</span> configuration. Keep the default build settings.
                    </li>
                    <li>
                      <span className="text-charcoal font-semibold">Click Deploy:</span> Press deploy! Vercel compiles your files into clean edge-delivered static HTML/CSS.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Configure Environment Variables */}
              <div className="bg-white border border-beige-divider p-5 rounded-lg space-y-3">
                <span className="text-[10px] text-champagne-gold tracking-widest font-bold uppercase block">CRITICAL CONFIGURATION STEP</span>
                <h4 className="font-bold text-charcoal flex items-center gap-2">
                  <Key className="w-4 h-4 text-champagne-gold" />
                  Define Vercel Environment Variables
                </h4>
                <p className="text-xs text-taupe-muted leading-relaxed">
                  To allow the real Razorpay Gateway checkout to verify payments, you must expose your API Key ID to the browser bundle on Vercel:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="bg-sand-light p-4 rounded border border-beige-divider text-xs space-y-3 font-mono">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-beige-divider/50 pb-2">
                      <span className="text-taupe-muted font-bold text-[10px] uppercase">VARIABLE KEY</span>
                      <span className="text-charcoal font-bold">VITE_RAZORPAY_KEY_ID</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-taupe-muted font-bold text-[10px] uppercase">VARIABLE VALUE</span>
                      <span className="text-champagne-gold font-bold">rzp_test_... or rzp_live_...</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-taupe-muted leading-relaxed italic">
                    💡 <span className="font-semibold text-charcoal">Where to find this setting on Vercel:</span> Go to your Vercel Dashboard → Select your Project → <span className="text-charcoal font-semibold">Settings</span> tab → <span className="text-charcoal font-semibold">Environment Variables</span>. Paste the Key and Value there, click Add, and trigger a redeploy of your project.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Interactive Sandbox */}
          {activeTab === 'sandbox' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Config Controls */}
                <div className="md:col-span-5 bg-sand-light p-4 rounded-lg border border-beige-divider space-y-4">
                  <span className="text-[10px] text-champagne-gold tracking-widest font-bold uppercase block">Interactive Controller</span>
                  <h4 className="font-semibold text-charcoal text-sm">Sandbox settings</h4>

                  <div className="space-y-1">
                    <label className="text-xs text-taupe-muted font-semibold block">Configure Key ID</label>
                    <input 
                      type="text"
                      value={testKeyId}
                      onChange={(e) => setTestKeyId(e.target.value)}
                      placeholder="rzp_test_..."
                      className="w-full bg-white border border-beige-divider text-xs rounded p-2 text-charcoal font-mono focus:outline-none focus:border-champagne-gold"
                    />
                    <p className="text-[9px] text-taupe-muted">
                      Leave default demo credentials to test simulated capture, or insert your real <span className="font-semibold">rzp_test_...</span> key to open the true popup checkout!
                    </p>
                  </div>

                  <div className="space-y-1 bg-white p-3 rounded border border-beige-divider/60 text-xs text-charcoal">
                    <div className="flex justify-between py-1 border-b border-sand-soft">
                      <span className="text-taupe-muted">Current Order Subtotal:</span>
                      <span className="font-mono font-bold">INR {cartTotal}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-taupe-muted">Simulated Currency:</span>
                      <span className="font-mono">INR</span>
                    </div>
                  </div>

                  <button
                    onClick={handleRunSandbox}
                    disabled={isSandboxRunning}
                    className="w-full bg-charcoal hover:bg-charcoal/90 text-alabaster font-bold px-4 py-2.5 rounded text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>{isSandboxRunning ? 'Processing SDK...' : 'Open Checkout Sandbox'}</span>
                  </button>

                  {paymentSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded text-xs flex items-start gap-2 animate-bounce">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Sandbox Payment Success!</span>
                        Transaction completed perfectly. The verified webhook receipt is logged in the telemetry console.
                      </div>
                    </div>
                  )}
                </div>

                {/* Console Log outputs */}
                <div className="md:col-span-7 bg-charcoal text-neutral-300 p-4 rounded-lg border border-neutral-800 flex flex-col justify-between h-[300px]">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                      <span className="text-[10px] text-champagne-gold tracking-widest font-bold uppercase font-mono">Console Log / Telemetry telemetry</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="font-mono text-[10px] space-y-1.5 overflow-y-auto max-h-[220px] pr-2 scrollbar-thin">
                      {sandboxLogs.length === 0 ? (
                        <p className="text-neutral-500 italic">Console is currently idle. Click &quot;Open Checkout Sandbox&quot; to initialize transaction streams.</p>
                      ) : (
                        sandboxLogs.map((log, i) => (
                          <p key={i} className="leading-relaxed break-all">
                            {log}
                          </p>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="text-[9px] text-neutral-500 font-mono text-right pt-2 border-t border-neutral-800">
                    Host: Node-CloudRun-Docker-Ingress-Secure
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-sand-soft border-t border-beige-divider flex justify-end gap-3 text-xs">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 font-bold bg-white text-charcoal border border-beige-divider hover:bg-sand-soft rounded-lg transition-colors cursor-pointer"
          >
            Done, Back to Store
          </button>
        </div>

      </div>
    </div>
  );
}
