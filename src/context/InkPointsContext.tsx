import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  image: string;
}

interface InkPointsContextType {
  points: number;
  rewards: Reward[];
  loading: boolean;
  error: string | null;
  addPoints: (amount: number) => Promise<void>;
  redeemReward: (rewardId: string) => Promise<void>;
  refreshPoints: () => Promise<void>;
}

const REWARDS: Reward[] = [
  {
    id: '1',
    name: '10% OFF na próxima tattoo',
    description: 'Ganhe 10% de desconto na sua próxima tatuagem exclusiva',
    cost: 100,
    image: 'https://images.pexels.com/photos/4046316/pexels-photo-4046316.jpeg'
  },
  {
    id: '2',
    name: 'Arte secreta por e-mail',
    description: 'Receba uma arte exclusiva direto no seu e-mail',
    cost: 150,
    image: 'https://images.pexels.com/photos/6975527/pexels-photo-6975527.jpeg'
  },
  {
    id: '3',
    name: 'Certificado animado',
    description: 'Transforme seu certificado em uma versão animada especial',
    cost: 200,
    image: 'https://images.pexels.com/photos/7319307/pexels-photo-7319307.jpeg'
  },
  {
    id: '4',
    name: 'Acesso antecipado',
    description: 'Seja o primeiro a ver e comprar da nova coleção',
    cost: 250,
    image: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg'
  },
  {
    id: '5',
    name: 'Mockup realista',
    description: 'Veja como sua tatuagem ficará em um mockup profissional',
    cost: 300,
    image: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg'
  }
];

const InkPointsContext = createContext<InkPointsContextType | undefined>(undefined);

export const InkPointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeUserPoints = async () => {
    if (!user) return;

    try {
      // First check if the user exists in the users table
      const { data: userExists, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (userCheckError) throw userCheckError;

      if (!userExists) {
        console.log('User does not exist in users table');
        return;
      }

      // Check if the user already has points initialized
      const { data: existingPoints, error: checkError } = await supabase
        .from('inkpoints_usuario')
        .select('pontos')
        .eq('id_usuario', user.id)
        .maybeSingle();

      if (checkError) throw checkError;

      // Only initialize if no record exists and user exists in users table
      if (!existingPoints && userExists) {
        const { error: insertError } = await supabase
          .from('inkpoints_usuario')
          .insert({
            id_usuario: user.id,
            pontos: 0
          });

        if (insertError) throw insertError;
      }
    } catch (err) {
      console.error('Error initializing user points:', err);
      setError('Failed to initialize points');
    }
  };

  const refreshPoints = async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('inkpoints_usuario')
        .select('pontos')
        .eq('id_usuario', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data === null) {
        await initializeUserPoints();
        // After initialization, fetch the points
        const { data: newData, error: newFetchError } = await supabase
          .from('inkpoints_usuario')
          .select('pontos')
          .eq('id_usuario', user.id)
          .maybeSingle();

        if (newFetchError) throw newFetchError;
        setPoints(newData?.pontos || 0);
      } else {
        setPoints(data.pontos);
      }
    } catch (err) {
      console.error('Error fetching points:', err);
      setError('Failed to fetch points');
    }
  };

  useEffect(() => {
    if (user) {
      refreshPoints();
    }
    setLoading(false);
  }, [user]);

  const addPoints = async (amount: number) => {
    if (!user) return;

    try {
      const { error: updateError } = await supabase.rpc('update_user_points', {
        user_id: user.id,
        points_to_add: amount
      });

      if (updateError) throw updateError;
      await refreshPoints();
    } catch (err) {
      console.error('Error adding points:', err);
      setError('Failed to add points');
    }
  };

  const redeemReward = async (rewardId: string) => {
    if (!user) return;

    const reward = REWARDS.find(r => r.id === rewardId);
    if (!reward) throw new Error('Reward not found');

    if (points < reward.cost) {
      throw new Error('Insufficient points');
    }

    try {
      // Start a transaction
      const { error: redeemError } = await supabase
        .from('recompensas_resgatadas')
        .insert({
          id_usuario: user.id,
          recompensa: reward.name,
          pontos_gastos: reward.cost
        });

      if (redeemError) throw redeemError;

      // Deduct points
      await addPoints(-reward.cost);
      await refreshPoints();
    } catch (err) {
      console.error('Error redeeming reward:', err);
      setError('Failed to redeem reward');
      throw err;
    }
  };

  return (
    <InkPointsContext.Provider value={{
      points,
      rewards: REWARDS,
      loading,
      error,
      addPoints,
      redeemReward,
      refreshPoints
    }}>
      {children}
    </InkPointsContext.Provider>
  );
};

export const useInkPoints = () => {
  const context = useContext(InkPointsContext);
  if (context === undefined) {
    throw new Error('useInkPoints must be used within an InkPointsProvider');
  }
  return context;
};