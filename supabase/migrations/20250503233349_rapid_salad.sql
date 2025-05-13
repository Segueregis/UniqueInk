/*
  # Add more tattoo designs
  
  1. Changes
    - Add diverse collection of tattoo designs
    - Include various styles and price points
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
  'Lobo Geométrico Noturno',
  'Majestoso retrato de lobo em estilo geométrico, capturando a essência selvagem através de formas precisas.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_wolf_geometric_tattoo_design_white_background_e8265252-8f05-4af6-bb74-3f14448e7053.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_wolf_geometric_tattoo_design_white_background_e8265252-8f05-4af6-bb74-3f14448e7053.png',
  389.99,
  'disponível',
  'geometric'
),
(
  'Guerreiro Indígena',
  'Retrato poderoso de um guerreiro indígena em estilo geométrico, honrando a herança ancestral.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hackin_american_indian_geometric_tattoo_design_white_background_3072eaf8-6641-42a1-b248-9fb141c8ab51.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hackin_american_indian_geometric_tattoo_design_white_background_3072eaf8-6641-42a1-b248-9fb141c8ab51.png',
  449.99,
  'disponível',
  'geometric'
),
(
  'Lobo Espiritual',
  'Design geométrico de lobo que combina elementos espirituais com precisão matemática.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_wolf_geometric_tattoo_design_white_background_3654706e-84be-40f5-9aa5-6fee6a594f66.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_wolf_geometric_tattoo_design_white_background_3654706e-84be-40f5-9aa5-6fee6a594f66.png',
  399.99,
  'disponível',
  'geometric'
),
(
  'Mandala Cósmica',
  'Mandala intrincada que representa a harmonia do universo através de padrões geométricos precisos.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/PREFERiDA.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/PREFERiDA.png',
  379.99,
  'disponível',
  'mandala'
),
(
  'Astronauta Explorador',
  'Design futurista de um astronauta em estilo geométrico, simbolizando a exploração do desconhecido.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_astronaut_geometric_tattoo_design_white_background_cf323284-2c36-4956-9541-e34e9ec6775a.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_astronaut_geometric_tattoo_design_white_background_cf323284-2c36-4956-9541-e34e9ec6775a.png',
  429.99,
  'disponível',
  'geometric'
),
(
  'Dragão Ancestral',
  'Imponente dragão japonês em estilo tradicional, simbolizando força e sabedoria ancestral.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/puks_full_back_tattoo_in_Japanese_style_32f30782-9ab9-48c5-8ac8-db407b9cc0e2.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/puks_full_back_tattoo_in_Japanese_style_32f30782-9ab9-48c5-8ac8-db407b9cc0e2.png',
  549.99,
  'disponível',
  'japanese'
);