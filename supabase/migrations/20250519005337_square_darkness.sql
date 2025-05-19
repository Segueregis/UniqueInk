/*
  # Simplificar banco de dados

  1. Remover tabelas desnecessárias
    - Remover tabelas relacionadas a pontos e recompensas
    - Manter apenas estrutura essencial

  2. Manter apenas
    - users (autenticação)
    - tattoos (tatuagens)
    - purchased_tattoos (compras)
    - wishlist (favoritos)
    - cart_items (carrinho)
*/

-- Remover tabelas e funções relacionadas a pontos e recompensas
DROP TABLE IF EXISTS inkpoints_usuario CASCADE;
DROP TABLE IF EXISTS recompensas_resgatadas CASCADE;
DROP TABLE IF EXISTS user_activity CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;

-- Remover colunas desnecessárias da tabela users
ALTER TABLE users 
DROP COLUMN IF EXISTS points,
DROP COLUMN IF EXISTS level;

-- Atualizar função de compra para remover lógica de pontos
CREATE OR REPLACE FUNCTION purchase_cart(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tattoo_id uuid;
BEGIN
  -- Verificar se alguma tatuagem no carrinho já foi vendida
  IF EXISTS (
    SELECT 1 
    FROM cart_items c
    JOIN tattoos t ON t.id = c.tattoo_id
    WHERE c.user_id = p_user_id 
    AND t.status != 'disponível'
  ) THEN
    RAISE EXCEPTION 'Some tattoos in your cart are no longer available';
  END IF;

  -- Processar cada tatuagem no carrinho
  FOR v_tattoo_id IN 
    SELECT tattoo_id 
    FROM cart_items 
    WHERE user_id = p_user_id
  LOOP
    -- Atualizar status da tatuagem
    UPDATE tattoos 
    SET 
      status = 'vendida',
      sold_to_user_id = p_user_id,
      updated_at = now()
    WHERE id = v_tattoo_id;

    -- Criar registro de compra
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

  -- Limpar carrinho
  DELETE FROM cart_items WHERE user_id = p_user_id;
END;
$$;