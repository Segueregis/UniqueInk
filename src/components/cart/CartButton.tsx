import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartButton: React.FC = () => {
  const { items } = useCart();

  return (
    <Link
      to="/cart"
      className="relative p-2 text-white hover:text-ink-gold transition-colors"
      aria-label="Carrinho de Compras"
    >
      <ShoppingCart size={24} />
      {items.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-ink-gold text-ink-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {items.length}
        </span>
      )}
    </Link>
  );
};

export default CartButton;