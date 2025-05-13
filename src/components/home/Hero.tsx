import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import ParticleBackground from '../common/ParticleBackground';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = heroRef.current;
      
      const moveX = (clientX / offsetWidth - 0.5) * 20;
      const moveY = (clientY / offsetHeight - 0.5) * 20;
      
      heroRef.current.style.setProperty('--move-x', `${moveX}px`);
      heroRef.current.style.setProperty('--move-y', `${moveY}px`);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink-black"
      style={{ 
        perspective: '1000px',
        '--move-x': '0px',
        '--move-y': '0px',
      } as React.CSSProperties}
    >
      <ParticleBackground count={100} />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto px-4 sm:px-6"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 font-display"
          >
            <span className="gradient-text">Tatuagens únicas.</span> <br />
            <span className="text-white">Feitas para você.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 text-xl md:text-2xl mb-10 max-w-2xl mx-auto"
          >
            Arte exclusiva que habita apenas um corpo: o seu. Cada design é vendido apenas uma vez e então removido do nosso catálogo para sempre.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Button to="/#collection" variant="primary" className="text-lg">
              Ver Coleção Exclusiva
            </Button>
            <Button to="/how-it-works" variant="secondary" className="text-lg">
              Como Funciona?
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="animate-bounce"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="#EFD9A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;