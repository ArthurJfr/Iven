# 🔐 Système d'Auto-login et Persistance de Session

## 📋 Vue d'ensemble

Le système d'auto-login permet aux utilisateurs de rester connectés entre les sessions de l'application. Il gère automatiquement la persistance de l'authentification et l'activation de compte avec connexion automatique.

## 🏗️ Architecture

### Composants principaux

1. **AuthService** - Service principal d'authentification
2. **AuthInitializer** - Composant d'initialisation au démarrage
3. **AsyncStorage** - Stockage persistant local
4. **ConfirmAccountScreen** - Interface d'activation avec auto-login

## 🔧 Fonctionnalités

### ✅ Auto-login après activation de compte

Lorsqu'un utilisateur active son compte avec le code de confirmation :

```typescript
// ConfirmAccountScreen.tsx
const response = await authService.confirmAccount(confirmationData);

if (response.success) {
  // Auto-login effectué automatiquement
  // Redirection vers l'app principale
  router.replace("/(tabs)");
}
```

### 💾 Persistance de session

Les données d'authentification sont automatiquement sauvegardées :

```typescript
// AuthService.ts
private async persistAuthData(authData: AuthResponse): Promise<void> {
  await AsyncStorage.multiSet([
    ['@iven_auth_token', authData.token],
    ['@iven_user_data', JSON.stringify(authData.user)],
    ['@iven_auth_expires', authData.expiresAt]
  ]);
}
```

### 🚀 Restauration automatique au démarrage

L'application vérifie et restaure automatiquement la session :

```typescript
// AuthInitializer.tsx
const sessionRestored = await authService.initialize();

if (sessionRestored) {
  // Redirection vers l'app
  router.replace('/(tabs)');
} else {
  // Redirection vers login
  router.replace('/(auth)/login');
}
```

## 📱 Flux d'utilisation

### 1. Activation de compte + Auto-login

```
1. Utilisateur entre le code d'activation
2. Backend confirme et retourne un token
3. AuthService sauvegarde automatiquement :
   - Token d'authentification  
   - Données utilisateur
   - Date d'expiration (72h)
4. Redirection automatique vers l'app
```

### 2. Démarrage de l'application

```
1. AuthInitializer s'exécute
2. Vérification du token stocké
3. Si valide : restauration de la session
4. Si invalide/expiré : nettoyage et redirection login
```

### 3. Déconnexion

```
1. Nettoyage des données en mémoire
2. Suppression du stockage persistant
3. Redirection vers login
```

## 🔑 Stockage des données

### Clés AsyncStorage

- `@iven_auth_token` - Token JWT d'authentification
- `@iven_user_data` - Données utilisateur (JSON)
- `@iven_auth_expires` - Date d'expiration du token

### Format des données

```typescript
// Token
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Données utilisateur
{
  "id": "123",
  "email": "user@example.com",
  "username": "user123",
  "fname": "John",
  "lname": "Doe",
  "isConfirmed": true
}

// Expiration
"2024-01-15T10:30:00.000Z"
```

## 🛡️ Sécurité

### Gestion des tokens

- **Expiration** : 72h (définie par le backend)
- **Validation** : Vérification automatique à chaque démarrage
- **Nettoyage** : Suppression automatique si expiré

### Protection des données

- Stockage local sécurisé (AsyncStorage)
- Nettoyage automatique en cas d'erreur
- Pas de stockage de mots de passe

## 🧪 Tests et Debug

### Écran de test

Utilisez `app/(tabs)/test-auth.tsx` pour tester :

```typescript
// Test de restauration
const restored = await authService.initialize();

// Test de nettoyage
await authService.logout();

// Vérification de l'état
const isAuth = authService.isAuthenticated();
```

### Logs de debug

```typescript
// Restauration réussie
console.info('✅ Session restaurée depuis le stockage');

// Session expirée
console.info('⚠️ Session expirée, nettoyage effectué');

// Auto-login après activation
console.info('✅ Compte confirmé avec succès + auto-login effectué');
```

## 🚨 Gestion d'erreurs

### Scénarios d'erreur

1. **Token corrompu** → Nettoyage automatique
2. **Erreur AsyncStorage** → Fallback vers état non connecté
3. **Expiration token** → Suppression et redirection login
4. **Erreur réseau** → Utilisation du token local si valide

### Recovery automatique

```typescript
try {
  // Tentative de restauration
  const sessionRestored = await authService.initialize();
} catch (error) {
  // Nettoyage automatique en cas d'erreur
  await this.clearStoredAuth();
  return false;
}
```

## 📋 Checklist d'implémentation

### ✅ Fonctionnalités implémentées

- [x] Auto-login après activation de compte
- [x] Persistance de session avec AsyncStorage
- [x] Restauration automatique au démarrage
- [x] Gestion de l'expiration des tokens
- [x] Nettoyage automatique lors de la déconnexion
- [x] Navigation intelligente selon l'état d'authentification
- [x] Gestion d'erreurs robuste
- [x] Interface de test et debug

### 🔧 Configuration requise

1. **AsyncStorage** installé et configuré
2. **AuthInitializer** intégré dans le layout principal
3. **Backend** retournant les tokens après activation
4. **Navigation** configurée avec les bonnes routes

## 🎯 Points clés

1. **Transparence** : L'utilisateur n'a pas besoin de se reconnecter
2. **Sécurité** : Gestion automatique de l'expiration et du nettoyage
3. **Performance** : Chargement rapide avec session restaurée
4. **Robustesse** : Recovery automatique en cas d'erreur
5. **Debug** : Logs détaillés pour le développement

---

## 📞 Support

Pour toute question sur l'implémentation, consultez :
- `services/AuthService.ts` - Logique principale
- `components/AuthInitializer.tsx` - Initialisation
- `app/(tabs)/test-auth.tsx` - Tests et debug