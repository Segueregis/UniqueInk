import React, { createContext, useState, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface Tattoo {
  id: string;
  title: string;
  description: string;
  image_url: string;
  preview_url: string;
  price: number;
  status: 'disponível' | 'vendida' | 'reservada';
  created_at: string;
  sold_to_user_id: string | null;
  updated_at: string;
  style: string;
}

interface TattooContextType {
  tattoos: Tattoo[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchTattoos: (reset?: boolean) => Promise<void>;
  isAvailable: (id: string) => boolean;
  purchaseTattoo: (id: string) => Promise<void>;
  getTattoo: (id: string) => Tattoo | undefined;
}

const TattooContext = createContext<TattooContextType | undefined>(undefined);

const ITEMS_PER_PAGE = 12;

export const TattooProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchTattoos = async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = reset ? 0 : page;
      const start = currentPage * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error: fetchError, count } = await supabase
        .from('tattoos')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(start, end);

      if (fetchError) throw fetchError;

      if (reset) {
        setTattoos(data || []);
      } else {
        setTattoos(prev => [...prev, ...(data || [])]);
      }

      setHasMore(count ? start + ITEMS_PER_PAGE < count : false);
      setPage(currentPage + 1);
    } catch (err) {
      console.error('Erro ao carregar tatuagens:', err);
      setError('Falha ao carregar tatuagens');
    } finally {
      setLoading(false);
    }
  };

  const isAvailable = (id: string) => {
    const tattoo = tattoos.find(t => t.id === id);
    return tattoo?.status === 'disponível';
  };

  const getTattoo = (id: string) => {
    return tattoos.find(tattoo => tattoo.id === id);
  };

  const purchaseTattoo = async (id: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      // First update the tattoo status
      const { error: updateError } = await supabase
        .from('tattoos')
        .update({
          status: 'vendida',
          sold_to_user_id: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('status', 'disponível');

      if (updateError) throw updateError;

      // Create purchase record in purchased_tattoos table
      const { error: purchaseError } = await supabase
        .from('purchased_tattoos')
        .insert({
          user_id: user.id,
          tattoo_id: id,
          purchase_date: new Date().toISOString(),
          certificate_url: `https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/certificates/${id}.pdf`
        });

      if (purchaseError) throw purchaseError;

      // After successful purchase, fetch new tattoos to update the collection
      await fetchTattoos(true);

      // Get the count of available tattoos
      const availableTattoos = tattoos.filter(t => t.status === 'disponível').length;

      // If we have less than 3 available tattoos, trigger replenishment
      if (availableTattoos < 3) {
        const { data: newTattoos, error: replenishError } = await supabase
          .rpc('replenish_tattoos');

        if (replenishError) {
          console.error('Erro ao repor tatuagens:', replenishError);
        } else {
          console.log('Novas tatuagens adicionadas:', newTattoos);
          await fetchTattoos(true); // Refresh the collection again
        }
      }
    } catch (err) {
      console.error('Erro ao comprar tatuagem:', err);
      throw err;
    }
  };

  React.useEffect(() => {
    fetchTattoos(true);
  }, []);

  return (
    <TattooContext.Provider value={{
      tattoos,
      loading,
      error,
      hasMore,
      fetchTattoos,
      isAvailable,
      purchaseTattoo,
      getTattoo
    }}>
      {children}
    </TattooContext.Provider>
  );
};

export const useTattoo = () => {
  const context = useContext(TattooContext);
  if (context === undefined) {
    throw new Error('useTattoo must be used within a TattooProvider');
  }
  return context;
};