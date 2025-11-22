'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Check, Copy, Github, Link as LinkIcon, Linkedin, Loader2, ShieldCheck, Twitter, Zap } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [shortId, setShortId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateId = () => Math.random().toString(36).substring(2, 8);

  const handleShorten = async () => {
    if (!longUrl) return;
    if (!longUrl.startsWith('http')) {
      alert('Please enter a valid URL (start with http:// or https://)');
      return;
    }

    setLoading(true);
    const newId = generateId();

    try {
      await setDoc(doc(db, 'links', newId), {
        originalUrl: longUrl,
        shortId: newId,
        views: 0,
        createdAt: serverTimestamp(),
        userId: 'guest',
      });

      setShortId(newId);
      setLoading(false);
    } catch (error) {
      console.error("Error creating link:", error);
      alert("Something went wrong. Check your console.");
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const fullUrl = `${window.location.origin}/${shortId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      
      {/* --- Header --- */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <LinkIcon className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight">LinkEarner</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Login
            </Link>
            <Link 
              href="/signup" 
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="pt-24 pb-12 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Professional Link Shortener
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Shorten Links. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Track Everything.
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A powerful, free URL shortener for creators. Manage your links and view detailed analytics on every click.
            </p>

            {/* --- Shortener Box --- */}
            <div className="mt-10 max-w-xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              
              <div className="relative bg-white p-2 rounded-xl shadow-xl border border-slate-100">
                {!shortId ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      placeholder="Paste your long link here (https://...)" 
                      className="flex-1 px-4 py-3 outline-none text-slate-700 placeholder:text-slate-400 bg-transparent"
                    />
                    <button 
                      onClick={handleShorten}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Shorten <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2">
                    <div className="flex flex-col text-left px-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Short Link</span>
                      <a href={`${window.location.origin}/${shortId}`} target="_blank" className="text-lg font-bold text-blue-600 hover:underline truncate max-w-[250px]">
                        {window.location.origin}/{shortId}
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      <button 
                        onClick={() => { setShortId(''); setLongUrl(''); }}
                        className="text-slate-400 hover:text-slate-600 px-3 py-2"
                      >
                        New
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Why use LinkEarner?</h2>
              <p className="text-slate-500 mt-2">Everything you need to manage your links effectively.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Zap className="w-6 h-6 text-amber-500" />}
                title="Lightning Fast"
                desc="Our optimized redirect engine ensures your users get to their destination instantly without unnecessary delays."
              />
              <FeatureCard 
                icon={<ShieldCheck className="w-6 h-6 text-green-500" />}
                title="Secure Links"
                desc="All links are scanned for safety to ensure a secure browsing experience for your audience."
              />
              <FeatureCard 
                icon={<BarChart3 className="w-6 h-6 text-purple-500" />}
                title="Detailed Analytics"
                desc="Track your views in real-time from your dashboard. Know exactly how your content is performing."
              />
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 text-white mb-4">
                <LinkIcon className="w-6 h-6 text-blue-500" />
                <span className="font-bold text-xl tracking-tight">LinkEarner</span>
              </div>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                The most reliable tool for creators to shorten links, track analytics, and manage their online presence efficiently.
              </p>
            </div>

            {/* Links Column 1 */}
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Analytics</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Integrations</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>

            {/* Links Column 2 */}
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} LinkEarner. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}