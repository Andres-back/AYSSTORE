# Documentación de Base de Datos - BellaStore

## Esquema de Base de Datos

Esta documentación describe la estructura de la base de datos PostgreSQL utilizada en BellaStore.

## Diagrama de Relaciones

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   User      │◄────┬───│   Address    │         │  Category   │
│             │     │   │              │         │             │
│ - id        │     │   │ - id         │         │ - id        │
│ - email     │     │   │ - userId (FK)│         │ - name      │
│ - password  │     │   │ - fullName   │         │ - slug      │
│ - firstName │     │   │ - phone      │         │ - imageUrl  │
│ - lastName  │     │   │ - street     │         │ - isActive  │
│ - phone     │     │   │ - city       │         └─────────────┘
│ - role      │     │   │ - department │               │
│ - isActive  │     │   │ - isDefault  │               │
└─────────────┘     │   └──────────────┘               │
      │             │                                   │
      │             │                                   │
      │             │   ┌──────────────┐               │
      │             └───│    Order     │               │
      │                 │              │               │
      │                 │ - id         │               │
      │                 │ - orderNumber│         ┌─────▼──────┐
      │                 │ - userId (FK)│         │  Product   │
      │                 │ - addressId  │         │            │
      │                 │ - status     │         │ - id       │
      │                 │ - subtotal   │         │ - name     │
      │                 │ - shipping   │         │ - slug     │
      │                 │ - total      │         │ - price    │
      │                 │ - payment    │         │ - stock    │
      │                 └──────────────┘         │ - images   │
      │                       │                  │ - category │
      │                       │                  │ - isActive │
      │                       │                  └────────────┘
      │                       │                        │
      │                 ┌─────▼──────┐                │
      │                 │ OrderItem  │                │
      │                 │            │                │
      │                 │ - id       │◄───────────────┘
      │                 │ - orderId  │
      │                 │ - productId│
      │                 │ - quantity │
      │                 │ - price    │
      │                 └────────────┘
      │
      │
      │                 ┌────────────┐
      └─────────────────│ CartItem   │
                        │            │
                        │ - id       │
                        │ - userId   │
                        │ - productId│
                        │ - quantity │
                        └────────────┘
```

## Tablas

### 1. users

Almacena información de usuarios del sistema (clientes y administradores).

| Campo      | Tipo       | Descripción                          | Restricciones         |
|------------|------------|--------------------------------------|-----------------------|
| id         | UUID       | Identificador único                  | PK, Default uuid()    |
| email      | String     | Correo electrónico                   | UNIQUE, NOT NULL      |
| password   | String     | Contraseña hasheada (bcrypt)         | NOT NULL              |
| firstName  | String     | Nombre                               | NOT NULL              |
| lastName   | String     | Apellido                             | NOT NULL              |
| phone      | String?    | Teléfono                             | NULLABLE              |
| role       | Enum       | Rol del usuario                      | DEFAULT 'CUSTOMER'    |
| isActive   | Boolean    | Estado de la cuenta                  | DEFAULT true          |
| createdAt  | DateTime   | Fecha de creación                    | DEFAULT now()         |
| updatedAt  | DateTime   | Fecha de actualización               | AUTO UPDATE           |

**Relaciones:**
- Tiene muchas: addresses, orders, cartItems

**Enums:**
- role: `CUSTOMER`, `ADMIN`

**Índices:**
- email (único)

---

### 2. addresses

Direcciones de envío de los usuarios.

| Campo      | Tipo     | Descripción                    | Restricciones      |
|------------|----------|--------------------------------|--------------------|
| id         | UUID     | Identificador único            | PK                 |
| userId     | UUID     | Usuario propietario            | FK → users.id      |
| fullName   | String   | Nombre completo del receptor   | NOT NULL           |
| phone      | String   | Teléfono de contacto           | NOT NULL           |
| street     | String   | Dirección completa             | NOT NULL           |
| city       | String   | Ciudad                         | NOT NULL           |
| department | String   | Departamento                   | NOT NULL           |
| postalCode | String?  | Código postal                  | NULLABLE           |
| isDefault  | Boolean  | Dirección predeterminada       | DEFAULT false      |
| createdAt  | DateTime | Fecha de creación              | DEFAULT now()      |
| updatedAt  | DateTime | Fecha de actualización         | AUTO UPDATE        |

**Relaciones:**
- Pertenece a: user
- Tiene muchas: orders

**Reglas de Negocio:**
- Cada usuario puede tener máximo una dirección con `isDefault = true`
- Al eliminar un usuario, se eliminan sus direcciones (CASCADE)

---

### 3. categories

Categorías de productos.

| Campo       | Tipo     | Descripción                 | Restricciones    |
|-------------|----------|----------------------------|------------------|
| id          | UUID     | Identificador único         | PK               |
| name        | String   | Nombre de la categoría      | UNIQUE, NOT NULL |
| slug        | String   | URL-friendly name           | UNIQUE, NOT NULL |
| description | String?  | Descripción                 | NULLABLE         |
| imageUrl    | String?  | URL de imagen               | NULLABLE         |
| isActive    | Boolean  | Estado de la categoría      | DEFAULT true     |
| createdAt   | DateTime | Fecha de creación           | DEFAULT now()    |
| updatedAt   | DateTime | Fecha de actualización      | AUTO UPDATE      |

**Relaciones:**
- Tiene muchos: products

**Índices:**
- name (único)
- slug (único)

**Ejemplos de categorías:**
- Bolsos
- Moñas
- Collares
- Aretes
- Pulseras
- Anillos

---

### 4. products

Productos disponibles en la tienda.

| Campo        | Tipo       | Descripción                      | Restricciones      |
|--------------|------------|----------------------------------|--------------------|
| id           | UUID       | Identificador único              | PK                 |
| name         | String     | Nombre del producto              | NOT NULL           |
| slug         | String     | URL-friendly name                | UNIQUE, NOT NULL   |
| description  | String     | Descripción del producto         | NOT NULL           |
| price        | Decimal    | Precio actual                    | NOT NULL           |
| comparePrice | Decimal?   | Precio original (antes descuento)| NULLABLE           |
| stock        | Integer    | Cantidad disponible              | DEFAULT 0          |
| images       | String[]   | Array de URLs de imágenes        | NOT NULL           |
| isActive     | Boolean    | Producto activo/visible          | DEFAULT true       |
| isFeatured   | Boolean    | Producto destacado               | DEFAULT false      |
| categoryId   | UUID       | Categoría del producto           | FK → categories.id |
| createdAt    | DateTime   | Fecha de creación                | DEFAULT now()      |
| updatedAt    | DateTime   | Fecha de actualización           | AUTO UPDATE        |

**Relaciones:**
- Pertenece a: category
- Tiene muchos: cartItems, orderItems

**Índices:**
- slug (único)
- categoryId
- isActive
- isFeatured

**Validaciones:**
- price > 0
- stock >= 0
- images.length >= 1 (al menos una imagen)

---

### 5. cart_items

Items en el carrito de compras de cada usuario.

| Campo     | Tipo     | Descripción             | Restricciones        |
|-----------|----------|-------------------------|----------------------|
| id        | UUID     | Identificador único     | PK                   |
| userId    | UUID     | Usuario propietario     | FK → users.id        |
| productId | UUID     | Producto agregado       | FK → products.id     |
| quantity  | Integer  | Cantidad                | DEFAULT 1, NOT NULL  |
| createdAt | DateTime | Fecha de creación       | DEFAULT now()        |
| updatedAt | DateTime | Fecha de actualización  | AUTO UPDATE          |

**Relaciones:**
- Pertenece a: user, product

**Restricciones únicas:**
- (userId, productId) - Un usuario no puede tener duplicados del mismo producto

**Reglas de Negocio:**
- quantity >= 1
- quantity <= product.stock
- Al eliminar usuario o producto, se elimina el item (CASCADE)

---

### 6. orders

Pedidos realizados por los usuarios.

| Campo         | Tipo          | Descripción                  | Restricciones      |
|---------------|---------------|------------------------------|--------------------|
| id            | UUID          | Identificador único          | PK                 |
| orderNumber   | String        | Número de orden único        | UNIQUE, NOT NULL   |
| userId        | UUID          | Usuario que realizó el pedido| FK → users.id      |
| addressId     | UUID          | Dirección de envío           | FK → addresses.id  |
| status        | Enum          | Estado del pedido            | DEFAULT 'PENDING'  |
| subtotal      | Decimal(10,2) | Subtotal de productos        | NOT NULL           |
| shippingCost  | Decimal(10,2) | Costo de envío               | NOT NULL           |
| total         | Decimal(10,2) | Total a pagar                | NOT NULL           |
| paymentMethod | String        | Método de pago               | NOT NULL           |
| paymentStatus | Enum          | Estado del pago              | DEFAULT 'PENDING'  |
| paymentId     | String?       | ID de transacción externa    | NULLABLE           |
| notes         | String?       | Notas del cliente            | NULLABLE           |
| createdAt     | DateTime      | Fecha de creación            | DEFAULT now()      |
| updatedAt     | DateTime      | Fecha de actualización       | AUTO UPDATE        |

**Relaciones:**
- Pertenece a: user, address
- Tiene muchos: orderItems

**Enums:**
- status: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- paymentStatus: `PENDING`, `PAID`, `FAILED`, `REFUNDED`

**Índices:**
- orderNumber (único)
- userId
- status
- paymentStatus

**Formato orderNumber:**
`ORD-{timestamp}-{random}`
Ejemplo: `ORD-1704067200000-X7K9P2M4Q`

**Cálculo de totals:**
```
subtotal = suma de (precio * cantidad) de todos los items
shippingCost = 0 si subtotal >= FREE_SHIPPING_THRESHOLD, sino valor fijo
total = subtotal + shippingCost
```

---

### 7. order_items

Items individuales dentro de cada pedido.

| Campo     | Tipo          | Descripción                      | Restricciones     |
|-----------|---------------|----------------------------------|-------------------|
| id        | UUID          | Identificador único              | PK                |
| orderId   | UUID          | Pedido al que pertenece          | FK → orders.id    |
| productId | UUID          | Producto comprado                | FK → products.id  |
| quantity  | Integer       | Cantidad comprada                | NOT NULL          |
| price     | Decimal(10,2) | Precio unitario al momento       | NOT NULL          |
| subtotal  | Decimal(10,2) | price * quantity                 | NOT NULL          |

**Relaciones:**
- Pertenece a: order, product

**Reglas de Negocio:**
- El precio se guarda del momento de la compra (no cambia si el producto cambia de precio)
- subtotal = price * quantity
- Al eliminar una orden, se eliminan sus items (CASCADE)

---

## Queries Comunes

### 1. Obtener productos con filtros

```sql
SELECT p.*, c.name as category_name
FROM products p
INNER JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
  AND p.price BETWEEN 10000 AND 100000
  AND c.slug = 'bolsos'
ORDER BY p.created_at DESC
LIMIT 12 OFFSET 0;
```

### 2. Obtener carrito de usuario con totales

```sql
SELECT
  ci.*,
  p.name, p.price, p.images,
  (p.price * ci.quantity) as item_total
FROM cart_items ci
INNER JOIN products p ON ci.product_id = p.id
WHERE ci.user_id = $1
  AND p.is_active = true;
```

### 3. Crear orden con transacción

```sql
BEGIN;

-- Insertar orden
INSERT INTO orders (id, order_number, user_id, address_id, status, subtotal, shipping_cost, total, payment_method)
VALUES ($1, $2, $3, $4, 'PENDING', $5, $6, $7, $8);

-- Insertar items
INSERT INTO order_items (id, order_id, product_id, quantity, price, subtotal)
SELECT gen_random_uuid(), $1, product_id, quantity, price, (price * quantity)
FROM cart_items WHERE user_id = $3;

-- Actualizar stock
UPDATE products p
SET stock = stock - ci.quantity
FROM cart_items ci
WHERE p.id = ci.product_id AND ci.user_id = $3;

-- Limpiar carrito
DELETE FROM cart_items WHERE user_id = $3;

COMMIT;
```

### 4. Obtener pedidos de usuario

```sql
SELECT
  o.*,
  a.full_name, a.street, a.city,
  COUNT(oi.id) as item_count
FROM orders o
INNER JOIN addresses a ON o.address_id = a.id
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = $1
GROUP BY o.id, a.id
ORDER BY o.created_at DESC;
```

## Migraciones

Las migraciones se manejan con Prisma.

### Crear nueva migración

```bash
npx prisma migrate dev --name nombre_de_la_migracion
```

### Aplicar migraciones

```bash
npx prisma migrate deploy
```

### Reset de base de datos (desarrollo)

```bash
npx prisma migrate reset
```

## Backup y Restauración

### Crear backup

```bash
pg_dump -U postgres -d bellastore_db > backup.sql
```

### Restaurar backup

```bash
psql -U postgres -d bellastore_db < backup.sql
```

## Optimización

### Índices Recomendados

```sql
-- Búsqueda de productos
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('spanish', name));
CREATE INDEX idx_products_category_active ON products(category_id, is_active);

-- Filtrado de órdenes
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Búsqueda de emails
CREATE INDEX idx_users_email ON users(email);
```

### Estadísticas

```sql
-- Ver estadísticas de tablas
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Consideraciones de Seguridad

1. **Contraseñas:** Siempre hasheadas con bcrypt (salt rounds: 10)
2. **Eliminación:** Usar soft delete (isActive) para productos y categorías
3. **Cascade:** Configurado apropiadamente para evitar data órfana
4. **Transacciones:** Usar para operaciones críticas (crear orden, procesar pago)
5. **Índices:** Mantener balanceados entre lectura y escritura

## Datos de Ejemplo

Ver el archivo `seed.sql` (próximamente) para datos de prueba.
