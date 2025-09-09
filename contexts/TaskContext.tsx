import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Task } from '../types/tasks';

interface TaskContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTask: (updatedTask: Task) => void;
  addTask: (task: Task) => void;
  removeTask: (taskId: number) => void;
  refreshTasks: () => void;
  syncEventTasks: (eventId: number, eventTasks: Task[]) => void;
  getTasksByEventId: (eventId: number) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(t => 
        t.id === updatedTask.id ? updatedTask : t
      );
      console.log('🔄 Mise à jour de la tâche dans le contexte:', updatedTask.title, 'validated_by:', updatedTask.validated_by);
      return newTasks;
    });
  }, []);

  const addTask = useCallback((task: Task) => {
    setTasks(prevTasks => {
      const newTasks = [...prevTasks, task];
      console.log('➕ Ajout de la tâche dans le contexte:', task.title);
      return newTasks;
    });
  }, []);

  const removeTask = useCallback((taskId: number) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.filter(t => t.id !== taskId);
      console.log('🗑️ Suppression de la tâche du contexte:', taskId);
      return newTasks;
    });
  }, []);

  const syncEventTasks = useCallback((eventId: number, eventTasks: Task[]) => {
    setTasks(prevTasks => {
      // Supprimer les anciennes tâches de cet événement
      const otherTasks = prevTasks.filter(t => t.event_id !== eventId);
      // Ajouter les nouvelles tâches de l'événement
      const newTasks = [...otherTasks, ...eventTasks];
      console.log('🔄 Synchronisation des tâches de l\'événement', eventId, ':', eventTasks.length, 'tâches');
      return newTasks;
    });
  }, []);

  const getTasksByEventId = useCallback((eventId: number) => {
    return tasks.filter(t => t.event_id === eventId);
  }, [tasks]);

  const refreshTasks = useCallback(() => {
    console.log('🔄 Rafraîchissement des tâches dans le contexte');
    // Cette fonction sera utilisée pour forcer un rechargement depuis l'API
  }, []);

  const value: TaskContextType = {
    tasks,
    setTasks,
    updateTask,
    addTask,
    removeTask,
    refreshTasks,
    syncEventTasks,
    getTasksByEventId
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
