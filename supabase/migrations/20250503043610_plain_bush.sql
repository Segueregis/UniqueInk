/*
  # Add new tattoo designs
  
  1. Changes
    - Add three new tattoo designs to the catalog
    - Include detailed descriptions and proper styling
*/

INSERT INTO tattoos (
  title,
  description,
  image_url,
  preview_url,
  price,
  status,
  style
) VALUES 
(
  'Índio Geométrico',
  'Retrato majestoso de um guerreiro indígena americano em estilo geométrico, combinando elementos tradicionais com design contemporâneo.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hackin_american_indian_geometric_tattoo_design_white_background_3072eaf8-6641-42a1-b248-9fb141c8ab51.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hackin_american_indian_geometric_tattoo_design_white_background_3072eaf8-6641-42a1-b248-9fb141c8ab51.png',
  449.99,
  'disponível',
  'geometric'
),
(
  'Lobo Geométrico',
  'Impressionante retrato de lobo em estilo geométrico, capturando a essência selvagem do animal através de formas precisas e padrões modernos.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_wolf_geometric_tattoo_design_white_background_3654706e-84be-40f5-9aa5-6fee6a594f66.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_wolf_geometric_tattoo_design_white_background_3654706e-84be-40f5-9aa5-6fee6a594f66.png',
  399.99,
  'disponível',
  'geometric'
),
(
  'Mandala Espiritual',
  'Mandala detalhada com elementos geométricos e espirituais, criando uma peça única que representa harmonia e equilíbrio.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/PREFERiDA.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/PREFERiDA.png',
  379.99,
  'disponível',
  'mandala'
);