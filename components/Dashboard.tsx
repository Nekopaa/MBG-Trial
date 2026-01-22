
import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { MOCK_STATS, MOCK_NUTRIENTS, COLORS, MOCK_WORKFLOW, MOCK_ALERTS } from '../constants';
import { 
  ShieldCheck, Truck, Users, School, Map as MapIcon, 
  ChefHat, Package, Activity, Camera, AlertTriangle, 
  PieChart, Navigation, Thermometer, Clock, Phone,
  CheckCircle2, Info
} from 'lucide-react';
import CameraComponent from './CameraComponent';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Declare Leaflet globally since it's loaded via script tag
declare const L: any;

interface Props {
  activeTab: string;
}

const Dashboard: React.FC<Props> = ({ activeTab }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [stats, setStats] = useState<any[]>(MOCK_STATS);
  const [workflow, setWorkflow] = useState<any[]>(MOCK_WORKFLOW);
  const [alerts, setAlerts] = useState<any[]>(MOCK_ALERTS);
  const [loading, setLoading] = useState(true);
  
  // Tracking Simulation State
  const [eta, setEta] = useState(12);
  const [temp, setTemp] = useState(68.5);
  
  // Map References
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const fleetMarkerRef = useRef<any>(null);

  // Constants for SDIT Al Uswah Coordinates
  const AL_USWAH_COORDS = [-7.28325, 112.79361]; // Gebang Putih, Surabaya

  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [statsRes, workflowRes, alertsRes] = await Promise.all([
          supabase.from('program_stats').select('*').order('id', { ascending: true }),
          supabase.from('operational_workflow').select('*').order('id', { ascending: true }),
          supabase.from('food_safety_alerts').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        if (statsRes.data && statsRes.data.length > 0) setStats(statsRes.data);
        if (workflowRes.data && workflowRes.data.length > 0) setWorkflow(workflowRes.data);
        if (alertsRes.data && alertsRes.data.length > 0) setAlerts(alertsRes.data);
      } catch (err) {
        console.warn("Supabase Fetch Failed. Falling back to Mock Data.", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    // Simulation for live tracking
    const interval = setInterval(() => {
      setEta(prev => Math.max(1, prev - (Math.random() > 0.8 ? 1 : 0)));
      setTemp(prev => Number((prev + (Math.random() - 0.5) * 0.2).toFixed(1)));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeTab]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (activeTab === 'distribution' && mapContainerRef.current && !mapRef.current) {
      // Initialize map
      mapRef.current = L.map(mapContainerRef.current).setView(AL_USWAH_COORDS, 15);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // School Marker
      const schoolIcon = L.divIcon({
        html: `<div class="bg-white p-1 rounded-lg border-2 border-emerald-500 shadow-xl"><div class="bg-emerald-500 p-1.5 rounded-md text-white"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div></div>`,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      L.marker(AL_USWAH_COORDS, { icon: schoolIcon }).addTo(mapRef.current)
        .bindPopup("<b>SDIT Al Uswah Surabaya</b><br>Tujuan Pengiriman MBG-042");

      // Fleet Marker (Moving simulation)
      const fleetIcon = L.divIcon({
        html: `<div class="bg-blue-600 p-2 rounded-xl shadow-2xl text-white transform rotate-45 flex items-center justify-center border-2 border-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(-45deg)"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg></div>`,
        className: 'custom-fleet-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      // Starting point near Sukolilo
      const startPos = [AL_USWAH_COORDS[0] - 0.005, AL_USWAH_COORDS[1] - 0.005];
      fleetMarkerRef.current = L.marker(startPos, { icon: fleetIcon }).addTo(mapRef.current);
      
      // Simulation of movement
      let currentPos = [...startPos];
      const moveInterval = setInterval(() => {
        if (!fleetMarkerRef.current) return;
        
        // Move slightly towards school
        currentPos[0] += (AL_USWAH_COORDS[0] - currentPos[0]) * 0.05;
        currentPos[1] += (AL_USWAH_COORDS[1] - currentPos[1]) * 0.05;
        
        fleetMarkerRef.current.setLatLng(currentPos);
      }, 2000);

      return () => {
        clearInterval(moveInterval);
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    );
  }

  if (activeTab === 'overview') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Porsi" value="1,245,670" sub="Bulan Berjalan" icon={<MapIcon className="text-blue-500" />} />
          <StatCard title="Target Satker" value="714" sub="Jawa Timur" icon={<School className="text-emerald-500" />} />
          <StatCard title="Siswa Tercover" value="1.9M" sub="Nasional" icon={<Users className="text-orange-500" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-black mb-6 text-gray-800 flex items-center">
              <Activity size={20} className="mr-2 text-emerald-500" />
              Indeks Kepatuhan Program
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month_name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="compliance_score" stroke={COLORS.primary} strokeWidth={4} dot={{ r: 6, fill: COLORS.primary, strokeWidth: 3, stroke: '#fff' }} />
                  <Line type="monotone" dataKey="nutritious_score" stroke={COLORS.secondary} strokeWidth={4} dot={{ r: 6, fill: COLORS.secondary, strokeWidth: 3, stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-black mb-6 text-gray-800 flex items-center">
              <PieChart size={20} className="mr-2 text-blue-500" />
              Nutrisi Rata-rata (Per Porsi)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_NUTRIENTS} layout="vertical" barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} className="text-xs font-bold" />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                    {MOCK_NUTRIENTS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? COLORS.primary : COLORS.secondary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'workflow') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black mb-8 text-gray-800">Status Operasional Nasional</h3>
          <div className="flex flex-wrap gap-8 justify-between">
            {workflow.map((item, idx) => (
              <WorkflowStep 
                key={idx}
                icon={getIconForStep(item.step_name)} 
                label={item.step_name} 
                status={item.status} 
                count={item.unit_count} 
                active={item.is_active} 
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
               <h4 className="font-black text-gray-800">Verifikasi Foto Real-time</h4>
               <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Live Source</span>
             </div>
             {showCamera ? (
               <CameraComponent onCapture={() => setShowCamera(false)} />
             ) : (
               <button 
                 onClick={() => setShowCamera(true)}
                 className="w-full aspect-video border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-all group"
               >
                 <Camera size={48} className="mb-4 group-hover:scale-110 transition-transform text-emerald-500" />
                 <p className="font-black text-gray-700">Buka Kamera Pengawas</p>
                 <p className="text-xs mt-1">Akses enkripsi end-to-end aktif</p>
               </button>
             )}
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h4 className="font-black text-gray-800 mb-6 flex items-center">
              <AlertTriangle className="mr-2 text-red-500" size={18} />
              Alert Keamanan Pangan
            </h4>
            <div className="space-y-4">
              {alerts.length > 0 ? alerts.map((alert, i) => (
                <div key={i} className={`p-4 rounded-2xl border flex items-start ${alert.severity === 'danger' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                  <div className={`p-2 rounded-xl text-white mr-4 shadow-lg ${alert.severity === 'danger' ? 'bg-red-500 shadow-red-200' : 'bg-amber-500 shadow-amber-200'}`}>
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <p className={`font-black text-sm italic ${alert.severity === 'danger' ? 'text-red-800' : 'text-amber-800'}`}>{alert.location}</p>
                    <p className={`text-xs mt-1 ${alert.severity === 'danger' ? 'text-red-600' : 'text-amber-600'}`}>{alert.issue_description}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-gray-400 italic font-medium">Semua sistem dalam batas aman</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'distribution') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Real OpenStreetMap Integration */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[550px]">
            <div ref={mapContainerRef} className="absolute inset-0 z-0"></div>

            {/* Map Overlay Controls */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none z-10">
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100 pointer-events-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-black text-gray-700 tracking-tight uppercase">Live Fleet Tracking</span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Source: OpenStreetMap API v1.9</p>
              </div>
              <div className="space-y-2 pointer-events-auto">
                <button className="w-12 h-12 bg-white rounded-2xl shadow-xl border border-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"><Info size={24} /></button>
                <button className="w-12 h-12 bg-white rounded-2xl shadow-xl border border-gray-50 flex items-center justify-center text-emerald-600 hover:bg-gray-50 transition-colors"><Navigation size={24} /></button>
              </div>
            </div>
          </div>

          {/* Telemetry & Details */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h4 className="text-xs font-black text-gray-400 mb-6 flex items-center uppercase tracking-widest">
                <Activity size={16} className="mr-2 text-blue-500" />
                Fleet Telemetry #042
              </h4>
              <div className="space-y-4">
                <TelemetryRow label="Suhu Cargo" value={`${temp}°C`} icon={<Thermometer size={16} />} status="Safe" color="text-emerald-500" />
                <TelemetryRow label="Estimasi Tiba" value={`${eta} Mins`} icon={<Clock size={16} />} status="On Track" color="text-blue-500" />
                <TelemetryRow label="Muatan" value="450/500" icon={<Package size={16} />} status="90%" color="text-orange-500" />
              </div>
            </div>

            <div className="bg-emerald-600 p-6 rounded-3xl shadow-xl shadow-emerald-100 text-white">
              <div className="flex items-center space-x-4 mb-6">
                <img src="https://i.pravatar.cc/150?u=driver1" className="w-14 h-14 rounded-2xl border-4 border-emerald-500/30 object-cover" alt="Driver" />
                <div>
                  <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Courier In-Charge</p>
                  <p className="font-black text-lg">Slamet Riyadi</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-xl flex items-center justify-center transition-colors">
                  <Phone size={18} />
                </button>
                <button className="flex-[3] bg-white text-emerald-600 font-black text-xs py-3 rounded-xl shadow-lg active:scale-95 transition-transform uppercase tracking-widest">
                  Hubungi Sekolah
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h4 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">Log Perjalanan</h4>
              <div className="space-y-4">
                <LogItem time="11:05" action="Kitchen Center" status="Departed" done />
                <LogItem time="11:20" action="Checkpoint Alpha" status="Temp Checked" done />
                <LogItem time="--" action="SDIT Al Uswah" status="Awaiting" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="p-20 text-center text-gray-400 font-bold bg-white rounded-3xl border border-gray-100 italic">Modul {activeTab} sedang dalam sinkronisasi data nasional...</div>;
};

const TelemetryRow: React.FC<{ label: string, value: string, icon: React.ReactNode, status: string, color: string }> = ({ label, value, icon, status, color }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
    <div className="flex items-center">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm mr-4">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 leading-none mb-1">{label}</p>
        <p className="text-sm font-black text-gray-800">{value}</p>
      </div>
    </div>
    <span className={`text-[10px] font-black uppercase ${color}`}>{status}</span>
  </div>
);

const LogItem: React.FC<{ time: string, action: string, status: string, done?: boolean }> = ({ time, action, status, done }) => (
  <div className="flex items-start space-x-3">
    <div className={`mt-1.5 w-2 h-2 rounded-full ring-4 ${done ? 'bg-emerald-500 ring-emerald-50' : 'bg-gray-200 ring-gray-50'}`}></div>
    <div className="flex-1 border-b border-gray-50 pb-3 last:border-0">
      <div className="flex justify-between items-center mb-0.5">
        <p className={`text-xs font-black ${done ? 'text-gray-800' : 'text-gray-300'}`}>{action}</p>
        <p className="text-[10px] font-bold text-gray-400">{time}</p>
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{status}</p>
    </div>
  </div>
);

const getIconForStep = (name: string) => {
  switch (name) {
    case 'Pemasakan': return <ChefHat />;
    case 'QC Lab': return <ShieldCheck />;
    case 'Packaging': return <Package />;
    case 'Distribusi': return <Truck />;
    default: return <Activity />;
  }
};

const StatCard: React.FC<{ title: string; value: string; sub: string; icon: React.ReactNode }> = ({ title, value, sub, icon }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center">
    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mr-6 shadow-inner text-2xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      <h4 className="text-3xl font-black text-gray-800 leading-tight">{value}</h4>
      <p className="text-[10px] font-bold text-emerald-500 mt-1 uppercase tracking-wider">{sub}</p>
    </div>
  </div>
);

const WorkflowStep: React.FC<{ icon: React.ReactNode; label: string; status: string; count: string; active?: boolean }> = ({ icon, label, status, count, active }) => (
  <div className={`flex flex-col items-center p-6 rounded-3xl border-2 transition-all w-44 ${active ? 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100/50 scale-105' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${active ? 'bg-emerald-500 text-white' : 'bg-white'}`}>
      {React.cloneElement(icon as any, { size: 28 })}
    </div>
    <span className="text-sm font-black mb-1 text-center text-gray-800">{label}</span>
    <span className={`text-[10px] font-black uppercase mb-4 tracking-widest ${active ? 'text-emerald-600' : 'text-gray-400'}`}>{status}</span>
    <div className="bg-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm border border-gray-100 whitespace-nowrap text-gray-700">{count}</div>
  </div>
);

export default Dashboard;
