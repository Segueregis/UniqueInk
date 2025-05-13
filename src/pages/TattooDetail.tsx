import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Award } from 'lucide-react';
import Button from '../components/common/Button';
import { useTattoo } from '../context/TattooContext';
import ProtectedImage from '../components/common/ProtectedImage';

const TattooDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTattoo, isAvailable } = useTattoo();
  const [activeView, setActiveView] = useState<'default' | 'skin' | 'certificate'>('default');
  
  const tattoo = getTattoo(id || '');
  
  if (!tattoo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Tatuagem não encontrada</h2>
          <Button to="/" variant="primary">
            Voltar para Coleção
          </Button>
        </div>
      </div>
    );
  }

  const available = isAvailable(tattoo.id);
  
  const handlePurchase = () => {
    navigate(`/checkout/${tattoo.id}`);
  };

  return (
    <div className="pt-20 bg-ink-black min-h-screen">
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-lg overflow-hidden aspect-square bg-gray-900 shadow-2xl"
          >
            <ProtectedImage
              imageUrl={
                activeView === 'default' 
                  ? tattoo.image_url 
                  : activeView === 'skin' 
                    ? tattoo.preview_url || tattoo.image_url
                    : tattoo.image_url
              }
              alt={tattoo.title}
              className="w-full h-full"
              ownerId={tattoo.sold_to_user_id}
            />
            
            {!available && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink-black/75">
                <div className="text-center">
                  <span className="text-4xl font-display text-ink-gold">Vendida</span>
                  <p className="text-gray-400 mt-2">Esta arte já foi adquirida</p>
                </div>
              </div>
            )}
            
            {activeView === 'default' && available && (
              <div className="absolute top-4 right-4">
                <span className="exclusive-badge flex items-center gap-1">
                  <Shield size={14} />
                  Exclusiva
                </span>
              </div>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col h-full justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                  {tattoo.serialNumber}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{tattoo.title}</h1>
              
              <p className="text-gray-400 mb-6">Por {tattoo.artist}</p>
              
              <div className="mb-8">
                <p className="text-gray-300 leading-relaxed">
                  {tattoo.description}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 mb-8">
                <Award className="text-ink-gold" size={20} />
                <span className="text-gray-300">
                  Certificado de autenticidade incluído
                </span>
              </div>
              
              <div className="p-4 border border-gray-800 rounded-lg mb-8">
                <p className="text-gray-400 italic">
                  "Nunca vi nada igual. Sinto que é só minha."
                </p>
                <p className="text-right text-sm text-gray-500 mt-2">- Cliente UniqueInk</p>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-display font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(tattoo.price)}
                </span>
                {available ? (
                  <span className="text-green-500 flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Disponível
                  </span>
                ) : (
                  <span className="text-ink-magenta flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 9L15 15M15 9L9 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Vendida
                  </span>
                )}
              </div>
              
              {available ? (
                <Button
                  onClick={handlePurchase}
                  variant="primary"
                  className="w-full text-center py-4"
                >
                  Comprar com Exclusividade
                </Button>
              ) : (
                <Button
                  to="/"
                  variant="secondary"
                  className="w-full text-center py-4"
                >
                  Ver Outras Tatuagens
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TattooDetail;