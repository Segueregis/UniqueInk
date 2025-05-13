/*
  # Fix purchased tattoos relationship

  1. Changes
    - Drop and recreate foreign key with proper reference
    - Update purchase functions to handle relationships correctly
*/

-- Drop existing foreign key if it exists
ALTER TABLE purchased_tattoos
DROP CONSTRAINT IF EXISTS purchased_tattoos_tattoo_id_fkey;

-- Add foreign key with proper reference
ALTER TABLE purchased_tattoos
ADD CONSTRAINT purchased_tattoos_tattoo_id_fkey
FOREIGN KEY (tattoo_id) REFERENCES tattoos(id)
ON DELETE CASCADE;

-- Update purchase_cart function to handle relationships
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
    INSERT INTO purchased_tattoos (
      user_id,
      tattoo_id,
      purchase_date,
      certificate_url
    )
    SELECT 
      p_user_id,
      t.id,
      now(),
      null -- Certificate URL will be generated later
    FROM tattoos t
    WHERE t.id = v_tattoo_id;
  END LOOP;

  -- Clear cart
  DELETE FROM cart_items WHERE user_id = p_user_id;
END;
$$;