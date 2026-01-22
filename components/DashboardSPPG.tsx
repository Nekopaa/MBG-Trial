
import React, { useState } from 'react';
import { Truck, Package, ChefHat, Wallet, Calendar, Camera, MapPin, CheckCircle2 } from 'lucide-react';
import { COLORS } from '../constants';
import CameraComponent from './CameraComponent';

interface Props {
  activeTab: string;
}

const DashboardSPPG: React.FC<Props> = ({ activeTab }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const workflow = [
    { label: 'Pemasakan', icon: <ChefHat size={20} /> },
    { label: 'Pengecekan', icon: <CheckCircle2 size={20} /> },
    { label: 'Packaging', icon: <Package size={20} /> },
    { label: 'Distribusi', icon: <Truck size={20} /> }
  ];

  if (activeTab === 'distro') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Status Alur Kerja Hari Ini</h3>
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 -z-10" />
            {workflow.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div 
                  onClick={() => setCurrentStep(idx)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    currentStep >= idx ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.icon}
                </div>
                <p className={`text-xs mt-2 font-bold ${currentStep >= idx ? 'text-emerald-600' : 'text-gray-400'}`}>{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Upload Bukti Real-time</h3>
              <Camera size={20} className="text-emerald-500" />
            </div>
            <p className="text-sm text-gray-500 mb-4 italic">Hanya bisa menggunakan kamera langsung. Foto otomatis diberi tag lokasi & waktu.</p>
            {showCamera ? (
              <CameraComponent onCapture={(img) => { setShowCamera(false); alert("Foto berhasil disimpan!"); }} />
            ) : (
              <button 
                onClick={() => setShowCamera(true)}
                className="w-full aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-all"
              >
                <Camera size={48} className="mb-2" />
                <span className="font-bold">Ambil Foto Sekarang</span>
              </button>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Manajemen Kadaluarsa</h3>
            <div className="space-y-3">
              {[
                { name: 'Susu UHT', days: 2, status: 'Kritis', color: 'bg-red-500' },
                { name: 'Daging Ayam', days: 1, status: 'Kritis', color: 'bg-red-500' },
                { name: 'Sayur Bayam', days: 5, status: 'Perhatian', color: 'bg-yellow-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">Expired dalam {item.days} hari</p>
                  </div>
                  <span className={`${item.color} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'budget') {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Informasi Anggaran SPPG</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-emerald-50 rounded-xl">
            <p className="text-xs text-emerald-600 font-bold">Total Tersedia</p>
            <h4 className="text-xl font-bold text-emerald-800">Rp 450,000,000</h4>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-600 font-bold">Telah Terpakai</p>
            <h4 className="text-xl font-bold text-blue-800">Rp 125,500,000</h4>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-bold text-gray-700">Rincian Pengeluaran</p>
          {[
            { label: 'Bahan Makanan', value: 'Rp 80M', percent: 64 },
            { label: 'Distribusi / Driver', value: 'Rp 25M', percent: 20 },
            { label: 'Operasional Dapur', value: 'Rp 20M', percent: 16 }
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span>{item.label}</span>
                <span className="font-bold">{item.value}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div className="p-10 text-center text-gray-400">Section details for {activeTab}.</div>;
};

export default DashboardSPPG;
