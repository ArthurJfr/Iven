import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { createThemedStyles, spacing } from '../../../styles';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Header from '../../../components/ui/organisms/Header';
import Card from '../../../components/ui/Card';
import Text from '../../../components/ui/atoms/Text';
import Badge from '../../../components/ui/atoms/Badge';
import Avatar from '../../../components/ui/atoms/Avatar';
import Button from '../../../components/ui/Button';
import { LoadingOverlay, EmptyState } from '../../../components/shared';
import { invitationService, Invitation } from '../../../services/InvitationService';

export default function InvitationsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const themedStyles = createThemedStyles(theme);

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [respondingTo, setRespondingTo] = useState<number | null>(null);

  // Charger les invitations
  const loadInvitations = async () => {
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

  // Rafraîchir les invitations
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInvitations();
    setRefreshing(false);
  };

  // Charger au montage
  useEffect(() => {
    loadInvitations();
  }, []);

  // Répondre à une invitation
  const respondToInvitation = async (invitationId: number, action: 'accept' | 'decline') => {
    if (respondingTo) return;
    
    const actionText = action === 'accept' ? 'accepter' : 'refuser';
    
    Alert.alert(
      `Confirmer ${actionText}`,
      `Êtes-vous sûr de vouloir ${actionText} cette invitation ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: action === 'accept' ? 'Accepter' : 'Refuser', 
          style: action === 'accept' ? 'default' : 'destructive',
          onPress: async () => {
            try {
              setRespondingTo(invitationId);
              
              const response = await invitationService.respondToInvitation(invitationId, {
                invitation_id: invitationId,
                action
              });
              
              if (response.success && response.data) {
                // Mettre à jour l'invitation dans la liste
                setInvitations(prev => 
                  prev.map(inv => 
                    inv.id === invitationId ? response.data! : inv
                  )
                );
                
                Alert.alert(
                  'Succès', 
                  `Invitation ${action === 'accept' ? 'acceptée' : 'refusée'} avec succès !`,
                  action === 'accept' ? [
                    { text: 'OK', onPress: () => router.push(`/events/${response.data.event_id}`) }
                  ] : [{ text: 'OK' }]
                );
              } else {
                Alert.alert('Erreur', response.error || `Impossible de ${actionText} l'invitation`);
              }
            } catch (error) {
              console.error(`Erreur lors de la réponse à l'invitation:`, error);
              Alert.alert('Erreur', `Erreur lors de la réponse à l'invitation`);
            } finally {
              setRespondingTo(null);
            }
          }
        }
      ]
    );
  };

  // Annuler une invitation (si c'est l'inviteur)
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
              const response = await invitationService.cancelInvitation(invitationId);
              
              if (response.success) {
                // Retirer l'invitation de la liste
                setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
                Alert.alert('Succès', 'Invitation annulée avec succès !');
              } else {
                Alert.alert('Erreur', response.error || 'Impossible d\'annuler l\'invitation');
              }
            } catch (error) {
              console.error('Erreur lors de l\'annulation de l\'invitation:', error);
              Alert.alert('Erreur', 'Erreur lors de l\'annulation de l\'invitation');
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
      <ProtectedRoute requireAuth={true}>
        <LoadingOverlay visible={true} message="Chargement des invitations..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute requireAuth={true}>
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <Header title="Mes Invitations" />
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing[5] }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: theme.error + '15',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing[4]
            }}>
              <Ionicons name="alert-circle-outline" size={40} color={theme.error} />
            </View>
            
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: theme.text, 
              marginBottom: spacing[2], 
              textAlign: 'center' 
            }}>
              Erreur de chargement
            </Text>
            
            <Text style={{ 
              color: theme.textSecondary, 
              marginBottom: spacing[6], 
              textAlign: 'center',
              lineHeight: 22,
              paddingHorizontal: spacing[4]
            }}>
              {error}
            </Text>
            
            <TouchableOpacity
              style={{
                backgroundColor: theme.primary,
                paddingHorizontal: spacing[5],
                paddingVertical: spacing[3],
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={loadInvitations}
            >
              <Ionicons name="refresh" size={20} color="white" style={{ marginRight: spacing[2] }} />
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Header title="Mes Invitations" />
        
        <ScrollView 
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {invitations.length === 0 ? (
            <EmptyState
              icon="mail-outline"
              title="Aucune invitation"
              description="Vous n'avez pas encore reçu d'invitations à des événements"
              actionButton={{
                text: 'Découvrir des événements',
                onPress: () => router.push('/events'),
                icon: 'calendar-outline'
              }}
            />
          ) : (
            <View style={{ paddingHorizontal: spacing[5], paddingBottom: spacing[6] }}>
              {/* Invitations en attente */}
              {pendingInvitations.length > 0 && (
                <View style={styles.section}>
                  <Text variant="h4" weight="semibold" style={{ marginBottom: spacing[3] }}>
                    En attente ({pendingInvitations.length})
                  </Text>
                  <View style={styles.invitationsList}>
                    {pendingInvitations.map(invitation => (
                      <Card key={invitation.id} variant="elevated" padding="medium" style={styles.invitationCard}>
                        <View style={styles.invitationHeader}>
                          <View style={styles.invitationInfo}>
                            <Text variant="body" weight="semibold" style={{ marginBottom: spacing[1] }}>
                              Invitation à l'événement #{invitation.event_id}
                            </Text>
                            {invitation.message && (
                              <Text variant="small" color="secondary" style={{ marginBottom: spacing[2] }}>
                                "{invitation.message}"
                              </Text>
                            )}
                            <Text variant="small" color="tertiary">
                              Reçue {formatDate(invitation.created_at)}
                            </Text>
                          </View>
                          <Badge 
                            text="En attente" 
                            color={invitationService.getInvitationStatusColor(invitation.status)}
                          />
                        </View>
                        
                        <View style={styles.invitationActions}>
                          <Button
                            title="Accepter"
                            onPress={() => respondToInvitation(invitation.id, 'accept')}
                            variant="primary"
                            size="small"
                            loading={respondingTo === invitation.id}
                            disabled={respondingTo !== null}
                            style={{ flex: 1, marginRight: spacing[2] }}
                          />
                          <Button
                            title="Refuser"
                            onPress={() => respondToInvitation(invitation.id, 'decline')}
                            variant="secondary"
                            size="small"
                            loading={respondingTo === invitation.id}
                            disabled={respondingTo !== null}
                            style={{ flex: 1 }}
                          />
                        </View>
                      </Card>
                    ))}
                  </View>
                </View>
              )}

              {/* Invitations acceptées */}
              {acceptedInvitations.length > 0 && (
                <View style={styles.section}>
                  <Text variant="h4" weight="semibold" style={{ marginBottom: spacing[3] }}>
                    Acceptées ({acceptedInvitations.length})
                  </Text>
                  <View style={styles.invitationsList}>
                    {acceptedInvitations.map(invitation => (
                      <Card key={invitation.id} variant="outlined" padding="medium" style={styles.invitationCard}>
                        <View style={styles.invitationHeader}>
                          <View style={styles.invitationInfo}>
                            <Text variant="body" weight="semibold" style={{ marginBottom: spacing[1] }}>
                              Événement #{invitation.event_id}
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
                        
                        <Button
                          title="Voir l'événement"
                          onPress={() => router.push(`/events/${invitation.event_id}`)}
                          variant="outline"
                          size="small"
                          style={{ alignSelf: 'flex-start' }}
                        />
                      </Card>
                    ))}
                  </View>
                </View>
              )}

              {/* Invitations refusées */}
              {declinedInvitations.length > 0 && (
                <View style={styles.section}>
                  <Text variant="h4" weight="semibold" style={{ marginBottom: spacing[3] }}>
                    Refusées ({declinedInvitations.length})
                  </Text>
                  <View style={styles.invitationsList}>
                    {declinedInvitations.map(invitation => (
                      <Card key={invitation.id} variant="outlined" padding="medium" style={styles.invitationCard}>
                        <View style={styles.invitationHeader}>
                          <View style={styles.invitationInfo}>
                            <Text variant="body" weight="semibold" style={{ marginBottom: spacing[1] }}>
                              Événement #{invitation.event_id}
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
                  <Text variant="h4" weight="semibold" style={{ marginBottom: spacing[3] }}>
                    Expirées ({expiredInvitations.length})
                  </Text>
                  <View style={styles.invitationsList}>
                    {expiredInvitations.map(invitation => (
                      <Card key={invitation.id} variant="outlined" padding="medium" style={styles.invitationCard}>
                        <View style={styles.invitationHeader}>
                          <View style={styles.invitationInfo}>
                            <Text variant="body" weight="semibold" style={{ marginBottom: spacing[1] }}>
                              Événement #{invitation.event_id}
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
          )}
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing[6],
  },
  invitationsList: {
    gap: spacing[3],
  },
  invitationCard: {
    marginBottom: 0,
  },
  invitationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  invitationInfo: {
    flex: 1,
    marginRight: spacing[3],
  },
  invitationActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
});
