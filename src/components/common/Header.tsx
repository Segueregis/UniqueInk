import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import Logo from './Logo';
import CartButton from '../cart/CartButton';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ username: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, getUserProfile } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (user) {
      getUserProfile().then(profile => {
        if (profile) {
          setUserProfile(profile);
        }
      });
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-ink-black/95 backdrop-blur-sm py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="z-10">
          <Logo />
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-white hover:text-ink-gold transition-colors font-medium"
          >
            Início
          </Link>
          <Link
            to="/how-it-works"
            className="text-white hover:text-ink-gold transition-colors font-medium"
          >
            Como Funciona
          </Link>
          <Link
            to="/manifesto"
            className="text-white hover:text-ink-gold transition-colors font-medium"
          >
            Manifesto
          </Link>
          <Link
            to="/"
            className="btn-primary"
          >
            Coleção Exclusiva
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <CartButton />
              
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="ml-6 p-1 rounded-full border border-ink-gold/30 hover:border-ink-gold transition-colors group"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-ink-orange to-ink-magenta flex items-center justify-center text-white overflow-hidden transition-transform group-hover:scale-110">
                      {userProfile?.username?.[0]?.toUpperCase() || <User size={20} />}
                    </div>
                    {userProfile && (
                      <span className="text-white">{userProfile.username}</span>
                    )}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-800 py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    >
                      Perfil
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-ink-gold border border-ink-gold/30 rounded hover:border-ink-gold transition-all hover:bg-ink-gold/10"
              >
                Entrar
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded bg-gradient-to-r from-[#F241A1] to-[#FF7E29] hover:opacity-90 transition-opacity"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </nav>

        {/* Botão Menu Mobile */}
        <button
          className="md:hidden z-10 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Alternar menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menu Mobile */}
        <div
          className={`fixed inset-0 bg-ink-black/95 flex flex-col items-center justify-center space-y-8 
                    transition-all duration-300 ease-in-out md:hidden ${
                      isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
        >
          <Link
            to="/"
            className="text-2xl text-white hover:text-ink-gold transition-colors font-medium"
          >
            Início
          </Link>
          <Link
            to="/how-it-works"
            className="text-2xl text-white hover:text-ink-gold transition-colors font-medium"
          >
            Como Funciona
          </Link>
          <Link
            to="/manifesto"
            className="text-2xl text-white hover:text-ink-gold transition-colors font-medium"
          >
            Manifesto
          </Link>
          <Link
            to="/"
            className="btn-primary text-xl mt-4"
          >
            Coleção Exclusiva
          </Link>

          {user ? (
            <div className="flex flex-col items-center space-y-4">
              <CartButton />
              {userProfile && (
                <span className="text-ink-gold">{userProfile.username}</span>
              )}
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-ink-gold hover:text-white transition-colors"
              >
                <User size={24} />
                <span>Perfil</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut size={24} />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-4 w-48">
              <Link
                to="/login"
                className="w-full px-4 py-2 text-center text-ink-gold border border-ink-gold/30 rounded hover:border-ink-gold transition-all hover:bg-ink-gold/10"
              >
                Entrar
              </Link>
              <Link
                to="/signup"
                className="w-full px-4 py-2 text-center rounded bg-gradient-to-r from-[#F241A1] to-[#FF7E29] hover:opacity-90 transition-opacity"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;