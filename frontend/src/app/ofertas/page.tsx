'use client';

import { useEffect, useState } from 'react';
import { Product, PaginationData } from '@/types';
import api from '@/lib/axios';
import ProductCard from '@/components/ProductCard';
import { Tag, TrendingDown } from 'lucide-react';

export default function OffersPage() {
  const [data, setData] = useState<PaginationData<Product> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      // Obtener productos que tengan comparePrice (descuentos)
      const { data: response } = await api.get('/products?limit=50');

      if (response.success) {
        // Filtrar solo productos con descuento
        const productsWithDiscount = response.data.products.filter(
          (p: Product) => p.comparePrice && p.comparePrice > p.price
        );

        setData({
          products: productsWithDiscount,
          pagination: {
            page: 1,
            limit: 50,
            total: productsWithDiscount.length,
            totalPages: 1,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (price: number, comparePrice: number) => {
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full mb-6">
          <Tag className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-display text-5xl font-bold mb-4">
          Ofertas Especiales
        </h1>
        <p className="text-xl text-gray-600">
          ¡Aprovecha nuestros mejores descuentos!
        </p>
      </div>

      {/* Stats */}
      {!loading && data && data.products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {data.products.length}
            </div>
            <p className="text-gray-600">Productos en Oferta</p>
          </div>

          <div className="card p-6 text-center">
            <div className="text-4xl font-bold text-accent-600 mb-2">
              Hasta {Math.max(
                ...data.products.map((p) =>
                  calculateDiscount(p.price, p.comparePrice || p.price)
                )
              )}%
            </div>
            <p className="text-gray-600">Descuento Máximo</p>
          </div>

          <div className="card p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-gray-600">Precios Increíbles</p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card h-96 animate-pulse bg-gray-200"></div>
          ))}
        </div>
      ) : data && data.products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <Tag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 className="font-display text-2xl font-semibold mb-3">
            No hay ofertas disponibles
          </h3>
          <p className="text-gray-600 mb-8">
            Vuelve pronto para descubrir nuestras próximas ofertas especiales
          </p>
          <a href="/productos" className="btn-primary inline-block">
            Ver Todos los Productos
          </a>
        </div>
      )}

      {/* CTA Banner */}
      {!loading && data && data.products.length > 0 && (
        <div className="mt-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-3xl p-12 text-white text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            ¡No te pierdas estas ofertas!
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Ofertas por tiempo limitado. ¡Compra ahora!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/productos"
              className="btn-secondary bg-white text-accent-600 hover:bg-gray-100"
            >
              Ver Más Productos
            </a>
            <a href="/categorias" className="btn-outline border-white text-white hover:bg-white/10">
              Explorar Categorías
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
