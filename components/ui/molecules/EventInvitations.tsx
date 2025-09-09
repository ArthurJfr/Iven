import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { createThemedStyles, spacing } from '../../../styles';
import Text from '../atoms/Text';
import Card from '../Card';
import Badge from '../atoms/Badge';
import Button from '../Button';
import { invitationService, Invitation } from '../../../services/InvitationService';

interface EventInvitationsProps {
  eventId: number;
  onInvitationUpdate?: () => void;
  style?: any;
}

export default function EventInvitations({ 
  eventId, 
  onInvitationUpdate,
  style 
}: EventInvitationsProps) {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<number | null>(null);

  // Charger les invitations de l'événement
  const loadEventInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await invitationService.getUserInvitations();
      
      if (response.success && response.data) {
        setInvitations(response.data);
      } else {
        setError(response.error || 'Impossible de charger les invitations');
        setInvitations([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des invitations:', error);
      setError('Erreur de connexion au serveur');
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger au montage
  useEffect(() => {
    loadEventInvitations();
  }, [eventId]);

  // Annuler une invitation
  const cancelInvitation = async (invitationId: number) => {
    Alert.alert(
      'Annuler l\'invitation',
      'Êtes-vous sûr de vouloir annuler cette invitation ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Annuler l\'invitation', 
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelling(invitationId);
              
              const response = await invitationService.cancelInvitation(invitationId);
              
              if (response.success) {
                // Retirer l'invitation de la liste
                setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
                onInvitationUpdate?.();
                Alert.alert('Succès', 'Invitation annulée avec succès !');
              } else {
                Alert.alert('Erreur', response.error || 'Impossible d\'annuler l\'invitation');
              }
            } catch (error) {
              console.error('Erreur lors de l\'annulation de l\'invitation:', error);
              Alert.alert('Erreur', 'Erreur lors de l\'annulation de l\'invitation');
            } finally {
              setCancelling(null);
            }
          }
        }
      ]
    );
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return 'Hier';
      } else if (diffDays < 7) {
        return `Il y a ${diffDays} jours`;
      } else {
        return date.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short'
        });
      }
    } catch {
      return dateString;
    }
  };

  // Vérifier si l'invitation a expiré
  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  // Filtrer les invitations par statut
  const pendingInvitations = invitations.filter(inv => inv.status === 'pending' && !isExpired(inv.expires_at));
  const acceptedInvitations = invitations.filter(inv => inv.status === 'accepted');
  const declinedInvitations = invitations.filter(inv => inv.status === 'declined');
  const expiredInvitations = invitations.filter(inv => inv.status === 'pending' && isExpired(inv.expires_at));

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <Ionicons name="sync" size={24} color={theme.primary} />
          <Text variant="small" color="secondary" style={{ marginTop: spacing[2] }}>
            Chargement des invitations...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <Card variant="outlined" padding="medium">
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={24} color={theme.error} />
            <Text variant="small" color="secondary" style={{ marginTop: spacing[2], textAlign: 'center' }}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={loadEventInvitations}
              style={styles.retryButton}
            >
              <Ionicons name="refresh" size={16} color={theme.primary} />
              <Text variant="small" color="primary" style={{ marginLeft: spacing[1] }}>
                Réessayer
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    );
  }

  if (invitations.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Card variant="outlined" padding="medium">
          <View style={styles.emptyContainer}>
            <Ionicons name="mail-outline" size={32} color={theme.textSecondary} />
            <Text variant="body" color="secondary" style={{ marginTop: spacing[2], textAlign: 'center' }}>
              Aucune invitation pour cet événement
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* Invitations en attente */}
      {pendingInvitations.length > 0 && (
        <View style={styles.section}>
          <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[3] }}>
            En attente ({pendingInvitations.length})
          </Text>
          <View style={styles.invitationsList}>
            {pendingInvitations.map(invitation => (
              <Card key={invitation.id} variant="elevated" padding="small" style={styles.invitationCard}>
                <View style={styles.invitationHeader}>
                  <View style={styles.invitationInfo}>
                    <Text variant="body" weight="semibold" style={{ marginBottom: spacing[1] }}>
                      Utilisateur #{invitation.user_id}
                    </Text>
                    {invitation.message && (
                      <Text variant="small" color="secondary" style={{ marginBottom: spacing[1] }}>
                        "{invitation.message}"
                      </Text>
                    )}
                    <Text variant="small" color="tertiary">
                      Envoyée {formatDate(invitation.created_at)}
                    </Text>
                  </View>
                  <View style={styles.invitationActions}>
                    <Badge 
                      text="En attente" 
                      color={invitationService.getInvitationStatusColor(invitation.status)}
                    />
                    <TouchableOpacity
                      onPress={() => cancelInvitation(invitation.id)}
                      disabled={cancelling === invitation.id}
                      style={[
                        styles.cancelButton,
                        { backgroundColor: theme.error + '15' }
                      ]}
                    >
                      {cancelling === invitation.id ? (
                        <Ionicons name="sync" size={16} color={theme.error} />
                      ) : (
                        <Ionicons name="close-circle-outline" size={16} color={theme.error} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </View>
      )}

      {/* Invitations acceptées */}
      {acceptedInvitations.length > 0 && (
        <View style={styles.section}>
          <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[3] }}>
            Acceptées ({acceptedInvitations.length})
          </Text>
          <View style={styles.invitationsList}>
            {acceptedInvitations.map(invitation => (
              <Card key={invitation.id} variant="outlined" padding="small" style={styles.invitationCard}>
                <View style={styles.invitationHeader}>
                  <View style={styles.invitationInfo}>
                    <Text variant="body" weight="semibold" style={{ marginBottom: spacing[1] }}>
                      Utilisateur #{invitation.user_id}
                    </Text>
                    <Text variant="small" color="tertiary">
                      Acceptée {formatDate(invitation.updated_at)}
                    </Text>
                  </View>
                  <Badge 
                    text="Acceptée" 
                    color={invitationService.getInvitationStatusColor(invitation.status)}
                  />
                </View>
              </Card>
            ))}
          </View>
        </View>
      )}

      {/* Invitations refusées */}
      {declinedInvitations.length > 0 && (
        <View style={styles.section}>
          <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[3] }}>
            Refusées ({declinedInvitations.length})
          </Text>
          <View style={styles.invitationsList}>
            {declinedInvitations.map(invitation => (
              <Card key={invitation.id} variant="outlined" padding="small" style={styles.invitationCard}>
                <View style={styles.invitationHeader}>
                  <View style={styles.invitationInfo}>
                    <Text variant="body" weight="semibold" style={{ marginBottom: spacing[1] }}>
                      Utilisateur #{invitation.user_id}
                    </Text>
                    <Text variant="small" color="tertiary">
                      Refusée {formatDate(invitation.updated_at)}
                    </Text>
                  </View>
                  <Badge 
                    text="Refusée" 
                    color={invitationService.getInvitationStatusColor(invitation.status)}
                  />
                </View>
              </Card>
            ))}
          </View>
        </View>
      )}

      {/* Invitations expirées */}
      {expiredInvitations.length > 0 && (
        <View style={styles.section}>
          <Text variant="h3" weight="semibold" style={{ marginBottom: spacing[3] }}>
            Expirées ({expiredInvitations.length})
          </Text>
          <View style={styles.invitationsList}>
            {expiredInvitations.map(invitation => (
              <Card key={invitation.id} variant="outlined" padding="small" style={styles.invitationCard}>
                <View style={styles.invitationHeader}>
                  <View style={styles.invitationInfo}>
                    <Text variant="body" weight="semibold" style={{ marginBottom: spacing[1] }}>
                      Utilisateur #{invitation.user_id}
                    </Text>
                    <Text variant="small" color="tertiary">
                      Expirée {formatDate(invitation.expires_at)}
                    </Text>
                  </View>
                  <Badge 
                    text="Expirée" 
                    color={invitationService.getInvitationStatusColor('expired')}
                  />
                </View>
              </Card>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[3],
    padding: spacing[2],
    borderRadius: spacing[2],
    backgroundColor: 'transparent',
  },
  section: {
    marginBottom: spacing[4],
  },
  invitationsList: {
    gap: spacing[2],
  },
  invitationCard: {
    marginBottom: 0,
  },
  invitationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invitationInfo: {
    flex: 1,
    marginRight: spacing[3],
  },
  invitationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  cancelButton: {
    padding: spacing[1],
    borderRadius: spacing[1],
  },
});
