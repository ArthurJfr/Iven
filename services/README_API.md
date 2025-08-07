# Guide d'utilisation de l'API Service

## Vue d'ensemble

Ce guide explique comment utiliser le service API nouvellement implémenté dans votre application Iven. Le service API utilise Axios et fournit une interface simple pour communiquer avec votre backend.

## Files créés

- `services/ApiService.ts` - Service principal pour les requêtes API
- `services/ApiConfig.ts` - Configuration centralisée de l'API
- `types/api.ts` - Types TypeScript pour les réponses API
- `app/(tabs)/test.tsx` - Interface de test modifiée pour tester l'API

## Configuration

### 1. Configuration de base

Modifiez le fichier `services/ApiConfig.ts` pour adapter l'URL de votre API :

```typescript
export const API_CONFIG = {
  baseURL: 'https://votre-api.com/api', // Changez cette URL
  timeout: 10000,
  // ... autres paramètres
};
```

### 2. Variables d'environnement (optionnel)

Vous pouvez utiliser des variables d'environnement Expo :

```bash
# .env.local
EXPO_PUBLIC_API_URL=https://votre-api.com/api
```

## Utilisation

### 1. Import du service

```typescript
import { apiService } from '../services/ApiService';
import type { ApiResponse, HealthCheckResponse } from '../types/api';
```

### 2. Health Check

```typescript
const testAPI = async () => {
  const response = await apiService.healthCheck();
  
  if (response.success) {
    console.log('API disponible:', response.data);
  } else {
    console.error('API indisponible:', response.error);
  }
};
```

### 3. Requêtes génériques

```typescript
// GET
const getUsers = async () => {
  const response = await apiService.get('/users');
  return response;
};

// POST
const createUser = async (userData: any) => {
  const response = await apiService.post('/users', userData);
  return response;
};

// PUT
const updateUser = async (id: string, userData: any) => {
  const response = await apiService.put(`/users/${id}`, userData);
  return response;
};

// DELETE
const deleteUser = async (id: string) => {
  const response = await apiService.delete(`/users/${id}`);
  return response;
};
```

### 4. Authentification

```typescript
// Ajouter un token
apiService.setAuthToken('votre-jwt-token');

// Supprimer le token
apiService.removeAuthToken();

// Changer l'URL de base
apiService.setBaseURL('https://nouvelle-api.com/api');
```

## Test de l'API

### Interface de test

Allez dans l'onglet "Test" de votre application pour tester l'API :

1. **🏥 Health Check** - Teste la disponibilité de l'API
2. **⚙️ Voir Config** - Affiche la configuration actuelle
3. **🔄 Changer URL** - Change l'URL de base (exemple)
4. **🔐 Add Token** - Ajoute un token de test
5. **📝 Test Logs** - Ajoute des logs de test

### Logs en temps réel

Tous les appels API sont loggés automatiquement dans la console. Vous pouvez voir :

- 🚀 Requêtes sortantes
- ✅ Réponses réussies
- ❌ Erreurs
- 📡 Changements de configuration

## Structure de réponse

Toutes les méthodes API retournent une structure standardisée :

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

## Gestion d'erreur

Le service gère automatiquement :

- **Timeout** - Timeout configurable (10s par défaut)
- **Retry** - Possibilité d'ajouter une logique de retry
- **Logs** - Logging automatique des erreurs
- **Types d'erreur** - Erreurs réseau, serveur, validation

## Endpoints configurés

Les endpoints sont pré-configurés dans `ApiConfig.ts` :

```typescript
endpoints: {
  health: '/health',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    // ...
  },
  events: {
    list: '/events',
    create: '/events',
    // ...
  },
  // ...
}
```

## Prochaines étapes

1. **Configurez votre API backend** avec un endpoint `/health`
2. **Adaptez l'URL** dans `ApiConfig.ts`
3. **Testez la connexion** avec l'interface de test
4. **Implémentez l'authentification** avec les tokens JWT
5. **Ajoutez vos endpoints métier** (événements, utilisateurs, etc.)

## Example d'endpoint backend (Express.js)

Voici un exemple simple d'endpoint health pour votre backend :

```javascript
// routes/health.js
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  });
});
```

## Troubleshooting

### Problèmes courants

1. **Erreur de connexion** - Vérifiez l'URL dans `ApiConfig.ts`
2. **CORS** - Configurez CORS sur votre backend
3. **Timeout** - Augmentez la valeur dans la config si nécessaire
4. **SSL** - En développement, utilisez HTTP au lieu de HTTPS

### Logs utiles

- Regardez l'onglet "Test" pour voir les logs en temps réel
- Tous les appels API sont tracés avec emoji pour faciliter le débogage