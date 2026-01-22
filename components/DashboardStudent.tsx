
import React, { useState, useEffect } from 'react';
// Added Truck to imports to fix "Cannot find name 'Truck'"
import { Camera, Star, ThumbsUp, ThumbsDown, Phone, MapPin, Clock, AlertTriangle, Truck } from 'lucide-react';
import QRScanner from './QRScanner';

interface Props {
  activeTab: string;
  // Added setActiveTab to interface to fix missing reference error
  setActiveTab: (tab: string) => void;
}

// Destructured setActiveTab from props
const DashboardStudent: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [countdown, setCountdown] = useState('00:45:12');

  if (activeTab === 'today') {
    return (
      <div className="space-y-6 animate-slide-up">
        <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <Clock size={120} />
           </div>
           <p className="text-sm font-medium opacity-80">Pembagian dimulai dalam:</p>
           <h2 className="text-4xl font-black mb-4 tracking-tighter">{countdown}</h2>
           <div className="flex items-center space-x-2 bg-emerald-700/50 p-3 rounded-2xl border border-emerald-400/30">
             <MapPin size={16} />
             <p className="text-xs font-bold">Lokasi: Kantin Sekolah / Aula Utama</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <img src="https://picsum.photos/seed/studentfood/600/400" className="w-full h-56 object-cover rounded-2xl mb-4" alt="Menu" />
          <h3 className="text-2xl font-bold text-gray-800">Menu Jumat Berkah</h3>
          <p className="text-gray-500 text-sm mb-4">Nasi Kuning Komplit dengan Telur Dadar, Perkedel, dan Kerupuk.</p>
          
          <div className="flex space-x-2">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">480 Kalori</span>
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Sangat Bergizi</span>
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('qr')} 
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition-transform"
        >
          <Camera size={24} />
          <span>SCAN ABSEN MAKAN</span>
        </button>
      </div>
    );
  }

  if (activeTab === 'qr') {
    return (
      <div className="bg-gray-900 min-h-[60vh] rounded-3xl flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
        {isScanning ? (
           <QRScanner onResult={(res) => { setIsScanning(false); alert("Berhasil Absen!"); }} />
        ) : (
          <>
            <div className="w-64 h-64 border-2 border-emerald-500 rounded-3xl flex flex-col items-center justify-center mb-8 relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-xl" />
              <Camera size={48} className="text-emerald-500 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-2">Scan QR dari Sekolah</h3>
            <p className="text-center text-gray-400 text-sm max-w-xs mb-8">Posisikan kode QR di dalam kotak untuk verifikasi pengambilan makanan.</p>
            <button 
              onClick={() => setIsScanning(true)}
              className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold"
            >
              Mulai Scanner
            </button>
          </>
        )}
      </div>
    );
  }

  if (activeTab === 'poll') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Gimana Menu Hari Ini?</h3>
          <div className="flex space-x-4 mb-8">
            <button className="flex-1 p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex flex-col items-center border-2 border-emerald-100 hover:bg-emerald-100 transition-colors">
              <ThumbsUp size={32} />
              <span className="text-xs font-bold mt-2">Enak Banget</span>
            </button>
            <button className="flex-1 p-4 bg-red-50 text-red-600 rounded-2xl flex flex-col items-center border-2 border-red-100 hover:bg-red-100 transition-colors">
              <ThumbsDown size={32} />
              <span className="text-xs font-bold mt-2">Kurang Suka</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-700">Tinggalkan Pesan/Saran:</p>
            <textarea 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="Menu hari ini enak, tapi nasinya agak keras..."
              rows={3}
            />
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg">Kirim Feedback</button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'sos') {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setShowSOS(true)}
          className="w-full aspect-square bg-red-600 text-white rounded-full shadow-[0_20px_50px_rgba(239,68,68,0.3)] flex flex-col items-center justify-center animate-pulse border-8 border-red-500/50"
        >
          <AlertTriangle size={64} className="mb-2" />
          <span className="text-2xl font-black">LAPOR KERACUNAN</span>
        </button>

        <div className="grid grid-cols-1 gap-4">
          <EmergencyContact name="Rumah Sakit Terdekat" sub="Unit Gawat Darurat" icon={<Phone />} color="bg-red-500" />
          <EmergencyContact name="Ambulans MBG" sub="Siaga 24 Jam" icon={<Truck />} color="bg-blue-600" />
          <EmergencyContact name="Admin Sekolah" sub="Ibu Siti - 0812..." icon={<MapPin />} color="bg-emerald-600" />
        </div>

        {showSOS && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center">
              <AlertTriangle size={64} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Konfirmasi Laporan</h3>
              <p className="text-gray-500 mb-6">Apakah Anda merasa pusing/mual setelah makan? Tim medis akan segera dihubungi ke lokasi Anda.</p>
              <div className="space-y-3">
                <button onClick={() => setShowSOS(false)} className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl">IYA, HUBUNGI RS</button>
                <button onClick={() => setShowSOS(false)} className="w-full text-gray-500 font-bold py-2">Batal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

const EmergencyContact: React.FC<{ name: string; sub: string; icon: React.ReactNode; color: string }> = ({ name, sub, icon, color }) => (
  <div className="bg-white p-4 rounded-2xl flex items-center shadow-sm border border-gray-100">
    <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center mr-4`}>
      {icon}
    </div>
    <div className="flex-1">
      <p className="font-bold text-gray-800">{name}</p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
    <button className="bg-gray-100 p-2 rounded-full text-gray-600"><Phone size={20} /></button>
  </div>
);

export default DashboardStudent;
