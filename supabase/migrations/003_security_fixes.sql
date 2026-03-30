-- Convene — Security Fixes & Database Hardening
-- Addresses all critical, high, and medium priority issues from the audit.

-- ============================================
-- FIX 1: Add DELETE policies to user-owned tables
-- ============================================

-- Room messages: users can delete their own messages
CREATE POLICY "Delete own room messages" ON public.room_messages
  FOR DELETE USING (auth.uid() = author_id);

-- Requests: users can delete their own requests
CREATE POLICY "Delete own requests" ON public.requests
  FOR DELETE USING (auth.uid() = author_id);

-- Notifications: users can delete their own notifications
CREATE POLICY "Delete own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Direct messages: users can delete their own sent messages
CREATE POLICY "Delete own DMs" ON public.direct_messages
  FOR DELETE USING (auth.uid() = sender_id);

-- Elevations: users can delete their own elevations
CREATE POLICY "Delete own elevations" ON public.elevations
  FOR DELETE USING (auth.uid() = elevator_id);

-- ============================================
-- FIX 2: Add UPDATE policy for room messages (edit own messages)
-- ============================================
CREATE POLICY "Update own room messages" ON public.room_messages
  FOR UPDATE USING (auth.uid() = author_id);

-- ============================================
-- FIX 3: Add missing indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_requests_author ON public.requests(author_id);
CREATE INDEX IF NOT EXISTS idx_reputation_events_user ON public.reputation_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_user_b ON public.conversations(user_b);
CREATE INDEX IF NOT EXISTS idx_bookmarks_bookmarked ON public.bookmarks(bookmarked_id);
CREATE INDEX IF NOT EXISTS idx_room_members_user ON public.room_members(user_id);

-- ============================================
-- FIX 4: Admin activity log table
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_log ON public.admin_activity_log(admin_id, created_at DESC);

ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write (handled via service role in practice)
CREATE POLICY "Admin log read" ON public.admin_activity_log FOR SELECT USING (false);
CREATE POLICY "Admin log insert" ON public.admin_activity_log FOR INSERT WITH CHECK (false);

-- ============================================
-- FIX 5: Application count RPC (replaces public SELECT)
-- ============================================
CREATE OR REPLACE FUNCTION public.get_application_count()
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM public.waitlist WHERE status = 'waiting';
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- FIX 6: Connections table with mutual consent
-- ============================================
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(requester_id, recipient_id),
  CHECK (requester_id != recipient_id)
);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read own connections" ON public.connections FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);
CREATE POLICY "Create connection request" ON public.connections FOR INSERT
  WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Update connection status" ON public.connections FOR UPDATE
  USING (auth.uid() = recipient_id);
CREATE POLICY "Delete own connections" ON public.connections FOR DELETE
  USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

CREATE INDEX idx_connections_requester ON public.connections(requester_id);
CREATE INDEX idx_connections_recipient ON public.connections(recipient_id);

-- ============================================
-- FIX 7: Request responses table
-- ============================================
CREATE TABLE IF NOT EXISTS public.request_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(request_id, responder_id)
);

ALTER TABLE public.request_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read responses to own requests" ON public.request_responses FOR SELECT
  USING (
    auth.uid() = responder_id
    OR EXISTS (SELECT 1 FROM public.requests WHERE id = request_id AND author_id = auth.uid())
  );
CREATE POLICY "Create response" ON public.request_responses FOR INSERT
  WITH CHECK (auth.uid() = responder_id);
CREATE POLICY "Delete own response" ON public.request_responses FOR DELETE
  USING (auth.uid() = responder_id);

CREATE INDEX idx_request_responses_request ON public.request_responses(request_id);

-- ============================================
-- FIX 8: Add reviewer_notes column to waitlist
-- ============================================
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS reviewer_notes TEXT;
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
