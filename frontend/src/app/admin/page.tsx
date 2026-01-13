'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  const adminCards = [
    {
      title: 'Productos',
      description: 'Gestionar productos, precios y stock',
      icon: Package,
      href: '/admin/productos',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Categorías',
      description: 'Organizar y editar categorías',
      icon: ShoppingBag,
      href: '/admin/categorias',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Usuarios',
      description: 'Ver y gestionar usuarios',
      icon: Users,
      href: '/admin/usuarios',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Estadísticas',
      description: 'Ver métricas y reportes',
      icon: TrendingUp,
      href: '/admin/estadisticas',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="font-display text-4xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Bienvenido/a, {user?.firstName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="card group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">{card.title}</h2>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="font-display text-lg font-bold mb-4">Resumen Rápido</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Productos Activos</span>
                <span className="font-bold text-primary-600">1,019</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Usuarios Registrados</span>
                <span className="font-bold text-primary-600">2</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Pedidos Hoy</span>
                <span className="font-bold text-primary-600">0</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="font-display text-lg font-bold mb-4">Actividad Reciente</h3>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                No hay actividad reciente
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
