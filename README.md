# AYS Store - Plataforma E-commerce de Joyería

Plataforma de e-commerce completa para joyería y accesorios construida con Next.js, TypeScript, Prisma y PostgreSQL.

## Características

- 🛍️ Catálogo de 623 productos con filtros avanzados
- 🔐 Autenticación JWT (clientes y administradores)
- 🛒 Carrito de compras persistente
- 📦 Sistema de órdenes y seguimiento
- 💎 9 categorías de productos
- 🎨 Filtro por material (Acero, Oro Goldfield, Covergold, Rodio, Plata)
- 📱 Diseño responsive con Tailwind CSS
- 🖼️ Galería de imágenes optimizadas

## Categorías de Productos

1. **Aretes** (201 productos) - Aretes, topos, candongas, argollas, piercings
2. **Collares** (168 productos) - Collares, cadenas, gargantillas
3. **Pulseras** (132 productos) - Pulseras, brazaletes, manillas
4. **Anillos** (66 productos) - Anillos de todo tipo
5. **Accesorios** (37 productos) - Cofres, bolsas, joyeros, denarios
6. **Tobilleras** (14 productos) - Accesorios para el tobillo
7. **Conjuntos** (5 productos) - Sets de collar y aretes
8. **Bolsos** - Bolsos y carteras
9. **Moñas** - Accesorios para el cabello

## Tech Stack

### Frontend
- **Next.js 14** - Framework de React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Zustand** - Gestión de estado global
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificaciones
- **Lucide React** - Iconos

### Backend
- **Express.js** - Framework de Node.js
- **Prisma ORM** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional (DigitalOcean)
- **JWT** - Autenticación y autorización
- **bcrypt** - Encriptación de contraseñas
- **Helmet** - Seguridad HTTP
- **CORS** - Control de acceso

## Estructura del Proyecto

```
AYSSTORE/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts
│   ├── scripts/
│   │   └── import-products-from-json.ts
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── store/
│   │   └── types/
│   └── .env.local
│
└── products_paddleocr.json
```

## Instalación

### Requisitos Previos
- Node.js 18+
- PostgreSQL (local o en la nube)

### 1. Clonar Repositorio

```bash
git clone git@github.com:Andres-back/AYSSTORE.git
cd AYSSTORE
```

### 2. Backend

```bash
cd backend
npm install
```

Configurar `.env`:

```env
DATABASE_URL="postgresql://doadmin:password@host:25060/aysdata?sslmode=require"
JWT_SECRET="tu-secreto-seguro"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### 3. Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Poblar con datos iniciales
npm run seed

# Importar productos
npm run import:products
```

### 4. Frontend

```bash
cd ../frontend
npm install
```

Configurar `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_NAME="AYS Store"
```

### 5. Iniciar Aplicación

```bash
# Backend (terminal 1)
cd backend && npm run dev

# Frontend (terminal 2)
cd frontend && npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Credenciales

### Administrador
- Email: admin@bellastore.com
- Contraseña: admin123

### Cliente
- Email: cliente@bellastore.com
- Contraseña: cliente123

## Scripts

### Backend
```bash
npm run dev              # Desarrollo
npm run build            # Compilar
npm run start            # Producción
npm run seed             # Poblar BD
npm run import:products  # Importar productos
```

### Frontend
```bash
npm run dev    # Desarrollo
npm run build  # Compilar
npm run start  # Producción
```

## Base de Datos en Producción

**PostgreSQL en DigitalOcean:**
- Host: db-postgresql-nyc3-63457-do-user-30141206-0.f.db.ondigitalocean.com
- Port: 25060
- Database: aysdata
- User: doadmin
- SSL: required

## Importación de Productos

El sistema incluye categorización inteligente automática:

```typescript
// Detecta categorías por nombre del producto
- "Conjunto" → Conjuntos
- "Cofre", "Bolsa", "Joyero" → Accesorios
- "Anillo" → Anillos (excepto "anillado")
- "Tobillera" → Tobilleras
- "Collar" + "Topo" → Conjuntos
```

Para reimportar:
```bash
npm run import:products
```

## API Endpoints

### Autenticación
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Productos
- `GET /api/products?category=X&material=Y&minPrice=Z`
- `GET /api/products/:slug`
- `POST /api/products` (admin)

### Categorías
- `GET /api/categories`
- `GET /api/categories/:slug`

### Carrito
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:id`
- `DELETE /api/cart/:id`

### Órdenes
- `GET /api/orders`
- `POST /api/orders`
- `PUT /api/orders/:id/status` (admin)

## Seguridad

- ✅ Autenticación JWT
- ✅ Contraseñas encriptadas (bcrypt)
- ✅ Rate limiting
- ✅ Helmet.js
- ✅ CORS configurado
- ✅ SQL Injection prevention (Prisma)
- ✅ Validación de permisos

## Deployment

### Backend
1. Configurar variables de entorno
2. Ejecutar: `npx prisma migrate deploy`
3. Iniciar: `npm run start`

### Frontend
1. Configurar `NEXT_PUBLIC_API_URL`
2. Build: `npm run build`
3. Iniciar: `npm run start`

## Licencia

Privado y confidencial

## Contacto

Para soporte: contactar al equipo de desarrollo
