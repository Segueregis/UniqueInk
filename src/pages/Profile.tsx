// Update the profile photo section in Profile.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Settings, ShoppingBag, Heart, FileText, History, 
  Camera, LogOut, Bell, Award, Download, Share2, Instagram,
  Edit2, Check, X
} from 'lucide-react';
import { format } from 'date-fns';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import ProfileMenu from '../components/profile/ProfileMenu';
import PointsDisplay from '../components/profile/PointsDisplay';
import { useInkPoints } from '../context/InkPointsContext';
import { useWishlist } from '../context/WishlistContext';
import { useTattoo } from '../context/TattooContext';
import ProtectedImage from '../components/common/ProtectedImage';
import { toast } from 'react-hot-toast';
import ProfilePhoto from '../components/profile/ProfilePhoto'; // IMPORTAÇÃO DO COMPONENTE FUNCIONAL

interface UserProfile {
  name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  level: string;
  points: number;
}

interface PurchasedTattoo {
  id: string;
  tattoo_id: string;
  purchase_date: string;
  certificate_url: string | null;
  tattoo: {
    id: string;
    title: string;
    image_url: string;
    status: string;
    sold_to_user_id: string | null;
  };
}

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { points, refreshPoints } = useInkPoints();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { tattoos } = useTattoo();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [purchasedTattoos, setPurchasedTattoos] = useState<PurchasedTattoo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
      refreshPoints();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profileData) {
        setError('Perfil não encontrado. Por favor, complete seu cadastro.');
        setLoading(false);
        return;
      }

      const { data: purchasedData, error: purchasedError } = await supabase
        .from('purchased_tattoos')
        .select(`
          id,
          tattoo_id,
          purchase_date,
          certificate_url,
          tattoo:tattoos (
            id,
            title,
            image_url,
            status,
            sold_to_user_id
          )
        `)
        .eq('user_id', user!.id)
        .order('purchase_date', { ascending: false });

      if (purchasedError) throw purchasedError;

      if (purchasedData) {
        setPurchasedTattoos(purchasedData as PurchasedTattoo[]);
      } else {
        setPurchasedTattoos([]);
      }

      setProfile(profileData);
    } catch (err) {
      setError('Falha ao carregar dados do usuário');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      setError('Falha ao sair');
      console.error(err);
    }
  };

  const handleDownload = async (tattoo: PurchasedTattoo) => {
    try {
      const response = await fetch(tattoo.tattoo.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tattoo.tattoo.title}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download iniciado!');
    } catch (err) {
      console.error('Erro ao fazer download:', err);
      toast.error('Falha ao fazer download da imagem');
    }
  };

  const handleViewCertificate = async (tattoo: PurchasedTattoo) => {
    if (tattoo.certificate_url) {
      window.open(tattoo.certificate_url, '_blank');
    } else {
      toast.error('Certificado ainda não disponível');
    }
  };

  const wishlistTattoos = tattoos.filter(tattoo => wishlist.includes(tattoo.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-black pt-20 flex items-center justify-center">
        <div className="text-ink-gold">Carregando...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-ink-black pt-20">
        <div className="container-custom py-16">
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
            <User size={64} className="text-ink-gold mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold mb-4">Perfil Não Encontrado</h2>
            <p className="text-gray-400 mb-6">
              {error || 'Não foi possível carregar seu perfil. Tente novamente mais tarde.'}
            </p>
            <Button
              onClick={handleSignOut}
              variant="secondary"
              className="inline-flex items-center space-x-2"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-black to-gray-900 pt-20">
      <div className="container-custom py-16">
        {error && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Perfil do Usuário */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              {/* Foto do perfil com funcionalidade de troca */}
              <ProfilePhoto
                currentUrl={profile?.avatar_url}
                onUpdate={loadUserData}
              />

              <div className="text-center mt-6">
                <h2 className="text-2xl font-display font-bold">{profile?.name}</h2>
                <p className="text-gray-400">@{profile?.username}</p>
                
                <div className="flex items-center justify-center mt-4 space-x-2">
                  <span className="px-3 py-1 bg-ink-gold/20 text-ink-gold rounded-full text-sm">
                    {profile?.level || 'Colecionador Iniciante'}
                  </span>
                  <PointsDisplay />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Detalhes da Conta</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Membro desde</label>
                    <p className="text-white">
                      {profile?.created_at ? 
                        format(new Date(profile.created_at), 'dd/MM/yyyy') : 
                        'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white">{profile?.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={handleSignOut}
                  variant="secondary"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <LogOut size={20} />
                  <span>Sair</span>
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* Minhas Tatuagens Exclusivas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <ShoppingBag className="text-ink-gold mr-2" size={24} />
                  Minhas Tatuagens Exclusivas
                </h2>
                <span className="text-gray-400">{purchasedTattoos.length} itens</span>
              </div>

              {purchasedTattoos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {purchasedTattoos.map((item) => (
                    <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden">
                      <div className="w-full h-[150px] relative">
                        <img
                          src={item.tattoo.image_url}
                          alt={item.tattoo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-2 truncate">{item.tattoo.title}</h3>
                        <p className="text-xs text-gray-400 mb-4">
                          Comprada em {format(new Date(item.purchase_date), 'dd/MM/yyyy')}
                        </p>
                        <div className="flex flex-col space-y-2">
                          <button 
                            onClick={() => handleDownload(item)}
                            className="w-full px-3 py-2 bg-ink-gold/20 text-ink-gold rounded hover:bg-ink-gold/30 transition-colors flex items-center justify-center text-sm"
                          >
                            <Download size={16} className="mr-2" />
                            Download
                          </button>
                          <button 
                            onClick={() => handleViewCertificate(item)}
                            className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors flex items-center justify-center text-sm"
                          >
                            <FileText size={16} className="mr-2" />
                            Certificado
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="mx-auto mb-4 text-gray-600" size={48} />
                  <p className="text-gray-400 mb-4">Você ainda não comprou nenhuma tattoo exclusiva.</p>
                  <Button to="/" variant="primary">Ver Coleção</Button>
                </div>
              )}
            </motion.div>

            {/* Lista de Desejos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <Heart className="text-ink-gold mr-2" size={24} />
                  Lista de Desejos
                </h2>
                <span className="text-gray-400">{wishlistTattoos.length} itens</span>
              </div>

              {wishlistTattoos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {wishlistTattoos.map((tattoo) => (
                    <div key={tattoo.id} className="bg-gray-800 rounded-lg overflow-hidden">
                      <div className="aspect-square w-full h-[150px] relative">
                        <ProtectedImage
                          imageUrl={tattoo.image_url}
                          alt={tattoo.title}
                          className="w-full h-full object-cover"
                          ownerId={tattoo.sold_to_user_id}
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm mb-1 truncate">{tattoo.title}</h3>
                        <p className="text-ink-gold text-sm mb-2">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(tattoo.price)}
                        </p>
                        <div className="flex space-x-1">
                          <Button
                            to={`/checkout/${tattoo.id}`}
                            variant="primary"
                            className="flex-1 py-1 px-2 text-sm"
                          >
                            Comprar
                          </Button>
                          <button 
                            onClick={() => removeFromWishlist(tattoo.id)}
                            className="p-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="mx-auto mb-4 text-gray-600" size={48} />
                  <p className="text-gray-400 mb-4">Sua lista de desejos está vazia</p>
                  <Button to="/" variant="primary">Descobrir Designs</Button>
                </div>
              )}
            </motion.div>

            {/* Atividade Recente */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              <h2 className="text-xl font-semibold flex items-center mb-6">
                <History className="text-ink-gold mr-2" size={24} />
                Atividade Recente
              </h2>

              <div className="space-y-4">
                <div className="flex items-center text-gray-400">
                  <Award className="mr-3" size={20} />
                  <div>
                    <p>Alcançou 50 pontos!</p>
                    <p className="text-sm">2 dias atrás</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Configurações */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-900 rounded-lg border border-gray-800"
            >
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Settings className="text-ink-gold" size={24} />
                  <h2 className="text-xl font-semibold">Configurações</h2>
                </div>
                <div className="space-y-4">
                  <ProfileMenu />
                  <button className="w-full text-left px-4 py-2 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
                    Editar Perfil
                  </button>
                  <button className="w-full text-left px-4 py-2 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
                    Alterar Senha
                  </button>
                  <button className="w-full text-left px-4 py-2 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
                    Configurações de Notificação
                  </button>
                  <button className="w-full text-left px-4 py-2 rounded bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors">
                    Sair
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;