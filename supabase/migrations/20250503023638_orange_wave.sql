/*
  # Create tattoos and purchases schema

  1. New Tables
    - `tattoos`
      - `id` (uuid, primary key)
      - `nome` (text)
      - `estilo` (text)
      - `preco` (numeric)
      - `status` (text)
      - `url_marca_agua` (text)
      - `url_original` (text)
      - `comprada_por` (uuid, references users.id)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `compras`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `tattoo_id` (uuid, references tattoos.id)
      - `data_compra` (timestamptz)
      - `valor` (numeric)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create enum for tattoo status
CREATE TYPE tattoo_status AS ENUM ('disponível', 'vendida');

-- Create tattoos table
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

-- Create compras table
CREATE TABLE IF NOT EXISTS compras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  tattoo_id uuid REFERENCES tattoos(id) NOT NULL,
  data_compra timestamptz DEFAULT now(),
  valor numeric(10,2) NOT NULL
);

-- Enable RLS
ALTER TABLE tattoos ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;

-- Policies for tattoos
CREATE POLICY "Todos podem ver tatuagens disponíveis" ON tattoos
  FOR SELECT USING (status = 'disponível' OR auth.uid() = comprada_por);

CREATE POLICY "Apenas admin pode inserir" ON tattoos
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@uniqueink.com'
  ));

CREATE POLICY "Apenas admin pode atualizar" ON tattoos
  FOR UPDATE TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@uniqueink.com'
  ));

-- Policies for compras
CREATE POLICY "Usuários podem ver próprias compras" ON compras
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem registrar compras" ON compras
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_tattoos_status ON tattoos(status);
CREATE INDEX idx_tattoos_comprada_por ON tattoos(comprada_por);
CREATE INDEX idx_compras_user_id ON compras(user_id);
CREATE INDEX idx_compras_tattoo_id ON compras(tattoo_id);

-- Create function to update tattoo status
CREATE OR REPLACE FUNCTION process_tattoo_purchase(
  p_tattoo_id uuid,
  p_user_id uuid
) RETURNS void AS $$
BEGIN
  -- Check if tattoo is available
  IF NOT EXISTS (
    SELECT 1 FROM tattoos 
    WHERE id = p_tattoo_id 
    AND status = 'disponível'
  ) THEN
    RAISE EXCEPTION 'Tatuagem não está disponível para compra';
  END IF;

  -- Update tattoo status and owner
  UPDATE tattoos 
  SET 
    status = 'vendida',
    comprada_por = p_user_id,
    updated_at = now()
  WHERE id = p_tattoo_id;

  -- Insert purchase record
  INSERT INTO compras (user_id, tattoo_id, valor)
  SELECT p_user_id, p_tattoo_id, preco
  FROM tattoos
  WHERE id = p_tattoo_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;