'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/formatters';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para comprar');
      router.push('/login');
      return;
    }

    try {
      await addToCart(product.id);
    } catch (error) {
      // Error is handled in the store
    }
  };

  // Construir URL completa para imágenes del backend
  const imageUrl = product.images[0]
    ? product.images[0].startsWith('http')
      ? product.images[0]
      : `http://localhost:5000${product.images[0]}`
    : '/placeholder.jpg';

  return (
    <Link href={`/productos/${product.slug}`}>
      <div className="card group cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.material && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
              {product.material}
            </div>
          )}
          <button
            className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-50"
            onClick={(e) => {
              e.preventDefault();
              toast.success('Agregado a favoritos');
            }}
          >
            <Heart className="w-5 h-5 text-primary-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-xs text-primary-600 font-medium mb-1">
            {product.category.name}
          </p>
          <h3 className="font-display text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-auto">
            <div className="flex items-baseline space-x-2 mb-3">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full btn-primary flex items-center justify-center space-x-2 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Agregar al Carrito</span>
            </button>
          </div>

          {product.stock < 5 && product.stock > 0 && (
            <p className="text-xs text-accent-600 mt-2">
              ¡Solo quedan {product.stock} unidades!
            </p>
          )}
          {product.stock === 0 && (
            <p className="text-xs text-gray-500 mt-2">Agotado</p>
          )}
        </div>
      </div>
    </Link>
  );
}
