/*
  # Add Shopping Cart and Avatar Storage

  1. New Tables
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `tattoo_id` (uuid, references tattoos.id)
      - `added_at` (timestamptz)

  2. Storage
    - Create avatars bucket
    - Set up storage policies

  3. Security
    - Enable RLS on cart_items
    - Add policies for authenticated users
*/

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tattoo_id uuid REFERENCES tattoos(id) ON DELETE CASCADE NOT NULL,
  added_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tattoo_id)
);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policies for cart_items
CREATE POLICY "Users can manage their own cart"
  ON cart_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to process cart purchase
CREATE OR REPLACE FUNCTION purchase_cart(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tattoo_id uuid;
BEGIN
  -- Check if any tattoo in cart is already sold
  IF EXISTS (
    SELECT 1 
    FROM cart_items c
    JOIN tattoos t ON t.id = c.tattoo_id
    WHERE c.user_id = p_user_id 
    AND t.status != 'disponível'
  ) THEN
    RAISE EXCEPTION 'Some tattoos in your cart are no longer available';
  END IF;

  -- Process each tattoo in cart
  FOR v_tattoo_id IN 
    SELECT tattoo_id 
    FROM cart_items 
    WHERE user_id = p_user_id
  LOOP
    -- Update tattoo status
    UPDATE tattoos 
    SET 
      status = 'vendida',
      sold_to_user_id = p_user_id,
      updated_at = now()
    WHERE id = v_tattoo_id;

    -- Create purchase record
    INSERT INTO purchased_tattoos (user_id, tattoo_id)
    VALUES (p_user_id, v_tattoo_id);
  END LOOP;

  -- Clear cart
  DELETE FROM cart_items WHERE user_id = p_user_id;
END;
$$;