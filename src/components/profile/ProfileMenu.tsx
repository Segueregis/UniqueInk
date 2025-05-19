import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/profile')}
      className="w-full text-left px-3 sm:px-4 py-2 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
    >
      <span>Meu Perfil</span>
    </button>
  );
};

export default ProfileMenu;