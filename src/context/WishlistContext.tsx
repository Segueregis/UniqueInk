import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface WishlistContextType {
  wishlist: string[];
  loading: boolean;
  error: string | null;
  addToWishlist: (tattooId: string) => Promise<void>;
  removeFromWishlist: (tattooId: string) => Promise<void>;
  isInWishlist: (tattooId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshWishlist = async () => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('wishlist')
        .select('tattoo_id')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;
      setWishlist(data?.map(item => item.tattoo_id) || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Falha ao carregar lista de desejos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const addToWishlist = async (tattooId: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar à lista de desejos');
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          tattoo_id: tattooId
        });

      if (insertError) throw insertError;
      
      await refreshWishlist();
      toast.success('Adicionado à lista de desejos!');
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      toast.error('Falha ao adicionar à lista de desejos');
    }
  };

  const removeFromWishlist = async (tattooId: string) => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('tattoo_id', tattooId);

      if (deleteError) throw deleteError;
      
      await refreshWishlist();
      toast.success('Removido da lista de desejos');
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      toast.error('Falha ao remover da lista de desejos');
    }
  };

  const isInWishlist = (tattooId: string) => {
    return wishlist.includes(tattooId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      error,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      refreshWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};