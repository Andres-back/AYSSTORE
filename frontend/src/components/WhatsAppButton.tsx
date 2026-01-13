'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({
  phoneNumber = '573001234567', // Cambia este número por el tuyo
  message = '¡Hola! Estoy interesado en sus productos de BellaStore',
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="mb-4 bg-white rounded-2xl shadow-2xl p-6 w-80 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-gray-900">
                ¿Necesitas ayuda?
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">BS</span>
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 flex-1">
                  <p className="text-sm text-gray-700">
                    ¡Hola! 👋 Bienvenida a BellaStore. ¿En qué podemos ayudarte?
                  </p>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center mb-3">
                Nuestro equipo responde en minutos
              </div>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-3 px-4 rounded-full flex items-center justify-center space-x-2 transition-colors shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chatear por WhatsApp</span>
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Respuesta promedio: 5 minutos
            </p>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative"
          aria-label="Chat de WhatsApp"
        >
          {isOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <>
              <MessageCircle className="w-7 h-7 animate-bounce-soft" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </>
          )}
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-20 right-0 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            ¿Necesitas ayuda? Chatea con nosotros
            <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          </div>
        )}
      </div>
    </>
  );
}
