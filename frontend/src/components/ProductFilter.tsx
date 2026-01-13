'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';
import api from '@/lib/axios';
import { SlidersHorizontal } from 'lucide-react';

interface ProductFilterProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  category?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: string;
}

export default function ProductFilter({ onFilterChange }: ProductFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterValues>({
    sort: 'createdAt'
  });
  const [isOpen, setIsOpen] = useState(false);

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
    }
  };

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-primary-600" />
          <span>Filtros</span>
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-primary-600"
        >
          {isOpen ? 'Cerrar' : 'Abrir'}
        </button>
      </div>

      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden md:block'}`}>
        {/* Category Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Categoría</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={!filters.category}
                onChange={() => handleFilterChange('category', undefined)}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-gray-700">Todas</span>
            </label>
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category.slug}
                  onChange={() => handleFilterChange('category', category.slug)}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-gray-700">{category.name}</span>
                <span className="text-xs text-gray-400">
                  ({category._count?.products || 0})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Material Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Material</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="material"
                checked={!filters.material}
                onChange={() => handleFilterChange('material', undefined)}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-gray-700">Todos</span>
            </label>
            {[
              { value: 'acero', label: 'Acero' },
              { value: 'oro_goldfield', label: 'Oro Goldfield' },
              { value: 'covergold', label: 'Covergold' },
              { value: 'rodio', label: 'Rodio' },
              { value: 'plata', label: 'Plata' }
            ].map((material) => (
              <label
                key={material.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="material"
                  checked={filters.material === material.value}
                  onChange={() => handleFilterChange('material', material.value)}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-gray-700">{material.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Rango de Precio</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Mínimo</label>
              <input
                type="number"
                placeholder="$0"
                value={filters.minPrice || ''}
                onChange={(e) =>
                  handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Máximo</label>
              <input
                type="number"
                placeholder="$500,000"
                value={filters.maxPrice || ''}
                onChange={(e) =>
                  handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                }
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Sort */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">Ordenar por</h3>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="input-field"
          >
            <option value="createdAt">Más recientes</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setFilters({ sort: 'createdAt' });
            onFilterChange({ sort: 'createdAt' });
          }}
          className="w-full btn-outline"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
}
