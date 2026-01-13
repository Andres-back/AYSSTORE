'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, Category } from '@/types';
import api from '@/lib/axios';
import ProductCard from '@/components/ProductCard';
import { Sparkles, TrendingUp, Gift, Truck } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products?featured=true&limit=8'),
        api.get('/categories'),
      ]);

      if (productsRes.data.success) {
        setFeaturedProducts(productsRes.data.data.products);
      }

      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-100 via-secondary-50 to-pink-100 py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-gray-900 animate-fade-in">
              Descubre tu{' '}
              <span className="text-gradient">Estilo Único</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-slide-up">
              Bolsos, moñas, collares, aretes y más accesorios exclusivos para mujeres que aman la moda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/productos" className="btn-primary">
                Ver Colección
              </Link>
              <Link href="/ofertas" className="btn-secondary">
                Ver Ofertas
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-50 blur-2xl animate-bounce-soft"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary-200 rounded-full opacity-50 blur-2xl animate-bounce-soft" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Envío Gratis</h3>
              <p className="text-gray-600 text-sm">En compras superiores a $200.000</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Regalos Especiales</h3>
              <p className="text-gray-600 text-sm">En cada compra una sorpresa</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">Calidad Premium</h3>
              <p className="text-gray-600 text-sm">Productos de la más alta calidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-4">Explora por Categoría</h2>
            <p className="text-gray-600">Encuentra exactamente lo que buscas</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card h-48 animate-pulse bg-gray-200"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={`/productos?category=${category.slug}`}
                  className="card group cursor-pointer h-48 flex items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  <div className="relative z-10 text-center">
                    <h3 className="font-display text-xl font-bold text-gray-800 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category._count?.products || 0} productos
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-4xl font-bold mb-2 flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-primary-600" />
                <span>Productos Destacados</span>
              </h2>
              <p className="text-gray-600">Los favoritos de nuestras clientas</p>
            </div>
            <Link href="/productos" className="btn-outline hidden md:block">
              Ver Todos
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card h-96 animate-pulse bg-gray-200"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link href="/productos" className="btn-primary">
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-4">
            ¿Lista para brillar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de mujeres que ya encontraron su estilo perfecto
          </p>
          <Link href="/productos" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
            Comenzar a Comprar
          </Link>
        </div>
      </section>
    </div>
  );
}
