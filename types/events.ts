// Types de base
export interface Event {
  id: number; // INT(11) dans votre DB
  title: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  startDate: string; // DATETIME format
  endDate?: string;
  startTime?: string;
  endTime?: string;
  maxParticipants?: number;
  status: EventStatus;
  category?: string;
  type: EventType;
  isPublic: boolean;
  requiresApproval: boolean;
  coverImageUrl?: string;
  createdBy: number; // User ID (INT)
  createdAt: string;
  updatedAt: string;
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type EventType = 'perso' | 'pro';
export type ParticipantRole = 'organizer' | 'co-organizer' | 'participant';
export type ParticipantStatus = 'pending' | 'accepted' | 'declined' | 'maybe';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type MessageType = 'text' | 'image' | 'file' | 'system';

// Relations et entités liées
export interface EventParticipant {
  id: number;
  eventId: number;
  userId: number;
  role: ParticipantRole;
  status: ParticipantStatus;
  invitedBy?: number;
  invitedAt: string;
  respondedAt?: string;
  joinedAt?: string;
  leftAt?: string;
  notes?: string;
  user?: User; // Populated
}

export interface EventTask {
  id: number;
  eventId: number;
  title: string;
  description?: string;
  assignedTo?: number;
  createdBy: number;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  assignee?: User; // Populated
  creator?: User; // Populated
}

export interface EventExpense {
  id: number;
  eventId: number;
  title: string;
  description?: string;
  amount: number;
  category?: string;
  paidBy: number;
  receiptUrl?: string;
  dateIncurred: string;
  createdAt: string;
  payer?: User; // Populated
}

// Médias stockés dans MongoDB
export interface EventMedia {
  _id: string;              // MongoDB ObjectId
  eventId: number;          // Référence events.id MySQL
  uploadedBy: number;       // Référence users.id MySQL
  
  // Données dénormalisées pour performance
  uploaderInfo: {
    username: string;       // users.username
    fname: string;          // users.fname
    lname: string;          // users.lname
    avatarUrl?: string;     // users.avatar_url
  };
  
  // Informations fichier
  filename: string;
  originalFilename: string;
  fileUrl: string;
  thumbnailUrl?: string;    // URL miniature générée
  fileType: 'image' | 'video' | 'audio' | 'document';
  mimeType: string;
  fileSize: number;         // bytes
  
  // Métadonnées spécifiques au type
  metadata?: {
    // Pour images
    dimensions?: {
      width: number;
      height: number;
    };
    exif?: {
      camera?: string;
      location?: {
        latitude: number;
        longitude: number;
        address?: string;
      };
      timestamp?: string;
      flash?: boolean;
      focalLength?: string;
      aperture?: string;
      iso?: number;
    };
    
    // Pour vidéos
    duration?: number;      // secondes
    resolution?: string;    // "1920x1080"
    codec?: string;
    frameRate?: number;
    
    // Pour audio
    bitrate?: number;       // kbps
    sampleRate?: number;    // Hz
    
    // Pour documents
    pages?: number;         // nombre de pages PDF
    language?: string;
  };
  
  // Organisation et catégorisation
  caption?: string;
  tags: string[];
  albumId?: string;         // MongoDB ObjectId de l'album
  albumName?: string;
  
  // Interactions sociales
  likes: Array<{
    userId: number;         // users.id
    timestamp: string;
  }>;
  
  comments: Array<{
    _id: string;            // MongoDB ObjectId
    userId: number;         // users.id
    userInfo: {
      username: string;
      fname: string;
      avatarUrl?: string;
    };
    content: string;
    timestamp: string;
    isEdited: boolean;
    editedAt?: string;
  }>;
  
  // Statut de traitement
  processingStatus: 'uploading' | 'processing' | 'completed' | 'failed';
  processingSteps?: {
    upload?: {
      completed: boolean;
      completedAt?: string;
    };
    thumbnailGeneration?: {
      completed: boolean;
      completedAt?: string;
    };
    metadataExtraction?: {
      completed: boolean;
      completedAt?: string;
    };
    virusScanning?: {
      completed: boolean;
      completedAt?: string;
      result?: string;
    };
  };
  
  // Permissions et visibilité
  visibility: 'public' | 'event_participants' | 'private';
  downloadable: boolean;
  
  // Gestion suppression
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: number;       // users.id
  
  // Stockage S3
  s3Info?: {
    bucket: string;
    key: string;
    region: string;
    publicUrl?: string;
    presignedUrls?: {
      download?: string;
      expiresAt?: string;
    };
  };
  
  // Timestamps
  takenAt?: string;         // Quand la photo a été prise
  uploadedAt: string;       // Quand uploadée
  createdAt: string;
  updatedAt: string;
  
  // Populated optionnel (pour compatibilité)
  uploader?: User;
}

// Album de médias
export interface MediaAlbum {
  _id: string;              // MongoDB ObjectId
  eventId: number;          // events.id MySQL
  createdBy: number;        // users.id MySQL
  name: string;
  description?: string;
  coverMediaId?: string;    // _id de event_media pour la couverture
  mediaCount: number;
  totalSize: number;        // bytes
  mediaTypes: Array<'image' | 'video' | 'audio' | 'document'>;
  visibility: 'public' | 'event_participants' | 'private';
  canContribute: Array<'organizer' | 'co-organizer' | 'participant'>;
  createdAt: string;
  updatedAt: string;
}

// Messages stockés dans MongoDB
export interface EventMessage {
  _id: string;              // MongoDB ObjectId
  eventId: number;          // Référence events.id MySQL
  senderId: number;         // Référence users.id MySQL
  
  // Données dénormalisées pour performance
  senderInfo: {
    username: string;       // users.username
    fname: string;          // users.fname
    lname: string;          // users.lname
    avatarUrl?: string;     // users.avatar_url
  };
  
  type: MessageType;
  content: string;          // Contenu du message
  
  // Métadonnées conditionnelles
  metadata?: {
    filename?: string;
    originalFilename?: string;
    fileSize?: number;
    fileUrl?: string;
    mimeType?: string;
    mentions?: number[];    // users.id mentionnés
    replyTo?: string;       // MongoDB ObjectId du message parent
    systemAction?: string;  // Pour messages système
    systemData?: object;    // Données contextuelles système
  };
  
  // Interactions sociales
  reactions: Array<{
    userId: number;         // users.id
    emoji: string;
    timestamp: string;
  }>;
  
  // Statut de lecture
  readBy: Array<{
    userId: number;         // users.id
    readAt: string;
  }>;
  
  // Gestion modifications/suppression
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: number;       // users.id
  
  createdAt: string;
  updatedAt: string;
  
  // Populated optionnels (pour compatibilité)
  sender?: User;
  replyToMessage?: EventMessage;
}

export interface EventInvitation {
  id: number;
  eventId: number;
  inviterId: number;
  inviteeEmail: string;
  inviteeUserId?: number;
  invitationToken: string;
  status: 'sent' | 'opened' | 'accepted' | 'declined' | 'expired';
  expiresAt: string;
  sentAt: string;
  respondedAt?: string;
  inviter?: User; // Populated
  invitee?: User; // Populated si inscrit
}

// Types étendus pour les réponses API
export interface EventWithDetails extends Event {
  participants: EventParticipant[];
  tasks: EventTask[];
  expenses: EventExpense[];
  media: EventMedia[];
  organizer: User;
  userRole?: ParticipantRole;
  userStatus?: ParticipantStatus;
  stats: EventStats;
}

export interface EventStats {
  confirmedParticipants: number;
  completedTasks: number;
  totalTasks: number;
  totalExpenses: number;
  pendingInvitations: number;
}

// Types pour les requêtes API
export interface CreateEventRequest {
  title: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  maxParticipants?: number;
  category?: string;
  type: EventType;
  isPublic?: boolean;
  requiresApproval?: boolean;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

export interface InviteParticipantsRequest {
  invitations: Array<{
    email: string;
    role?: Exclude<ParticipantRole, 'organizer'>;
    message?: string;
  }>;
}

export interface UpdateParticipantRequest {
  status?: ParticipantStatus;
  role?: ParticipantRole;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  assignedTo?: number;
  priority: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: TaskStatus;
}

export interface CreateExpenseRequest {
  title: string;
  description?: string;
  amount: number;
  category?: string;
  dateIncurred: string;
}

export interface SendMessageRequest {
  content: string;
  type: MessageType;
  metadata?: {
    mentions?: number[];     // users.id à mentionner
    replyTo?: string;        // MongoDB ObjectId du message parent
    filename?: string;       // Pour fichiers
    fileUrl?: string;
  };
}

export interface SendMessageResponse {
  success: boolean;
  message: EventMessage;
}

export interface EditMessageRequest {
  content: string;
}

export interface ReactToMessageRequest {
  emoji: string;             // '👍', '❤️', '😂', etc.
  action: 'add' | 'remove';
}

export interface MarkAsReadRequest {
  messageIds?: string[];     // MongoDB ObjectIds, si omis = dernier message
}

// Types WebSocket pour chat temps réel
export interface ChatWebSocketEvents {
  // Messages
  new_message: {
    message: EventMessage;
    eventId: number;
  };
  message_edited: {
    messageId: string;
    content: string;
    editedAt: string;
  };
  message_deleted: {
    messageId: string;
    deletedAt: string;
  };
  message_reaction: {
    messageId: string;
    userId: number;
    emoji: string;
    action: 'add' | 'remove';
  };
  
  // Statut de lecture
  message_read: {
    messageId: string;
    userId: number;
    readAt: string;
  };
  messages_bulk_read: {
    messageIds: string[];
    userId: number;
    readAt: string;
  };
  
  // Frappe en cours
  typing_start: {
    userId: number;
    username: string;
  };
  typing_stop: {
    userId: number;
  };
  
  // Présence utilisateurs
  user_online: {
    userId: number;
    username: string;
  };
  user_offline: {
    userId: number;
  };
  users_online: {
    users: Array<{userId: number, username: string}>;
  };
}

// Import du type User - adapté à votre table existante
interface User {
  id: number; // INT(11) dans votre DB
  username: string;
  fname: string;
  lname: string;
  email: string;
  password?: string; // Généralement omis côté frontend
  active: boolean; // tinyint(1)
  avatar_url?: string; // Ajout recommandé
  bio?: string; // Ajout recommandé
  phone?: string; // Ajout recommandé
  timezone?: string; // Ajout recommandé
  notification_preferences?: object; // JSON field
  reset_token?: string;
  reset_token_expires?: string;
  confirmation_code?: string;
  confirmation_code_expires?: string;
  created_at: string;
  updated_at: string;
} 