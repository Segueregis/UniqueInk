/*
  # Insert initial tattoo designs

  1. Changes
    - Creates tattoos table if it doesn't exist
    - Inserts initial tattoo designs
    - Sets appropriate status and pricing
*/

-- First ensure the tattoo_status type exists
DO $$ BEGIN
    CREATE TYPE tattoo_status AS ENUM ('disponível', 'vendida');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create tattoos table if it doesn't exist
CREATE TABLE IF NOT EXISTS tattoos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  estilo text NOT NULL,
  preco numeric(10,2) NOT NULL,
  status tattoo_status DEFAULT 'disponível',
  url_marca_agua text NOT NULL,
  url_original text NOT NULL,
  comprada_por uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tattoos ENABLE ROW LEVEL SECURITY;

-- Insert initial tattoo designs
INSERT INTO tattoos (nome, estilo, preco, url_marca_agua, url_original, status) 
VALUES 
  (
    'Astronauta Geométrico',
    'Geométrico',
    299.99,
    'https://images.pexels.com/photos/2152580/pexels-photo-2152580.jpeg',
    'https://images.pexels.com/photos/2152580/pexels-photo-2152580.jpeg',
    'disponível'
  ),
  (
    'Flor Mandala',
    'Mandala',
    349.99,
    'https://images.pexels.com/photos/1975342/pexels-photo-1975342.jpeg',
    'https://images.pexels.com/photos/1975342/pexels-photo-1975342.jpeg',
    'disponível'
  ),
  (
    'Lobo Geométrico',
    'Geométrico',
    399.99,
    'https://images.pexels.com/photos/4198554/pexels-photo-4198554.jpeg',
    'https://images.pexels.com/photos/4198554/pexels-photo-4198554.jpeg',
    'disponível'
  ),
  (
    'Chefe Indígena',
    'Aquarela',
    449.99,
    'https://images.pexels.com/photos/7980587/pexels-photo-7980587.jpeg',
    'https://images.pexels.com/photos/7980587/pexels-photo-7980587.jpeg',
    'disponível'
  );