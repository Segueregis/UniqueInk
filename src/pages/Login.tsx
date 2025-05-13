import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (loading) return;
    
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocorreu um erro';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-black pt-16 sm:pt-20 px-4">
      <div className="container-custom py-8 sm:py-16">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900 rounded-lg p-6 sm:p-8 shadow-2xl border border-gray-800"
          >
            <div className="text-center mb-6 sm:mb-8">
              <Lock className="mx-auto mb-3 sm:mb-4 text-ink-gold" size={32} />
              <h1 className="text-xl sm:text-2xl font-display font-bold mb-2">Bem-vindo de Volta</h1>
              <p className="text-sm sm:text-base text-gray-400">Entre para acessar seus designs exclusivos</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ink-gold text-sm sm:text-base"
                  required
                  placeholder="Digite seu email"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2" htmlFor="password">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ink-gold text-sm sm:text-base"
                  required
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-ink-gold rounded border-gray-700 bg-gray-800" 
                  />
                  <span className="ml-2 text-xs sm:text-sm text-gray-400">Lembrar-me</span>
                </label>
                <Link to="/forgot-password" className="text-xs sm:text-sm text-ink-gold hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>

              <Button 
                variant="primary" 
                className={`w-full py-2.5 sm:py-3 text-sm sm:text-base ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm sm:text-base text-gray-400">
                Não tem uma conta?{' '}
                <Link to="/signup" className="text-ink-gold hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;