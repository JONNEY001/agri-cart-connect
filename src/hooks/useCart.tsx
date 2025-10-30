import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CartContextType {
  cartItemsCount: number;
  refreshCartCount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const refreshCartCount = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setCartItemsCount(0);
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', session.user.id);

    if (!error && data) {
      const totalCount = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemsCount(totalCount);
    }
  };

  useEffect(() => {
    refreshCartCount();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        refreshCartCount();
      } else {
        setCartItemsCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <CartContext.Provider value={{ cartItemsCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};