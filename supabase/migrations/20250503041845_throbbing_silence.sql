/*
  # Add new tattoo designs with images from storage
  
  1. Changes
    - Add new tattoo designs with images from the storage bucket
    - Include proper style categorization
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
  'Mandala Lunar',
  'Uma mandala intrincada inspirada nas fases da lua, com detalhes geométricos e elementos místicos.',
  'https://images.pexels.com/photos/7319307/pexels-photo-7319307.jpeg',
  'https://images.pexels.com/photos/7319307/pexels-photo-7319307.jpeg',
  299.99,
  'disponível',
  'mandala'
),
(
  'Tigre Geométrico',
  'Retrato majestoso de um tigre composto por formas geométricas precisas e linhas ousadas.',
  'https://images.pexels.com/photos/1670342/pexels-photo-1670342.jpeg',
  'https://images.pexels.com/photos/1670342/pexels-photo-1670342.jpeg',
  449.99,
  'disponível',
  'geometric'
),
(
  'Flores em Aquarela',
  'Composição delicada de flores em estilo aquarela, com cores suaves e traços fluidos.',
  'https://images.pexels.com/photos/5321586/pexels-photo-5321586.jpeg',
  'https://images.pexels.com/photos/5321586/pexels-photo-5321586.jpeg',
  379.99,
  'disponível',
  'watercolor'
),
(
  'Corvo Blackwork',
  'Desenho dramático de um corvo em estilo blackwork, com texturas e sombreamentos intensos.',
  'https://images.pexels.com/photos/2152580/pexels-photo-2152580.jpeg',
  'https://images.pexels.com/photos/2152580/pexels-photo-2152580.jpeg',
  399.99,
  'disponível',
  'blackwork'
);