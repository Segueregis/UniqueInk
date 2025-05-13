/*
  # Add style field to tattoos table and update existing records

  1. Changes
    - Add style field to tattoos table
    - Update existing records with style information
    - Add index for style field to improve query performance
*/

-- Add style field if it doesn't exist
ALTER TABLE tattoos ADD COLUMN IF NOT EXISTS style text;

-- Create index for style field
CREATE INDEX IF NOT EXISTS idx_tattoos_style ON tattoos(style);

-- Update existing records with style information
UPDATE tattoos 
SET style = 
  CASE 
    WHEN title ILIKE '%geométrico%' THEN 'geometric'
    WHEN title ILIKE '%mandala%' THEN 'mandala'
    WHEN title ILIKE '%aquarela%' THEN 'watercolor'
    ELSE 'others'
  END
WHERE style IS NULL;

-- Make style field required for future records
ALTER TABLE tattoos ALTER COLUMN style SET NOT NULL;