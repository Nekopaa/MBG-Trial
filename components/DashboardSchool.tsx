
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Users, QrCode, AlertCircle, MapPin, Search } from 'lucide-react';
import { COLORS } from '../constants';

interface Props {
  activeTab: string;
}

const DashboardSchool: React.FC<Props> = ({ activeTab }) => {
  const [qrCodeData, setQrCodeData] = useState('');

  // Generate daily QR code based on date + secret hash (simulation)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setQrCodeData(`MBG-SECURE-${today}-${Math.random().toString(36).substr(2, 5)}`);
  }, []);

  if (activeTab === 'menu') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Menu Hari Ini</h3>
            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold">Tiba Pukul 11:30 WIB</span>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <img src="https://picsum.photos/seed/food1/400/300" className="w-full md:w-64 h-48 object-cover rounded-xl" alt="Menu" />
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-800 mb-2">Nasi Ayam Saus Teriyaki & Sayur</h4>
              <p className="text-sm text-gray-500 mb-4">Ayam potong segar, brokoli, wortel, dan nasi putih organik.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <NutrientBadge label="Energi" value="450kcal" color="bg-emerald-100 text-emerald-700" />
                <NutrientBadge label="Protein" value="25g" color="bg-blue-100 text-blue-700" />
                <NutrientBadge label="Karbo" value="60g" color="bg-orange-100 text-orange-700" />
                <NutrientBadge label="Serat" value="12g" color="bg-purple-100 text-purple-700" />
              </div>
              <div className="mt-6 flex items-center p-3 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle className="text-red-500 mr-2" size={16} />
                <p className="text-xs text-red-700 font-bold">Peringatan Alergen: Biji Wijen</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Tracking Pengiriman GoSend (Simulasi)</h3>
          <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
            <MapPin className="text-blue-500 mr-4" size={32} />
            <div className="flex-1">
              <p className="font-bold">Bpk. Budiman (Driver)</p>
              <p className="text-xs text-gray-500">Menuju Sekolah Anda • 4 Menit lagi</p>
            </div>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">Panggil</button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'attendance') {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Absensi QR Harian</h3>
        <p className="text-sm text-gray-500 mb-8 max-w-sm">Tampilkan kode ini kepada siswa saat pembagian makanan. Kode akan berubah otomatis setiap hari.</p>
        
        <div className="p-6 bg-white border-4 border-gray-50 rounded-3xl shadow-inner mb-6">
           {/* Replace with actual QR implementation if library available, simulating with a stylized box */}
           <div className="w-48 h-48 bg-gray-900 rounded-xl flex flex-wrap p-1">
             {Array.from({length: 400}).map((_, i) => (
               <div key={i} className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`} />
             ))}
           </div>
        </div>
        
        <div className="w-full max-w-md">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span>Kehadiran Real-time</span>
            <span className="text-emerald-600">452 / 600 Siswa</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: '75%' }} />
          </div>
        </div>

        <button className="mt-8 flex items-center text-emerald-600 font-bold hover:underline">
          <Search size={16} className="mr-2" /> Lihat Rekap Per Kelas
        </button>
      </div>
    );
  }

  return <div className="p-10 text-center text-gray-400">School dashboard for {activeTab}.</div>;
};

const NutrientBadge: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className={`p-2 rounded-lg ${color} flex flex-col items-center justify-center`}>
    <span className="text-[10px] uppercase opacity-70 font-bold">{label}</span>
    <span className="text-xs font-bold">{value}</span>
  </div>
);

export default DashboardSchool;
