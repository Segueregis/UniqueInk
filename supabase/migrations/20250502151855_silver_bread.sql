/*
  # InkPoints Gamification System

  1. New Tables
    - `inkpoints_usuario`
      - `id_usuario` (string, FK to users.id)
      - `pontos` (integer)
      - `atualizado_em` (timestamp)
    
    - `recompensas_resgatadas`
      - `id` (uuid, primary key)
      - `id_usuario` (string, FK to users.id)
      - `recompensa` (string)
      - `pontos_gastos` (integer)
      - `data` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read/write their own data
*/

-- Create inkpoints_usuario table
CREATE TABLE IF NOT EXISTS inkpoints_usuario (
  id_usuario uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  pontos integer DEFAULT 0,
  atualizado_em timestamptz DEFAULT now()
);

ALTER TABLE inkpoints_usuario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own points"
  ON inkpoints_usuario
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id_usuario);

CREATE POLICY "Users can update own points"
  ON inkpoints_usuario
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id_usuario)
  WITH CHECK (auth.uid() = id_usuario);

-- Create recompensas_resgatadas table
CREATE TABLE IF NOT EXISTS recompensas_resgatadas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario uuid REFERENCES users(id) ON DELETE CASCADE,
  recompensa text NOT NULL,
  pontos_gastos integer NOT NULL,
  data timestamptz DEFAULT now()
);

ALTER TABLE recompensas_resgatadas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own rewards"
  ON recompensas_resgatadas
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id_usuario);

CREATE POLICY "Users can redeem rewards"
  ON recompensas_resgatadas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id_usuario);

-- Create function to update points
CREATE OR REPLACE FUNCTION update_user_points(
  user_id uuid,
  points_to_add integer
) RETURNS void AS $$
BEGIN
  INSERT INTO inkpoints_usuario (id_usuario, pontos)
  VALUES (user_id, points_to_add)
  ON CONFLICT (id_usuario)
  DO UPDATE SET
    pontos = inkpoints_usuario.pontos + points_to_add,
    atualizado_em = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;