'use client';

import { useEffect, useState, use } from 'react';
import { doc, getDoc, increment, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Lightbulb, Loader2, ShieldCheck, Timer } from 'lucide-react';
import Script from 'next/script';

// --- YOUR CONFIGURATION ---
const ADSENSE_PUB_ID = "ca-pub-1991660235760053"; // Your Real ID

// Simple list of facts to satisfy "Content" requirements
const FACTS = [
  "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.",
  "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.",
  "Octopuses have three hearts. Two pump blood to the gills, and one pumps it to the rest of the body.",
  "Bananas are curved because they grow towards the sun.",
  "A group of flamingos is called a 'flamboyance'.",
  "Wombat poop is cube-shaped.",
  "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion."
];

export default function RedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(10);
  const [destination, setDestination] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [fact, setFact] = useState('');

  useEffect(() => {
    // Pick a random fact on load
    setFact(FACTS[Math.floor(Math.random() * FACTS.length)]);

    const fetchLink = async () => {
      if (!slug) return;
      try {
        const docRef = doc(db, 'links', slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDestination(docSnap.data().originalUrl);
          // Increment view count safely
          updateDoc(docRef, { views: increment(1) }).catch(console.error);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [slug]);

  // Countdown Logic
  useEffect(() => {
    if (!loading && destination && timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [loading, destination, timer]);

  const handleRedirect = () => {
    if (destination) window.location.href = destination;
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-red-50 text-center p-4">
        <h1 className="text-4xl font-bold text-red-600 mb-2">404</h1>
        <p className="text-slate-700 text-lg">Link not found or has expired.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center pt-6 px-4">
      {/* Global AdSense Script */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      
      {/* 1. TOP BANNER (Your Unit: 3349117440) */}
      <div className="w-full max-w-4xl min-h-[100px] bg-white rounded-lg mb-6 overflow-hidden shadow-sm flex justify-center items-center">
        <AdUnit 
          slotId="3349117440" 
          format="auto" 
          responsive={true}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full">
        
        {/* MAIN CONTENT COLUMN */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Timer Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            
            <h1 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-center gap-2">
              <ShieldCheck className="text-green-500 w-5 h-5" /> Secure Link
            </h1>

            {timer > 0 ? (
              <div className="bg-slate-50 rounded-xl p-6 mb-4">
                 <div className="text-4xl font-mono font-bold text-blue-600 mb-2">{timer}</div>
                 <p className="text-xs text-slate-400 uppercase tracking-widest">Seconds Remaining</p>
              </div>
            ) : (
              <button 
                onClick={handleRedirect}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg shadow-green-600/20 transition-all animate-bounce"
              >
                Go to Link
              </button>
            )}
            <p className="text-slate-400 text-xs">Please wait while we generate your link.</p>
          </div>

          {/* Fact Card (Content for AdSense) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left">
            <div className="flex items-center gap-2 mb-3 text-amber-500 font-bold text-sm uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" /> Did you know?
            </div>
            <p className="text-slate-700 text-lg leading-relaxed font-medium">
              {fact}
            </p>
          </div>

          {/* 2. IN-CONTENT AD (Reusing your ID for now) */}
          <div className="w-full min-h-[250px] bg-white rounded-lg overflow-hidden shadow-sm flex justify-center items-center">
             <AdUnit 
               slotId="3349117440" 
               format="auto" 
               responsive={true}
             />
          </div>

        </div>

        {/* 3. SIDEBAR ADS (Reusing your ID for now) */}
        <div className="hidden md:flex flex-col gap-4">
          <div className="min-h-[600px] bg-white rounded-lg overflow-hidden shadow-sm w-full">
             <AdUnit 
               slotId="3349117440" 
               format="vertical" 
               responsive={true}
             />
          </div>
        </div>

      </div>
    </div>
  );
}

// --- AD UNIT COMPONENT ---
function AdUnit({ slotId, format, style, responsive = false }: { slotId: string, format: string, style?: any, responsive?: boolean }) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // Ignore errors if ads are blocked or already loaded
      // console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className="w-full h-full bg-slate-50 relative overflow-hidden">
      {/* Placeholder text for development (hidden when ad loads) */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-slate-300 text-xs border border-dashed border-slate-200 -z-10">
        Ad Loading...
      </div>
      
      <ins
        className="adsbygoogle block"
        style={style || { display: 'block' }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      ></ins>
    </div>
  );
}