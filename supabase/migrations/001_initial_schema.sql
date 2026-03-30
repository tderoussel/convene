-- Convene MVP — Initial Schema
-- Run this in your Supabase SQL editor or via CLI

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- WAITLIST
-- ============================================
CREATE TABLE public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  one_liner TEXT,
  linkedin_url TEXT,
  referral_source TEXT,
  referred_by_code TEXT,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'invited', 'applied', 'accepted', 'waitlisted', 'rejected')),
  admin_notes TEXT,
  invited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_waitlist_status ON public.waitlist(status);
CREATE INDEX idx_waitlist_email ON public.waitlist(email);

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  photo_url TEXT,
  linkedin_url TEXT,
  company_url TEXT,
  location TEXT,
  one_liner TEXT,
  what_looking_for TEXT,
  offer_statement TEXT,
  tier TEXT DEFAULT 'explorer' CHECK (tier IN ('explorer', 'builder', 'catalyst')),
  tier_reason TEXT,
  reputation_score INTEGER DEFAULT 0,
  total_room_posts INTEGER DEFAULT 0,
  total_bookmarks_received INTEGER DEFAULT 0,
  total_requests_completed INTEGER DEFAULT 0,
  total_elevations_received INTEGER DEFAULT 0,
  total_flags_received INTEGER DEFAULT 0,
  application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'accepted', 'waitlisted', 'rejected')),
  application_score JSONB,
  waitlist_id UUID REFERENCES public.waitlist(id),
  is_onboarded BOOLEAN DEFAULT FALSE,
  referral_code TEXT UNIQUE,
  invite_codes_remaining INTEGER DEFAULT 2,
  fund_eligible BOOLEAN DEFAULT FALSE,
  shipping_score INTEGER DEFAULT 0,
  community_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROOMS
-- ============================================
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  topic TEXT,
  category TEXT CHECK (category IN ('general', 'industry', 'cofounder', 'investors', 'hiring', 'advice', 'city')),
  min_tier TEXT DEFAULT 'explorer' CHECK (min_tier IN ('explorer', 'builder', 'catalyst')),
  is_official BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id),
  member_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROOM MEMBERS
-- ============================================
CREATE TABLE public.room_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'creator')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- ============================================
-- ROOM MESSAGES
-- ============================================
CREATE TABLE public.room_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  reply_to UUID REFERENCES public.room_messages(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_room_messages ON public.room_messages(room_id, created_at DESC);

-- ============================================
-- CONVERSATIONS (DMs)
-- ============================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_a, user_b),
  CHECK (user_a < user_b)
);

CREATE TABLE public.direct_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dm_convo ON public.direct_messages(conversation_id, created_at);

-- ============================================
-- REPUTATION EVENTS
-- ============================================
CREATE TABLE public.reputation_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'room_post', 'bookmark_received', 'request_completed', 'elevated', 'flagged'
  )),
  points INTEGER NOT NULL,
  source_user_id UUID REFERENCES public.profiles(id),
  source_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ELEVATIONS
-- ============================================
CREATE TABLE public.elevations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  elevator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  elevated_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(elevator_id, elevated_id)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'room_mention', 'room_reply', 'dm_received', 'elevated',
    'waitlist_accepted', 'tier_upgrade', 'reputation_milestone'
  )),
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, created_at DESC);

-- ============================================
-- BOOKMARKS (Phase 3 ready)
-- ============================================
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bookmarker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bookmarked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bookmarker_id, bookmarked_id)
);

-- ============================================
-- REQUESTS (Phase 3 ready)
-- ============================================
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('cofounder', 'investment', 'hiring', 'advisor', 'services', 'other')),
  is_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FUND TABLES (future — schema only)
-- ============================================
CREATE TABLE public.fund_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  founder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_description TEXT,
  raising_amount INTEGER,
  current_traction TEXT,
  pitch_deck_url TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'declined', 'funded')),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_application_id UUID REFERENCES public.fund_applications(id),
  founder_id UUID NOT NULL REFERENCES public.profiles(id),
  company_name TEXT NOT NULL,
  instrument_type TEXT DEFAULT 'safe',
  investment_amount INTEGER NOT NULL,
  valuation_cap INTEGER,
  investment_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'converted', 'written_off')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), ' ', '-')) || '-' || SUBSTR(NEW.id::text, 1, 6)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update reputation score when events are added
CREATE OR REPLACE FUNCTION update_reputation_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET reputation_score = (
    SELECT COALESCE(SUM(points), 0) FROM public.reputation_events WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reputation_updated
  AFTER INSERT ON public.reputation_events
  FOR EACH ROW EXECUTE FUNCTION update_reputation_score();

-- Update room member count
CREATE OR REPLACE FUNCTION update_room_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.rooms SET member_count = member_count + 1 WHERE id = NEW.room_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.rooms SET member_count = member_count - 1 WHERE id = OLD.room_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER room_members_count
  AFTER INSERT OR DELETE ON public.room_members
  FOR EACH ROW EXECUTE FUNCTION update_room_member_count();
