-- Drop existing table first to remove dependencies
DROP TABLE IF EXISTS tattoos CASCADE;

-- Drop and recreate the type
DROP TYPE IF EXISTS tattoo_status CASCADE;
CREATE TYPE tattoo_status AS ENUM ('disponível', 'vendida', 'reservada');

-- Create new tattoos table with updated schema
CREATE TABLE tattoos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  preview_url text,
  price numeric(10,2) NOT NULL,
  status tattoo_status DEFAULT 'disponível',
  created_at timestamptz DEFAULT now(),
  sold_to_user_id uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tattoos ENABLE ROW LEVEL SECURITY;

-- Policy for public access (only available tattoos, limited fields)
CREATE POLICY "Public can view available tattoos" ON tattoos
FOR SELECT
TO public
USING (
  status = 'disponível'
  AND sold_to_user_id IS NULL
);

-- Policy for authenticated users to view available and their purchased tattoos
CREATE POLICY "Users can view available and purchased tattoos" ON tattoos
FOR SELECT
TO authenticated
USING (
  status = 'disponível' 
  OR sold_to_user_id = auth.uid()
);

-- Insert sample tattoos
INSERT INTO tattoos (title, description, image_url, preview_url, price, status) 
VALUES 
  (
    'Astronauta Geométrico',
    'Design geométrico moderno de astronauta em estilo contemporâneo',
    'https://images.pexels.com/photos/2152580/pexels-photo-2152580.jpeg',
    'https://images.pexels.com/photos/2152580/pexels-photo-2152580.jpeg',
    299.99,
    'disponível'
  ),
  (
    'Flor Mandala',
    'Mandala floral intrincada com padrões geométricos',
    'https://images.pexels.com/photos/1975342/pexels-photo-1975342.jpeg',
    'https://images.pexels.com/photos/1975342/pexels-photo-1975342.jpeg',
    349.99,
    'disponível'
  ),
  (
    'Lobo Geométrico',
    'Retrato geométrico de lobo com linhas precisas e formas angulares',
    'https://images.pexels.com/photos/4198554/pexels-photo-4198554.jpeg',
    'https://images.pexels.com/photos/4198554/pexels-photo-4198554.jpeg',
    399.99,
    'disponível'
  ),
  (
    'Chefe Indígena',
    'Retrato em aquarela de chefe indígena com cocar tradicional',
    'https://images.pexels.com/photos/7980587/pexels-photo-7980587.jpeg',
    'https://images.pexels.com/photos/7980587/pexels-photo-7980587.jpeg',
    449.99,
    'disponível'
  );

-- Create function to handle tattoo purchase
CREATE OR REPLACE FUNCTION purchase_tattoo(
  p_tattoo_id uuid,
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if tattoo is available
  IF NOT EXISTS (
    SELECT 1 FROM tattoos 
    WHERE id = p_tattoo_id 
    AND status = 'disponível'
  ) THEN
    RAISE EXCEPTION 'Tattoo is not available for purchase';
  END IF;

  -- Update tattoo status and owner
  UPDATE tattoos 
  SET 
    status = 'vendida',
    sold_to_user_id = p_user_id,
    updated_at = now()
  WHERE id = p_tattoo_id;
END;
$$;