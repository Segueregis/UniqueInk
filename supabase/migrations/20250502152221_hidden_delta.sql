/*
  # Add RLS policies for inkpoints_usuario table

  1. Security
    - Enable RLS on inkpoints_usuario table
    - Add policies for authenticated users to:
      - Insert their own points
      - Update their own points
      - Read their own points
*/

-- Enable RLS
ALTER TABLE inkpoints_usuario ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can insert own points" ON inkpoints_usuario;
    DROP POLICY IF EXISTS "Users can update own points" ON inkpoints_usuario;
    DROP POLICY IF EXISTS "Users can read own points" ON inkpoints_usuario;
END $$;

-- Policy for inserting points
CREATE POLICY "Users can insert own points"
  ON inkpoints_usuario
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id_usuario);

-- Policy for updating points
CREATE POLICY "Users can update own points"
  ON inkpoints_usuario
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id_usuario)
  WITH CHECK (auth.uid() = id_usuario);

-- Policy for reading points
CREATE POLICY "Users can read own points"
  ON inkpoints_usuario
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id_usuario);