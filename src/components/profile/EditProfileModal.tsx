import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface EditProfileModalProps {
  onClose: () => void;
  onUpdate: () => void;
  currentProfile: {
    name: string;
    email: string;
    username: string;
  };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose, onUpdate, currentProfile }) => {
  const [formData, setFormData] = useState({
    name: currentProfile.name,
    username: currentProfile.username,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Check if username is already taken
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('username', formData.username)
        .neq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingUser) {
        setError('Este nome de usuário já está em uso');
        return;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: formData.name,
          username: formData.username,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Perfil atualizado com sucesso!');
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error updating profile:', err);
      if (error === null) {
        toast.error('Falha ao atualizar perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 rounded-lg p-6 max-w-lg w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-display font-bold mb-6">Editar Perfil</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ink-gold"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Nome de Usuário
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              pattern="^[a-zA-Z0-9_]+$"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ink-gold"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Apenas letras, números e underscores são permitidos
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-ink-orange to-ink-magenta text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Salvar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;