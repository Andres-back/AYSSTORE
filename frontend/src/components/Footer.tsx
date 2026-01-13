'use client';

import Link from 'next/link';
import { Heart, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary-50 to-secondary-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <span className="font-display text-2xl font-bold text-gradient">
                BellaStore
              </span>
            </Link>
            <p className="text-gray-600 mb-4">
              Tu tienda favorita de accesorios para mujer. Bolsos, moñas, collares, aretes y más.
              Estilo único para mujeres únicas.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4 text-gray-800">
              Compra
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-gray-600 hover:text-primary-600">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-gray-600 hover:text-primary-600">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-gray-600 hover:text-primary-600">
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4 text-gray-800">
              Ayuda
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ayuda" className="text-gray-600 hover:text-primary-600">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-gray-600 hover:text-primary-600">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-gray-600 hover:text-primary-600">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-600 hover:text-primary-600">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} BellaStore. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
