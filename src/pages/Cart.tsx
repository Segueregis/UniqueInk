import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import ProtectedImage from '../components/common/ProtectedImage';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, loading, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-black pt-20 flex items-center justify-center">
        <div className="text-ink-gold">Carregando carrinho...</div>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.tattoo.price, 0);

  const handleCheckout = () => {
    if (items.length === 1) {
      // Se houver apenas uma tatuagem, redireciona para a página de checkout específica
      navigate(`/checkout/${items[0].tattoo.id}`);
    } else if (items.length > 1) {
      // Se houver múltiplas tatuagens, redireciona para uma página de checkout em lote
      // Por enquanto, vamos usar a primeira tatuagem como referência
      navigate(`/checkout/${items[0].tattoo.id}?batch=true&total=${total}&items=${items.length}`);
    }
  };

  return (
    <div className="min-h-screen bg-ink-black pt-20">
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <ShoppingCart className="text-ink-gold mx-auto mb-4" size={48} />
          <h1 className="text-4xl font-display font-bold mb-4">Seu Carrinho</h1>
          <p className="text-xl text-gray-300">
            {items.length} {items.length === 1 ? 'item' : 'itens'} no carrinho
          </p>
        </motion.div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-gray-900 rounded-lg overflow-hidden flex flex-col sm:flex-row"
                  >
                    <div className="w-full sm:w-48 h-48">
                      <ProtectedImage
                        imageUrl={item.tattoo.image_url}
                        alt={item.tattoo.title}
                        className="w-full h-full object-cover"
                        ownerId={item.tattoo.sold_to_user_id}
                      />
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-display mb-2">
                          {item.tattoo.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          Estilo: {item.tattoo.style}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-ink-gold text-lg">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(item.tattoo.price)}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.tattoo.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Resumo do Pedido</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(total)}
                    </span>
                  </div>

                  <div className="border-t border-gray-800 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-ink-gold">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-ink-orange to-ink-magenta text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Finalizar Compra
                </button>

                <p className="text-sm text-gray-400 text-center mt-4">
                  Estes designs serão removidos do catálogo após a compra
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border border-gray-800 rounded-lg">
            <ShoppingCart className="mx-auto mb-6 text-gray-600" size={64} />
            <h2 className="text-2xl font-display mb-4">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-400 mb-8">
              Adicione alguns designs de tatuagem exclusivos ao seu carrinho!
            </p>
            <Button to="/" variant="primary" className="inline-flex items-center">
              Ver Coleção
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;