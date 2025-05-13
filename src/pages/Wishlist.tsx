import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useTattoo } from '../context/TattooContext';
import TattooCard from '../components/tattoo/TattooCard';
import Button from '../components/common/Button';

const Wishlist: React.FC = () => {
  const { wishlist, loading: wishlistLoading } = useWishlist();
  const { tattoos, loading: tattoosLoading } = useTattoo();

  const wishlistTattoos = tattoos.filter(tattoo => wishlist.includes(tattoo.id));
  const loading = wishlistLoading || tattoosLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-black pt-20 flex items-center justify-center">
        <div className="text-ink-gold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-black pt-20">
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Heart className="text-ink-gold mx-auto mb-4" size={48} />
          <h1 className="text-4xl font-display font-bold mb-4">Lista de Desejos</h1>
          <p className="text-xl text-gray-300">
            Suas tatuagens favoritas em um só lugar
          </p>
        </motion.div>

        {wishlistTattoos.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="image-grid"
          >
            {wishlistTattoos.map((tattoo) => (
              <TattooCard key={tattoo.id} tattoo={tattoo} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 border border-gray-800 rounded-lg">
            <Heart className="mx-auto mb-6 text-gray-600" size={64} />
            <h2 className="text-2xl font-display mb-4">
              Sua lista de desejos está vazia
            </h2>
            <p className="text-gray-400 mb-8">
              Você ainda não curtiu nenhuma tattoo. Descubra sua próxima arte!
            </p>
            <Button to="/" variant="primary" className="inline-flex items-center">
              <ShoppingBag className="mr-2" size={20} />
              Explorar Coleção
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;