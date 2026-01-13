'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/formatters';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { items, summary, fetchCart, updateQuantity, removeFromCart, isLoading } =
    useCartStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(itemId, newQuantity);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-primary-600 animate-bounce" />
          <p className="text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <h2 className="font-display text-2xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">
            Agrega productos para comenzar tu compra
          </p>
          <Link href="/productos" className="btn-primary">
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card p-4 flex gap-4">
              <Link
                href={`/productos/${item.product.slug}`}
                className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden"
              >
                <Image
                  src={item.product.images[0] || '/placeholder.jpg'}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </Link>

              <div className="flex-1">
                <Link
                  href={`/productos/${item.product.slug}`}
                  className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-2"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {item.product.category.name}
                </p>
                <p className="font-bold text-lg mt-2">
                  {formatPrice(item.product.price)}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-2 py-1">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="font-display text-xl font-bold mb-4">Resumen de Compra</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({summary?.itemCount} items)</span>
                <span>{formatPrice(summary?.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span>
                  {summary?.shippingCost === 0 ? (
                    <span className="text-green-600 font-semibold">¡GRATIS!</span>
                  ) : (
                    formatPrice(summary?.shippingCost || 0)
                  )}
                </span>
              </div>

              {summary && !summary.qualifiesForFreeShipping && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 text-sm">
                  <p className="text-primary-700">
                    ¡Agrega{' '}
                    <span className="font-bold">
                      {formatPrice(
                        summary.freeShippingThreshold - summary.subtotal
                      )}
                    </span>{' '}
                    más para envío gratis!
                  </p>
                  <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (summary.subtotal / summary.freeShippingThreshold) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">
                  {formatPrice(summary?.total || 0)}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="w-full btn-primary flex items-center justify-center">
              <span>Proceder al Pago</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            <Link
              href="/productos"
              className="block text-center text-primary-600 hover:text-primary-700 font-medium mt-4"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
