/*
  # Add new tattoo designs

  1. Changes
    - Add new tattoo designs with the provided images
    - Set appropriate styles and prices
    - Ensure all images are from the correct storage path
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
  'Astronauta Geométrico',
  'Design futurista de um astronauta em estilo geométrico, representando a exploração do desconhecido através de formas precisas e linhas modernas.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_astronaut_geometric_tattoo_design_white_background_cf323284-2c36-4956-9541-e34e9ec6775a.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_astronaut_geometric_tattoo_design_white_background_cf323284-2c36-4956-9541-e34e9ec6775a.png',
  429.99,
  'disponível',
  'geometric'
),
(
  'Lobo Selvagem',
  'Retrato geométrico de um lobo selvagem, combinando a força natural do animal com a precisão do design moderno.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_wolf_geometric_tattoo_design_white_background_e8265252-8f05-4af6-bb74-3f14448e7053.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_wolf_geometric_tattoo_design_white_background_e8265252-8f05-4af6-bb74-3f14448e7053.png',
  389.99,
  'disponível',
  'geometric'
),
(
  'Dragão Japonês',
  'Tatuagem tradicional japonesa de dragão em estilo full back, representando força, sabedoria e proteção.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/puks_full_back_tattoo_in_Japanese_style_32f30782-9ab9-48c5-8ac8-db407b9cc0e2.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/puks_full_back_tattoo_in_Japanese_style_32f30782-9ab9-48c5-8ac8-db407b9cc0e2.png',
  549.99,
  'disponível',
  'japanese'
);