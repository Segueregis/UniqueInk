import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { Tattoo } from './TattooContext';

interface CartItem {
  id: string;
  tattoo: Tattoo;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (tattooId: string) => Promise<void>;
  removeFromCart: (tattooId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          tattoo_id,
          tattoos (
            id,
            title,
            description,
            image_url,
            preview_url,
            price,
            status,
            style,
            sold_to_user_id
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const cartItems = data
        .filter(item => item.tattoos?.status === 'disponível')
        .map(item => ({
          id: item.id,
          tattoo: item.tattoos as Tattoo
        }));

      setItems(cartItems);
    } catch (err) {
      console.error('Error loading cart:', err);
      toast.error('Falha ao carregar itens do carrinho');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const validateCartItems = async () => {
    if (!user || items.length === 0) return [];

    const { data, error } = await supabase
      .from('tattoos')
      .select('id, status')
      .in('id', items.map(item => item.tattoo.id));

    if (error) throw error;

    const unavailableItems = data
      .filter(tattoo => tattoo.status !== 'disponível')
      .map(tattoo => tattoo.id);

    if (unavailableItems.length > 0) {
      // Remove unavailable items from cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .in('tattoo_id', unavailableItems);

      const unavailableTitles = items
        .filter(item => unavailableItems.includes(item.tattoo.id))
        .map(item => item.tattoo.title)
        .join(', ');

      toast.error(`As seguintes tatuagens não estão mais disponíveis: ${unavailableTitles}`);
      await loadCart();
      return unavailableItems;
    }

    return [];
  };

  const addToCart = async (tattooId: string) => {
    if (!user) {
      toast.error('Faça login para adicionar ao carrinho');
      return;
    }

    // Client-side check for existing item
    const existingItem = items.find(item => item.tattoo.id === tattooId);
    if (existingItem) {
      toast.error('Esta tattoo já está no seu carrinho');
      return;
    }

    try {
      // Check if the tattoo is still available
      const { data: tattoo, error: tattooError } = await supabase
        .from('tattoos')
        .select('status')
        .eq('id', tattooId)
        .single();

      if (tattooError) throw tattooError;

      if (!tattoo || tattoo.status !== 'disponível') {
        toast.error('Esta tatuagem não está mais disponível');
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .insert({ user_id: user.id, tattoo_id: tattooId });

      if (error) {
        // If somehow the item was added between our check and insert
        if (error.code === '23505') {
          toast.error('Esta tattoo já está no seu carrinho');
          await loadCart(); // Refresh cart to ensure consistency
          return;
        }
        throw error;
      }

      await loadCart();
      toast.success('Adicionado ao carrinho!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Falha ao adicionar ao carrinho');
    }
  };

  const removeFromCart = async (tattooId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('tattoo_id', tattooId);

      if (error) throw error;

      await loadCart();
      toast.success('Removido do carrinho');
    } catch (err) {
      console.error('Error removing from cart:', err);
      toast.error('Falha ao remover do carrinho');
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Falha ao limpar carrinho');
    }
  };

  const checkout = async () => {
    if (!user) return;

    try {
      // Validate cart items before checkout
      const unavailableItems = await validateCartItems();
      if (unavailableItems.length > 0) {
        throw new Error('Some tattoos in your cart are no longer available');
      }

      const { error } = await supabase
        .rpc('purchase_cart', { p_user_id: user.id });

      if (error) throw error;

      await clearCart();
      toast.success('Compra realizada com sucesso! Tattoo exclusiva desbloqueada.');
    } catch (err) {
      console.error('Error during checkout:', err);
      toast.error('Falha ao finalizar compra');
      throw err;
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeFromCart,
      clearCart,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};