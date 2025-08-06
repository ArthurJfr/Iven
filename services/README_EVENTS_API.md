# 🎪 API Routes - Gestion des événements

## 📋 **Endpoints principaux**

### 🎯 **Événements - CRUD de base**

#### **GET /api/events**
```typescript
// Récupérer tous les événements de l'utilisateur
interface GetEventsQuery {
  page?: number;
  limit?: number;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category?: string;
  search?: string;
}

interface GetEventsResponse {
  events: Event[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

#### **POST /api/events**
```typescript
// Créer un nouvel événement
interface CreateEventRequest {
  title: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  start_date: string; // ISO format
  end_date?: string;
  start_time?: string;
  end_time?: string;
  max_participants?: number;
  category?: string;
  type: 'perso' | 'pro';
  is_public?: boolean;
  requires_approval?: boolean;
  cover_image?: File; // Multipart upload
}

interface CreateEventResponse {
  success: boolean;
  event: Event;
  message: string;
}
```

#### **GET /api/events/:id**
```typescript
// Récupérer un événement spécifique avec toutes ses données
interface GetEventResponse {
  success: boolean;
  event: Event & {
    participants: Participant[];
    tasks: Task[];
    expenses: Expense[];
    media: Media[];
    organizer: User;
    userRole: 'organizer' | 'co-organizer' | 'participant';
    userStatus: 'pending' | 'accepted' | 'declined' | 'maybe';
    stats: {
      confirmedParticipants: number;
      completedTasks: number;
      totalTasks: number;
      totalExpenses: number;
    };
  };
}
```

#### **PUT /api/events/:id**
```typescript
// Modifier un événement (seuls organisateurs)
interface UpdateEventRequest {
  title?: string;
  description?: string;
  location?: string;
  // ... autres champs modifiables
}
```

#### **DELETE /api/events/:id**
```typescript
// Supprimer un événement (seul créateur)
```

---

### 👥 **Participants - Gestion des participations**

#### **GET /api/events/:id/participants**
```typescript
// Récupérer tous les participants d'un événement
interface GetParticipantsResponse {
  participants: Array<{
    id: string;
    user: User;
    role: 'organizer' | 'co-organizer' | 'participant';
    status: 'pending' | 'accepted' | 'declined' | 'maybe';
    joinedAt: string;
    invitedBy?: User;
  }>;
}
```

#### **POST /api/events/:id/participants**
```typescript
// Inviter des participants
interface InviteParticipantsRequest {
  invitations: Array<{
    email: string;
    role?: 'participant' | 'co-organizer';
    message?: string;
  }>;
}
```

#### **PUT /api/events/:id/participants/:userId**
```typescript
// Modifier le statut/rôle d'un participant
interface UpdateParticipantRequest {
  status?: 'accepted' | 'declined' | 'maybe';
  role?: 'participant' | 'co-organizer'; // Seuls organisateurs
}
```

#### **DELETE /api/events/:id/participants/:userId**
```typescript
// Retirer un participant ou se retirer soi-même
```

---

### ✅ **Tâches - Gestion des tâches**

#### **GET /api/events/:id/tasks**
```typescript
// Récupérer toutes les tâches d'un événement
interface GetTasksResponse {
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
    assignedTo?: User;
    createdBy: User;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    dueDate?: string;
    completedAt?: string;
    createdAt: string;
  }>;
}
```

#### **POST /api/events/:id/tasks**
```typescript
// Créer une nouvelle tâche
interface CreateTaskRequest {
  title: string;
  description?: string;
  assignedTo?: string; // User ID
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
}
```

#### **PUT /api/events/:id/tasks/:taskId**
```typescript
// Modifier une tâche
interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate?: string;
}
```

---

### 💰 **Budget - Gestion des dépenses**

#### **GET /api/events/:id/expenses**
```typescript
// Récupérer toutes les dépenses d'un événement
interface GetExpensesResponse {
  expenses: Array<{
    id: string;
    title: string;
    description?: string;
    amount: number;
    category?: string;
    paidBy: User;
    receiptUrl?: string;
    dateIncurred: string;
    createdAt: string;
  }>;
  summary: {
    totalAmount: number;
    categorySummary: Record<string, number>;
    expensesByUser: Record<string, number>;
  };
}
```

#### **POST /api/events/:id/expenses**
```typescript
// Ajouter une nouvelle dépense
interface CreateExpenseRequest {
  title: string;
  description?: string;
  amount: number;
  category?: string;
  dateIncurred: string;
  receipt?: File; // Multipart upload
}
```

---

### 🖼️ **Médias - Gestion des fichiers (MongoDB)**

#### **GET /api/events/:id/media**
```typescript
// Récupérer tous les médias d'un événement (MongoDB)
interface GetMediaQuery {
  limit?: number;
  skip?: number;
  fileType?: 'image' | 'video' | 'audio' | 'document';
  albumId?: string;         // MongoDB ObjectId
  search?: string;          // Recherche dans filename, caption, tags
  sort?: 'uploadedAt' | 'takenAt' | 'filename' | 'fileSize';
  order?: 'asc' | 'desc';
}

interface GetMediaResponse {
  media: Array<{
    _id: string;            // MongoDB ObjectId
    eventId: number;        // Référence MySQL events.id
    uploadedBy: number;     // Référence MySQL users.id
    uploaderInfo: {         // Données dénormalisées
      username: string;
      fname: string;
      lname: string;
      avatarUrl?: string;
    };
    filename: string;
    originalFilename: string;
    fileUrl: string;
    thumbnailUrl?: string;
    fileType: 'image' | 'video' | 'audio' | 'document';
    mimeType: string;
    fileSize: number;
    caption?: string;
    tags: string[];
    albumId?: string;
    albumName?: string;
    likes: Array<{userId: number, timestamp: string}>;
    comments: Array<{
      _id: string;
      userId: number;
      userInfo: UserInfo;
      content: string;
      timestamp: string;
    }>;
    processingStatus: 'uploading' | 'processing' | 'completed' | 'failed';
    visibility: 'public' | 'event_participants' | 'private';
    downloadable: boolean;
    metadata?: MediaMetadata;
    takenAt?: string;
    uploadedAt: string;
    createdAt: string;
  }>;
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
  albums: Array<{
    _id: string;
    name: string;
    mediaCount: number;
  }>;
}
```

#### **POST /api/events/:id/media**
```typescript
// Uploader des médias (MongoDB + S3)
interface UploadMediaRequest {
  files: File[];            // Multipart upload
  captions?: string[];      // Une caption par fichier
  tags?: string[][];        // Tags par fichier
  albumId?: string;         // MongoDB ObjectId album existant
  albumName?: string;       // Créer nouvel album
  visibility?: 'public' | 'event_participants' | 'private';
  downloadable?: boolean;
}

interface UploadMediaResponse {
  success: boolean;
  media: Array<{
    _id: string;            // MongoDB ObjectId généré
    filename: string;
    fileUrl: string;
    thumbnailUrl?: string;
    processingStatus: string;
    uploadProgress?: number;
  }>;
  albumId?: string;         // Si album créé/utilisé
}
```

#### **PUT /api/media/:mediaId**
```typescript
// Modifier métadonnées d'un média (MongoDB)
interface UpdateMediaRequest {
  caption?: string;
  tags?: string[];
  albumId?: string;
  visibility?: 'public' | 'event_participants' | 'private';
  downloadable?: boolean;
}
```

#### **DELETE /api/media/:mediaId**
```typescript
// Supprimer un média (soft delete MongoDB)
interface DeleteMediaResponse {
  success: boolean;
  deletedAt: string;
}
```

#### **POST /api/media/:mediaId/like**
```typescript
// Ajouter/retirer un like (MongoDB)
interface LikeMediaRequest {
  action: 'add' | 'remove';
}

interface LikeMediaResponse {
  success: boolean;
  likesCount: number;
  userLiked: boolean;
}
```

#### **POST /api/media/:mediaId/comment**
```typescript
// Ajouter un commentaire (MongoDB)
interface AddCommentRequest {
  content: string;
}

interface AddCommentResponse {
  success: boolean;
  comment: {
    _id: string;
    userId: number;
    userInfo: UserInfo;
    content: string;
    timestamp: string;
  };
}
```

#### **GET /api/events/:id/albums**
```typescript
// Récupérer les albums d'un événement (MongoDB)
interface GetAlbumsResponse {
  albums: Array<{
    _id: string;
    eventId: number;
    createdBy: number;
    name: string;
    description?: string;
    coverMediaId?: string;
    mediaCount: number;
    totalSize: number;
    mediaTypes: string[];
    visibility: string;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

#### **POST /api/events/:id/albums**
```typescript
// Créer un album (MongoDB)
interface CreateAlbumRequest {
  name: string;
  description?: string;
  visibility?: 'public' | 'event_participants' | 'private';
  canContribute?: Array<'organizer' | 'co-organizer' | 'participant'>;
}
```

---

### 💬 **Chat - Messages temps réel (MongoDB)**

#### **GET /api/events/:id/messages**
```typescript
// Récupérer l'historique des messages (MongoDB)
interface GetMessagesQuery {
  limit?: number;
  before?: string; // MongoDB ObjectId pour pagination
  search?: string; // Recherche full-text
  type?: 'text' | 'image' | 'file' | 'system';
}

interface GetMessagesResponse {
  messages: Array<{
    _id: string;           // MongoDB ObjectId
    eventId: number;       // Référence MySQL events.id
    senderId: number;      // Référence MySQL users.id
    senderInfo: {          // Données dénormalisées pour performance
      username: string;
      fname: string;
      lname: string;
      avatarUrl?: string;
    };
    type: 'text' | 'image' | 'file' | 'system' | 'media';
    content: string;
    metadata?: {
      filename?: string;
      fileUrl?: string;
      mentions?: number[];  // users.id mentionnés
      replyTo?: string;     // MongoDB ObjectId
      systemAction?: string;
    };
    reactions: Array<{
      userId: number;       // users.id
      emoji: string;
      timestamp: string;
    }>;
    readBy: Array<{
      userId: number;       // users.id
      readAt: string;
    }>;
    isEdited: boolean;
    editedAt?: string;
    isDeleted: boolean;
    createdAt: string;
  }>;
  hasMore: boolean;
  totalCount: number;
}
```

#### **POST /api/events/:id/messages**
```typescript
// Envoyer un message (MongoDB + WebSocket)
interface SendMessageRequest {
  content: string;
  type: 'text' | 'image' | 'file' | 'media';
  metadata?: {
    mentions?: number[];     // users.id à mentionner
    replyTo?: string;        // MongoDB ObjectId du message parent
    filename?: string;       // Pour fichiers
    fileUrl?: string;
  };
}

interface SendMessageResponse {
  success: boolean;
  message: {
    _id: string;            // MongoDB ObjectId généré
    eventId: number;
    senderId: number;
    senderInfo: UserInfo;
    type: string;
    content: string;
    createdAt: string;
  };
}
```

#### **PUT /api/messages/:messageId**
```typescript
// Modifier un message (MongoDB)
interface EditMessageRequest {
  content: string;
}
```

#### **DELETE /api/messages/:messageId**
```typescript
// Supprimer un message (soft delete MongoDB)
interface DeleteMessageResponse {
  success: boolean;
  deletedAt: string;
}
```

#### **POST /api/messages/:messageId/react**
```typescript
// Ajouter/retirer une réaction (MongoDB)
interface ReactToMessageRequest {
  emoji: string; // '👍', '❤️', '😂', etc.
  action: 'add' | 'remove';
}
```

#### **PUT /api/messages/:messageId/read**
```typescript
// Marquer un message comme lu (MongoDB)
interface MarkAsReadResponse {
  success: boolean;
  readAt: string;
}
```

#### **WebSocket /ws/events/:id/chat**
```typescript
// Connexion temps réel pour le chat (MongoDB)
interface WebSocketEvents {
  // Messages
  'new_message': {
    message: MongoMessage;
    eventId: number;
  };
  'message_edited': {
    messageId: string;
    content: string;
    editedAt: string;
  };
  'message_deleted': {
    messageId: string;
    deletedAt: string;
  };
  'message_reaction': {
    messageId: string;
    userId: number;
    emoji: string;
    action: 'add' | 'remove';
  };
  
  // Statut de lecture
  'message_read': {
    messageId: string;
    userId: number;
    readAt: string;
  };
  'messages_bulk_read': {
    messageIds: string[];
    userId: number;
    readAt: string;
  };
  
  // Frappe en cours (Redis cache)
  'typing_start': {
    userId: number;
    username: string;
  };
  'typing_stop': {
    userId: number;
  };
  
  // Présence utilisateurs
  'user_online': {
    userId: number;
    username: string;
  };
  'user_offline': {
    userId: number;
  };
  'users_online': {
    users: Array<{userId: number, username: string}>;
  };
}
```

---

## 🔐 **Autorisations et sécurité**

### **Niveaux d'autorisation**
```typescript
interface Permission {
  // Lecture
  canViewEvent: boolean;
  canViewParticipants: boolean;
  canViewTasks: boolean;
  canViewBudget: boolean;
  canViewMedia: boolean;
  canViewChat: boolean;
  
  // Écriture
  canEditEvent: boolean;
  canInviteParticipants: boolean;
  canRemoveParticipants: boolean;
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canAddExpenses: boolean;
  canUploadMedia: boolean;
  canSendMessages: boolean;
  
  // Administration
  canDeleteEvent: boolean;
  canChangeParticipantRoles: boolean;
}

// Matrice des permissions par rôle
const PERMISSIONS: Record<Role, Permission> = {
  organizer: { /* Tous les droits */ },
  'co-organizer': { /* Tous sauf suppression */ },
  participant: { /* Lecture + contributions */ }
};
```

### **Validation des accès**
```typescript
// Middleware de vérification d'accès
async function checkEventAccess(
  userId: string, 
  eventId: string, 
  requiredPermission: keyof Permission
): Promise<boolean> {
  const participation = await getParticipation(userId, eventId);
  if (!participation || participation.status !== 'accepted') {
    return false;
  }
  
  const permissions = PERMISSIONS[participation.role];
  return permissions[requiredPermission];
}
```

---

## 📊 **Requêtes optimisées**

### **Statistiques dashboard**
```typescript
// GET /api/events/stats
interface GetStatsResponse {
  upcomingEvents: number;
  totalEventsCreated: number;
  totalEventsParticipated: number;
  pendingInvitations: number;
  activeTasks: number;
  recentActivity: Activity[];
}
```

### **Recherche avancée**
```typescript
// GET /api/events/search
interface SearchEventsQuery {
  query: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  location?: string;
  radius?: number; // km
  onlyMyEvents?: boolean;
}
```