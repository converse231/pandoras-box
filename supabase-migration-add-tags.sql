-- ============================================
-- Migration: Add tags field and update categories
-- Date: 2025-11-28
-- Description: Adds tags array column and updates category constraints
-- ============================================

-- Step 1: Drop the existing category constraint
ALTER TABLE public.jewelry_items 
DROP CONSTRAINT IF EXISTS jewelry_items_category_check;

-- Step 2: Add the new category constraint with updated values
ALTER TABLE public.jewelry_items
ADD CONSTRAINT jewelry_items_category_check 
CHECK (category IN ('Ring', 'Necklace', 'Necklace w/ Pendant', 'Pendant', 'Bracelet', 'Earrings', 'Chain', 'Bangle', 'Others'));

-- Step 3: Add tags column (TEXT array)
ALTER TABLE public.jewelry_items
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Step 4: Create GIN index for efficient tag searching
CREATE INDEX IF NOT EXISTS jewelry_items_tags_idx 
ON public.jewelry_items USING GIN(tags);

-- ============================================
-- VERIFICATION QUERIES (run these to verify)
-- ============================================

-- Check if tags column exists
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'jewelry_items' AND column_name = 'tags';

-- Check category constraint
-- SELECT constraint_name, check_clause
-- FROM information_schema.check_constraints
-- WHERE constraint_name = 'jewelry_items_category_check';

-- Check if tags index exists
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'jewelry_items' AND indexname = 'jewelry_items_tags_idx';

