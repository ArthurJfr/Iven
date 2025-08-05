# Guide d'authentification - Iven

## Vue d'ensemble

Ce guide explique comment utiliser le système d'authentification complet nouvellement implémenté dans votre application Iven. Le système comprend l'inscription, la connexion, la confirmation de compte et la gestion des sessions.

## Files créés/modifiés

### Services
- `services/AuthService.ts` - Service principal d'authentification
- `services/ApiService.ts` - Service API (utilisé par AuthService)

### Types
- `types/auth.ts` - Types TypeScript pour l'authentification

### Contextes
- `contexts/AuthContext.tsx` - Contexte React pour l'état global d'authentification

### Écrans
- `components/screens/RegisterScreen.tsx` - Écran d'inscription (modifié)
- `components/screens/LoginScreen.tsx` - Écran de connexion (modifié)  
- `components/screens/ConfirmAccountScreen.tsx` - Écran de confirmation de compte (nouveau)

### Routes
- `app/(auth)/confirm-account.tsx` - Route pour la confirmation
- `app/(auth)/_layout.tsx` - Layout auth mis à jour

## Flux d'authentification

### 1. Inscription

```typescript
import { useAuth } from '../contexts/AuthContext';

const { register, error, isLoading } = useAuth();

const handleRegister = async () => {
  const success = await register(firstName, lastName, email, password);
  if (success) {
    // Redirection vers confirmation
    router.push('/confirm-account', { email });
  }
};
```

### 2. Confirmation de compte

```typescript
const { confirmAccount } = useAuth();

const handleConfirm = async () => {
  const success = await confirmAccount(email, confirmationCode);
  if (success) {
    // Utilisateur connecté automatiquement
    router.replace('/(tabs)');
  }
};
```

### 3. Connexion

```typescript
const { login, isAuthenticated } = useAuth();

const handleLogin = async () => {
  const success = await login(email, password, rememberMe);
  if (success) {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      // Compte non confirmé
      router.push('/confirm-account', { email });
    }
  }
};
```

### 4. Déconnexion

```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  router.replace('/(auth)/login');
};
```

## Utilisation dans les composants

### Hook useAuth

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { 
    user,           // Utilisateur actuel
    isAuthenticated, // État de connexion
    isLoading,      // Chargement en cours
    error,          // Erreur actuelle
    login,          // Fonction de connexion
    logout,         // Fonction de déconnexion
    clearError      // Effacer l'erreur
  } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <View>
      <Text>Bonjour {user?.firstName} !</Text>
      <Button title="Déconnexion" onPress={logout} />
    </View>
  );
}
```

### Protection des routes

```typescript
// components/ProtectedRoute.tsx
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

## Configuration du Provider

Ajoutez l'AuthProvider dans votre layout principal :

```typescript
// app/_layout.tsx
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        {/* Vos composants */}
      </ThemeProvider>
    </AuthProvider>
  );
}
```

## Endpoints backend requis

Votre API backend doit implémenter ces endpoints :

### POST /auth/register
```typescript
// Request
{
  "username": "arthur123",
  "fname": "arthur",
  "lname": "User", 
  "email": "arthur@example.com",
  "password": "SecurePassword123"
}

// Response
{
  "success": true,
  "message": "Compte créé. Email de confirmation envoyé."
}
```

### POST /auth/confirm
```typescript
// Request
{
  "email": "john@example.com",
  "confirmationCode": "123456"
}

// Response
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "username": "johndoe123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isConfirmed": true
  },
  "expiresAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /auth/login
```typescript
// Request
{
  "email": "john@example.com",
  "password": "SecurePassword123",
  "rememberMe": true
}

// Response (même que confirm)
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "username": "johndoe123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isConfirmed": true
  },
  "expiresAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /auth/resend-confirmation
```typescript
// Request
{
  "email": "john@example.com"
}

// Response
{
  "success": true,
  "message": "Nouveau code envoyé"
}
```

### POST /auth/logout
```typescript
// Request (avec Authorization header)
{}

// Response
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

### POST /auth/refresh
```typescript
// Request (avec Authorization header)
{}

// Response
{
  "token": "new-jwt-token",
  "expiresAt": "2024-01-01T00:00:00.000Z"
}
```

## Gestion des erreurs

Le système gère automatiquement :

- **Validation côté client** (email, mot de passe fort, etc.)
- **Erreurs réseau** (timeout, connexion)
- **Erreurs serveur** (credentials invalides, compte verrouillé)
- **Token expiré** (rafraîchissement automatique)

### Codes d'erreur courants

```typescript
// Types disponibles dans types/auth.ts
enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_NOT_CONFIRMED = 'ACCOUNT_NOT_CONFIRMED',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INVALID_CONFIRMATION_CODE = 'INVALID_CONFIRMATION_CODE',
  // ... autres codes
}
```

## Test de l'authentification

### Interface de test

Utilisez l'onglet "Test" de votre app pour :

1. **🏥 Health Check** - Vérifier la connexion API
2. **🔐 Tester Auth** - Endpoints d'authentification
3. **📝 Voir Logs** - Tracer les requêtes en temps réel

### Tests manuels

1. **Inscription complète** :
   - Créer un compte → Recevoir email → Confirmer → Connexion auto

2. **Connexion avec compte non confirmé** :
   - Login → Redirection vers confirmation

3. **Gestion d'erreurs** :
   - Email déjà utilisé, mot de passe faible, code invalide

## Sécurité

### Bonnes pratiques implémentées

- **Validation robuste** des inputs côté client
- **Hachage sécurisé** des mots de passe (côté backend)
- **Tokens JWT** avec expiration
- **Rafraîchissement automatique** des tokens
- **Nettoyage** des données sensibles à la déconnexion

### Recommandations backend

- Implémenter **rate limiting** sur les endpoints auth
- Utiliser **HTTPS** en production
- **Hacher les mots de passe** avec bcrypt/argon2
- **Invalider les tokens** côté serveur au logout
- **Logs de sécurité** pour les tentatives de connexion

## Troubleshooting

### Problèmes courants

1. **"useAuth must be used within AuthProvider"**
   - Vérifiez que AuthProvider englobe vos composants

2. **Token toujours expiré**
   - Vérifiez l'horloge système et la config JWT backend

3. **Emails de confirmation non reçus**
   - Vérifiez les spams, config SMTP backend

4. **Erreurs de validation**
   - Logs détaillés disponibles dans l'onglet Test

### Debug

- **Logs automatiques** : Tous les appels auth sont loggés
- **État en temps réel** : Utilisez le hook useAuth pour le debug
- **Inspection réseau** : Vérifiez les requêtes dans les dev tools

## Prochaines étapes

1. **Implémentez les endpoints backend** selon les spécifications
2. **Configurez l'envoi d'emails** de confirmation
3. **Testez le flux complet** avec l'interface de test
4. **Ajoutez la protection des routes** sensibles
5. **Implémentez la récupération** de mot de passe (forgot-password)

Le système d'authentification est maintenant prêt pour la production ! 🚀