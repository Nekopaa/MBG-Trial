
import React, { useState, useEffect } from 'react';
import { User } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import { supabase, isSupabaseConfigured } from './lib/supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn("Supabase not configured. App running in Demo Mode with Mock Data.");
      setLoading(false);
      return;
    }

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || 'Admin',
            email: session.user.email || ''
          });
        }
      } catch (err) {
        console.error("Supabase Auth failed to connect:", err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || 'Admin',
          email: session.user.email || ''
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const handleDemoLogin = (u: User) => {
    setUser(u);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleDemoLogin} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 overflow-hidden text-gray-900">
      <div className="hidden md:block">
        <Sidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
      </div>

      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 h-screen">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-black text-emerald-600">MBG Command Center</h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sistem Manajemen Bergizi Nasional</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                <p className="text-[10px] text-emerald-500 font-black">ADMINISTRATOR</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200">
                {user.name.charAt(0)}
              </div>
            </div>
          </header>

          <Dashboard activeTab={activeTab} />
        </div>
      </main>

      <div className="md:hidden">
        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default App;
