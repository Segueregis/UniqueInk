import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface WishlistButtonProps {
  tattooId: string;
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ tattooId, className = '' }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isLiked = isInWishlist(tattooId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Você precisa estar logado para curtir tatuagens');
      navigate('/login');
      return;
    }

    if (isLiked) {
      await removeFromWishlist(tattooId);
    } else {
      await addToWishlist(tattooId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all ${
        isLiked
          ? 'bg-ink-magenta text-white'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
      } ${className}`}
      aria-label={isLiked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        size={20}
        className={isLiked ? 'fill-current' : ''}
      />
    </button>
  );
};

export default WishlistButton;