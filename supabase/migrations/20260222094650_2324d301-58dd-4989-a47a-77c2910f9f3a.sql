
-- Create chat analytics table
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  ai_response_status TEXT NOT NULL DEFAULT 'success',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (chatbot is public)
CREATE POLICY "Anyone can insert chat sessions"
ON public.chat_sessions
FOR INSERT
WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can read chat sessions"
ON public.chat_sessions
FOR SELECT
USING (is_admin());

-- Create indexes for analytics queries
CREATE INDEX idx_chat_sessions_created_at ON public.chat_sessions (created_at DESC);
CREATE INDEX idx_chat_sessions_session_id ON public.chat_sessions (session_id);
