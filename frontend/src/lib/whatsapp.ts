import { Order } from '@/types';
import { formatPrice } from './formatters';

// Configuración de WhatsApp
export const WHATSAPP_CONFIG = {
  phoneNumber: '573108551940', // CAMBIAR POR TU NÚMERO (con código de país)
  businessName: 'BellaStore',
};

/**
 * Genera un mensaje de WhatsApp para confirmar un pedido
 */
export const generateOrderWhatsAppMessage = (order: Order): string => {
  const items = order.orderItems
    .map(
      (item, index) =>
        `${index + 1}. ${item.product.name} x${item.quantity} - ${formatPrice(
          item.subtotal
        )}`
    )
    .join('\n');

  const message = `
🛍️ *NUEVO PEDIDO - ${order.orderNumber}*

Hola! Acabo de realizar un pedido en BellaStore:

📦 *PRODUCTOS:*
${items}

💰 *RESUMEN:*
Subtotal: ${formatPrice(order.subtotal)}
Envío: ${order.shippingCost === 0 ? 'GRATIS ✨' : formatPrice(order.shippingCost)}
*TOTAL: ${formatPrice(order.total)}*

📍 *DIRECCIÓN DE ENVÍO:*
${order.address.fullName}
${order.address.street}
${order.address.city}, ${order.address.department}
Tel: ${order.address.phone}

💳 *MÉTODO DE PAGO:*
${order.paymentMethod === 'stripe' ? 'Tarjeta de Crédito/Débito' :
  order.paymentMethod === 'pse' ? 'PSE' :
  'Pago Contraentrega'}

${order.notes ? `📝 *NOTAS:*\n${order.notes}\n` : ''}
¿Podrías confirmarme los detalles del envío? Gracias! 😊
  `.trim();

  return message;
};

/**
 * Abre WhatsApp con un mensaje predefinido
 */
export const openWhatsApp = (message: string, phoneNumber?: string) => {
  const phone = phoneNumber || WHATSAPP_CONFIG.phoneNumber;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
};

/**
 * Genera mensaje para consultar sobre un producto
 */
export const generateProductInquiry = (productName: string, productPrice: number): string => {
  return `Hola! Estoy interesado en *${productName}* (${formatPrice(productPrice)}). ¿Está disponible?`;
};

/**
 * Genera mensaje genérico de contacto
 */
export const generateGeneralInquiry = (): string => {
  return `¡Hola ${WHATSAPP_CONFIG.businessName}! Tengo una consulta sobre sus productos. ¿Me pueden ayudar?`;
};

/**
 * Genera mensaje para consultar estado de pedido
 */
export const generateOrderStatusInquiry = (orderNumber: string): string => {
  return `Hola! Quisiera consultar el estado de mi pedido *${orderNumber}*. ¿Me pueden ayudar?`;
};
