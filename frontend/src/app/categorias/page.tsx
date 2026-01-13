'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import api from '@/lib/axios';
import { ShoppingBag } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-5xl font-bold mb-4">
          Explora Nuestras Categorías
        </h1>
        <p className="text-xl text-gray-600">
          Encuentra el accesorio perfecto para cada ocasión
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-64 animate-pulse bg-gray-200"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/productos?category=${category.slug}`}
              className="card group cursor-pointer overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative h-48 bg-gradient-to-br from-primary-100 via-secondary-50 to-pink-100 overflow-hidden">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="w-20 h-20 text-primary-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <h2 className="font-display text-2xl font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h2>

                {category.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    {category._count?.products || 0} producto(s)
                  </span>
                  <span className="text-primary-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Ver más →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold mb-2">
            No hay categorías disponibles
          </h3>
          <p className="text-gray-600">
            Las categorías estarán disponibles pronto
          </p>
        </div>
      )}

      {/* Featured Section */}
      <div className="mt-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-12 text-white text-center">
        <h2 className="font-display text-3xl font-bold mb-4">
          ¿No encuentras lo que buscas?
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Explora toda nuestra colección de productos
        </p>
        <Link
          href="/productos"
          className="inline-block bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
        >
          Ver Todos los Productos
        </Link>
      </div>
    </div>
  );
}
