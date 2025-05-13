/*
  # Fix purchase_cart function to properly handle purchased tattoos

  1. Changes
    - Update purchase_cart function to properly create purchased_tattoo records
    - Ensure proper status updates and relationships
*/

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
    -- Update tattoo status and owner
    UPDATE tattoos 
    SET 
      status = 'vendida',
      sold_to_user_id = p_user_id,
      updated_at = now()
    WHERE id = v_tattoo_id;

    -- Create purchase record with certificate URL
    INSERT INTO purchased_tattoos (
      user_id,
      tattoo_id,
      purchase_date,
      certificate_url
    )
    VALUES (
      p_user_id,
      v_tattoo_id,
      now(),
      'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/certificates/' || v_tattoo_id || '.pdf'
    );
  END LOOP;

  -- Clear cart
  DELETE FROM cart_items WHERE user_id = p_user_id;
END;
$$;