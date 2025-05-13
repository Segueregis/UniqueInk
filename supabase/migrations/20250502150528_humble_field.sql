/*
  # Create profile-related tables

  1. New Tables
    - `purchased_tattoos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `tattoo_id` (uuid, references tattoos.id)
      - `purchase_date` (timestamptz)
      - `certificate_url` (text)
    
    - `wishlist`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `tattoo_id` (uuid, references tattoos.id)
      - `added_at` (timestamptz)
    
    - `user_activity`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `activity_type` (text)
      - `created_at` (timestamptz)
      - `metadata` (jsonb)

  2. Changes
    - Add points and level columns to users table
    
  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS level text DEFAULT 'Novice Collector';

-- Create purchased_tattoos table
CREATE TABLE IF NOT EXISTS purchased_tattoos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tattoo_id uuid NOT NULL,
  purchase_date timestamptz DEFAULT now(),
  certificate_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE purchased_tattoos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own purchased tattoos"
  ON purchased_tattoos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tattoo_id uuid NOT NULL,
  added_at timestamptz DEFAULT now()
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own wishlist"
  ON wishlist
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own wishlist"
  ON wishlist
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist"
  ON wishlist
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_activity table
CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own activity"
  ON user_activity
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchased_tattoos_user_id ON purchased_tattoos(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);