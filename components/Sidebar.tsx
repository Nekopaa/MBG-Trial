
import React from 'react';
import { User } from '../types';
import { NAVIGATION_ITEMS } from '../constants';
import { LogOut, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  user: User;
  activeTab: string;
  onTabChange: (id: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, onTabChange, onLogout }) => {
  return (
    <div className="w-64 h-full bg-white border-r border-gray-100 flex flex-col">
      <div className="p-8 border-b border-gray-50">
        <div className="flex items-center space-x-3 text-emerald-600 mb-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <ShieldCheck size={24} />
          </div>
          <span className="font-black text-2xl tracking-tighter text-gray-800">MBG<span className="text-emerald-500">secure</span></span>
        </div>
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mt-2">Global Admin Hub</p>
      </div>

      <nav className="flex-1 p-6 space-y-3">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200 scale-105' 
                : 'text-gray-400 hover:bg-emerald-50 hover:text-emerald-600'
            }`}
          >
            {item.icon}
            <span className="font-black text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all font-black text-sm"
        >
          <LogOut size={20} />
          <span>Keluar Sistem</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
