/*
  # Add new Japanese and geometric tattoo designs
  
  1. Changes
    - Add new tattoo designs to the catalog
    - Include high-quality images from storage
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
  'Dragão Japonês Tradicional',
  'Majestosa tatuagem tradicional japonesa de dragão em estilo full back, representando força, sabedoria e proteção divina.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hackin_full_back_tattoo_in_Japanese_style_855c0144-96aa-48a2-ba51-fce40a07b7fb.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hackin_full_back_tattoo_in_Japanese_style_855c0144-96aa-48a2-ba51-fce40a07b7fb.png',
  549.99,
  'disponível',
  'japanese'
),
(
  'Dragão Celestial',
  'Design full back de dragão japonês em estilo tradicional, simbolizando poder celestial e proteção espiritual.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hackin_full_back_tattoo_in_Japanese_style_a4ee27a4-e27f-4b0e-b9bc-45c74464485f.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hackin_full_back_tattoo_in_Japanese_style_a4ee27a4-e27f-4b0e-b9bc-45c74464485f.png',
  599.99,
  'disponível',
  'japanese'
),
(
  'Dragão Imperial',
  'Impressionante tatuagem full back de dragão em estilo japonês tradicional, representando nobreza e poder ancestral.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/puks_full_back_tattoo_in_Japanese_style_32f30782-9ab9-48c5-8ac8-db407b9cc0e2.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/puks_full_back_tattoo_in_Japanese_style_32f30782-9ab9-48c5-8ac8-db407b9cc0e2.png',
  649.99,
  'disponível',
  'japanese'
),
(
  'Astronauta Cósmico',
  'Design geométrico moderno de astronauta explorando o cosmos, combinando elementos futuristas com precisão geométrica.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_astronaut_geometric_tattoo_design_white_background_1f18c1db-7a09-490f-abf1-5be29acd9ffc.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_astronaut_geometric_tattoo_design_white_background_1f18c1db-7a09-490f-abf1-5be29acd9ffc.png',
  399.99,
  'disponível',
  'geometric'
),
(
  'Mandala Indiana Geométrica',
  'Intrincada mandala geométrica inspirada na arte indiana tradicional, combinando simetria perfeita com simbolismo espiritual.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_India_geometric_tattoo_design_white_background_8a1aa20b-b146-4d1e-a06b-f5efeb58fa2e.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_India_geometric_tattoo_design_white_background_8a1aa20b-b146-4d1e-a06b-f5efeb58fa2e.png',
  349.99,
  'disponível',
  'geometric'
);