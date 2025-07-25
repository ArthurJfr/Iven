# Architecture Frontend Mobile – Iven

## Technologies principales
- **React Native** (Expo)
- **Expo Router**
- **TypeScript**
- **React Query**
- **Nativewind**
- **Expo ImagePicker**
- **Axios**
- **React Hook Form**
- **Zod**

## Structure des dossiers recommandée

```
app/
  index.tsx
  login.tsx
  register.tsx
  profile.tsx
  settings.tsx
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
contexts/
store/
types/
utils/
assets/
```

### Détail des principaux dossiers/fichiers
- **app/** : pages et routes principales (Expo Router)
- **components/screens/** : écrans principaux (auth, dashboard, détail événement, etc.)
- **components/ui/** : composants réutilisables (boutons, inputs, cartes, avatars, loaders)
- **components/events, media, chat/** : composants spécifiques à chaque module
- **services/** : appels API, gestion des requêtes réseau (ex: `api.ts`)
- **contexts/** : contextes React (auth, thème, etc.)
- **store/** : gestion d’état globale (ex: Redux, Zustand, ou context API)
- **types/** : définitions TypeScript partagées
- **utils/** : fonctions utilitaires
- **assets/** : images, icônes, polices

## Fonctionnement du module média
- **Sélection** : Utilisation de `expo-image-picker` pour choisir photos/vidéos depuis la galerie ou l’appareil photo.
- **Upload** : Appel à un endpoint via `services/api.ts` pour obtenir une URL présignée, puis upload direct sur S3.
- **Affichage** : `MediaScreen` affiche la galerie, mise à jour via React Query (WebSocket/invalidation du cache pour temps réel).
- **Sécurité** : Suppression sécurisée, contrôle d’accès côté backend.

## Bonnes pratiques UI/UX
- Charte graphique : bleu/blanc, typo sans-serif
- Navigation fluide (≤ 3 clics pour accéder à une fonctionnalité)
- Accessibilité mobile (WCAG 2.1, compatibilité lecteurs d’écran, thème global)

## Tests
- **Unitaires** : React Native Testing Library
- **Intégration** : Supertest, Postman
- **E2E** : Detox
- **Performance** : Profiling React Native

## À adapter selon l’évolution du projet et les besoins spécifiques. 