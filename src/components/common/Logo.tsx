import React from 'react';
import { Droplet } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <Droplet className="text-transparent mr-2 fill-current bg-clip-text bg-gradient-to-r from-ink-orange to-ink-magenta" size={32} />
      <span className="font-display text-xl md:text-2xl font-bold gradient-text">
        UniqueInk
      </span>
    </div>
  );
};

export default Logo;