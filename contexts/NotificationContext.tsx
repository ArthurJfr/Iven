import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { invitationService } from '../services/InvitationService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notificationCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  clearNotifications: () => void;
  updateNotificationCount: (count: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const loadNotifications = async () => {
    if (!isAuthenticated) {
      setNotificationCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await invitationService.getUserInvitations();
      
      if (response.success && response.data) {
        // Compter seulement les invitations en attente
        const pendingCount = response.data.filter(inv => inv.status === 'pending').length;
        setNotificationCount(pendingCount);
      } else {
        setNotificationCount(0);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des notifications:', error);
      setNotificationCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [isAuthenticated]);

  const refreshNotifications = async () => {
    await loadNotifications();
  };

  const clearNotifications = () => {
    setNotificationCount(0);
  };

  const updateNotificationCount = (count: number) => {
    setNotificationCount(count);
  };

  const value: NotificationContextType = {
    notificationCount,
    loading,
    refreshNotifications,
    clearNotifications,
    updateNotificationCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
