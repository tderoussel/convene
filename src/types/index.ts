// ── Tier & View aliases ──

export type Tier = 'explorer' | 'builder' | 'catalyst';

export type AppView =
  | 'dashboard'
  | 'rooms'
  | 'room-detail'
  | 'messages'
  | 'conversation'
  | 'profile'
  | 'edit-profile'
  | 'members'
  | 'notifications'
  | 'settings'
  | 'admin';

// ── Waitlist ──

export interface WaitlistEntry {
  id: string;
  email: string;
  full_name: string;
  one_liner?: string;
  linkedin_url?: string;
  referral_source?: string;
  referred_by_code?: string | null;
  status: 'waiting' | 'invited' | 'applied' | 'accepted' | 'waitlisted' | 'rejected';
  admin_notes?: string | null;
  invited_at?: string | null;
  created_at: string;
}

// ── Member Profile ──

export interface MemberProfile {
  id: string;
  email: string;
  full_name: string;
  photo_url?: string | null;
  linkedin_url?: string | null;
  company_url?: string | null;
  location?: string | null;
  one_liner?: string | null;
  what_looking_for?: string | null;
  offer_statement?: string | null;
  tier: Tier;
  tier_reason?: string | null;
  reputation_score: number;
  total_room_posts?: number;
  total_bookmarks_received?: number;
  total_requests_completed?: number;
  total_elevations_received?: number;
  total_flags_received?: number;
  application_status: 'pending' | 'accepted' | 'waitlisted' | 'rejected';
  is_onboarded?: boolean;
  referral_code?: string;
  invite_codes_remaining?: number;
  created_at: string;
  updated_at?: string;
}

// ── Rooms ──

export type RoomCategory =
  | 'general'
  | 'industry'
  | 'cofounder'
  | 'investors'
  | 'hiring'
  | 'advice'
  | 'city';

export interface Room {
  id: string;
  name: string;
  description: string;
  topic: string;
  category: RoomCategory;
  min_tier: Tier;
  is_official: boolean;
  created_by: string;
  member_count: number;
  is_archived?: boolean;
  created_at: string;
}

export interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  role: 'member' | 'moderator' | 'creator';
  joined_at: string;
}

export interface RoomMessage {
  id: string;
  room_id: string;
  author_id: string;
  content: string;
  reply_to: string | null;
  created_at: string;
  author?: MemberProfile;
}

// ── Direct Messages ──

export interface Conversation {
  id: string;
  user_a: string;
  user_b: string;
  created_at: string;
  other_user?: MemberProfile;
  last_message?: DirectMessage;
}

export interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: MemberProfile;
}

// ── Reputation ──

export interface ReputationEvent {
  id: string;
  user_id: string;
  event_type: string;
  points: number;
  source_user_id: string | null;
  source_description: string | null;
  created_at: string;
}

// ── Elevations ──

export interface Elevation {
  id: string;
  elevator_id: string;
  elevated_id: string;
  reason: string;
  created_at: string;
  elevator?: MemberProfile;
}

// ── Notifications ──

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  created_at: string;
}
