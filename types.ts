
export interface Story {
  id: string;
  treeId: string;
  individualId?: string;
  authorId?: string;
  title: string;
  content: string; // Text content
  audioUrl?: string; // For oral history
  summary?: string; // Optional AI summary
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN';
export type RelationshipType = 'PARENT_CHILD' | 'SPOUSE';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface FamilyTree {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  privacy: 'PUBLIC' | 'PRIVATE' | 'SHARED';
  createdAt: Date;
}

export interface FamilyMember {
  id: string;
  treeId?: string; // Optional for UI-only trees
  
  // Basic Info
  name: string; // Mapped from firstName + lastName
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  img: string; // profile_image_url
  
  // Dates & Places
  dob?: string; // Date of Birth
  dod?: string; // Date of Death
  placeOfBirth?: string;
  placeOfDeath?: string;
  
  // Advanced Genealogy Fields
  rishtaTypeTitle?: string; // e.g. "Head of Family"
  confidenceScore?: number; // 0-100
  sourceVerificationUrl?: string; // URL to proof
  
  // Hierarchy (UI Helper)
  children?: FamilyMember[];
  spouses?: FamilyMember[];
}

export interface Relationship {
  id: string;
  treeId: string;
  person1Id: string;
  person2Id: string;
  type: RelationshipType;
  customUrduName?: string; // e.g. "Chacha", "Sautan"
  isCurrent?: boolean; // For divorce/multiple wives status
  marriageDate?: string;
}

export interface Media {
  id: string;
  individualId?: string;
  url: string;
  type: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'AUDIO';
  title?: string;
  description?: string;
}

export interface EditRequest {
  id: string;
  memberId: string;
  memberName: string;
  requesterRole: UserRole;
  changes: Partial<FamilyMember>;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: Date;
}

// --- NEW NOTIFICATION TYPES ---
export type BroadcastEventType = 'NEW_BIRTH' | 'WEDDING' | 'DEATH' | 'REUNION' | 'GENERAL';

export interface Notification {
  id: string;
  treeId: string;
  senderId: string;
  senderName?: string; // Joined field
  eventType: BroadcastEventType;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO Date
}
