export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Booking {
  id?: string;
  userId: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  notes?: string;
  createdAt: string;
  userName?: string;
  userEmail?: string;
}

export interface Service {
  id?: string;
  name: string;
  description: string;
}

export interface PortfolioItem {
  id?: string;
  mediaUrl: string;
  category: 'Wedding' | 'Cars' | 'Events';
  type: 'image' | 'video';
  createdAt?: string;
}

export interface UserUpload {
  id?: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  createdAt: string;
  userName?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}
