# Architecture Frontend Mobile – Iven

## 🎯 **État Actuel du Projet**

Ce projet utilise une architecture moderne React Native + Expo avec une approche hybride MySQL + MongoDB pour le backend.

### **Dépendances principales (`package.json`)**
- **React Native** (`react-native`) + **Expo** (`expo`)
- **Expo Router** (`expo-router`) - Navigation filesystem
- **TypeScript** (`typescript`) - Type safety
- **NativeWind** (`nativewind`) - Tailwind CSS pour React Native
- **Axios** (`axios`) - Client HTTP
- **@expo/vector-icons** - Icônes
- **@react-native-async-storage/async-storage** - Stockage local
- **expo-image-picker** - Sélection photos/vidéos
- **expo-media-library** - Accès galerie
- **expo-camera** - Appareil photo
- **expo-location** - Géolocalisation
- **expo-notifications** - Push notifications
- **react-native-maps** - Cartes
- **react-native-safe-area-context** - Safe areas
- **react-native-screens** - Navigation optimisée

---

## 📁 **Structure des Dossiers Actuelle**

```
app/                                    # Expo Router (Navigation)
├── _layout.tsx ✅                      # Layout racine + AuthInitializer
├── (auth)/                             # Groupe routes authentification
│   ├── _layout.tsx ✅                  # Layout auth + AuthProvider
│   ├── login.tsx ✅                    # Point d'entrée LoginScreen
│   ├── register.tsx ✅                 # Point d'entrée RegisterScreen
│   ├── confirm-account.tsx ✅          # Point d'entrée ConfirmAccountScreen
│   └── forgot-password.tsx ✅          # Point d'entrée ForgotPasswordScreen
├── (tabs)/                             # Groupe routes avec tabs
│   ├── _layout.tsx ✅                  # Bottom tabs + navigation
│   ├── index.tsx ✅                    # HomeScreen (Dashboard)
│   ├── test.tsx ✅                     # Tests API
│   ├── test-auth.tsx ✅                # Tests authentification
│   ├── ui-test.tsx ✅                  # Tests composants UI
│   ├── events/
│   │   ├── _layout.tsx ✅              # Stack navigation événements
│   │   ├── index.tsx ✅                # Liste événements
│   │   ├── create-event.tsx ✅         # Création événement
│   │   └── [id]/                       # Événement dynamique
│   │       ├── _layout.tsx ✅          # Tabs événement
│   │       ├── index.tsx ✅            # Détail événement
│   │       ├── tasks.tsx ✅            # Gestion tâches
│   │       ├── budget.tsx ✅           # Gestion budget
│   │       ├── media.tsx ✅            # Galerie médias
│   │       ├── chat.tsx ✅             # Chat temps réel
│   │       └── manage.tsx ✅           # Paramètres événement
│   ├── tasks/
│   │   └── index.tsx ✅                # Tâches globales
│   ├── media/
│   │   └── index.tsx ✅                # Médias globaux
│   ├── users/
│   │   └── index.tsx ✅                # Utilisateurs
│   ├── profile/
│   │   └── index.tsx ✅                # Profil utilisateur
│   └── calendars/
│       └── index.tsx ✅                # Calendrier
├── modals/                             # Modales (présentation modale)
│   ├── create-event.tsx ✅             # Création événement
│   ├── edit-profile.tsx ✅             # Édition profil
│   ├── media-upload.tsx ✅             # Upload médias
│   ├── media-viewer.tsx ✅             # Visualiseur média
│   ├── invite-participants.tsx ✅      # Invitation participants
│   ├── task-detail.tsx ✅              # Détail/édition tâche
│   └── expense-form.tsx ✅             # Ajout/édition dépense
└── notifications/
    └── index.tsx ✅                    # Notifications

components/                              # Composants réutilisables
├── AuthInitializer.tsx ✅              # Initialisation auth + navigation
├── ProtectedRoute.tsx ✅               # Protection routes
├── DevNavigator.tsx ✅                 # Navigation développement
├── Debugger.tsx ✅                     # Debug intégré
├── DebuggerView.tsx ✅                 # Interface debug
├── screens/                            # Écrans avec logique métier
│   ├── HomeScreen.tsx ✅               # Dashboard principal
│   ├── LoginScreen.tsx ✅              # Connexion
│   ├── RegisterScreen.tsx ✅           # Inscription
│   ├── ConfirmAccountScreen.tsx ✅     # Confirmation compte
│   ├── ForgotPasswordScreen.tsx ✅     # Mot de passe oublié
│   ├── EventsScreen.tsx ✅             # Liste événements
│   ├── ProfileScreen.tsx ✅            # Profil utilisateur
│   └── SettingsScreen.tsx ✅           # Paramètres
└── ui/                                # Design System (Atomic Design)
    ├── atoms/                          # Composants de base
    │   ├── Avatar.tsx ✅               # Avatar utilisateur
    │   ├── Badge.tsx ✅                # Badges/étiquettes
    │   ├── Divider.tsx ✅              # Séparateurs
    │   ├── Spinner.tsx ✅              # Indicateur de chargement
    │   └── Text.tsx ✅                 # Texte avec styles
    ├── molecules/                      # Composants composés
    │   ├── EmptyState.tsx ✅           # État vide
    │   ├── LoadingOverlay.tsx ✅       # Overlay de chargement
    │   └── SearchBar.tsx ✅            # Barre de recherche
    ├── organisms/                      # Composants complexes
    │   └── Header.tsx ✅               # En-têtes
    ├── Button.tsx ✅                   # Boutons avec variantes
    ├── Card.tsx ✅                     # Cartes avec variantes
    ├── EventCard.tsx ✅                # Carte événement
    ├── EventsTopBar.tsx ✅             # Top bar événements
    ├── TopBar.tsx ✅                   # Top bar générique
    ├── BottomBar.tsx ✅                # Navigation tabs
    ├── Input.tsx ✅                    # Champs de saisie (refactorisé)
    ├── Input/                          # Nouveau système Input
    │   ├── Input.tsx ✅                # Input configurable
    │   └── index.ts ✅                 # Re-exports
    ├── ErrorText.tsx ✅                # Affichage d'erreurs
    ├── ToggleTheme.tsx ✅              # Basculement thème
    └── AccountActivationBanner.tsx ✅  # Bannière activation compte

services/                               # Services & API
├── ApiService.ts ✅                    # Client Axios configuré
├── ApiConfig.ts ✅                     # Configuration API
├── AuthService.ts ✅                   # Service authentification
├── LoggerService.ts ✅                 # Logging
├── README_API.md ✅                    # Documentation API
├── README_AUTH.md ✅                   # Documentation auth
└── README_EVENTS_API.md ✅            # Documentation événements

contexts/                               # Contextes React
├── ThemeContext.tsx ✅                 # Gestion thème clair/sombre
└── AuthContext.tsx ✅                  # État authentification global

types/                                  # Types TypeScript
├── api.ts ✅                           # Types API responses
├── auth.ts ✅                          # Types authentification
├── events.ts ✅                        # Types événements (MySQL + MongoDB)
├── tasks.ts ✅                         # Types tâches
├── users.ts ✅                         # Types utilisateurs
└── categories.ts ✅                    # Types catégories

styles/                                 # Styles et thèmes
├── global.ts ✅                        # Styles globaux
├── components/                         # Styles composants
│   ├── buttons.ts ✅                   # Styles boutons
│   ├── inputs.ts ✅                    # Styles inputs
│   ├── layout.ts ✅                    # Styles layout
│   └── typography.ts ✅                # Styles typographie
├── themes/                             # Thèmes
│   └── index.ts ✅                     # Export thèmes
└── tokens/                             # Design tokens
    ├── colors.ts ✅                    # Palette couleurs
    ├── shadows.ts ✅                   # Ombres
    ├── spacing.ts ✅                   # Espacements
    └── typography.ts ✅                # Système typographique

data/                                   # Données mock/statiques
├── events.json ✅                      # Événements mock
├── users.json ✅                       # Utilisateurs mock
├── tasks.json ✅                       # Tâches mock
├── categories.json ✅                  # Catégories
└── media.json ✅                       # Médias mock

assets/                                 # Ressources statiques
├── adaptive-icon.png ✅                # Icône adaptative
├── favicon.png ✅                      # Favicon
├── icon.png ✅                         # Icône principale
└── splash-icon.png ✅                  # Icône splash
```

---

## ✅ **Fonctionnalités Implémentées**

### **🔐 Système d'Authentification Complet**
- **AuthContext** : Gestion globale de l'état d'authentification
- **AuthService** : Services login, register, confirm account, logout
- **AuthInitializer** : Initialisation automatique + navigation intelligente
- **ProtectedRoute** : Protection des routes sensibles
- **Screens** : Login, Register, ConfirmAccount, ForgotPassword
- **Auto-login** : Persistance session + redirection automatique
- **Account activation** : Confirmation email + bannière de statut

### **🎨 Design System Avancé**
- **Atomic Design** : Atoms, Molecules, Organisms
- **Thème dynamique** : Clair/sombre avec ThemeContext
- **Composants UI** : Button, Card, Input, Avatar, Badge, Spinner
- **Typography** : Système de textes avec variantes
- **Layout** : Header, TopBar, BottomBar, LoadingOverlay
- **Input refactorisé** : Système modulaire avec variants, sizes, states

### **📱 Navigation & Routing**
- **Expo Router** : Navigation filesystem moderne
- **Groupes de routes** : (auth), (tabs), modals
- **Navigation dynamique** : Événements avec [id]
- **Modales** : Présentation modale pour formulaires
- **Bottom tabs** : Navigation principale
- **Stack navigation** : Navigation événements

### **🗄️ Gestion des Événements**
- **CRUD complet** : Création, lecture, modification, suppression
- **Détail événement** : Vue complète avec onglets
- **Participants** : Invitation, gestion statuts
- **Tâches** : Création, assignation, suivi
- **Budget** : Dépenses, contributions, répartition
- **Médias** : Upload, galerie, albums (préparé pour MongoDB)
- **Chat** : Messages temps réel (préparé pour MongoDB)

### **🔧 Services & API**
- **ApiService** : Client Axios configuré avec intercepteurs
- **ApiConfig** : Configuration centralisée (baseURL, timeout, etc.)
- **AuthService** : Services authentification complets
- **LoggerService** : Logging avancé avec niveaux
- **Documentation** : README détaillés pour chaque service

### **📊 Types TypeScript**
- **Types API** : Responses, requests, configurations
- **Types Auth** : User, AuthResponse, LoginRequest, etc.
- **Types Events** : Event, EventParticipant, EventTask, etc.
- **Types hybrides** : MySQL + MongoDB (chat, médias)
- **Types utilitaires** : Categories, Users, Tasks

### **🛠️ Outils de Développement**
- **DevNavigator** : Navigation rapide entre écrans
- **Debugger** : Interface debug intégrée
- **DebuggerView** : Visualisation des logs
- **Tests** : Écrans de test API, auth, UI
- **LoggerService** : Interception et formatage des logs

---

## 🚀 **Architecture Technique Avancée**

### **🏗️ Structure Modulaire**
```typescript
// Architecture en couches
├── Presentation (app/, components/screens/)
├── Business Logic (services/, contexts/)
├── Data Layer (types/, data/)
└── Infrastructure (styles/, assets/)
```

### **🔄 Gestion d'État**
```typescript
// Contextes React pour état global
├── AuthContext     // État authentification
├── ThemeContext    // État thème
└── Future: EventContext, ChatContext, MediaContext
```

### **📡 Communication API**
```typescript
// Services unifiés
├── ApiService      // Client HTTP configuré
├── AuthService     // Authentification
└── Future: EventService, MediaService, ChatService
```

### **🎯 Patterns Utilisés**
- **Provider Pattern** : Contextes React
- **Service Pattern** : Services métier
- **Repository Pattern** : Accès données
- **Observer Pattern** : WebSocket (préparé)
- **Factory Pattern** : Composants UI

---

## 🔮 **Fonctionnalités Prévues (Architecture Hybride)**

### **💬 Chat Temps Réel (MongoDB)**
- **WebSocket** : Socket.io pour temps réel
- **Messages** : Stockage MongoDB avec dénormalisation
- **Réactions** : Emojis, likes, mentions
- **Statuts** : Lecture, frappe, présence

### **🖼️ Gestion Médias (MongoDB)**
- **Upload** : S3 + presigned URLs
- **Métadonnées** : EXIF, géolocalisation, tags
- **Albums** : Organisation flexible
- **Interactions** : Likes, commentaires
- **Traitement** : Thumbnails, compression

### **🔔 Notifications**
- **Push** : Expo notifications
- **In-app** : Notifications temps réel
- **Email** : Notifications importantes
- **Scheduling** : Notifications programmées

---

## 📈 **Performance & Optimisation**

### **⚡ Optimisations Actuelles**
- **Lazy loading** : Routes Expo Router
- **Memoization** : React.memo, useMemo
- **Code splitting** : Modules séparés
- **Image optimization** : Expo Image
- **Bundle analysis** : Métriques de taille

### **🔮 Optimisations Futures**
- **React Query** : Cache et synchronisation
- **Virtual scrolling** : Listes longues
- **Image caching** : Cache local images
- **Offline support** : Sync quand reconnecté
- **Background sync** : Synchronisation arrière-plan

---

## 🧪 **Tests & Qualité**

### **✅ Tests Actuels**
- **Tests manuels** : Écrans de test intégrés
- **Validation** : Forms avec validation
- **Error handling** : Gestion d'erreurs robuste
- **Type safety** : TypeScript strict

### **🔮 Tests Futurs**
- **Unit tests** : Jest + React Native Testing Library
- **Integration tests** : API calls
- **E2E tests** : Detox
- **Performance tests** : Profiling React Native

---

## 🎨 **UI/UX & Accessibilité**

### **✅ Implémenté**
- **Design system** : Cohérence visuelle
- **Thème dynamique** : Clair/sombre
- **Responsive** : Adaptation écrans
- **Safe areas** : Support notches
- **Haptic feedback** : Retour tactile

### **🔮 À implémenter**
- **Accessibilité** : Screen readers, VoiceOver
- **Animations** : Transitions fluides
- **Micro-interactions** : Feedback utilisateur
- **Loading states** : États de chargement
- **Error states** : États d'erreur

---

## 📋 **Prochaines Étapes Recommandées**

### **Phase 1 : Backend Integration** 🗄️
1. **Créer les tables MySQL** : `source DATABASE_EVENTS_SCHEMA_ADAPTED.sql`
2. **Configurer MongoDB** : Collections event_messages, event_media
3. **Implémenter API** : Endpoints hybrides MySQL + MongoDB
4. **WebSocket** : Socket.io pour chat temps réel

### **Phase 2 : Frontend Enhancement** 📱
1. **React Query** : Cache et synchronisation API
2. **Hooks spécialisés** : useEvents, useMedia, useChat
3. **Optimisations** : Virtual scrolling, image caching
4. **Animations** : Transitions et micro-interactions

### **Phase 3 : Production Ready** 🚀
1. **Tests complets** : Unit, integration, E2E
2. **Performance** : Profiling et optimisations
3. **Monitoring** : Analytics et crash reporting
4. **CI/CD** : Pipeline de déploiement

---

## 🏆 **Points Forts de l'Architecture**

### **✅ Robustesse**
- **Type safety** : TypeScript strict
- **Error handling** : Gestion d'erreurs complète
- **Validation** : Forms avec validation
- **Protection routes** : Auth guards

### **✅ Scalabilité**
- **Modularité** : Architecture en couches
- **Réutilisabilité** : Composants UI
- **Maintenabilité** : Code organisé
- **Évolutivité** : Patterns extensibles

### **✅ Performance**
- **Lazy loading** : Routes et composants
- **Optimisations** : Memoization, code splitting
- **Cache** : Préparé pour React Query
- **Bundle size** : Optimisation taille

### **✅ Developer Experience**
- **Hot reload** : Expo development
- **Debug tools** : Interface debug intégrée
- **Documentation** : README détaillés
- **Type safety** : Autocomplétion TypeScript

---

**Cette architecture frontend moderne et robuste est prête pour l'intégration avec votre backend hybride MySQL + MongoDB !** 🎉 