import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CreditCard, Banknote } from 'lucide-react';
import { useTattoo } from '../context/TattooContext';
import Button from '../components/common/Button';
import ProtectedImage from '../components/common/ProtectedImage';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getTattoo, purchaseTattoo, isAvailable } = useTattoo();
  const { checkout, items } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  
  const isBatchCheckout = searchParams.get('batch') === 'true';
  const total = isBatchCheckout ? Number(searchParams.get('total')) : 0;
  const itemCount = isBatchCheckout ? Number(searchParams.get('items')) : 1;
  
  const tattoo = getTattoo(id || '');
  
  if (!tattoo && !isBatchCheckout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Tatuagem não encontrada</h2>
          <Button to="/" variant="primary">
            Voltar para Coleção
          </Button>
        </div>
      </div>
    );
  }

  if (!isAvailable(tattoo?.id || '') && !isBatchCheckout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl mb-4">Esta tatuagem já foi vendida</h2>
          <p className="text-gray-400 mb-6">
            Infelizmente, alguém já adquiriu a exclusividade deste design.
            Explore nossa coleção para encontrar outras artes únicas.
          </p>
          <Button to="/" variant="primary">
            Ver Outras Tatuagens
          </Button>
        </div>
      </div>
    );
  }

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-ink-black pt-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto px-4"
        >
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-ink-orange to-ink-magenta rounded-full mx-auto flex items-center justify-center">
              <Lock className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-display font-bold mb-6 gradient-text">
            Obrigado pela sua compra!
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {isBatchCheckout 
              ? "Suas tatuagens exclusivas agora são suas para sempre. Elas foram removidas do catálogo e ninguém mais poderá comprá-las."
              : "Sua tatuagem exclusiva agora é sua para sempre. Ela foi removida do catálogo e ninguém mais poderá comprá-la."}
          </p>
          <div className="space-y-4">
            <Button 
              to={isBatchCheckout ? "/profile" : `/tattoo/${tattoo?.id}`}
              variant="primary"
              className="w-full sm:w-auto"
            >
              {isBatchCheckout ? "Ver Minhas Tatuagens" : "Ver Minha Tatuagem"}
            </Button>
            <Button 
              to="/"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Explorar Mais Designs
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    
    try {
      if (isBatchCheckout) {
        await checkout();
      } else {
        await purchaseTattoo(tattoo?.id || '');
      }
      setShowThankYou(true);
    } catch (error: any) {
      console.error('Erro ao processar compra:', error);
      
      // Check for unavailable tattoos error
      const errorMessage = error.message || error.error?.message || '';
      if (
        errorMessage.includes('no longer available') || 
        errorMessage.includes('Some tattoos in your cart are no longer available')
      ) {
        toast.error('Algumas tatuagens no seu carrinho não estão mais disponíveis', {
          duration: 5000,
        });
        navigate('/cart');
        return;
      }
      
      setError('Ocorreu um erro ao processar sua compra. Por favor, tente novamente.');
      toast.error('Erro ao processar pagamento. Por favor, tente novamente.', {
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-black pt-20">
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Lock className="text-ink-gold mx-auto mb-4" size={32} />
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Checkout Exclusivo
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {isBatchCheckout 
                ? `${itemCount} designs exclusivos serão seus após a compra.`
                : 'Essa arte será removida do catálogo após sua compra.'}
              <span className="block font-display text-ink-gold mt-2">
                {isBatchCheckout 
                  ? 'Eles serão seus e de mais ninguém.'
                  : 'Ela será sua e de mais ninguém.'}
              </span>
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl p-6 mb-6">
                  {error && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
                      <p>{error}</p>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-semibold mb-6">Dados Pessoais</h3>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2" htmlFor="name">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ink-gold"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-400 text-sm mb-2" htmlFor="email">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ink-gold"
                          required
                        />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-6">Método de Pagamento</h3>
                    
                    <div className="space-y-4 mb-8">
                      <div 
                        className={`border ${
                          paymentMethod === 'card' 
                            ? 'border-ink-gold bg-gray-800' 
                            : 'border-gray-700 bg-gray-900'
                        } rounded-lg p-4 cursor-pointer transition-all`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="card"
                            name="paymentMethod"
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                            className="mr-3 h-4 w-4 accent-ink-gold"
                          />
                          <label htmlFor="card" className="flex items-center cursor-pointer">
                            <CreditCard className="mr-2 text-ink-gold" size={20} />
                            <span>Cartão de Crédito</span>
                          </label>
                        </div>
                        
                        {paymentMethod === 'card' && (
                          <div className="mt-4 grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-gray-400 text-sm mb-2" htmlFor="cardNumber">
                                Número do Cartão
                              </label>
                              <input
                                type="text"
                                id="cardNumber"
                                placeholder="0000 0000 0000 0000"
                                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ink-gold"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-400 text-sm mb-2" htmlFor="expiry">
                                  Data de Validade
                                </label>
                                <input
                                  type="text"
                                  id="expiry"
                                  placeholder="MM/AA"
                                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ink-gold"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-gray-400 text-sm mb-2" htmlFor="cvv">
                                  CVV
                                </label>
                                <input
                                  type="text"
                                  id="cvv"
                                  placeholder="123"
                                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ink-gold"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className={`border ${
                          paymentMethod === 'pix' 
                            ? 'border-ink-gold bg-gray-800' 
                            : 'border-gray-700 bg-gray-900'
                        } rounded-lg p-4 cursor-pointer transition-all`}
                        onClick={() => setPaymentMethod('pix')}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="pix"
                            name="paymentMethod"
                            value="pix"
                            checked={paymentMethod === 'pix'}
                            onChange={() => setPaymentMethod('pix')}
                            className="mr-3 h-4 w-4 accent-ink-gold"
                          />
                          <label htmlFor="pix" className="flex items-center cursor-pointer">
                            <Banknote className="mr-2 text-ink-gold" size={20} />
                            <span>Pix</span>
                          </label>
                        </div>
                        
                        {paymentMethod === 'pix' && (
                          <div className="mt-4 text-center">
                            <div className="bg-gray-700 p-4 rounded-lg inline-block">
                              <p className="text-gray-300 mb-2">QR Code do Pix</p>
                              <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center">
                                <p className="text-ink-black">QR Code Simulado</p>
                              </div>
                              <p className="text-gray-400 text-sm mt-2">
                                Escaneie com seu app de banco
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className={`btn-primary w-full py-4 text-lg ${
                          isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isProcessing ? 'Processando...' : 'Finalizar Compra Exclusiva'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
            
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl sticky top-24">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Resumo do Pedido</h3>
                    
                    {isBatchCheckout ? (
                      <div className="space-y-4 mb-6">
                        {items.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-20 h-20 rounded-md overflow-hidden">
                              <ProtectedImage
                                imageUrl={item.tattoo.image_url}
                                alt={item.tattoo.title}
                                className="w-full h-full object-cover"
                                ownerId={item.tattoo.sold_to_user_id}
                              />
                            </div>
                            <div>
                              <h4 className="font-display font-medium text-sm">{item.tattoo.title}</h4>
                              <p className="text-gray-400 text-xs">Estilo: {item.tattoo.style}</p>
                              <p className="text-ink-gold text-sm mt-1">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(item.tattoo.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-4 mb-6">
                        <div className="w-20 h-20 rounded-md overflow-hidden">
                          <ProtectedImage
                            imageUrl={tattoo?.image_url}
                            alt={tattoo?.title || 'Tatuagem'}
                            className="w-full h-full object-cover"
                            ownerId={tattoo?.sold_to_user_id}
                          />
                        </div>
                        
                        <div>
                          <h4 className="font-display font-medium">
                            {isBatchCheckout 
                              ? `${itemCount} designs exclusivos` 
                              : tattoo?.title}
                          </h4>
                          {!isBatchCheckout && tattoo && (
                            <>
                              <p className="text-gray-400 text-sm">Estilo: {tattoo.style}</p>
                              <p className="text-sm text-gray-500">{tattoo.id}</p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-800 pt-4 mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Subtotal</span>
                        <span>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(isBatchCheckout ? total : (tattoo?.price || 0))}
                        </span>
                      </div>
                      
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Certificado Digital</span>
                        <span>Incluso</span>
                      </div>
                      
                      <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-gray-800">
                        <span>Total</span>
                        <span>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(isBatchCheckout ? total : (tattoo?.price || 0))}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg mt-6">
                      <p className="text-sm text-gray-300">
                        <span className="text-ink-gold">Importante:</span> Após a compra, você receberá um email com {isBatchCheckout ? 'os arquivos' : 'o arquivo'} em alta resolução e {isBatchCheckout ? 'seus certificados' : 'seu certificado'} de exclusividade.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;