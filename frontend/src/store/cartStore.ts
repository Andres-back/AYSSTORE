import { create } from 'zustand';
import api from '@/lib/axios';
import { CartItem, CartSummary, ApiResponse } from '@/types';
import toast from 'react-hot-toast';

interface CartState {
  items: CartItem[];
  summary: CartSummary | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  summary: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<ApiResponse<{ items: CartItem[]; summary: CartSummary }>>(
        '/cart'
      );

      if (data.success && data.data) {
        set({
          items: data.data.items,
          summary: data.data.summary,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching cart:', error);
    }
  },

  addToCart: async (productId: string, quantity = 1) => {
    try {
      const { data } = await api.post<ApiResponse<CartItem>>('/cart', {
        productId,
        quantity,
      });

      if (data.success) {
        toast.success('Producto agregado al carrito');
        await get().fetchCart();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al agregar al carrito';
      toast.error(message);
      throw error;
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      const { data } = await api.put<ApiResponse<CartItem>>(`/cart/${itemId}`, {
        quantity,
      });

      if (data.success) {
        await get().fetchCart();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar cantidad';
      toast.error(message);
      throw error;
    }
  },

  removeFromCart: async (itemId: string) => {
    try {
      const { data } = await api.delete<ApiResponse<void>>(`/cart/${itemId}`);

      if (data.success) {
        toast.success('Producto eliminado del carrito');
        await get().fetchCart();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al eliminar del carrito';
      toast.error(message);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const { data } = await api.delete<ApiResponse<void>>('/cart');

      if (data.success) {
        set({ items: [], summary: null });
        toast.success('Carrito vaciado');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al vaciar el carrito';
      toast.error(message);
      throw error;
    }
  },
}));
