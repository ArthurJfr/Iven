import { useState, useEffect } from 'react';
import { invitationService } from '../services/InvitationService';
import { useAuth } from '../contexts/AuthContext';

export function useNotifications() {
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

  const refreshNotifications = () => {
    loadNotifications();
  };

  return {
    notificationCount,
    loading,
    refreshNotifications
  };
}
