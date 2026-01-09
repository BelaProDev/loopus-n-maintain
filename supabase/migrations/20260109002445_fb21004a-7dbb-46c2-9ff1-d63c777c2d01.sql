-- Create chat_rooms table for Community Hub
CREATE TABLE public.chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  topic TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_documents table for Document Manager
CREATE TABLE public.user_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  file_path TEXT,
  file_type TEXT NOT NULL DEFAULT 'document',
  file_size BIGINT DEFAULT 0,
  parent_folder_id UUID REFERENCES public.user_documents(id) ON DELETE CASCADE,
  is_folder BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_photos table for Photo Gallery
CREATE TABLE public.user_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  is_liked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service_requests table for service forms
CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  service_type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  urgency TEXT DEFAULT 'normal',
  description TEXT NOT NULL,
  budget_range TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Chat rooms policies (public rooms viewable by all authenticated, private by members)
CREATE POLICY "Authenticated users can view public chat rooms"
ON public.chat_rooms FOR SELECT
USING (auth.uid() IS NOT NULL AND is_private = false);

CREATE POLICY "Authenticated users can create chat rooms"
ON public.chat_rooms FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Room creators can update their rooms"
ON public.chat_rooms FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Room creators can delete their rooms"
ON public.chat_rooms FOR DELETE
USING (auth.uid() = created_by);

-- Chat messages policies
CREATE POLICY "Authenticated users can view messages in rooms they can access"
ON public.chat_messages FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can send messages"
ON public.chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages"
ON public.chat_messages FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
ON public.chat_messages FOR DELETE
USING (auth.uid() = user_id);

-- User documents policies
CREATE POLICY "Users can manage their own documents"
ON public.user_documents FOR ALL
USING (auth.uid() = user_id);

-- User photos policies
CREATE POLICY "Users can manage their own photos"
ON public.user_photos FOR ALL
USING (auth.uid() = user_id);

-- Service requests policies
CREATE POLICY "Anyone can submit service requests"
ON public.service_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their own service requests"
ON public.service_requests FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Authenticated admins can view all service requests"
ON public.service_requests FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_chat_rooms_updated_at
BEFORE UPDATE ON public.chat_rooms
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_documents_updated_at
BEFORE UPDATE ON public.user_documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at
BEFORE UPDATE ON public.service_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();