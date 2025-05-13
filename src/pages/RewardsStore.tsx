import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, AlertCircle, Check } from 'lucide-react';
import { useInkPoints } from '../context/InkPointsContext';

const RewardsStore: React.FC = () => {
  const { points, rewards, redeemReward } = useInkPoints();
  const [redeeming, setRedeeming] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRedeem = async (rewardId: string) => {
    setRedeeming(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await redeemReward(rewardId);
      setSuccessMessage('Recompensa resgatada com sucesso! Verifique seu e-mail.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to redeem reward');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-black to-gray-900 pt-20">
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Award className="text-ink-gold mx-auto mb-4" size={48} />
          <h1 className="text-4xl font-display font-bold mb-4">Loja de Recompensas</h1>
          <p className="text-xl text-gray-300">
            Use seus InkPoints para resgatar recompensas exclusivas
          </p>
          <div className="mt-6 inline-block px-6 py-3 bg-ink-gold/20 rounded-full">
            <span className="text-2xl font-display text-ink-gold">
              {points} InkPoints
            </span>
          </div>
        </motion.div>

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-green-900/30 border border-green-500/50 rounded-lg flex items-center"
          >
            <Check className="text-green-400 mr-2" size={20} />
            <p className="text-green-400">{successMessage}</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center"
          >
            <AlertCircle className="text-red-400 mr-2" size={20} />
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rewards.map((reward) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-ink-gold/30 transition-all"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={reward.image}
                  alt={reward.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-ink-gold text-ink-black rounded-full text-sm font-semibold">
                    {reward.cost} pontos
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-display font-semibold mb-2">
                  {reward.name}
                </h3>
                <p className="text-gray-400 mb-6">
                  {reward.description}
                </p>

                <button
                  onClick={() => handleRedeem(reward.id)}
                  disabled={points < reward.cost || redeeming}
                  className={`w-full py-3 px-4 rounded-md font-semibold transition-all ${
                    points >= reward.cost
                      ? 'bg-gradient-to-r from-ink-orange to-ink-magenta text-white hover:opacity-90'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {points >= reward.cost
                    ? redeeming
                      ? 'Resgatando...'
                      : 'Resgatar Agora'
                    : `Faltam ${reward.cost - points} pontos`}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardsStore