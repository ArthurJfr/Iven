# 🍃 MongoDB - Schema pour Chat et Données Temps Réel

## 🎯 **Pourquoi MongoDB pour le Chat ?**

### **Avantages par rapport à MySQL :**
- **📈 Performance** : Optimisé pour gros volumes de messages
- **🔄 Temps réel** : Écritures/lectures très rapides
- **📊 Flexibilité** : Structure documents complexes (réactions, métadonnées)
- **🔍 Recherche** : Indexation full-text native
- **📱 Scalabilité** : Sharding horizontal automatique

### **Synchronisation avec MySQL :**
- **Références** : `eventId` et `senderId` pointent vers MySQL (INT)
- **Dénormalisation** : Infos utilisateur copiées pour performance
- **Cohérence** : Synchronisation via WebSocket et API

---

## 📋 **Collections MongoDB**

### 1. 💬 **event_messages** - Chat Temps Réel

```javascript
{
  _id: ObjectId("..."),
  
  // RÉFÉRENCES MYSQL (INT pour compatibilité)
  eventId: 1,                      // events.id (MySQL)
  senderId: 42,                    // users.id (MySQL)
  
  // DONNÉES DÉNORMALISÉES (Performance - évite JOINs MySQL)
  senderInfo: {
    username: "arthur_dev",        // users.username
    fname: "Arthur",               // users.fname  
    lname: "Jaffre",               // users.lname
    avatarUrl: "https://...",      // users.avatar_url
    active: true                   // users.active
  },
  
  // CONTENU DU MESSAGE
  type: "text",                    // 'text', 'image', 'file', 'system', 'media'
  content: "Salut tout le monde ! 👋",
  
  // MÉTADONNÉES CONDITIONNELLES
  metadata: {
    // Pour fichiers/médias
    filename: "photo.jpg",
    originalFilename: "IMG_001.jpg",
    fileSize: 2048576,           // bytes
    fileUrl: "https://s3.../photo.jpg",
    mimeType: "image/jpeg",
    
    // Pour mentions (@username)
    mentions: [15, 23, 8],       // users.id mentionnés
    
    // Pour réponses
    replyTo: ObjectId("..."),    // _id du message parent
    
    // Pour messages système
    systemAction: "user_joined", // 'user_joined', 'task_completed', etc.
    systemData: {
      userId: 15,
      taskId: 42,
      taskTitle: "Acheter décorations"
    }
  },
  
  // INTERACTIONS SOCIALES
  reactions: [
    {
      userId: 15,                // users.id
      emoji: "👍",
      timestamp: ISODate("2024-01-15T14:30:00Z")
    },
    {
      userId: 23,
      emoji: "❤️", 
      timestamp: ISODate("2024-01-15T14:31:00Z")
    }
  ],
  
  // STATUT DE LECTURE
  readBy: [
    {
      userId: 15,                // users.id
      readAt: ISODate("2024-01-15T14:32:00Z")
    },
    {
      userId: 23,
      readAt: ISODate("2024-01-15T14:35:00Z")
    }
  ],
  
  // GESTION MODIFICATIONS/SUPPRESSION
  isEdited: false,
  editedAt: null,
  isDeleted: false,            // Soft delete
  deletedAt: null,
  deletedBy: null,             // users.id qui a supprimé
  
  // TIMESTAMPS
  createdAt: ISODate("2024-01-15T14:30:00Z"),
  updatedAt: ISODate("2024-01-15T14:30:00Z")
}
```

### **Index de Performance** 📊

```javascript
// Index principaux pour event_messages
db.event_messages.createIndex({ 
  "eventId": 1, 
  "createdAt": -1 
}, { 
  name: "eventId_createdAt",
  background: true 
})

db.event_messages.createIndex({ 
  "senderId": 1, 
  "createdAt": -1 
}, { 
  name: "senderId_createdAt" 
})

db.event_messages.createIndex({ 
  "eventId": 1, 
  "isDeleted": 1 
}, { 
  name: "eventId_isDeleted" 
})

// Index pour recherche
db.event_messages.createIndex({ 
  "content": "text",
  "senderInfo.username": "text" 
}, { 
  name: "text_search",
  default_language: "french"
})

// Index pour mentions
db.event_messages.createIndex({ 
  "metadata.mentions": 1 
}, { 
  name: "mentions_userId",
  sparse: true 
})

// Index pour réponses
db.event_messages.createIndex({ 
  "metadata.replyTo": 1 
}, { 
  name: "replyTo",
  sparse: true 
})

// Index pour réactions
db.event_messages.createIndex({ 
  "reactions.userId": 1 
}, { 
  name: "reactions_userId",
  sparse: true 
})
```

---

### 2. 🔔 **notifications** - Notifications Utilisateur

```javascript
{
  _id: ObjectId("..."),
  
  // DESTINATAIRE
  userId: 42,                    // users.id (MySQL)
  
  // TYPE ET CONTENU
  type: "event_invite",          // 'event_invite', 'task_assigned', 'message', 'reminder'
  title: "Invitation événement",
  body: "Arthur vous a invité à 'Anniversaire Marie'",
  
  // DONNÉES CONTEXTUELLES
  data: {
    eventId: 1,                  // events.id (MySQL)
    senderId: 15,                // users.id (MySQL)
    taskId: null,
    messageId: null,
    actionUrl: "/events/1"
  },
  
  // STATUT ET CHANNELS
  status: "pending",             // 'pending', 'sent', 'delivered', 'read'
  channels: ["push", "in_app"],  // 'push', 'email', 'in_app', 'sms'
  
  // PROGRAMMATION
  scheduledFor: ISODate("2024-01-15T15:00:00Z"),  // null pour immédiat
  sentAt: null,
  deliveredAt: null,
  readAt: null,
  
  // TIMESTAMPS
  createdAt: ISODate("2024-01-15T14:30:00Z"),
  updatedAt: ISODate("2024-01-15T14:30:00Z"),
  expiresAt: ISODate("2024-01-22T14:30:00Z")     // TTL automatique
}
```

### **Index pour Notifications** 📊

```javascript
// Index principaux
db.notifications.createIndex({ 
  "userId": 1, 
  "status": 1,
  "createdAt": -1 
}, { name: "userId_status_created" })

db.notifications.createIndex({ 
  "scheduledFor": 1 
}, { name: "scheduledFor" })

// TTL pour expiration automatique
db.notifications.createIndex({ 
  "expiresAt": 1 
}, { 
  expireAfterSeconds: 0,
  name: "auto_expire" 
})
```

---

### 3. 📝 **activity_logs** - Audit Trail

```javascript
{
  _id: ObjectId("..."),
  
  // UTILISATEUR ET ACTION
  userId: 42,                    // users.id (MySQL)
  action: "create",              // 'create', 'update', 'delete', 'login', 'invite'
  resource: "event",             // 'event', 'task', 'expense', 'user', 'message'
  resourceId: 1,                 // ID de la ressource (MySQL)
  
  // DÉTAILS DES MODIFICATIONS
  changes: {
    before: {
      title: "Anniversaire Julie",
      date: "2024-01-20"
    },
    after: {
      title: "Anniversaire Julie (reporté)",
      date: "2024-01-27"
    }
  },
  
  // MÉTADONNÉES CONTEXTUELLES
  metadata: {
    ip: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    location: "Paris, France",
    eventId: 1,                  // Contexte événement si applicable
    platform: "mobile"          // 'web', 'mobile', 'api'
  },
  
  // TIMESTAMP
  timestamp: ISODate("2024-01-15T14:30:00Z")
}
```

---

### 4. 📤 **file_uploads** - Gestion Uploads Temporaires

```javascript
{
  _id: ObjectId("..."),
  
  // IDENTIFICATION UPLOAD
  uploadId: "upload_12345",      // UUID unique
  userId: 42,                    // users.id (MySQL)
  eventId: 1,                    // events.id (MySQL)
  
  // INFORMATIONS FICHIER
  filename: "video_soiree.mp4",
  originalFilename: "VID_20240115_203045.mp4",
  mimeType: "video/mp4",
  size: 52428800,                // 50MB en bytes
  
  // UPLOAD EN CHUNKS (pour gros fichiers)
  chunks: [
    {
      chunkNumber: 1,
      chunkSize: 10485760,       // 10MB
      uploaded: true,
      uploadedAt: ISODate("...")
    },
    {
      chunkNumber: 2,
      chunkSize: 10485760,
      uploaded: true,
      uploadedAt: ISODate("...")
    }
    // ... autres chunks
  ],
  
  // STATUT UPLOAD
  status: "uploading",           // 'uploading', 'completed', 'failed', 'cancelled'
  progress: 75,                  // Pourcentage 0-100
  error: null,
  
  // STOCKAGE S3
  s3Bucket: "iven-media-prod",
  s3Key: "events/1/media/upload_12345_video_soiree.mp4",
  s3Url: null,                   // URL finale après upload complet
  
  // MÉTADONNÉES
  metadata: {
    duration: 180,               // Durée vidéo en secondes
    resolution: "1920x1080",
    codec: "h264"
  },
  
  // TIMESTAMPS ET TTL
  createdAt: ISODate("2024-01-15T14:30:00Z"),
  completedAt: null,
  expiresAt: ISODate("2024-01-15T15:30:00Z")  // TTL 1h pour nettoyage
}
```

---

### 5. 🖼️ **event_media** - Galerie Médias Optimisée

```javascript
{
  _id: ObjectId("..."),
  
  // RÉFÉRENCES MYSQL (INT pour compatibilité)
  eventId: 1,                      // events.id (MySQL)
  uploadedBy: 42,                  // users.id (MySQL)
  
  // DONNÉES DÉNORMALISÉES (Performance - évite JOINs MySQL)
  uploaderInfo: {
    username: "arthur_dev",        // users.username
    fname: "Arthur",               // users.fname
    lname: "Jaffre",               // users.lname
    avatarUrl: "https://..."       // users.avatar_url
  },
  
  // INFORMATIONS FICHIER
  filename: "IMG_20240115_203045.jpg",
  originalFilename: "photo_soiree.jpg",
  fileUrl: "https://s3.../events/1/media/IMG_20240115_203045.jpg",
  thumbnailUrl: "https://s3.../events/1/thumbnails/IMG_20240115_203045_thumb.jpg",
  fileType: "image",               // 'image', 'video', 'audio', 'document'
  mimeType: "image/jpeg",
  fileSize: 2048576,               // bytes
  
  // MÉTADONNÉES SPÉCIFIQUES AU TYPE
  metadata: {
    // Pour images
    dimensions: {
      width: 1920,
      height: 1080
    },
    exif: {
      camera: "iPhone 15 Pro",
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        address: "Paris, France"
      },
      timestamp: ISODate("2024-01-15T20:30:45Z"),
      flash: false,
      focalLength: "24mm",
      aperture: "f/1.6",
      iso: 100
    },
    
    // Pour vidéos
    duration: 180,                 // secondes
    resolution: "1920x1080",
    codec: "h264",
    frameRate: 30,
    
    // Pour audio
    bitrate: 320,                  // kbps
    sampleRate: 44100,            // Hz
    
    // Pour documents
    pages: 5,                     // nombre de pages PDF
    language: "fr"
  },
  
  // ORGANISATION ET CATÉGORISATION
  caption: "Super soirée avec toute l'équipe ! 🎉",
  tags: ["soirée", "équipe", "célébration"],
  albumId: ObjectId("..."),        // Référence album MongoDB
  albumName: "Soirée entreprise 2024",
  
  // INTERACTIONS SOCIALES
  likes: [
    {
      userId: 15,                  // users.id
      timestamp: ISODate("2024-01-15T21:00:00Z")
    },
    {
      userId: 23,
      timestamp: ISODate("2024-01-15T21:05:00Z")
    }
  ],
  
  comments: [
    {
      _id: ObjectId("..."),        // ID unique du commentaire
      userId: 15,                  // users.id
      userInfo: {                  // Dénormalisé
        username: "marie_design",
        fname: "Marie",
        avatarUrl: "https://..."
      },
      content: "Belle photo ! 📸",
      timestamp: ISODate("2024-01-15T21:10:00Z"),
      isEdited: false,
      editedAt: null
    }
  ],
  
  // STATUT DE TRAITEMENT
  processingStatus: "completed",   // 'uploading', 'processing', 'completed', 'failed'
  processingSteps: {
    upload: {
      completed: true,
      completedAt: ISODate("2024-01-15T20:35:00Z")
    },
    thumbnailGeneration: {
      completed: true,
      completedAt: ISODate("2024-01-15T20:35:30Z")
    },
    metadataExtraction: {
      completed: true,
      completedAt: ISODate("2024-01-15T20:36:00Z")
    },
    virusScanning: {
      completed: true,
      completedAt: ISODate("2024-01-15T20:36:15Z"),
      result: "clean"
    }
  },
  
  // PERMISSIONS ET VISIBILITÉ
  visibility: "event_participants", // 'public', 'event_participants', 'private'
  downloadable: true,              // Autoriser téléchargement
  
  // GESTION SUPPRESSION
  isDeleted: false,               // Soft delete
  deletedAt: null,
  deletedBy: null,                // users.id
  
  // STOCKAGE S3
  s3Info: {
    bucket: "iven-media-prod",
    key: "events/1/media/IMG_20240115_203045.jpg",
    region: "eu-west-1",
    publicUrl: "https://cdn.iven.app/...",
    presignedUrls: {
      download: "https://s3.../download?...",
      expiresAt: ISODate("2024-01-16T20:30:45Z")
    }
  },
  
  // TIMESTAMPS
  takenAt: ISODate("2024-01-15T20:30:45Z"),  // Quand la photo a été prise
  uploadedAt: ISODate("2024-01-15T20:35:00Z"), // Quand uploadée
  createdAt: ISODate("2024-01-15T20:35:00Z"),
  updatedAt: ISODate("2024-01-15T20:36:00Z")
}
```

### **Index pour event_media** 📊

```javascript
// Index principaux pour event_media
db.event_media.createIndex({ 
  "eventId": 1, 
  "uploadedAt": -1 
}, { 
  name: "eventId_uploadedAt",
  background: true 
})

db.event_media.createIndex({ 
  "uploadedBy": 1, 
  "uploadedAt": -1 
}, { 
  name: "uploadedBy_uploadedAt" 
})

db.event_media.createIndex({ 
  "eventId": 1, 
  "isDeleted": 1,
  "fileType": 1
}, { 
  name: "eventId_isDeleted_fileType" 
})

// Index pour recherche full-text
db.event_media.createIndex({ 
  "filename": "text",
  "originalFilename": "text",
  "caption": "text",
  "tags": "text"
}, { 
  name: "media_text_search",
  default_language: "french"
})

// Index géospatial pour photos avec localisation
db.event_media.createIndex({ 
  "metadata.exif.location": "2dsphere" 
}, { 
  name: "geo_location",
  sparse: true 
})

// Index pour albums
db.event_media.createIndex({ 
  "albumId": 1,
  "uploadedAt": -1
}, { 
  name: "albumId_uploadedAt",
  sparse: true 
})

// Index pour likes et interactions
db.event_media.createIndex({ 
  "likes.userId": 1 
}, { 
  name: "likes_userId",
  sparse: true 
})

// Index pour statut de traitement
db.event_media.createIndex({ 
  "processingStatus": 1,
  "createdAt": 1
}, { 
  name: "processing_status" 
})
```

---

### 6. 📁 **media_albums** - Albums de Médias

```javascript
{
  _id: ObjectId("..."),
  
  // RÉFÉRENCES MYSQL
  eventId: 1,                      // events.id (MySQL)
  createdBy: 42,                   // users.id (MySQL)
  
  // INFORMATIONS ALBUM
  name: "Soirée entreprise 2024",
  description: "Photos et vidéos de notre soirée annuelle",
  coverMediaId: ObjectId("..."),   // _id de event_media pour la couverture
  
  // MÉTADONNÉES
  mediaCount: 25,                  // Nombre de médias
  totalSize: 52428800,             // Taille totale en bytes
  mediaTypes: ["image", "video"],  // Types de médias contenus
  
  // PERMISSIONS
  visibility: "event_participants",
  canContribute: ["organizer", "co-organizer"], // Qui peut ajouter des médias
  
  // TIMESTAMPS
  createdAt: ISODate("2024-01-15T20:00:00Z"),
  updatedAt: ISODate("2024-01-15T22:30:00Z")
}
```

---

## 🔄 **Synchronisation MySQL ↔ MongoDB**

### **Flux de données :**

```typescript
// 1. NOUVEAU MESSAGE (Frontend → Backend)
POST /api/events/1/messages
{
  content: "Salut !",
  type: "text"
}

// 2. BACKEND TRAITEMENT
async function createMessage(eventId: number, senderId: number, content: string) {
  // Récupérer infos utilisateur MySQL
  const user = await mysql.query('SELECT username, fname, lname, avatar_url FROM users WHERE id = ?', [senderId]);
  
  // Créer message MongoDB
  const message = await mongodb.event_messages.insertOne({
    eventId,
    senderId,
    senderInfo: {
      username: user.username,
      fname: user.fname,
      lname: user.lname,
      avatarUrl: user.avatar_url
    },
    type: 'text',
    content,
    createdAt: new Date()
  });
  
  // Diffuser via WebSocket
  io.to(`event_${eventId}`).emit('new_message', message);
  
  return message;
}
```

### **Cohérence des données :**

1. **Source de vérité** : MySQL pour utilisateurs/événements, MongoDB pour messages
2. **Dénormalisation contrôlée** : Copie des infos utilisateur dans MongoDB
3. **Synchronisation** : Mise à jour MongoDB quand utilisateur modifie son profil
4. **WebSocket** : Diffusion temps réel des changements

---

## 🚀 **Avantages de cette Architecture**

### **Performance** 📈
- **Chat** : MongoDB optimisé pour millions de messages
- **MySQL** : Données relationnelles complexes et contraintes ACID
- **Redis** : Cache haute performance pour sessions/typing

### **Scalabilité** 🔧
- **Horizontal** : MongoDB sharding automatique
- **Vertical** : MySQL optimisé pour données structurées
- **Micro-services** : Séparation claire des responsabilités

### **Développement** 💻
- **TypeScript** : Types partagés entre MySQL et MongoDB
- **API unifiée** : Interface unique pour le frontend
- **WebSocket** : Temps réel transparent

Cette architecture hybride combine le meilleur des deux mondes : la robustesse relationnelle de MySQL et la flexibilité/performance de MongoDB pour le temps réel ! 🎉