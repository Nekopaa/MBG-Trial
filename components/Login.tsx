
import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // If not configured, allow demo login
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        onLogin({
          id: 'DEMO-001',
          name: 'Demo Admin',
          email: email || 'demo@mbg.systems'
        });
        setLoading(false);
      }, 800);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      onLogin({
        id: data.user.id,
        name: data.user.user_metadata.full_name || 'Admin',
        email: data.user.email || ''
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4 font-sans text-gray-900">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-emerald-100 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl mb-6 shadow-inner">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">MBG Systems</h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">Portal Administrasi Nasional</p>
          {!isSupabaseConfigured && (
            <div className="mt-4 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full inline-block uppercase tracking-widest">
              Demo Mode Active
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl flex items-center border border-red-100">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
              placeholder="Email Administrator"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-200 transition-all active:scale-95 text-lg flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Masuk ke Dashboard'
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center opacity-50">
           <span className="text-[10px] font-black tracking-widest uppercase">SDG 2 & 3 Compliance</span>
           <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600">v2.5.0-resilient</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
