'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, PaginationData } from '@/types';
import api from '@/lib/axios';
import ProductCard from '@/components/ProductCard';
import ProductFilter, { FilterValues } from '@/components/ProductFilter';
import { Loader2 } from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const [data, setData] = useState<PaginationData<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({
    sort: 'createdAt',
    category: categoryFromUrl || undefined
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Actualizar filtro de categoría si cambia en la URL
    if (categoryFromUrl && categoryFromUrl !== filters.category) {
      setFilters(prev => ({ ...prev, category: categoryFromUrl }));
      setCurrentPage(1);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sort: filters.sort,
      });

      if (filters.category) params.append('category', filters.category);
      if (filters.material) params.append('material', filters.material);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

      const { data: response } = await api.get(`/products?${params.toString()}`);

      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold mb-2">Todos los Productos</h1>
        <p className="text-gray-600">
          {data ? `${data.pagination.total} productos disponibles` : 'Cargando...'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <ProductFilter onFilterChange={handleFilterChange} />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : data && data.products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-2 flex-wrap gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 transition-colors"
                  >
                    Anterior
                  </button>

                  {/* Primera página */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      currentPage === 1
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-110'
                        : 'border border-gray-300 hover:bg-primary-50'
                    }`}
                  >
                    1
                  </button>

                  {/* Puntos suspensivos izquierda */}
                  {currentPage > 4 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}

                  {/* Páginas intermedias */}
                  {[...Array(data.pagination.totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    // Mostrar páginas cerca de la actual
                    if (
                      pageNumber > 1 &&
                      pageNumber < data.pagination.totalPages &&
                      pageNumber >= currentPage - 2 &&
                      pageNumber <= currentPage + 2
                    ) {
                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`w-10 h-10 rounded-lg transition-all ${
                            currentPage === pageNumber
                              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-110'
                              : 'border border-gray-300 hover:bg-primary-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}

                  {/* Puntos suspensivos derecha */}
                  {currentPage < data.pagination.totalPages - 3 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}

                  {/* Última página */}
                  {data.pagination.totalPages > 1 && (
                    <button
                      onClick={() => setCurrentPage(data.pagination.totalPages)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        currentPage === data.pagination.totalPages
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-110'
                          : 'border border-gray-300 hover:bg-primary-50'
                      }`}
                    >
                      {data.pagination.totalPages}
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(data.pagination.totalPages, p + 1))
                    }
                    disabled={currentPage === data.pagination.totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
