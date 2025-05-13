import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedImageProps {
  imageUrl: string;
  alt: string;
  className?: string;
  ownerId?: string | null;
}

const ProtectedImage: React.FC<ProtectedImageProps> = ({ imageUrl, alt, className = '', ownerId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();

  const userOwnsImage = user && ownerId === user.id;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || userOwnsImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Apply white overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Configure watermark text
      const fontSize = Math.min(canvas.width, canvas.height) * 0.1;
      ctx.font = `${fontSize}px "Playfair Display", serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Full opacity
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Create diagonal watermark pattern
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 4);

      const text = 'UniqueInk';
      const spacing = fontSize * 2;
      const repeats = Math.ceil(Math.max(canvas.width, canvas.height) / spacing) * 2;

      for (let i = -repeats; i <= repeats; i++) {
        for (let j = -repeats; j <= repeats; j++) {
          ctx.fillText(text, i * spacing, j * spacing);
        }
      }

      ctx.restore();

      // Add border
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)'; // Full opacity
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    };
  }, [imageUrl, userOwnsImage]);

  if (userOwnsImage) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={className}
      />
    );
  }

  return (
    <div 
      className={`relative ${className}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover select-none"
        style={{
          pointerEvents: 'none',
          WebkitUserSelect: 'none',
          WebkitUserDrag: 'none'
        }}
      />
    </div>
  );
};

export default ProtectedImage;