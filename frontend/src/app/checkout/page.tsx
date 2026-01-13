'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Address, ApiResponse, Order } from '@/types';
import api from '@/lib/axios';
import { formatPrice } from '@/lib/formatters';
import { generateOrderWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp';
import toast from 'react-hot-toast';
import { CreditCard, MapPin, Loader2, CheckCircle, MessageCircle } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { summary, clearCart } = useCartStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    department: '',
    postalCode: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!summary || summary.itemCount === 0) {
      router.push('/carrito');
      return;
    }
    fetchAddresses();
  }, [isAuthenticated, summary]);

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get<ApiResponse<Address[]>>('/users/addresses');
      if (data.success && data.data) {
        setAddresses(data.data);
        const defaultAddress = data.data.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post<ApiResponse<Address>>(
        '/users/addresses',
        newAddress
      );
      if (data.success && data.data) {
        toast.success('Dirección agregada');
        setAddresses([...addresses, data.data]);
        setSelectedAddress(data.data.id);
        setShowNewAddress(false);
      }
    } catch (error: any) {
      toast.error('Error al agregar dirección');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Por favor selecciona una dirección de envío');
      return;
    }
    if (!paymentMethod) {
      toast.error('Por favor selecciona un método de pago');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        addressId: selectedAddress,
        paymentMethod,
        notes,
      });

      if (data.success) {
        const order: Order = data.data;

        toast.success('¡Pedido realizado exitosamente!');
        await clearCart();

        // Preguntar si quiere contactar por WhatsApp
        const confirmWhatsApp = window.confirm(
          '✅ ¡Pedido confirmado!\n\n¿Deseas contactarnos por WhatsApp para confirmar los detalles del envío?'
        );

        if (confirmWhatsApp) {
          const message = generateOrderWhatsAppMessage(order);
          openWhatsApp(message);
        }

        router.push(`/cuenta`);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al procesar el pedido';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !summary) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="card p-6">
            <h2 className="font-display text-xl font-bold mb-4 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-primary-600" />
              Dirección de Envío
            </h2>

            {addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedAddress === address.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddress === address.id}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-semibold">{address.fullName}</span>
                    <p className="text-sm text-gray-600 ml-6">
                      {address.street}, {address.city}, {address.department}
                    </p>
                    <p className="text-sm text-gray-600 ml-6">{address.phone}</p>
                  </label>
                ))}
              </div>
            ) : null}

            <button
              onClick={() => setShowNewAddress(!showNewAddress)}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              {showNewAddress ? 'Cancelar' : '+ Agregar nueva dirección'}
            </button>

            {showNewAddress && (
              <form onSubmit={handleCreateAddress} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo"
                    value={newAddress.fullName}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, fullName: e.target.value })
                    }
                    className="input-field"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Teléfono"
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, phone: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Dirección completa"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                  className="input-field"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Ciudad"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                    className="input-field"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Departamento"
                    value={newAddress.department}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, department: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Guardar Dirección
                </button>
              </form>
            )}
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <h2 className="font-display text-xl font-bold mb-4 flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-primary-600" />
              Método de Pago
            </h2>

            <div className="space-y-3">
              <label className="block p-4 border-2 rounded-lg cursor-pointer hover:border-primary-300 transition-all">
                <input
                  type="radio"
                  name="payment"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span className="font-semibold">Tarjeta de Crédito/Débito</span>
                <p className="text-sm text-gray-600 ml-6">Pago seguro con Stripe</p>
              </label>

              <label className="block p-4 border-2 rounded-lg cursor-pointer hover:border-primary-300 transition-all">
                <input
                  type="radio"
                  name="payment"
                  value="pse"
                  checked={paymentMethod === 'pse'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span className="font-semibold">PSE</span>
                <p className="text-sm text-gray-600 ml-6">
                  Pago desde tu banco en línea
                </p>
              </label>

              <label className="block p-4 border-2 rounded-lg cursor-pointer hover:border-primary-300 transition-all">
                <input
                  type="radio"
                  name="payment"
                  value="contraentrega"
                  checked={paymentMethod === 'contraentrega'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span className="font-semibold">Pago Contraentrega</span>
                <p className="text-sm text-gray-600 ml-6">Paga cuando recibas tu pedido</p>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="card p-6">
            <h3 className="font-semibold mb-3">Notas del Pedido (Opcional)</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="¿Alguna instrucción especial para tu pedido?"
              rows={4}
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="font-display text-xl font-bold mb-4">Resumen del Pedido</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span>
                  {summary.shippingCost === 0 ? (
                    <span className="text-green-600 font-semibold">¡GRATIS!</span>
                  ) : (
                    formatPrice(summary.shippingCost)
                  )}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(summary.total)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress || !paymentMethod}
              className="w-full btn-primary flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Realizar Pedido
                </>
              )}
            </button>

            <div className="mt-6 text-xs text-gray-500 text-center">
              <p>Al realizar el pedido aceptas nuestros términos y condiciones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
