# Configuración de WhatsApp - BellaStore

## 📱 Cómo Cambiar el Número de WhatsApp

### Opción 1: Cambiar en el archivo de configuración (Recomendado)

Edita el archivo: **`frontend/src/lib/whatsapp.ts`**

Busca la línea:
```typescript
export const WHATSAPP_CONFIG = {
  phoneNumber: '573001234567', // CAMBIAR POR TU NÚMERO
  businessName: 'BellaStore',
};
```

Cambia `'573001234567'` por tu número de WhatsApp con el formato:
- **Código de país + número (sin espacios, sin +, sin guiones)**

**Ejemplos:**
- Colombia: `573001234567` (57 + 3001234567)
- México: `5215512345678` (521 + 5512345678)
- España: `34612345678` (34 + 612345678)
- Argentina: `5491112345678` (549 + 1112345678)

### Opción 2: Cambiar en el componente del botón flotante

Edita el archivo: **`frontend/src/app/layout.tsx`**

Busca la línea:
```tsx
<WhatsAppButton phoneNumber="573001234567" />
```

Cambia `"573001234567"` por tu número.

---

## 🎯 Funcionalidades Implementadas

### 1. **Botón Flotante de WhatsApp** ✅
- Ubicación: Esquina inferior derecha en TODAS las páginas
- Características:
  - Animación de rebote
  - Badge de notificación
  - Popup con mensaje de bienvenida
  - Click abre WhatsApp Web/App

**Archivo:** `frontend/src/components/WhatsAppButton.tsx`

### 2. **Mensaje Automático al Confirmar Pedido** ✅
- Cuando: Al completar el checkout
- Qué hace: Pregunta si quiere contactar por WhatsApp
- Mensaje incluye:
  - Número de pedido
  - Lista de productos comprados
  - Total a pagar
  - Dirección de envío
  - Método de pago
  - Notas adicionales

**Archivo:** `frontend/src/app/checkout/page.tsx`

### 3. **Botón en Detalles de Producto** ✅
- Ubicación: Página de cada producto
- Mensaje predefinido: Consulta sobre disponibilidad y precio
- Color verde WhatsApp oficial (#25D366)

**Archivo:** `frontend/src/app/productos/[slug]/page.tsx`

### 4. **Utilidades de WhatsApp** ✅
Funciones disponibles en `frontend/src/lib/whatsapp.ts`:

```typescript
// Generar mensaje de pedido
generateOrderWhatsAppMessage(order)

// Abrir WhatsApp con mensaje
openWhatsApp(message, phoneNumber)

// Consultar sobre producto
generateProductInquiry(productName, productPrice)

// Mensaje genérico
generateGeneralInquiry()

// Consultar estado de pedido
generateOrderStatusInquiry(orderNumber)
```

---

## 📝 Formato de Mensajes

### Mensaje de Pedido Confirmado:
```
🛍️ *NUEVO PEDIDO - ORD-1234567890*

Hola! Acabo de realizar un pedido en BellaStore:

📦 *PRODUCTOS:*
1. Bolso Tote Elegante x1 - $89,900
2. Collar Cadena Corazón x1 - $45,900

💰 *RESUMEN:*
Subtotal: $135,800
Envío: GRATIS ✨
*TOTAL: $135,800*

📍 *DIRECCIÓN DE ENVÍO:*
María González
Calle 123 #45-67, Apto 801
Bogotá, Cundinamarca
Tel: 3009876543

💳 *MÉTODO DE PAGO:*
Pago Contraentrega

¿Podrías confirmarme los detalles del envío? Gracias! 😊
```

### Mensaje de Consulta de Producto:
```
Hola! Estoy interesado en *Bolso Tote Elegante* ($89,900). ¿Está disponible?
```

---

## 🎨 Personalización

### Cambiar Mensaje de Bienvenida del Bot Flotante

Edita: `frontend/src/components/WhatsAppButton.tsx`

Busca:
```tsx
<p className="text-sm text-gray-700">
  ¡Hola! 👋 Bienvenida a BellaStore. ¿En qué podemos ayudarte?
</p>
```

### Cambiar Mensaje por Defecto

Edita: `frontend/src/components/WhatsAppButton.tsx`

Busca:
```tsx
message = '¡Hola! Estoy interesado en sus productos de BellaStore',
```

### Cambiar Nombre del Negocio

Edita: `frontend/src/lib/whatsapp.ts`

Busca:
```typescript
businessName: 'BellaStore',
```

---

## 🧪 Probar WhatsApp

1. **Desarrollo (localhost):**
   - El botón flotante abre WhatsApp Web
   - Puedes probar con tu propio número

2. **Producción:**
   - Los clientes pueden abrir WhatsApp desde su app móvil
   - O desde WhatsApp Web en desktop

---

## 📱 Flujo Completo del Cliente

### Escenario 1: Consulta General
1. Cliente entra a la web
2. Ve el botón verde flotante
3. Click → Se abre popup
4. Click "Chatear por WhatsApp"
5. Se abre WhatsApp con mensaje predefinido

### Escenario 2: Consulta de Producto
1. Cliente ve un producto que le gusta
2. Click en "Consultar por WhatsApp"
3. Se abre WhatsApp con mensaje sobre ese producto específico

### Escenario 3: Post-Compra
1. Cliente completa el checkout
2. Sistema pregunta: "¿Deseas contactarnos por WhatsApp?"
3. Si acepta → Se abre WhatsApp con todos los detalles del pedido

---

## 🔧 Solución de Problemas

### El botón no abre WhatsApp
- **Causa:** Número mal formateado
- **Solución:** Verificar formato (código país + número, sin espacios)

### El mensaje aparece cortado
- **Causa:** Caracteres especiales no codificados
- **Solución:** La función `encodeURIComponent()` ya lo maneja

### El botón no se ve en móvil
- **Causa:** z-index bajo
- **Solución:** Ya está en z-50 (máximo en Tailwind)

---

## 📊 Estadísticas Recomendadas

Para rastrear conversiones de WhatsApp, puedes:

1. **Usar UTM Parameters:**
```typescript
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}&utm_source=website&utm_medium=whatsapp&utm_campaign=chat`;
```

2. **Google Analytics:**
```typescript
// Agregar tracking cuando se abre WhatsApp
window.gtag('event', 'whatsapp_click', {
  'event_category': 'engagement',
  'event_label': 'product_inquiry'
});
```

---

## ✅ Checklist de Configuración

- [ ] Cambiar número de WhatsApp en `whatsapp.ts`
- [ ] Cambiar número en `layout.tsx`
- [ ] Personalizar mensajes de bienvenida
- [ ] Probar botón flotante
- [ ] Probar consulta de producto
- [ ] Probar mensaje post-compra
- [ ] Verificar en móvil
- [ ] Verificar en desktop

---

## 🎉 ¡Listo!

Tu sistema de WhatsApp está completamente integrado y funcional. Los clientes pueden contactarte desde cualquier página de tu tienda.

**Beneficios:**
- ✅ Atención al cliente en tiempo real
- ✅ Mayor conversión de ventas
- ✅ Confirmación de pedidos instantánea
- ✅ Soporte personalizado
- ✅ Confianza del cliente

---

**Desarrollado con ❤️ para BellaStore**
