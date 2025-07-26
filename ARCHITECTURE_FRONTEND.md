# Architecture Frontend Mobile – Iven

## Technologies principales & Dépendances

Ce projet utilise les technologies et bibliothèques suivantes :

### Dépendances principales (`package.json`)
- **React Native** (`react-native`)
- **Expo** (`expo`)
- **Expo Router** (`expo-router`)
- **TypeScript** (`typescript`)
- **NativeWind** (`nativewind`)
- **Axios** (`axios`)
- **@expo/vector-icons**
- **expo-camera**
- **expo-constants**
- **expo-dev-client**
- **expo-device**
- **expo-file-system**
- **expo-linking**
- **expo-location**
- **expo-media-library**
- **expo-notifications**
- **expo-sensors**
- **expo-status-bar**
- **react-native-maps**
- **react-native-safe-area-context**
- **react-native-screens**

### Dépendances de développement
- **@babel/core**
- **@types/react**
- **typescript**

---

## Structure des dossiers actuelle

```
app/
  _layout.tsx ✅
  index.tsx ✅
  profile.tsx ✅
  settings.tsx ✅
  events.tsx ✅
  test.tsx ✅
  auth/
    login.tsx ✅
    register.tsx ✅
  events/
    [eventId]/
      index.tsx ❌ (À implémenter)
      tasks.tsx ❌ (À implémenter)
      budget.tsx ❌ (À implémenter)
      media.tsx ❌ (À implémenter)
      chat.tsx ❌ (À implémenter)
  create-event.tsx ❌ (À implémenter)
components/
  Debugger.tsx ✅
  DebuggerView.tsx ✅
  screens/
    HomeScreen.tsx ✅
    LoginScreen.tsx ✅
    RegisterScreen.tsx ✅
    EventsScreen.tsx ✅
    ProfileScreen.tsx ✅
    SettingsScreen.tsx ✅
    EventDetailScreen.tsx ❌ (À implémenter)
    TaskScreen.tsx ❌ (À implémenter)
    BudgetScreen.tsx ❌ (À implémenter)
    MediaScreen.tsx ❌ (À implémenter)
    ChatScreen.tsx ❌ (À implémenter)
  ui/
    BottomBar.tsx ✅
    Button.tsx ✅
    Input.tsx ✅
    ErrorText.tsx ✅
    ToggleTheme.tsx ✅
    Card.tsx ❌ (À implémenter)
    Avatar.tsx ❌ (À implémenter)
    Loading.tsx ❌ (À implémenter)
  events/ ❌ (À créer)
  media/ ❌ (À créer)
  chat/ ❌ (À créer)
  hooks/ ❌ (À créer)
services/
  LoggerService.ts ✅
  api.ts ❌ (À implémenter)
  auth.ts ❌ (À implémenter)
contexts/
  ThemeContext.tsx ✅
  AuthContext.tsx ❌ (À implémenter)
store/ ❌ (À créer)
types/ ❌ (À créer)
utils/ ❌ (À créer)
styles/
  global.ts ✅
assets/
  (images, icônes, polices) ✅
```

### Détail des principaux dossiers/fichiers
- **app/** : pages et routes principales (Expo Router) ✅
- **components/screens/** : écrans principaux (auth, dashboard, détail événement, etc.) ✅
- **components/ui/** : composants réutilisables (boutons, inputs, cartes, avatars, loaders) ✅
- **components/events, media, chat/** : composants spécifiques à chaque module ❌
- **services/** : gestion des appels API, logique métier côté client (partiellement implémenté)
- **contexts/** : contextes React (thème ✅, auth ❌)
- **store/** : gestion d'état globale ❌
- **types/** : définitions TypeScript partagées ❌
- **utils/** : fonctions utilitaires ❌
- **assets/** : images, icônes, polices ✅

---

## Fonctionnalités implémentées ✅

### Système de thème
- **ThemeContext** : Gestion du thème clair/sombre
- **ToggleTheme** : Composant de basculement de thème
- **Styles globaux** : Système de styles thématisés

### Navigation
- **BottomBar** : Navigation principale
- **Expo Router** : Système de routage

### Debug et développement
- **LoggerService** : Interception des logs console
- **DebuggerView** : Interface de visualisation des logs
- **Debugger** : Composant de debug intégré

### Composants UI de base
- **Button** : Boutons stylisés
- **Input** : Champs de saisie
- **ErrorText** : Affichage d'erreurs

---

## Fonctionnalités à implémenter ❌

### Authentification
- **AuthContext** : Gestion de l'état d'authentification
- **Services d'auth** : Login, register, token management

### Gestion des événements
- **Création d'événements** : Formulaire de création
- **Détail d'événement** : Vue détaillée avec onglets
- **Tâches** : Gestion des tâches par événement
- **Budget** : Suivi budgétaire
- **Média** : Upload et gestion des médias
- **Chat** : Communication en temps réel

### Services API
- **api.ts** : Configuration Axios et intercepteurs
- **auth.ts** : Services d'authentification

### Composants UI avancés
- **Card** : Composants de carte
- **Avatar** : Composants d'avatar
- **Loading** : Indicateurs de chargement

### Gestion d'état globale
- **Store** : Zustand, Redux ou Context API avancé

### Types TypeScript
- **types/** : Définitions partagées

---

## Fonctionnement du module média (À implémenter)
- **Sélection** : Utilisation de `expo-image-picker` ou `expo-media-library` pour choisir photos/vidéos depuis la galerie ou l'appareil photo.
- **Upload** : Appel à un endpoint via `services/api.ts` pour obtenir une URL présignée, puis upload direct sur S3.
- **Affichage** : `MediaScreen` affiche la galerie, mise à jour via React Query (WebSocket/invalidation du cache pour temps réel).
- **Sécurité** : Suppression sécurisée, contrôle d'accès côté backend.

---

## Bonnes pratiques UI/UX
- Charte graphique : bleu/blanc, typo sans-serif
- Navigation fluide (≤ 3 clics pour accéder à une fonctionnalité)
- Accessibilité mobile (WCAG 2.1, compatibilité lecteurs d'écran, thème global)

---

## Tests
- **Unitaires** : React Native Testing Library
- **Intégration** : Supertest, Postman
- **E2E** : Detox
- **Performance** : Profiling React Native

---

## Prochaines étapes recommandées

1. **Implémenter AuthContext** et services d'authentification
2. **Créer les services API** de base
3. **Développer les écrans d'événements** (création, détail, tâches)
4. **Ajouter les composants UI** manquants (Card, Avatar, Loading)
5. **Implémenter le module média** avec upload
6. **Mettre en place la gestion d'état globale**
7. **Ajouter les types TypeScript** partagés
8. **Implémenter les tests** unitaires et d'intégration 