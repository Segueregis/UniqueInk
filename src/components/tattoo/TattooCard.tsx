import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ShoppingCart } from 'lucide-react';
import { Tattoo } from '../../context/TattooContext';
import ProtectedImage from '../common/ProtectedImage';
import WishlistButton from './WishlistButton';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface TattooCardProps {
  tattoo: Tattoo;
}

const TattooCard: React.FC<TattooCardProps> = ({ tattoo }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Faça login para adicionar ao carrinho');
      navigate('/login');
      return;
    }

    try {
      await addToCart(tattoo.id);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      className="card-tattoo group"
    >
      <Link to={`/tattoo/${tattoo.id}`} className="block">
        <div className="relative h-80 overflow-hidden">
          <ProtectedImage
            imageUrl={tattoo.image_url}
            alt={tattoo.title}
            className="w-full h-full object-cover"
            ownerId={tattoo.sold_to_user_id}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-black to-transparent"></div>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <WishlistButton tattooId={tattoo.id} />
            <span className="exclusive-badge flex items-center gap-1">
              <Shield size={14} />
              Exclusiva
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-display text-white mb-2">{tattoo.title}</h3>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400">Estilo: {tattoo.style}</span>
            <span className="text-ink-gold font-semibold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(tattoo.price)}
            </span>
          </div>
          
          <div className="mt-4 relative overflow-hidden">
            <div className="bg-gradient-to-r from-ink-orange to-ink-magenta h-px w-full opacity-40"></div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-400">{tattoo.status}</span>
              {tattoo.status === 'disponível' ? (
                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 px-4 py-2 bg-ink-gold/20 text-ink-gold rounded-lg hover:bg-ink-gold/30 transition-all"
                >
                  <ShoppingCart size={18} />
                  Adicionar ao Carrinho
                </button>
              ) : (
                <span className="text-ink-gold flex items-center gap-1 text-sm font-medium transition-all group-hover:translate-x-1">
                  Ver detalhes
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TattooCard;