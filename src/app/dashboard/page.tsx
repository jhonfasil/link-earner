'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { BarChart3, Copy, ExternalLink, Link as LinkIcon, LogOut, Plus, TrendingUp } from 'lucide-react';

interface LinkData {
  id: string;
  shortId: string;
  originalUrl: string;
  views: number;
  userId: string;
  createdAt: any;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        fetchLinks(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchLinks = async (userId: string) => {
    try {
      const q = query(collection(db, 'links'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const fetchedLinks: LinkData[] = [];
      querySnapshot.forEach((doc) => {
        fetchedLinks.push({ id: doc.id, ...doc.data() } as LinkData);
      });

      fetchedLinks.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      
      setLinks(fetchedLinks);
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !user) return;
    
    setCreating(true);
    const shortId = Math.random().toString(36).substring(2, 8);

    try {
      await setDoc(doc(db, 'links', shortId), {
        originalUrl: newUrl,
        shortId: shortId,
        views: 0,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      const newLinkItem: LinkData = { 
        id: shortId, 
        shortId, 
        originalUrl: newUrl, 
        views: 0, 
        userId: user.uid,
        createdAt: { seconds: Date.now() / 1000 } 
      };

      setLinks([newLinkItem, ...links]);
      setNewUrl('');
    } catch (error) {
      console.error("Error creating link:", error);
      alert('Error creating link');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const totalViews = links.reduce((acc, link) => acc + link.views, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <LinkIcon className="w-6 h-6" /> <span>LinkEarner</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 hidden md:block">{user?.email}</span>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6 space-y-8">
        
        {/* Stats Grid - REMOVED MONEY CARD */}
        <div className="grid md:grid-cols-2 gap-6">
          <StatCard 
            title="Total Views" 
            value={totalViews.toLocaleString()} 
            icon={<TrendingUp className="w-6 h-6 text-blue-600" />} 
          />
          <StatCard 
            title="Active Links" 
            value={links.length.toString()} 
            icon={<BarChart3 className="w-6 h-6 text-purple-600" />} 
          />
        </div>

        {/* Create Link Input */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Create New Link</h2>
          <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-3">
            <input 
              type="url" 
              required
              placeholder="Paste long URL here (e.g. https://youtube.com)" 
              className="flex-1 px-4 py-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <Plus className="w-5 h-5" />
              {creating ? 'Creating...' : 'Shorten'}
            </button>
          </form>
        </div>

        {/* Links List - REMOVED EARNINGS COLUMN */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-700">Your Links</h3>
          </div>
          
          {links.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              You haven't created any links yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Short Link</th>
                    <th className="px-6 py-3">Original URL</th>
                    <th className="px-6 py-3 text-right">Views</th>
                    <th className="px-6 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {links.map((link) => (
                    <tr key={link.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-blue-600">
                        <a 
                          href={`${window.location.origin}/${link.shortId}`} 
                          target="_blank" 
                          className="flex items-center gap-1 hover:underline"
                        >
                          /{link.shortId} <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate" title={link.originalUrl}>
                        {link.originalUrl}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-900">
                        {link.views}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${link.shortId}`)}
                          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-blue-600 transition-colors"
                          title="Copy Link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
          {icon}
        </div>
      </div>
    </div>
  );
}