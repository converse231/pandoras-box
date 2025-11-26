-- ============================================
-- Pandora's Box - Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- JEWELRY ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.jewelry_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('Ring', 'Necklace', 'Bracelet', 'Earrings', 'Chain', 'Pendant', 'Bangle', 'Others')),
    
    -- Gold Information
    gold_type TEXT NOT NULL CHECK (gold_type IN ('24k', '22k', '21k', '20k', '18k', '16k', '14k', '10k')),
    weight DECIMAL(10, 2) NOT NULL CHECK (weight > 0),
    
    -- Financial Information
    buy_price DECIMAL(12, 2) NOT NULL CHECK (buy_price >= 0),
    current_value DECIMAL(12, 2) NOT NULL CHECK (current_value >= 0),
    date_bought DATE NOT NULL,
    
    -- Images (array of URLs)
    images TEXT[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.jewelry_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own jewelry items
CREATE POLICY "Users can view own jewelry items"
    ON public.jewelry_items
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own jewelry items
CREATE POLICY "Users can insert own jewelry items"
    ON public.jewelry_items
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own jewelry items
CREATE POLICY "Users can update own jewelry items"
    ON public.jewelry_items
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own jewelry items
CREATE POLICY "Users can delete own jewelry items"
    ON public.jewelry_items
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS jewelry_items_user_id_idx ON public.jewelry_items(user_id);
CREATE INDEX IF NOT EXISTS jewelry_items_gold_type_idx ON public.jewelry_items(gold_type);
CREATE INDEX IF NOT EXISTS jewelry_items_category_idx ON public.jewelry_items(category);
CREATE INDEX IF NOT EXISTS jewelry_items_date_bought_idx ON public.jewelry_items(date_bought DESC);

-- ============================================
-- TRIGGER FOR UPDATED_AT TIMESTAMP
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jewelry_items_updated_at
    BEFORE UPDATE ON public.jewelry_items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- USER PROFILES TABLE (OPTIONAL - FOR EXTENDED USER DATA)
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    preferred_currency TEXT DEFAULT 'PHP',
    language TEXT DEFAULT 'en',
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    email_notifications BOOLEAN DEFAULT true,
    price_alerts BOOLEAN DEFAULT true,
    newsletter BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for user profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view own profile
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can update own profile
CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy: Users can insert own profile
CREATE POLICY "Users can insert own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Trigger for updated_at on user_profiles
CREATE TRIGGER user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create profile automatically on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.jewelry_items TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;

