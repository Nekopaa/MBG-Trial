
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface DistributionData {
  schoolName: string;
  status: 'Selesai' | 'Dalam Proses' | 'Tertunda';
  portions: number;
  time: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  rating: number;
  tags: string[];
}

export interface Report {
  id: string;
  title: string;
  sender: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Revision';
}
