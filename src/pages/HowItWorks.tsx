import React from 'react';
import { motion } from 'framer-motion';
import { Search, CreditCard, FileCheck, Trash2 } from 'lucide-react';
import Button from '../components/common/Button';

const steps = [
  {
    icon: <Search className="text-ink-gold" size={48} />,
    title: 'Escolha sua tattoo',
    description: 'Explore nossa coleção exclusiva e encontre a arte que fala diretamente com você. Cada design é meticulosamente criado para ser único.'
  },
  {
    icon: <CreditCard className="text-ink-gold" size={48} />,
    title: 'Garanta a exclusividade',
    description: 'Ao comprar, você adquire os direitos exclusivos da arte. Este design nunca mais será vendido a ninguém, tornando-o verdadeiramente seu.'
  },
  {
    icon: <FileCheck className="text-ink-gold" size={48} />,
    title: 'Receba o arquivo + certificado',
    description: 'Você receberá o arquivo em alta resolução e um certificado digital de autenticidade com número de série único, garantindo a originalidade.'
  },
  {
    icon: <Trash2 className="text-ink-gold" size={48} />,
    title: 'Tattoo sai do site',
    description: 'A arte é permanentemente removida do nosso catálogo. Leve-a ao seu tatuador de confiança sabendo que ela foi feita exclusivamente para habitar seu corpo.'
  }
];

const HowItWorks: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-ink-black pt-20">
      <div className="container-custom py-16">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="gradient-text inline-block mb-6"
          >
            Como Funciona
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl"
          >
            Um processo simples que garante a exclusividade da sua tatuagem. 
            Tão única quanto você.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-gray-900 to-ink-black rounded-lg border border-gray-800 hover:border-ink-gold/30 transition-all duration-300"
            >
              <div className="mb-6 p-4 rounded-full bg-ink-black/50">
                {step.icon}
              </div>
              
              <h3 className="text-xl font-display font-semibold mb-3">{step.title}</h3>
              
              <p className="text-gray-400">{step.description}</p>
              
              <div className="mt-auto pt-6">
                <span className="text-4xl font-display text-ink-gold opacity-30">{index + 1}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-20 text-center"
        >
          <p className="text-xl md:text-2xl text-gray-300 italic font-display mb-8 max-w-3xl mx-auto">
            "A arte foi feita para habitar um só corpo. E cada corpo merece uma arte única."
          </p>
          
          <Button to="/" variant="primary" className="text-lg">
            Ver Coleção Exclusiva
          </Button>
        </motion.div>
      </div>

      <div className="py-16 bg-gradient-to-b from-ink-black to-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Perguntas Frequentes
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-display font-semibold mb-2">
                    Posso modificar o design?
                  </h3>
                  <p className="text-gray-400">
                    Sim, você é livre para trabalhar com seu tatuador para fazer ajustes que tornem o design perfeito para o seu corpo e estilo.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-display font-semibold mb-2">
                    Em que formato recebo o arquivo?
                  </h3>
                  <p className="text-gray-400">
                    Você receberá arquivos em alta resolução nos formatos PDF, PNG e JPG, adequados para qualquer tatuador.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-display font-semibold mb-2">
                    O certificado é físico ou digital?
                  </h3>
                  <p className="text-gray-400">
                    Você receberá um certificado digital com número de série único. Certificados físicos podem ser solicitados por um valor adicional.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">
                  E se alguém copiar minha tatuagem?
                </h3>
                <p className="text-gray-400">
                  Embora não possamos impedir cópias no mundo real, seu certificado de autenticidade prova que você é o proprietário legítimo do design original.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">
                  Posso solicitar um design personalizado?
                </h3>
                <p className="text-gray-400">
                  Sim! Entre em contato conosco para discutir a criação de uma arte exclusiva baseada em suas ideias e preferências.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">
                  Vocês indicam tatuadores?
                </h3>
                <p className="text-gray-400">
                  Sim, temos uma rede de tatuadores parceiros em várias cidades. Podemos recomendar profissionais que trabalham bem com nossos estilos de design.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;