/*
  # Add foreign key relationship for purchased tattoos

  1. Changes
    - Add foreign key constraint to purchased_tattoos table linking tattoo_id to tattoos.id
    - This enables proper joins between purchased_tattoos and tattoos tables
    
  2. Security
    - No changes to RLS policies
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'purchased_tattoos_tattoo_id_fkey'
  ) THEN
    ALTER TABLE purchased_tattoos
    ADD CONSTRAINT purchased_tattoos_tattoo_id_fkey
    FOREIGN KEY (tattoo_id) REFERENCES tattoos(id)
    ON DELETE CASCADE;
  END IF;
END $$;