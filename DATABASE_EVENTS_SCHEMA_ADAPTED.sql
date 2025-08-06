-- 🎪 Schéma de base de données - Événements adapté à votre structure users existante

-- 1. 🎪 Table events - Adaptée pour vos IDs INT
CREATE TABLE events (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  start_date DATETIME NOT NULL,
  end_date DATETIME,
  start_time TIME,
  end_time TIME,
  max_participants INT(11),
  status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
  category VARCHAR(50),
  type ENUM('perso', 'pro') DEFAULT 'perso',
  is_public BOOLEAN DEFAULT FALSE,
  requires_approval BOOLEAN DEFAULT FALSE,
  cover_image_url VARCHAR(500),
  created_by INT(11) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Clés étrangères
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Index pour optimiser les requêtes
  INDEX idx_events_created_by (created_by),
  INDEX idx_events_status (status),
  INDEX idx_events_start_date (start_date),
  INDEX idx_events_category (category),
  INDEX idx_events_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. 👥 Table event_participants - Table de liaison
CREATE TABLE event_participants (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  event_id INT(11) NOT NULL,
  user_id INT(11) NOT NULL,
  role ENUM('organizer', 'co-organizer', 'participant') DEFAULT 'participant',
  status ENUM('pending', 'accepted', 'declined', 'maybe') DEFAULT 'pending',
  invited_by INT(11),
  invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP NULL,
  joined_at TIMESTAMP NULL,
  left_at TIMESTAMP NULL,
  notes TEXT,
  
  -- Contraintes
  UNIQUE KEY unique_participation (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL,
  
  -- Index
  INDEX idx_event_participants_event (event_id),
  INDEX idx_event_participants_user (user_id),
  INDEX idx_event_participants_status (status),
  INDEX idx_event_participants_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. ✅ Table event_tasks
CREATE TABLE event_tasks (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  event_id INT(11) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to INT(11),
  created_by INT(11) NOT NULL,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  due_date DATETIME,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Contraintes
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Index
  INDEX idx_event_tasks_event (event_id),
  INDEX idx_event_tasks_assigned (assigned_to),
  INDEX idx_event_tasks_status (status),
  INDEX idx_event_tasks_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. 💰 Table event_expenses
CREATE TABLE event_expenses (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  event_id INT(11) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50),
  paid_by INT(11) NOT NULL,
  receipt_url VARCHAR(500),
  date_incurred DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Contraintes
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (paid_by) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Index
  INDEX idx_event_expenses_event (event_id),
  INDEX idx_event_expenses_paid_by (paid_by),
  INDEX idx_event_expenses_date (date_incurred)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. 🖼️ Médias d'événements - STOCKAGE MONGODB
-- Les médias sont stockés dans MongoDB pour optimiser la gestion des fichiers
-- et gérer efficacement les métadonnées complexes (EXIF, albums, tags, etc.).
-- 
-- Structure MongoDB : voir DATABASE_MONGODB_SCHEMA.md
-- Collection : event_media
-- 
-- AVANTAGES MongoDB pour les médias :
-- ✅ Gestion native des métadonnées complexes (EXIF, géolocalisation, tags)
-- ✅ Stockage flexible de propriétés variables (vidéo vs image vs document)
-- ✅ Indexation full-text pour recherche de fichiers par nom/caption
-- ✅ GridFS pour très gros fichiers (>16MB)
-- ✅ Performance lecture/écriture optimisée pour galeries
-- ✅ Albums et collections de médias flexibles
--
-- Les références aux événements (event_id) et utilisateurs (uploaded_by) 
-- restent des INT pour maintenir la cohérence avec MySQL.

-- 6. 💬 Messages d'événements - STOCKAGE MONGODB
-- Les messages du chat sont stockés dans MongoDB pour optimiser les performances
-- et gérer efficacement les conversations temps réel avec de gros volumes de données.
-- 
-- Structure MongoDB : voir DATABASE_MONGODB_SCHEMA.md
-- Collection : event_messages
-- 
-- AVANTAGES MongoDB pour le chat :
-- ✅ Performance écriture/lecture élevée pour messages fréquents
-- ✅ Flexibilité du schéma (métadonnées, réactions, mentions)
-- ✅ Indexation optimisée pour recherche et pagination
-- ✅ Réplication automatique et sharding horizontal
-- ✅ Gestion native des documents complexes (fichiers, réactions)
--
-- Les références aux événements (event_id) et utilisateurs (sender_id) 
-- restent des INT pour maintenir la cohérence avec MySQL.

-- 7. 🔔 Table event_invitations
CREATE TABLE event_invitations (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  event_id INT(11) NOT NULL,
  inviter_id INT(11) NOT NULL,
  invitee_email VARCHAR(255) NOT NULL,
  invitee_user_id INT(11),
  invitation_token VARCHAR(255) UNIQUE NOT NULL,
  status ENUM('sent', 'opened', 'accepted', 'declined', 'expired') DEFAULT 'sent',
  expires_at DATETIME NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP NULL,
  
  -- Contraintes
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (inviter_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (invitee_user_id) REFERENCES users(id) ON DELETE SET NULL,
  
  -- Index
  INDEX idx_event_invitations_event (event_id),
  INDEX idx_event_invitations_email (invitee_email),
  INDEX idx_event_invitations_token (invitation_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;