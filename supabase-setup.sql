-- ===============================================
-- 🗄️ SUPABASE DATABASE SCHEMA
-- UniGuida AI - Setup SQL Tables
-- ===============================================

-- 📋 User Profiles Table
-- Stores user personal information and preferences
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    profile JSONB NOT NULL,
    quiz_results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📊 Quiz Sessions Table
-- Tracks all quiz completions and results
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    quiz_results JSONB NOT NULL,
    top_area TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 💬 Chat History Table (Optional for future features)
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    message_role TEXT NOT NULL CHECK (message_role IN ('user', 'assistant')),
    message_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📈 Analytics Table (Optional for insights)
CREATE TABLE IF NOT EXISTS public.user_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 🔒 ROW LEVEL SECURITY (RLS) POLICIES
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- ⚠️ IMPORTANT: These policies allow anonymous access
-- In production, consider implementing proper authentication

-- User Profiles Policies
CREATE POLICY "Allow anonymous read access on user_profiles"
    ON public.user_profiles FOR SELECT
    USING (true);

CREATE POLICY "Allow anonymous insert on user_profiles"
    ON public.user_profiles FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow anonymous update on user_profiles"
    ON public.user_profiles FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous delete on user_profiles"
    ON public.user_profiles FOR DELETE
    USING (true);

-- Quiz Sessions Policies
CREATE POLICY "Allow anonymous read access on quiz_sessions"
    ON public.quiz_sessions FOR SELECT
    USING (true);

CREATE POLICY "Allow anonymous insert on quiz_sessions"
    ON public.quiz_sessions FOR INSERT
    WITH CHECK (true);

-- Chat History Policies
CREATE POLICY "Allow anonymous read access on chat_history"
    ON public.chat_history FOR SELECT
    USING (true);

CREATE POLICY "Allow anonymous insert on chat_history"
    ON public.chat_history FOR INSERT
    WITH CHECK (true);

-- Analytics Policies
CREATE POLICY "Allow anonymous insert on user_analytics"
    ON public.user_analytics FOR INSERT
    WITH CHECK (true);

-- ===============================================
-- 📋 INDEXES FOR PERFORMANCE
-- ===============================================

-- Index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON public.quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON public.user_analytics(user_id);

-- Index on timestamps for analytics
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_completed_at ON public.quiz_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON public.chat_history(created_at);
CREATE INDEX IF NOT EXISTS idx_user_analytics_created_at ON public.user_analytics(created_at);

-- Index on top_area for aggregations
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_top_area ON public.quiz_sessions(top_area);

-- ===============================================
-- 🔄 FUNCTIONS AND TRIGGERS
-- ===============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- 📊 USEFUL QUERIES FOR ANALYTICS
-- ===============================================

-- Most popular interest areas
-- SELECT top_area, COUNT(*) as count
-- FROM public.quiz_sessions
-- GROUP BY top_area
-- ORDER BY count DESC;

-- User activity over time
-- SELECT DATE(completed_at) as date, COUNT(*) as daily_quizzes
-- FROM public.quiz_sessions
-- GROUP BY DATE(completed_at)
-- ORDER BY date DESC;

-- Active users (users with recent activity)
-- SELECT COUNT(DISTINCT user_id) as active_users
-- FROM public.quiz_sessions
-- WHERE completed_at > NOW() - INTERVAL '30 days';

-- ===============================================
-- 🚀 SETUP INSTRUCTIONS
-- ===============================================

/*
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy and paste this entire file
5. Run the query to create all tables and policies
6. Update your .env file with:
   - VITE_SUPABASE_URL=your_supabase_project_url
   - VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
7. Test the connection by running the app

Note: These policies allow anonymous access for development.
For production, implement proper authentication with Auth policies.
*/
