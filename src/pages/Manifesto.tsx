import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import ParticleBackground from '../components/common/ParticleBackground';

const Manifesto: React.FC = () => {
  return (
    <div className="min-h-screen bg-ink-black pt-20">
      <ParticleBackground count={50} />
      
      <div className="container-custom py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="gradient-text inline-block mb-8">Manifesto</h1>
            
            <p className="text-2xl md:text-3xl text-white italic font-display leading-relaxed">
              "A arte precisa ser única. E seu corpo também."
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="prose prose-lg prose-invert mx-auto"
          >
            <div className="mb-12">
              <img 
                src="https://images.pexels.com/photos/7794435/pexels-photo-7794435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Icarus Mythology Artwork" 
                className="w-full h-80 object-cover rounded-lg shadow-2xl mb-8"
              />
              
              <p className="text-xl leading-relaxed text-gray-300">
                Na mitologia grega, Ícaro voou próximo demais do sol ignorando os avisos de seu pai, 
                e suas asas de cera derreteram. Como Ícaro, vemos a tatuagem moderna perdendo sua 
                essência: a originalidade.
              </p>

              <p className="text-xl leading-relaxed text-gray-300">
                A UniqueInk nasceu da frustração compartilhada por artistas e tatuados: o ciclo 
                infinito de cópias. Um design criado com paixão, copiado centenas de vezes, 
                esvaziado de seu significado original.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                Nossa Filosofia
              </h2>
              
              <p className="text-lg text-gray-300">
                Acreditamos que cada pessoa merece uma expressão artística verdadeiramente única. 
                A tatuagem não é apenas tinta na pele — é uma declaração permanente de identidade, 
                uma história que você carrega para sempre.
              </p>

              <p className="text-lg text-gray-300">
                Quando um design é repetido em centenas de corpos, algo é perdido. A magia da 
                individualidade se dissolve. É como usar a mesma roupa que todos os outros, exceto 
                que nunca poderá ser trocada.
              </p>

              <p className="text-lg text-gray-300">
                Nossa missão é clara: devolver à tatuagem seu caráter verdadeiramente único e pessoal. 
                Cada design em nosso catálogo é vendido apenas uma vez e, depois, removido para sempre. 
                Uma vez seu, permanecerá exclusivamente seu.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                Contra a Cultura do Pinterest
              </h2>
              
              <p className="text-lg text-gray-300">
                Vivemos na era do "vi no Pinterest". O problema não é a inspiração, é a replicação sem 
                consideração pelo artista original ou pelo significado por trás da arte.
              </p>

              <p className="text-lg text-gray-300">
                Nossos artistas criam com a certeza de que seu trabalho não será diluído por reproduções 
                em massa. Você, como cliente, recebe algo que ninguém mais no mundo terá — uma garantia 
                cada vez mais rara em nossa cultura de consumo homogeneizada.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                Compromisso com a Autenticidade
              </h2>
              
              <p className="text-lg text-gray-300">
                Cada design UniqueInk recebe um número de série e um certificado de autenticidade. 
                Uma vez vendido, removemos permanentemente o design de nosso site e arquivos.
              </p>

              <p className="text-lg text-gray-300">
                Este não é apenas um modelo de negócio — é uma posição ética sobre o valor da arte 
                original em um mundo repleto de cópias.
              </p>

              <div className="border-l-4 border-ink-gold pl-6 my-8">
                <p className="text-xl font-display italic">
                  "A arte que habita seu corpo deve ser tão única quanto a vida que você vive."
                </p>
              </div>

              <p className="text-lg text-gray-300">
                Convidamos você a fazer parte desta revolução silenciosa contra a homogeneização 
                da expressão artística pessoal. Escolha ser único. Escolha possuir algo verdadeiramente 
                exclusivo.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <Button to="/" variant="primary" className="text-lg">
              Explorar Coleção Exclusiva
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Manifesto;