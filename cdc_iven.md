Cahier des Charges Détaillé – Iven (Application Mobile)

1. Contexte et Présentation du Projet

Nom du Projet : Iven (Application de Gestion d’Événements)
Contexte général : Besoin d’un outil mobile pour organiser événements personnels et professionnels dans une interface fluide.
Origine du besoin : Centraliser création, gestion et communication autour des événements (réunions, fêtes, voyages, anniversaires).
Enjeux métier et objectifs stratégiques :

- Expérience mobile native via React Native
- Scalabilité backend pour gérer les pics d’usage
- Sécurité et confidentialité des données personnelles

2. Objectifs de l’Application

Objectifs principaux :

- Création et gestion complète d’événements (physiques ou virtuels)
- Collaboration entre participants (chat, tâches, budget)
- Notifications centralisées et rappels

Objectifs secondaires :

- Support multi-langue
- Mode sombre/clair
- Feedback intégré

3. Périmètre Fonctionnel

Auth & Profil utilisateur : inscription, connexion, mot de passe oublié, JWT, préférences (langue, thème).
Gestion d’Événements : création d’événement (titre, type, dates), participants (invitation e‑mail/username), tableau de bord (tâches, budget, médias).
Tâches : création, assignation, filtres, progression.
Budget : suivi dépenses, contributions, répartition automatique.
Calendrier : vue événement mensuelle/hebdomadaire.
Chat : salon par événement, historique, notifications.
Médias : espace de stockage par événement pour photos, images, vidéos (upload, visualisation, suppression sécurisée).
Notifications : rappels, alertes d’événements, nouveaux messages.
Feedback & Support : formulaire, FAQ, contact.

Cas d’usage principaux :

- Organisateur : créer, inviter participants, gérer tâches, budget et médias.
- Participant : accepter invitations, communiquer, consulter tâches et calendrier.
- Invité temporaire : rejoindre un événement sans compte, consulter contenu si autorisé.

4. Exigences Non-Fonctionnelles

- Performances : API < 200 ms, médias servis via CDN
- Sécurité : JWT, TLS, validation serveur, contrôle d’accès fichiers
- Disponibilité : SLA 99.9 %, redondance base et stockage
- Scalabilité : microservices Docker/Kubernetes, auto-scaling, CDN
- Compatibilité : iOS 14+ et Android 8+, résolutions standards
- Accessibilité : conformité WCAG 2.1 niveau AA

5. Architecture Technique

5.1. Schéma Global

Client mobile : React Native + Expo Router\
API Gateway : Express.js\
Microservices : Node.js (MySQL, MongoDB, Redis, RabbitMQ/Kafka)\
Stockage objets : AWS S3 (media)\
CDN : diffusion rapide des médias\
Load Balancer : Nginx ou service cloud équivalent\
CI/CD : GitHub Actions + Helm Charts sur Kubernetes

5.2. Backend – Microservices

- API Gateway : authentification, routage, gestion du trafic
- Auth Service : gestion des JWT, utilisateurs, sessions (MySQL + Redis)
- Events Service : CRUD événements/invitations, publication messages broker
- Task & Budget Service : gestion des tâches et transactions financières, orchestration
- Chat Service : communication temps réel via WebSocket (Socket.io), stockage MongoDB
- Media Service : upload/download S3, vignettes, transcodage vidéo
- Notification Service : envoi push/email via broker (FCM/APNS)
- Monitoring & Logging : ELK, Prometheus/Grafana
- Jobs planifiés : rappels, nettoyage via worker (Bull/Agenda.js)

5.3. Architecture Express.js

Structure du backend Express.js :
```
backend/
├── api-gateway/
│   ├── src/
│   │   ├── index.ts       # Point d’entrée du gateway
│   │   ├── app.ts         # Configuration Express
│   │   ├── routes/        # Définition des routes
│   │   ├── controllers/   # Logique métier
│   │   ├── services/      # Appels aux microservices et bases
│   │   └── utils/         # Helpers et middlewares
│   ├── Dockerfile         # Image Docker du gateway
│   └── helm-chart/        # Déploiement Kubernetes
├── services/
│   ├── auth-service/      # Service d’authentification (MySQL, Redis)
│   ├── event-service/     # CRUD événements et invitations
│   ├── task-budget-service/# Gestion des tâches et budget
│   ├── chat-service/      # WebSocket + MongoDB
│   ├── media-service/     # Upload S3, transcodage, antivirus
│   └── notification-service/ # Envoi push/email
└── shared/
    ├── config/            # Variables d’environnement, config globale
    └── lib/               # Bibliothèques et utilitaires partagés
```

TypeScript strict, tests unitaires par service, Dockerfile et Helm Chart pour chaque module.

5.4 Architecture Frontend Mobile. Architecture Frontend Mobile (React Native + Expo Router)

Technologies clés : React Native (Expo), Expo Router, TypeScript, React Query, Nativewind, Expo ImagePicker, Axios, React Hook Form, Zod

Structure de l’application :
```
iven/
├── app/
│   ├── index.tsx          # Point d’entrée de l’application
│   ├── login.tsx          # Écran de connexion
│   ├── register.tsx       # Écran d’inscription
│   ├── settings.tsx       # Paramètres utilisateur
│   ├── events/            # Dossier par événement
│   │   └── [eventId]/
│   │       ├── index.tsx  # Détail général de l’événement
│   │       ├── tasks.tsx  # Gestion des tâches
│   │       ├── budget.tsx # Gestion du budget
│   │       ├── media.tsx  # Galerie médias
│   │       └── chat.tsx   # Salon de discussion
│   └── create-event.tsx   # Création d’un nouvel événement
├── components/
│   ├── screens/           # Écrans principaux
│   ├── ui/                # Composants UI réutilisables
│   ├── events/            # Composants spécifiques aux événements
│   ├── media/             # Composants spécifiques aux médias
│   ├── chat/              # Composants spécifiques au chat
│   └── hooks/             # Hooks personnalisés
├── services/              # Appels API
├── contexts/              # Contexts globaux (auth, thème)
├── store/                 # Gestion d’état (Redux / Zustand)
├── types/                 # Types TypeScript partagés
├── utils/                 # Fonctions utilitaires
└── assets/                # Ressources statiques (images, icônes)
```

Fonctionnement du module média :
- Sélection de photos/vidéos via expo-image-picker
- Requête pour URL présignée + upload direct sur S3
- Affichage dynamique de la galerie via React Query et WebSocket (invalidation cache)

5.5. Schéma de Base de Données Schéma de Base de Données

5.5.1. Schéma MySQL amélioré

```sql
-- Table users
CREATE TABLE users (
  id             BIGINT       AUTO_INCREMENT PRIMARY KEY,
  username       VARCHAR(50)  NOT NULL UNIQUE,
  email          VARCHAR(100) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  lang           VARCHAR(8)   NOT NULL DEFAULT 'en',
  theme          ENUM('light','dark') NOT NULL DEFAULT 'light',
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_created (created_at)
);

-- Table events
CREATE TABLE events (
  id            BIGINT       AUTO_INCREMENT PRIMARY KEY,
  organizer_id  BIGINT       NOT NULL,
  title         VARCHAR(150) NOT NULL,
  type          ENUM('physical','virtual') NOT NULL,
  start_date    DATETIME     NOT NULL,
  end_date      DATETIME     NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_user FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_events_organizer (organizer_id),
  INDEX idx_events_period (start_date, end_date)
);

-- Table participants
CREATE TABLE participants (
  id          BIGINT      AUTO_INCREMENT PRIMARY KEY,
  event_id    BIGINT      NOT NULL,
  user_id     BIGINT      NULL,
  email       VARCHAR(100) NULL,
  role        ENUM('organizer','participant','temporary') NOT NULL DEFAULT 'participant',
  status      ENUM('pending','accepted','declined') NOT NULL DEFAULT 'pending',
  token       CHAR(36)    NOT NULL,
  invited_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_part_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_part_user  FOREIGN KEY (user_id)  REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_event_user_email (event_id, COALESCE(user_id, email)),
  INDEX idx_part_status (status),
  INDEX idx_part_token  (token)
);

-- Table tasks
CREATE TABLE tasks (
  id           BIGINT       AUTO_INCREMENT PRIMARY KEY,
  event_id     BIGINT       NOT NULL,
  title        VARCHAR(150) NOT NULL,
  description  TEXT,
  assignee_id  BIGINT       NULL,
  status       ENUM('todo','in_progress','done') NOT NULL DEFAULT 'todo',
  due_date     DATETIME     NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_tasks_user  FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_tasks_event (event_id),
  INDEX idx_tasks_status (due_date, status)
);

-- Tables budgets & contributions
CREATE TABLE budgets (
  id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
  event_id   BIGINT       NOT NULL UNIQUE,
  total      DECIMAL(12,2) NOT NULL CHECK (total >= 0),
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_budg_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE contributions (
  id              BIGINT       AUTO_INCREMENT PRIMARY KEY,
  budget_id       BIGINT       NOT NULL,
  contributor_id  BIGINT       NOT NULL,
  amount          DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_contr_budget FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
  CONSTRAINT fk_contr_user   FOREIGN KEY (contributor_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_contr_budget (budget_id),
  INDEX idx_contr_user   (contributor_id)
);

-- Table messages
CREATE TABLE messages (
  id           BIGINT       AUTO_INCREMENT PRIMARY KEY,
  event_id     BIGINT       NOT NULL,
  sender_id    BIGINT       NOT NULL,
  content      TEXT         NOT NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_msg_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_msg_user  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_msg_event_time (event_id, created_at)
);

-- Table media_items
CREATE TABLE media_items (
  id           BIGINT       AUTO_INCREMENT PRIMARY KEY,
  event_id     BIGINT       NOT NULL,
  url          VARCHAR(500) NOT NULL,
  type         ENUM('image','video') NOT NULL,
  uploaded_by  BIGINT       NOT NULL,
  uploaded_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_media_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_media_user  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_media_event_time (event_id, uploaded_at),
  INDEX idx_media_type (type)
);
```

5.5.2. Modélisation MongoDB

```js
// Collection chats
{
  _id: ObjectId("..."),
  eventId: NumberLong("123"),
  participants: [ { userId: NumberLong("1"), username: "alice" }, ... ],
  messages: [
    { _id: ObjectId(), senderId: NumberLong("1"), content: "...", createdAt: ISODate("2025-07-28T10:15:00Z"), attachments: [...] },
    ...
  ],
  updatedAt: ISODate("2025-07-28T10:16:00Z")
}

// Indexes
// db.chats.createIndex({ eventId: 1 });
// db.chats.createIndex({ "messages.createdAt": 1 });

// Pour gros volumes, séparer messages :
// Collection chats sans messages + Collection messages avec chatId
// Indexes messages : chatId, createdAt, senderId

// Collection media
{
  _id: ObjectId("..."),
  eventId: NumberLong("123"),
  uploader: { userId: NumberLong("2"), username: "bob" },
  type: "video",
  originalUrl: "s3://bucket/abcd.mp4",
  presignedUrl: "https://...",
  thumbnails: [ { size: "small", url: "..." }, ... ],
  status: "ready",
  errorMsg: null,
  uploadedAt: ISODate("..."),
  processedAt: ISODate("...")
}

// Indexes
// db.media.createIndex({ eventId: 1 });
// db.media.createIndex({ status: 1 });
// db.media.createIndex({ "thumbnails.size": 1 });
```

6. UI / UX & Design

Charte graphique : bleu/blanc, typo sans-serif
Wireframes Figma (splash, auth, dashboard, détail événement, galerie média)
Navigation fluide en ≤ 3 clics
Accessibilité mobile (WCAG 2.1, compatibilité screen readers, thème global)

7. Plan de Tests & Validation

Tests unitaires : Jest (backend), React Native Testing Library (frontend)
Tests d’intégration : Supertest, Postman
Tests e2e : Detox
Tests de performance : k6 (API), profiling React Native
Critères d’acceptation via user stories précises

8. Déploiement & Exploitation

CI/CD : GitHub Actions → build Docker → tests → déploiement via Helm Charts (Kubernetes)
Environnements: dev, staging, production
Monitoring : Prometheus, Grafana, alertes
Logs centralisés via ELK stack
Support incident : alertes Slack/email, plan de reprise

9. Planning & Ressources

Phase 1 (3 semaines) : setup environnement, auth, profil
Phase 2 (5 semaines) : gestion des événements & participants
Phase 3 (4 semaines) : tâches & budget
Phase 4 (3 semaines) : chat, médias, notifications
Phase 5 (3 semaines) : tests, optimisation, déploiement
Total : 18 semaines (\~360 J/H)
Ressource : 1 développeur full-stack (toi, développeur étudiant)

10. Sécurité & Confidentialité

RGPD : droit accès, portabilité, suppression
Sauvegardes : journalières MySQL, continues MongoDB
Mots de passe hachés (bcrypt), TLS partout
Audit & tests de pénétration réguliers
RBAC déployé au niveau Kubernetes et des services

11. Annexes

Glossaire technique
Diagrammes : ERD, séquence upload média
Maquettes Figma, documentation API
Contacts : toi-même (développeur étudiant)

