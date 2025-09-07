# 🎉 Iven - Gestionnaire d'Événements Mobile

**Iven** est une application mobile développée avec **React Native** (Expo) et **TypeScript** permettant de créer, organiser et gérer des événements collaboratifs. L'application offre une expérience utilisateur moderne avec un système de gestion des tâches, des participants, des médias et des budgets pour vos événements.

## 📱 Aperçu de l'application

Iven est une solution complète pour organiser vos événements avec :
- **Gestion d'événements** avec participants multiples
- **Système de tâches** collaboratives avec assignation
- **Chat en temps réel** pour chaque événement
- **Gestion de budget** partagé
- **Partage de médias** (photos, vidéos)
- **Système d'invitations** et de notifications
- **Interface moderne** avec thème sombre/clair

## ✨ Fonctionnalités principales

### 🔐 Authentification
- Inscription et connexion sécurisées
- Confirmation de compte par email
- Récupération de mot de passe
- Gestion des sessions persistantes

### 🎪 Gestion d'événements
- **Création d'événements** avec détails complets (titre, description, dates, lieu)
- **Gestion des participants** avec rôles et permissions
- **Filtrage et recherche** d'événements (à venir, en cours, terminés)
- **Statistiques** détaillées par événement

### ✅ Système de tâches
- **Création et assignation** de tâches aux participants
- **Suivi du statut** (à faire, en cours, terminées)
- **Priorités** et dates d'échéance
- **Validation** par les organisateurs

### 💬 Communication
- **Chat intégré** pour chaque événement
- **Système de notifications** push
- **Invitations** avec liens de partage

### 💰 Gestion financière
- **Budgets partagés** par événement
- **Suivi des dépenses** collaborative
- **Rapports financiers** détaillés

### 📸 Partage de médias
- **Galerie photos/vidéos** par événement
- **Upload depuis l'appareil** ou prise de photo directe
- **Permissions d'accès** configurables

## 🚀 Technologies utilisées

### Frontend Mobile
- **React Native** (0.79.5) - Framework mobile cross-platform
- **Expo** (~53.0.20) - Plateforme de développement
- **TypeScript** (~5.8.3) - Typage statique
- **Expo Router** (~5.1.4) - Navigation file-based

### UI & Styling
- **NativeWind** (^4.1.23) - Tailwind CSS pour React Native
- **Expo Vector Icons** (^14.1.0) - Bibliothèque d'icônes
- **Expo Linear Gradient** (^14.1.5) - Gradients natifs

### État et contextes
- **React Context API** - Gestion d'état globale
- **AsyncStorage** (^2.2.0) - Stockage local persistant

### Fonctionnalités natives
- **Expo Camera** (~16.1.11) - Accès caméra
- **Expo Image Picker** (~16.1.4) - Sélection d'images
- **Expo Notifications** (~0.31.4) - Notifications push
- **Expo Location** (~18.1.6) - Géolocalisation
- **React Native Maps** (1.20.1) - Cartes intégrées

### Communication
- **Axios** (^1.11.0) - Client HTTP
- **WebSockets** - Communication temps réel (via services)

## 📦 Structure du projet

```
Iven/
├── app/                          # Routes et écrans (Expo Router)
│   ├── (auth)/                   # Écrans d'authentification
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── confirm-account.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                   # Navigation par onglets
│   │   ├── index.tsx            # Écran d'accueil
│   │   ├── events/              # Gestion des événements
│   │   ├── tasks/               # Gestion des tâches
│   │   ├── profile/             # Profil utilisateur
│   │   └── invitations/         # Invitations reçues
│   ├── modals/                  # Modales (création, édition)
│   └── notifications/           # Centre de notifications
│
├── components/                   # Composants réutilisables
│   ├── features/                # Composants métier
│   │   ├── auth/               # Composants d'authentification
│   │   ├── events/             # Composants d'événements
│   │   ├── tasks/              # Composants de tâches
│   │   └── home/               # Composants d'accueil
│   ├── screens/                # Écrans complets
│   ├── ui/                     # Système de design
│   │   ├── atoms/              # Composants atomiques
│   │   ├── molecules/          # Composants composés
│   │   ├── organisms/          # Composants complexes
│   │   └── templates/          # Modèles de mise en page
│   └── shared/                 # Composants partagés
│
├── contexts/                    # Contextes React
│   ├── AuthContext.tsx         # Gestion authentification
│   ├── ThemeContext.tsx        # Gestion des thèmes
│   ├── EventContext.tsx        # Gestion des événements
│   └── TaskContext.tsx         # Gestion des tâches
│
├── services/                    # Services et API
│   ├── ApiService.ts           # Client HTTP générique
│   ├── AuthService.ts          # Service d'authentification
│   ├── EventService.ts         # Service des événements
│   ├── TaskService.ts          # Service des tâches
│   ├── UserService.ts          # Service utilisateurs
│   └── InvitationService.ts    # Service d'invitations
│
├── types/                       # Définitions TypeScript
│   ├── auth.ts                 # Types d'authentification
│   ├── events.ts               # Types d'événements
│   ├── tasks.ts                # Types de tâches
│   ├── users.ts                # Types d'utilisateurs
│   └── api.ts                  # Types API
│
├── styles/                      # Système de design
│   ├── tokens/                 # Design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── shadows.ts
│   ├── themes/                 # Thèmes clair/sombre
│   ├── components/             # Styles de composants
│   └── global.ts               # Styles globaux
│
├── hooks/                       # Hooks personnalisés
│   └── useNotifications.ts     # Gestion des notifications
│
└── assets/                      # Ressources statiques
    ├── icon.png                # Icône de l'app
    ├── splash-icon.png         # Écran de démarrage
    └── adaptive-icon.png       # Icône adaptative Android
```

## 🛠 Installation et configuration

### Prérequis
- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Expo Go** sur votre appareil mobile (iOS/Android)

### Installation

1. **Cloner le repository**
   ```bash
   git clone [URL_DU_REPO]
   cd Iven
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   # Créer un fichier .env.local (exemple)
   API_BASE_URL=https://your-api.com
   ```

4. **Démarrer l'application**
   ```bash
   # Démarrage standard
   npm start
   
   # Démarrage avec cache vidé
   npm run start:clear
   
   # Lancement sur simulateur
   npm run ios     # iOS
   npm run android # Android
   ```

5. **Scanner le QR code** avec l'application **Expo Go** ou lancer sur un simulateur

## 🎨 Système de design

L'application utilise un système de design complet avec :

### Thèmes
- **Thème clair** et **thème sombre** 
- Adaptation automatique selon les préférences système
- Basculement manuel via l'interface

### Design tokens
- **Couleurs** : Palette cohérente avec variantes
- **Typographie** : Hiérarchie de textes (H1, H2, Body, Caption)
- **Espacements** : Système d'espacement harmonieux
- **Ombres** : Effets de profondeur adaptés

### Composants
- **Atomic Design** : Atoms → Molecules → Organisms
- **Composants thématiques** : Adaptation automatique aux thèmes
- **Accessibilité** : Support des lecteurs d'écran et navigation

## 📱 Fonctionnalités détaillées

### Écrans principaux

#### 🏠 Accueil
- Actions rapides (créer événement, voir événements, inviter)
- Statistiques personnalisées
- Événements à venir

#### 🎪 Événements
- Liste avec filtres (tous, à venir, en cours, terminés)
- Recherche par nom/description
- Détails complets avec onglets :
  - **Vue générale** : Informations et participants
  - **Tâches** : Liste des tâches assignées
  - **Chat** : Discussion en temps réel
  - **Budget** : Gestion financière partagée
  - **Médias** : Galerie photos/vidéos

#### ✅ Tâches
- Vue d'ensemble de toutes les tâches
- Filtrage par statut (à faire, terminées)
- Recherche textuelle
- Assignation et validation

#### 👤 Profil
- Informations personnelles
- Paramètres de notification
- Thème de l'application
- Déconnexion

## 🔧 Scripts disponibles

```bash
# Développement
npm start              # Démarre Expo avec menu interactif
npm run start:clear    # Démarre avec cache vidé
npm run web            # Version web (développement)

# Builds natifs
npm run android        # Build et lance sur Android
npm run ios           # Build et lance sur iOS

# Utilitaires
npm run migrate        # Migration des imports (si nécessaire)
npm run verify-migration # Vérification post-migration
npm run test-imports   # Test des imports
```

## 🌐 API et Backend

L'application communique avec une API REST pour :
- **Authentification** : JWT tokens, refresh tokens
- **CRUD Événements** : Création, lecture, mise à jour, suppression
- **Gestion utilisateurs** : Profils, invitations, permissions
- **Tâches collaboratives** : Assignation, statuts, validation
- **Médias** : Upload, stockage, partage
- **Notifications** : Push notifications, alertes temps réel

### Endpoints principaux
- `POST /auth/login` - Connexion
- `GET /events` - Liste des événements
- `POST /events` - Création d'événement
- `GET /tasks` - Tâches de l'utilisateur
- `POST /invitations` - Envoi d'invitations

## 🔒 Sécurité

- **Authentification JWT** avec refresh tokens
- **Validation côté client** et serveur
- **Permissions** granulaires par fonctionnalité
- **Stockage sécurisé** des tokens (AsyncStorage)
- **Gestion des erreurs** et timeouts

## 📱 Compatibilité

- **iOS** : 13.0+ 
- **Android** : API 21+ (Android 5.0+)
- **Expo Go** : Compatible
- **Builds natifs** : iOS et Android

## 🤝 Contribution

Pour contribuer au projet :

1. **Fork** le repository
2. **Créer une branche** pour votre fonctionnalité
3. **Commiter** vos changements
4. **Push** vers votre branche
5. **Créer une Pull Request**

### Standards de code
- **TypeScript** strict
- **ESLint** + **Prettier** pour le formatage
- **Nomenclature** en français pour l'UI, anglais pour le code
- **Tests** unitaires encouragés

## 📄 Licence

Ce projet est sous licence **0BSD** - voir le fichier `package.json` pour plus de détails.

## 👨‍💻 Auteur

**Développé par l'équipe Iven**

---

## 🚀 Roadmap

### Fonctionnalités à venir
- [ ] **Mode hors-ligne** avec synchronisation
- [ ] **Géolocalisation** avancée pour les événements
- [ ] **Intégrations calendrier** (Google Calendar, Apple Calendar)
- [ ] **Système de notation** et avis
- [ ] **Exports PDF** des rapports
- [ ] **API publique** pour intégrations tierces

### Améliorations techniques
- [ ] **Tests automatisés** (Jest, Detox)
- [ ] **CI/CD Pipeline** (GitHub Actions)
- [ ] **Monitoring** et analytics
- [ ] **Performance** optimisations
- [ ] **Accessibilité** améliorée

---

*Pour toute question ou support, n'hésitez pas à ouvrir une issue ou nous contacter !* 🎉