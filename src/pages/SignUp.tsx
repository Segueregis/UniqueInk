import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Nome é obrigatório';
    if (!formData.username.trim()) return 'Nome de usuário é obrigatório';
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      return 'Nome de usuário pode conter apenas letras, números e underscores';
    }
    if (!formData.email.trim()) return 'Email é obrigatório';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Formato de email inválido';
    if (formData.password.length < 6) return 'A senha deve ter pelo menos 6 caracteres';
    if (formData.password !== formData.confirmPassword) return 'As senhas não coincidem';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    if (loading) return;
    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.name, formData.username);
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro durante o cadastro';
      if (errorMessage.includes('user_already_exists')) {
        setError('Já existe uma conta com este email');
      } else if (errorMessage.includes('duplicate key value violates unique constraint')) {
        setError('Este nome de usuário já está em uso');
      } else {
        setError(errorMessage);
      }
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
              <UserPlus className="mx-auto mb-3 sm:mb-4 text-ink-gold" size={32} />
              <h1 className="text-xl sm:text-2xl font-display font-bold mb-2">Criar Conta</h1>
              <p className="text-sm sm:text-base text-gray-400">Junte-se à UniqueInk e tenha designs exclusivos de tatuagem</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start sm:items-center gap-3"
              >
                <AlertCircle className="text-red-400 shrink-0" size={20} />
                <div className="text-red-400 text-sm">
                  {error}
                  {error.includes('já existe') && (
                    <div className="mt-2">
                      <Link to="/login" className="text-ink-gold hover:underline">
                        Clique aqui para entrar
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2" htmlFor="name">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ink-gold text-sm sm:text-base"
                  placeholder="Digite seu nome completo"
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2" htmlFor="username">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  pattern="^[a-zA-Z0-9_]+$"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ink-gold text-sm sm:text-base"
                  placeholder="Escolha um nome de usuário"
                  autoComplete="username"
                />
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Apenas letras, números e underscores são permitidos
                </p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ink-gold text-sm sm:text-base"
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
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ink-gold text-sm sm:text-base"
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2" htmlFor="confirmPassword">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ink-gold text-sm sm:text-base"
                  placeholder="Confirme sua senha"
                  autoComplete="new-password"
                />
              </div>

              <div className="flex items-start sm:items-center">
                <input 
                  type="checkbox" 
                  id="terms"
                  required 
                  className="mt-1 sm:mt-0 form-checkbox text-ink-gold rounded border-gray-700 bg-gray-800" 
                />
                <label htmlFor="terms" className="ml-2 text-xs sm:text-sm text-gray-400">
                  Eu concordo com os{' '}
                  <Link to="/terms" className="text-ink-gold hover:underline">
                    Termos de Serviço
                  </Link>{' '}
                  e{' '}
                  <Link to="/privacy" className="text-ink-gold hover:underline">
                    Política de Privacidade
                  </Link>
                </label>
              </div>

              <Button 
                variant="primary" 
                className={`w-full py-2.5 sm:py-3 text-sm sm:text-base ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Criando Conta...' : 'Criar Conta'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm sm:text-base text-gray-400">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-ink-gold hover:underline">
                  Entrar
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;