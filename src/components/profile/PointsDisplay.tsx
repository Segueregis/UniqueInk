import React, { useEffect } from 'react';
import { Coins } from 'lucide-react';
import { useInkPoints } from '../../context/InkPointsContext';

const PointsDisplay: React.FC = () => {
  const { points, refreshPoints } = useInkPoints();

  useEffect(() => {
    refreshPoints();
  }, []);

  return (
    <div className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 bg-ink-gold/20 rounded-full">
      <Coins size={14} className="text-ink-gold sm:hidden" />
      <Coins size={16} className="text-ink-gold hidden sm:block" />
      <span className="text-sm sm:text-base font-bold text-white whitespace-nowrap">
        {points} InkPoints
      </span>
    </div>
  );
};

export default PointsDisplay;