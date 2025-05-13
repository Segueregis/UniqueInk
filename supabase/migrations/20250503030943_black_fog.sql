/*
  # Add new geometric tattoo designs
  
  1. Changes
    - Add new tattoo designs to the catalog
    - Include artist attribution and serial numbers
*/

INSERT INTO tattoos (
  title,
  description,
  image_url,
  preview_url,
  price,
  status
) VALUES 
(
  'Astronauta Geométrico Noturno',
  'Design minimalista em preto e branco de um astronauta envolto em formas geométricas com detalhes de salpicos',
  'https://images.pexels.com/photos/2152580/pexels-photo-2152580.jpeg',
  'https://images.pexels.com/photos/2152580/pexels-photo-2152580.jpeg',
  399.99,
  'disponível'
),
(
  'Lobo Geométrico Cristalino',
  'Retrato geométrico de um lobo selvagem com padrões triangulares e linhas precisas',
  'https://images.pexels.com/photos/1975342/pexels-photo-1975342.jpeg',
  'https://images.pexels.com/photos/1975342/pexels-photo-1975342.jpeg',
  349.99,
  'disponível'
),
(
  'Explorador Espacial',
  'Retrato lateral de um astronauta com elementos geométricos e detalhes do espaço',
  'https://images.pexels.com/photos/4198554/pexels-photo-4198554.jpeg',
  'https://images.pexels.com/photos/4198554/pexels-photo-4198554.jpeg',
  449.99,
  'disponível'
);