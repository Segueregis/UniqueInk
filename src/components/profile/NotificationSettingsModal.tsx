import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Bell, Gift, Tag, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface NotificationSetting {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
}

interface NotificationSettingsModalProps {
  onClose: () => void;
}

const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'promotions',
      icon: <Tag className="text-ink-gold" size={24} />,
      title: 'Promoções',
      description: 'Receba notificações sobre descontos e ofertas especiais',
      enabled: true
    },
    {
      id: 'rewards',
      icon: <Gift className="text-ink-gold" size={24} />,
      title: 'Roleta de Prêmios',
      description: 'Seja notificado quando ganhar prêmios na roleta',
      enabled: true
    },
    {
      id: 'catalog',
      icon: <BookOpen className="text-ink-gold" size={24} />,
      title: 'Atualizações do Catálogo',
      description: 'Saiba quando novas tatuagens são adicionadas',
      enabled: true
    }
  ]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('notifications')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data?.notifications) {
        setSettings(prev => prev.map(setting => ({
          ...setting,
          enabled: data.notifications[setting.id] ?? setting.enabled
        })));
      }
    } catch (err) {
      console.error('Error loading notification settings:', err);
    }
  };

  const handleToggle = (id: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const notificationPreferences = settings.reduce((acc, setting) => ({
        ...acc,
        [setting.id]: setting.enabled
      }), {});

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          notifications: notificationPreferences
        });

      if (error) throw error;

      toast.success('Preferências de notificação atualizadas!');
      onClose();
    } catch (err) {
      console.error('Error saving notification settings:', err);
      toast.error('Falha ao salvar preferências');
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

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-ink-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="text-ink-gold" size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold">Configurar Notificações</h2>
          <p className="text-gray-400 mt-2">
            Escolha quais notificações você deseja receber
          </p>
        </div>

        <div className="space-y-6">
          {settings.map(setting => (
            <div
              key={setting.id}
              className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg"
            >
              <div className="flex-shrink-0 mt-1">{setting.icon}</div>
              <div className="flex-grow">
                <h3 className="font-semibold mb-1">{setting.title}</h3>
                <p className="text-sm text-gray-400">{setting.description}</p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleToggle(setting.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ink-gold focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    setting.enabled ? 'bg-ink-gold' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      setting.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-ink-orange to-ink-magenta text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Salvando...</span>
              </>
            ) : (
              'Salvar Preferências'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationSettingsModal;