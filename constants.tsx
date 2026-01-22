
import React from 'react';
import { LayoutDashboard, Truck, ClipboardList, PieChart, ShieldCheck, Search, Activity } from 'lucide-react';

export const COLORS = {
  primary: '#10B981', 
  secondary: '#3B82F6',
  warning: '#F59E0B',
  danger: '#EF4444',
  bg: '#F3F4F6'
};

export const NAVIGATION_ITEMS = [
  { label: 'Ringkasan', icon: <LayoutDashboard size={20} />, id: 'overview' },
  { label: 'Workflow', icon: <Activity size={20} />, id: 'workflow' },
  { label: 'Distribusi', icon: <Truck size={20} />, id: 'distribution' },
  { label: 'Anggaran', icon: <PieChart size={20} />, id: 'budget' },
  { label: 'Verifikasi', icon: <ShieldCheck size={20} />, id: 'verification' },
  { label: 'Supplier', icon: <Search size={20} />, id: 'suppliers' }
];

export const MOCK_STATS = [
  { month_name: 'Jan', compliance_score: 85, nutritious_score: 90 },
  { month_name: 'Feb', compliance_score: 88, nutritious_score: 92 },
  { month_name: 'Mar', compliance_score: 92, nutritious_score: 89 },
  { month_name: 'Apr', compliance_score: 90, nutritious_score: 94 }
];

export const MOCK_NUTRIENTS = [
  { name: 'Karbohidrat', value: 400 },
  { name: 'Protein', value: 300 },
  { name: 'Lemak', value: 200 },
  { name: 'Vitamin', value: 100 }
];

export const MOCK_WORKFLOW = [
  { step_name: 'Pemasakan', status: 'Aktif', unit_count: '512 Unit', is_active: true },
  { step_name: 'QC Lab', status: 'Berjalan', unit_count: '714 Unit', is_active: true },
  { step_name: 'Packaging', status: 'Pending', unit_count: '128 Unit', is_active: false },
  { step_name: 'Distribusi', status: 'Siaga', unit_count: '1.2k Armada', is_active: false }
];

export const MOCK_ALERTS = [
  { location: 'SPPG Kediri #11', issue_description: 'Suhu pendingin bahan baku di atas 10°C.', severity: 'danger' },
  { location: 'SPPG Surabaya #04', issue_description: 'Keterlambatan pasokan sayur segar > 1 jam.', severity: 'warning' }
];
