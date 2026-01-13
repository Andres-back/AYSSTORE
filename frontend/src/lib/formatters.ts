export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getOrderStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    PENDING: 'badge-warning',
    PROCESSING: 'badge-primary',
    SHIPPED: 'badge-primary',
    DELIVERED: 'badge-success',
    CANCELLED: 'badge-danger',
  };
  return colors[status] || 'badge-primary';
};

export const getPaymentStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    PENDING: 'badge-warning',
    PAID: 'badge-success',
    FAILED: 'badge-danger',
    REFUNDED: 'badge-warning',
  };
  return colors[status] || 'badge-primary';
};
