import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Award } from 'lucide-react';
import { useInkPoints } from '../../context/InkPointsContext';

interface WheelSegment {
  id: string;
  label: string;
  color: string;
  probability: number;
  points: number;
}

const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: 'nothing', label: 'Não foi dessa vez', color: '#7F1D1D', probability: 0.4, points: 0 },
  { id: 'one', label: '+1 ponto', color: '#B45309', probability: 0.2, points: 1 },
  { id: 'two', label: '+2 pontos', color: '#1E40AF', probability: 0.15, points: 2 },
  { id: 'five', label: '+5 pontos', color: '#065F46', probability: 0.15, points: 5 },
  { id: 'art', label: 'Arte exclusiva', color: '#5B21B6', probability: 0.1, points: 0 }
];

const RewardsWheel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { points, addPoints } = useInkPoints();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = async () => {
    if (isSpinning || points < 50) return;

    try {
      setIsSpinning(true);
      setResult(null);

      await addPoints(-50);

      const random = Math.random();
      let cumulativeProbability = 0;
      let selectedSegment = WHEEL_SEGMENTS[0];

      for (const segment of WHEEL_SEGMENTS) {
        cumulativeProbability += segment.probability;
        if (random <= cumulativeProbability) {
          selectedSegment = segment;
          break;
        }
      }

      const segmentIndex = WHEEL_SEGMENTS.indexOf(selectedSegment);
      const segmentAngle = 360 / WHEEL_SEGMENTS.length;
      const targetRotation = rotation + (360 * 8) + (segmentAngle * segmentIndex);
      
      setRotation(targetRotation);

      setTimeout(async () => {
        setResult(selectedSegment);
        if (selectedSegment.points > 0) {
          await addPoints(selectedSegment.points);
        }
        setIsSpinning(false);
      }, 6000);
    } catch (error) {
      console.error('Error spinning wheel:', error);
      setIsSpinning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-ink-orange to-ink-magenta p-[1px] rounded-xl w-full max-w-lg"
      >
        <div className="bg-gray-900/95 backdrop-blur rounded-lg p-4 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-6 sm:mb-8">
            <Award className="text-ink-gold mx-auto mb-3 sm:mb-4" size={40} />
            <h2 className="text-xl sm:text-2xl font-display font-bold mb-2">Roleta de Prêmios</h2>
            <p className="text-sm sm:text-base text-gray-400">Teste sua sorte! Cada giro custa 50 InkPoints</p>
            <div className="mt-3 sm:mt-4 inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800/80 backdrop-blur rounded-full">
              <span className="text-sm sm:text-base text-ink-gold">{points} InkPoints disponíveis</span>
            </div>
          </div>

          <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto mb-6 sm:mb-8">
            {/* Golden Arrow Pointer */}
            <div 
              className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 z-10 w-6 sm:w-8 h-8 sm:h-12 clip-arrow"
              style={{
                background: 'linear-gradient(to bottom, #EFD9A5, #BFA874)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
              }}
            />

            {/* Wheel Container */}
            <div
              ref={wheelRef}
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{ 
                transform: `rotate(${rotation}deg)`,
                transition: `transform ${isSpinning ? '6s' : '0s'} cubic-bezier(0.32, 0, 0.67, 1)`,
                boxShadow: '0 0 30px rgba(239, 217, 165, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {WHEEL_SEGMENTS.map((segment, index) => {
                const angle = (360 / WHEEL_SEGMENTS.length) * index;
                return (
                  <div
                    key={segment.id}
                    className="absolute w-1/2 h-1/2 origin-bottom-right"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      background: `linear-gradient(
                        135deg,
                        ${segment.color}dd,
                        ${segment.color}
                      )`,
                      borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: isSpinning ? 'inset 0 0 20px rgba(255, 255, 255, 0.1)' : 'none'
                    }}
                  >
                    <div
                      className="absolute whitespace-nowrap font-sans font-bold text-xs sm:text-sm"
                      style={{
                        left: '50%',
                        top: '25%',
                        transform: `
                          rotate(${90 + (360 / WHEEL_SEGMENTS.length) / 2}deg)
                          translate(-50%, -50%)
                        `,
                        transformOrigin: 'center',
                        color: '#FFFFFF',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                        width: 'max-content'
                      }}
                    >
                      {segment.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {result ? (
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                {result.points > 0 ? (
                  <>Parabéns! Você ganhou {result.points} InkPoints!</>
                ) : result.id === 'art' ? (
                  <>Incrível! Você ganhou uma Arte Exclusiva!</>
                ) : (
                  <>Não foi dessa vez... Tente novamente!</>
                )}
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                {result.points > 0 ? (
                  <>Os pontos já foram adicionados à sua conta!</>
                ) : result.id === 'art' ? (
                  <>Verifique seu e-mail para receber sua arte exclusiva.</>
                ) : (
                  <>Continue tentando, a próxima pode ser sua!</>
                )}
              </p>
            </div>
          ) : (
            <div className="h-16 sm:h-20" />
          )}

          <button
            onClick={spinWheel}
            disabled={isSpinning || points < 50}
            className={`w-full py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all ${
              isSpinning || points < 50
                ? 'bg-gray-800/80 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-ink-orange to-ink-magenta text-white hover:opacity-90'
            }`}
          >
            {isSpinning
              ? 'Girando...'
              : points < 50
              ? `Faltam ${50 - points} pontos para girar`
              : 'Girar por 50 pontos'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RewardsWheel;