export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  eventId: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority']; 