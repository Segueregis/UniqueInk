/*
  # Add new geometric tattoo design
  
  1. Changes
    - Add new India-inspired geometric tattoo to the catalog
*/

INSERT INTO tattoos (
  title,
  description,
  image_url,
  preview_url,
  price,
  status,
  style
) VALUES (
  'Mandala Indiana',
  'Design geométrico inspirado na arte tradicional indiana, com padrões intrincados e simbolismo espiritual.',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos//hacabana_India_geometric_tattoo_design_white_background_8a1aa20b-b146-4d1e-a06b-f5efeb58fa2e.png',
  'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos//hacabana_India_geometric_tattoo_design_white_background_8a1aa20b-b146-4d1e-a06b-f5efeb58fa2e.png',
  349.99,
  'disponível',
  'geometric'
);