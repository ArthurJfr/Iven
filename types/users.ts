export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'organizer' | 'participant' | 'viewer';
  phone?: string;
  bio?: string;
  createdAt: string;
  lastSeen?: string;
}

export type UserRole = User['role']; 