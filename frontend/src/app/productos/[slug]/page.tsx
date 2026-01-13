'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import api from '@/lib/axios';
import { formatPrice } from '@/lib/formatters';
import { generateProductInquiry, openWhatsApp } from '@/lib/whatsapp';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, ArrowLeft, Truck, Shield, RefreshCw, Minus, Plus, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${params.slug}`);
      if (data.success) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Producto no encontrado');
      router.push('/productos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para comprar');
      router.push('/login');
      return;
    }

    if (!product) return;

    try {
      await addToCart(product.id, quantity);
    } catch (error) {
      // Error handled in store
    }
  };


  // Construir URLs completas para las imágenes
  const getImageUrl = (image: string) => {
    if (!image) return '/placeholder.jpg';
    if (image.startsWith('http')) return image;
    return `http://localhost:5000${image}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/productos"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a productos
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
            <Image
              src={getImageUrl(product.images[selectedImage])}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.material && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase">
                {product.material}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-primary-500 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-primary-600 font-medium mb-2">
            {product.category.name}
          </p>

          <h1 className="font-display text-4xl font-bold mb-4 text-gray-900">
            {product.name}
          </h1>

          <div className="flex items-baseline space-x-3 mb-6">
            <span className="text-4xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Stock Status */}
          {product.stock > 0 ? (
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">
                {product.stock < 5
                  ? `¡Solo quedan ${product.stock} unidades!`
                  : 'Disponible en stock'}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-red-700 font-medium">Agotado</span>
            </div>
          )}

          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Cantidad
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-300 rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors rounded-l-full"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-gray-100 transition-colors rounded-r-full"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Máximo: {product.stock} unidades
                </span>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full btn-primary flex items-center justify-center space-x-2 text-lg py-4 mb-3"
          >
            <ShoppingBag className="w-6 h-6" />
            <span>{product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}</span>
          </button>

          {/* WhatsApp Inquiry Button */}
          <button
            onClick={() => {
              const message = generateProductInquiry(product.name, product.price);
              openWhatsApp(message);
            }}
            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-4 px-6 rounded-full flex items-center justify-center space-x-2 text-lg mb-6 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Consultar por WhatsApp</span>
          </button>

          {/* Features */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-start space-x-3">
              <Truck className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Envío Gratis</p>
                <p className="text-sm text-gray-600">
                  En compras superiores a {formatPrice(200000)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Compra Segura</p>
                <p className="text-sm text-gray-600">
                  Tus datos están protegidos
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <RefreshCw className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Devoluciones</p>
                <p className="text-sm text-gray-600">
                  30 días para devoluciones
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
