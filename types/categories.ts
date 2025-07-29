export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  eventCount: number;
  createdAt: string;
}

export interface Media {
  id: string;
  title: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  thumbnail?: string;
  eventId: string;
  uploadedBy: string;
  size?: number;
  createdAt: string;
}

export type MediaType = Media['type']; 