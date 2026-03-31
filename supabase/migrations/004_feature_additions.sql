-- Convene — Feature Additions Migration
-- Adds: email_logs, tier_history, daily_feed_cache
-- Extends: notifications types, reputation event types

-- ============================================
-- EMAIL LOGS — Track all sent emails
-- ============================================
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email TEXT NOT NULL,
  template_name TEXT NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced')),
  metadata JSONB,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.email_logs IS 'Tracks all transactional emails sent through the platform for observability';
COMMENT ON COLUMN public.email_logs.template_name IS 'Email template identifier (welcome, application_accepted, tier_upgrade, etc.)';

CREATE INDEX idx_email_logs_recipient ON public.email_logs(recipient_email, sent_at DESC);
CREATE INDEX idx_email_logs_template ON public.email_logs(template_name, sent_at DESC);

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Only server-side (service role) can read/write email logs
CREATE POLICY "Service role email logs" ON public.email_logs FOR ALL USING (false);

-- ============================================
-- TIER HISTORY — Track tier changes over time
-- ============================================
CREATE TABLE IF NOT EXISTS public.tier_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  old_tier TEXT NOT NULL CHECK (old_tier IN ('explorer', 'builder', 'catalyst')),
  new_tier TEXT NOT NULL CHECK (new_tier IN ('explorer', 'builder', 'catalyst')),
  reason TEXT DEFAULT 'automatic' CHECK (reason IN ('automatic', 'manual_admin', 'manual_override')),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.tier_history IS 'Records every tier change for audit trail and analytics';

CREATE INDEX idx_tier_history_user ON public.tier_history(user_id, changed_at DESC);

ALTER TABLE public.tier_history ENABLE ROW LEVEL SECURITY;

-- Users can read their own tier history
CREATE POLICY "Read own tier history" ON public.tier_history FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- DAILY FEED CACHE — Cached daily member recommendations
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_feed_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recommended_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  relevance_score INTEGER DEFAULT 0,
  feed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recommended_user_id, feed_date)
);

COMMENT ON TABLE public.daily_feed_cache IS 'Stores pre-computed daily member recommendations per user';

CREATE INDEX idx_daily_feed_user_date ON public.daily_feed_cache(user_id, feed_date DESC);

ALTER TABLE public.daily_feed_cache ENABLE ROW LEVEL SECURITY;

-- Users can read their own feed
CREATE POLICY "Read own daily feed" ON public.daily_feed_cache FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- EXTEND REPUTATION EVENTS — Add new event types
-- ============================================
-- Drop and recreate the check constraint to add new event types
ALTER TABLE public.reputation_events DROP CONSTRAINT IF EXISTS reputation_events_event_type_check;
ALTER TABLE public.reputation_events ADD CONSTRAINT reputation_events_event_type_check
  CHECK (event_type IN (
    'room_post', 'bookmark_received', 'request_completed', 'elevated', 'flagged',
    'profile_completed', 'photo_uploaded', 'mutual_connection', 'dm_sent', 'request_posted',
    'request_responded', 'streak_day'
  ));

-- ============================================
-- EXTEND NOTIFICATIONS — Add new notification types
-- ============================================
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'room_mention', 'room_reply', 'dm_received', 'elevated',
    'waitlist_accepted', 'tier_upgrade', 'reputation_milestone',
    'new_connection', 'bookmark_received', 'new_message',
    'request_response', 'welcome'
  ));

-- Add reference columns to notifications for linking to source entities
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS reference_id UUID;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS reference_type TEXT;

-- ============================================
-- ADD AVATAR_URL TO PROFILES (already exists as photo_url)
-- Just adding an index for quick lookups
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON public.profiles(tier);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(application_status);

-- ============================================
-- USER PRESENCE — Track last active timestamps
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_presence (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  current_room_id UUID REFERENCES public.rooms(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.user_presence IS 'Tracks user online presence via heartbeat polling';

ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Anyone can read presence (needed for room online counts)
CREATE POLICY "Read presence" ON public.user_presence FOR SELECT USING (true);
-- Users can update their own presence
CREATE POLICY "Update own presence" ON public.user_presence FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Upsert own presence" ON public.user_presence FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- TRIGGER: Auto-check tier progression on reputation update
-- ============================================
CREATE OR REPLACE FUNCTION check_tier_progression()
RETURNS TRIGGER AS $$
DECLARE
  current_tier TEXT;
  new_tier TEXT;
  current_score INTEGER;
BEGIN
  SELECT tier, reputation_score INTO current_tier, current_score
  FROM public.profiles WHERE id = NEW.user_id;

  -- Determine new tier based on score
  IF current_score >= 500 THEN
    new_tier := 'catalyst';
  ELSIF current_score >= 100 THEN
    new_tier := 'builder';
  ELSE
    new_tier := 'explorer';
  END IF;

  -- If tier changed, update profile and log the change
  IF new_tier != current_tier THEN
    UPDATE public.profiles SET tier = new_tier WHERE id = NEW.user_id;

    INSERT INTO public.tier_history (user_id, old_tier, new_tier, reason)
    VALUES (NEW.user_id, current_tier, new_tier, 'automatic');

    -- Create notification for tier upgrade
    INSERT INTO public.notifications (user_id, type, title, body, link)
    VALUES (
      NEW.user_id,
      'tier_upgrade',
      'Tier Upgrade!',
      'You''ve been promoted to ' || INITCAP(new_tier) || ' tier!',
      '/dashboard/profile'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach to reputation_events after the score is updated
CREATE OR REPLACE TRIGGER check_tier_after_reputation
  AFTER INSERT ON public.reputation_events
  FOR EACH ROW EXECUTE FUNCTION check_tier_progression();
