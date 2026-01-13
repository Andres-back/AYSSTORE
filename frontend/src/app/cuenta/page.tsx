'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Order } from '@/types';
import api from '@/lib/axios';
import { formatPrice, formatDate, getOrderStatusColor, getPaymentStatusColor } from '@/lib/formatters';
import { User, MapPin, Package, LogOut } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold mb-2">Mi Cuenta</h1>
        <p className="text-gray-600">
          Bienvenida de nuevo, {user.firstName}!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-white">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <p className="text-center font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-center text-sm text-gray-500">{user.email}</p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Mis Pedidos</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Mi Perfil</span>
              </button>

              <Link
                href="/cuenta/direcciones"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Direcciones</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'orders' && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-6">Mis Pedidos</h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando pedidos...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="card p-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-2">
                    No tienes pedidos aún
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Explora nuestros productos y realiza tu primera compra
                  </p>
                  <Link href="/productos" className="btn-primary inline-block">
                    Ver Productos
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="card p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            Pedido #{order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                          <span className={`badge ${getOrderStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className={`badge ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-bold text-lg text-primary-600">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Artículos</p>
                            <p className="font-semibold">
                              {order.orderItems.length} producto(s)
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Dirección de envío:
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.address.street}, {order.address.city},{' '}
                            {order.address.department}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-6">Mi Perfil</h2>

              <div className="card p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={user.firstName}
                      disabled
                      className="input-field bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={user.lastName}
                      disabled
                      className="input-field bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="input-field bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={user.phone || 'No registrado'}
                      disabled
                      className="input-field bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol
                    </label>
                    <input
                      type="text"
                      value={user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                      disabled
                      className="input-field bg-gray-50"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">
                      Miembro desde: {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
