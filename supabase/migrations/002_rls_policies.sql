-- Convene MVP — Row Level Security Policies

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reputation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elevations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Waitlist: public insert, no public read
CREATE POLICY "Public waitlist signup" ON public.waitlist FOR INSERT WITH CHECK (true);

-- Profiles
CREATE POLICY "Read accepted profiles" ON public.profiles FOR SELECT
  USING (application_status = 'accepted');
CREATE POLICY "Read own profile" ON public.profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "Update own profile" ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
CREATE POLICY "Insert own profile" ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Rooms
CREATE POLICY "Read rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Create rooms" ON public.rooms FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Room members
CREATE POLICY "Read room members" ON public.room_members FOR SELECT USING (true);
CREATE POLICY "Join rooms" ON public.room_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Leave rooms" ON public.room_members FOR DELETE USING (auth.uid() = user_id);

-- Room messages
CREATE POLICY "Read room messages" ON public.room_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM room_members WHERE room_id = room_messages.room_id AND user_id = auth.uid()));
CREATE POLICY "Post room messages" ON public.room_messages FOR INSERT
  WITH CHECK (auth.uid() = author_id AND EXISTS (SELECT 1 FROM room_members WHERE room_id = room_messages.room_id AND user_id = auth.uid()));

-- Conversations
CREATE POLICY "Read own conversations" ON public.conversations FOR SELECT
  USING (auth.uid() = user_a OR auth.uid() = user_b);
CREATE POLICY "Create conversations" ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

-- Direct messages
CREATE POLICY "Read own DMs" ON public.direct_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND (user_a = auth.uid() OR user_b = auth.uid())));
CREATE POLICY "Send DMs" ON public.direct_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id AND (user_a = auth.uid() OR user_b = auth.uid())));

-- Reputation events
CREATE POLICY "Read reputation" ON public.reputation_events FOR SELECT USING (true);

-- Elevations
CREATE POLICY "Read elevations" ON public.elevations FOR SELECT USING (true);
CREATE POLICY "Create elevations" ON public.elevations FOR INSERT WITH CHECK (auth.uid() = elevator_id);

-- Notifications
CREATE POLICY "Own notifications read" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Own notifications update" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Bookmarks
CREATE POLICY "Own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = bookmarker_id);
CREATE POLICY "Read bookmarks received" ON public.bookmarks FOR SELECT USING (auth.uid() = bookmarked_id);

-- Requests
CREATE POLICY "Read requests" ON public.requests FOR SELECT USING (true);
CREATE POLICY "Create requests" ON public.requests FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Update own requests" ON public.requests FOR UPDATE USING (auth.uid() = author_id);
