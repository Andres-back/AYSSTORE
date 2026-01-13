'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, User, Heart, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { summary, fetchCart } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="font-display text-2xl font-bold text-gradient">
              BellaStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/productos"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Productos
            </Link>
            <Link
              href="/categorias"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Categorías
            </Link>
            <Link
              href="/ofertas"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Ofertas
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="hidden md:block px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/cuenta"
                  className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user?.firstName}</span>
                </Link>
                <button
                  onClick={logout}
                  className="hidden md:block text-gray-700 hover:text-primary-600 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden md:block text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}

            <Link
              href="/carrito"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {summary && summary.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {summary.itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link
                href="/productos"
                className="text-gray-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                href="/categorias"
                className="text-gray-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorías
              </Link>
              <Link
                href="/ofertas"
                className="text-gray-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Ofertas
              </Link>
              {isAuthenticated ? (
                <>
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="text-purple-600 hover:text-purple-800 font-bold py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Panel Admin
                    </Link>
                  )}
                  <Link
                    href="/cuenta"
                    className="text-gray-700 hover:text-primary-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi Cuenta
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-primary-600 font-medium py-2"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
