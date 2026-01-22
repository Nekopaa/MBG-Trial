
import React from 'react';
import { NAVIGATION_ITEMS } from '../constants';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex justify-around items-center z-40 pb-safe shadow-[0_-20px_40px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
      {NAVIGATION_ITEMS.slice(0, 4).map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex flex-col items-center space-y-2 transition-all ${
            activeTab === item.id ? 'text-emerald-600' : 'text-gray-300'
          }`}
        >
          <div className={`p-3 rounded-2xl transition-all ${activeTab === item.id ? 'bg-emerald-100 scale-110 shadow-inner shadow-emerald-200/50' : 'bg-transparent'}`}>
            {/* Fix: Using 'any' cast to bypass strict property checks in React.cloneElement for Lucide icon components */}
            {React.cloneElement(item.icon as any, { size: 24 })}
          </div>
        </button>
      ))}
    </div>
  );
};

export default MobileNav;
