import { createContext, useContext, useState, ReactNode } from 'react';
import { Food } from '../../domain/entities/food';

export interface CartItem {
  comida: Food;
  cantidad: number;
  comentario: string;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext({} as CartContextProps);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const exists = prev.find(p => p.comida.id === item.comida.id);
      if (exists) {
        // Si ya existe, sumamos cantidad y concatenamos comentario
        return prev.map(p =>
          p.comida.id === item.comida.id
            ? {
                ...p,
                cantidad: p.cantidad + item.cantidad,
                comentario: `${p.comentario} ${item.comentario}`.trim(),
              }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (foodId: string) => {
    setCart(prev => prev.filter(p => p.comida.id !== foodId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};