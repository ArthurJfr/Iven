export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  participants: number;
  maxParticipants?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  description?: string;
  organizer?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
}

export type EventStatus = Event['status']; 