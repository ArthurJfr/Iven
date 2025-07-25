# Architecture Frontend Mobile – Iven

## Technologies principales & Dépendances

Ce projet utilise les technologies et bibliothèques suivantes :

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

## Structure des dossiers recommandée

```
app/
  _layout.tsx
  index.tsx
  profile.tsx
  settings.tsx
  auth/
    login.tsx
    register.tsx
  events/
    [eventId]/
      index.tsx
      tasks.tsx
      budget.tsx
      media.tsx
      chat.tsx
  create-event.tsx
components/
  screens/
    HomeScreen.tsx
    LoginScreen.tsx
    RegisterScreen.tsx
    EventDetailScreen.tsx
    TaskScreen.tsx
    BudgetScreen.tsx
    MediaScreen.tsx
    ChatScreen.tsx
    SettingsScreen.tsx
  ui/
    Button.tsx
    Input.tsx
    Card.tsx
    Avatar.tsx
    Loading.tsx
  events/
  media/
  chat/
  hooks/
services/
  api.ts
  auth.ts
contexts/
  AuthContext.tsx
  ThemeContext.tsx
store/
  (état global, ex: Zustand, Redux ou context API)
types/
  (types TypeScript partagés)
utils/
  (fonctions utilitaires)
assets/
  (images, icônes, polices)
```

### Détail des principaux dossiers/fichiers
- **app/** : pages et routes principales (Expo Router)
- **components/screens/** : écrans principaux (auth, dashboard, détail événement, etc.)
- **components/ui/** : composants réutilisables (boutons, inputs, cartes, avatars, loaders)
- **components/events, media, chat/** : composants spécifiques à chaque module
- **services/** : gestion des appels API, logique métier côté client
- **contexts/** : contextes React (auth, thème, etc.)
- **store/** : gestion d’état globale
- **types/** : définitions TypeScript partagées
- **utils/** : fonctions utilitaires
- **assets/** : images, icônes, polices

---

## Fonctionnement du module média
- **Sélection** : Utilisation de `expo-image-picker` ou `expo-media-library` pour choisir photos/vidéos depuis la galerie ou l’appareil photo.
- **Upload** : Appel à un endpoint via `services/api.ts` pour obtenir une URL présignée, puis upload direct sur S3.
- **Affichage** : `MediaScreen` affiche la galerie, mise à jour via React Query (WebSocket/invalidation du cache pour temps réel).
- **Sécurité** : Suppression sécurisée, contrôle d’accès côté backend.

---

## Bonnes pratiques UI/UX
- Charte graphique : bleu/blanc, typo sans-serif
- Navigation fluide (≤ 3 clics pour accéder à une fonctionnalité)
- Accessibilité mobile (WCAG 2.1, compatibilité lecteurs d’écran, thème global)

---

## Tests
- **Unitaires** : React Native Testing Library
- **Intégration** : Supertest, Postman
- **E2E** : Detox
- **Performance** : Profiling React Native

---

## À adapter selon l’évolution du projet et les besoins spécifiques. 