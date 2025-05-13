import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import RewardsWheel from '../rewards/RewardsWheel';
import { useInkPoints } from '../../context/InkPointsContext';

const ProfileMenu: React.FC = () => {
  const [showWheel, setShowWheel] = useState(false);
  const { addPoints } = useInkPoints();

  const handleAddTestPoints = async () => {
    try {
      await addPoints(50);
    } catch (error) {
      console.error('Erro ao adicionar pontos de teste:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowWheel(true)}
        className="w-full text-left px-3 sm:px-4 py-2 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
      >
        <Gift size={18} className="text-ink-gold" />
        <span>Roleta de Prêmios</span>
      </button>

      <button
        onClick={handleAddTestPoints}
        className="w-full text-left px-3 sm:px-4 py-2 mt-2 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
      >
        <Gift size={18} className="text-ink-gold" />
        <span>Adicionar 50 pontos (Teste)</span>
      </button>

      {showWheel && <RewardsWheel onClose={() => setShowWheel(false)} />}
    </>
  );
};

export default ProfileMenu;