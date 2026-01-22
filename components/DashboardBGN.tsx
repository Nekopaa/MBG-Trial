
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart as RePieChart, Pie } from 'recharts';
// Fix: Renamed MOCK_BGN_STATS to MOCK_STATS as exported in constants.tsx
import { MOCK_STATS, MOCK_NUTRIENTS, COLORS } from '../constants';
import { CheckCircle, XCircle, AlertTriangle, Users, School, Map as MapIcon } from 'lucide-react';

interface Props {
  activeTab: string;
}

const DashboardBGN: React.FC<Props> = ({ activeTab }) => {
  if (activeTab === 'overview') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Distribusi" value="1,245,670" sub="Porsi/Bulan" icon={<MapIcon className="text-blue-500" />} />
          <StatCard title="Sekolah Terlayani" value="714" sub="Satker Jawa Timur" icon={<School className="text-emerald-500" />} />
          <StatCard title="Siswa Penerima" value="1.9M" sub="Target Nasional" icon={<Users className="text-orange-500" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Tren Kepatuhan & Gizi</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_STATS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="compliance" stroke={COLORS.primary} strokeWidth={3} />
                  <Line type="monotone" dataKey="nutritious" stroke={COLORS.secondary} strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Rata-rata Kandungan Gizi</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_NUTRIENTS} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {MOCK_NUTRIENTS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? COLORS.primary : COLORS.secondary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Peringatan SPPG Bermasalah</h3>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">4 Masalah Aktif</span>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center p-4 bg-red-50 rounded-xl border border-red-100">
                <AlertTriangle className="text-red-500 mr-4" />
                <div className="flex-1">
                  <p className="font-bold text-red-800">SPPG Surabaya - {i}</p>
                  <p className="text-sm text-red-600">Terlambat distribusi &gt; 2 jam di 5 sekolah.</p>
                </div>
                <button className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm">Tindak Lanjut</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'reports') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Persetujuan Laporan SPPG</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4">SPPG / ID</th>
                <th className="px-6 py-4">Status Kualitas</th>
                <th className="px-6 py-4">Foto Bukti</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold">SPPG Malang #{i}</p>
                    <p className="text-xs text-gray-400">14 Mar 2024</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">Memenuhi SOP</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      <img src={`https://picsum.photos/seed/${i*10}/50/50`} className="w-8 h-8 rounded-full border-2 border-white" alt="Evidence" />
                      <img src={`https://picsum.photos/seed/${i*20}/50/50`} className="w-8 h-8 rounded-full border-2 border-white" alt="Evidence" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><CheckCircle size={20} /></button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><XCircle size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return <div className="p-10 text-center text-gray-400">Section available in full version.</div>;
};

const StatCard: React.FC<{ title: string; value: string; sub: string; icon: React.ReactNode }> = ({ title, value, sub, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start">
    <div className="p-3 bg-gray-50 rounded-xl mr-4">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  </div>
);

export default DashboardBGN;
