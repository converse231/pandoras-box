-- ============================================
-- Migration: Add Profile Fields
-- Date: 2024-11-26
-- Description: Adds bio, language, theme, and notification fields to user_profiles
-- ============================================

-- Add new columns to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'system',
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS price_alerts BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS newsletter BOOLEAN DEFAULT false;

-- Add check constraint for theme column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_profiles_theme_check'
    ) THEN
        ALTER TABLE public.user_profiles 
        ADD CONSTRAINT user_profiles_theme_check 
        CHECK (theme IN ('light', 'dark', 'system'));
    END IF;
END $$;

-- Create or replace trigger for updated_at (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'user_profiles_updated_at'
    ) THEN
        CREATE TRIGGER user_profiles_updated_at
            BEFORE UPDATE ON public.user_profiles
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END $$;

-- Update existing records to have default values
UPDATE public.user_profiles 
SET 
    bio = COALESCE(bio, ''),
    language = COALESCE(language, 'en'),
    theme = COALESCE(theme, 'system'),
    email_notifications = COALESCE(email_notifications, true),
    price_alerts = COALESCE(price_alerts, true),
    newsletter = COALESCE(newsletter, false)
WHERE bio IS NULL 
   OR language IS NULL 
   OR theme IS NULL 
   OR email_notifications IS NULL 
   OR price_alerts IS NULL 
   OR newsletter IS NULL;

