# Arquitectura del Sistema - BellaStore E-commerce

## Visión General

BellaStore es una plataforma de e-commerce moderna, segura y escalable diseñada específicamente para la venta de accesorios femeninos. La arquitectura sigue patrones de diseño probados y mejores prácticas de la industria.

## Stack Tecnológico

### Backend (Node.js + TypeScript)
- **Framework:** Express.js
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL
- **Autenticación:** JWT (JSON Web Tokens)
- **Seguridad:** bcrypt, helmet, cors, rate-limit
- **Validación:** express-validator
- **Archivos:** multer

### Frontend (React + Next.js)
- **Framework:** Next.js 14 (App Router)
- **UI Framework:** React 18
- **Estilos:** Tailwind CSS
- **Estado Global:** Zustand
- **HTTP Client:** Axios
- **Notificaciones:** React Hot Toast
- **Iconos:** Lucide React

## Arquitectura en Capas

### 1. Capa de Presentación (Frontend)

```
┌─────────────────────────────────────┐
│        Next.js App Router           │
├─────────────────────────────────────┤
│  Pages                              │
│  ├── Home (/)                       │
│  ├── Products (/productos)          │
│  ├── Cart (/carrito)                │
│  ├── Checkout (/checkout)           │
│  └── Auth (/login)                  │
├─────────────────────────────────────┤
│  Components                         │
│  ├── Navbar                         │
│  ├── Footer                         │
│  ├── ProductCard                    │
│  └── ProductFilter                  │
├─────────────────────────────────────┤
│  State Management (Zustand)         │
│  ├── authStore                      │
│  └── cartStore                      │
├─────────────────────────────────────┤
│  Services (Axios)                   │
│  └── HTTP Client + Interceptors     │
└─────────────────────────────────────┘
```

**Características:**
- Server-Side Rendering (SSR) para SEO
- Client-Side Rendering para interactividad
- Optimización automática de imágenes
- Code splitting automático
- Diseño responsive mobile-first

### 2. Capa de API (Backend)

```
┌─────────────────────────────────────┐
│        Express Server               │
├─────────────────────────────────────┤
│  Middleware Stack                   │
│  ├── Helmet (Security Headers)      │
│  ├── CORS                           │
│  ├── Rate Limiter                   │
│  ├── Body Parser                    │
│  └── Error Handler                  │
├─────────────────────────────────────┤
│  Routes                             │
│  ├── /api/auth                      │
│  ├── /api/products                  │
│  ├── /api/categories                │
│  ├── /api/cart                      │
│  ├── /api/orders                    │
│  └── /api/users                     │
├─────────────────────────────────────┤
│  Controllers                        │
│  └── Business Logic                 │
├─────────────────────────────────────┤
│  Services (Future)                  │
│  ├── Email Service                  │
│  ├── Payment Service                │
│  └── Storage Service                │
└─────────────────────────────────────┘
```

**Patrones Implementados:**
- **MVC:** Separación entre rutas, controladores y modelos
- **Middleware Chain:** Para procesamiento de requests
- **Dependency Injection:** Para servicios reutilizables
- **Error Handling Centralizado**

### 3. Capa de Datos

```
┌─────────────────────────────────────┐
│         Prisma ORM                  │
├─────────────────────────────────────┤
│  Models                             │
│  ├── User                           │
│  ├── Product                        │
│  ├── Category                       │
│  ├── CartItem                       │
│  ├── Order                          │
│  ├── OrderItem                      │
│  └── Address                        │
├─────────────────────────────────────┤
│       PostgreSQL                    │
│  ├── Relational Tables              │
│  ├── Indexes                        │
│  ├── Constraints                    │
│  └── Triggers (Future)              │
└─────────────────────────────────────┘
```

**Ventajas:**
- Type-safe database queries
- Auto-completion en queries
- Migrations automáticas
- Protección contra SQL Injection

## Flujos de Datos Principales

### 1. Flujo de Autenticación

```
Usuario → Login Form → POST /api/auth/login
                            ↓
                    Validate Credentials
                            ↓
                    Generate JWT Token
                            ↓
                    Return User + Token
                            ↓
            Store in localStorage + Zustand
                            ↓
        Include in all authenticated requests
```

### 2. Flujo de Compra

```
1. Browse Products (sin login)
        ↓
2. Add to Cart → Require Login
        ↓
3. View Cart → GET /api/cart
        ↓
4. Checkout → Select Address + Payment
        ↓
5. Place Order → POST /api/orders
        ↓
        Transaction:
        - Create Order
        - Create Order Items
        - Update Product Stock
        - Clear Cart
        ↓
6. Order Confirmation
```

### 3. Flujo de Gestión de Productos (Admin)

```
Admin Login → JWT with ADMIN role
        ↓
POST /api/products (with images)
        ↓
Upload Middleware → Multer
        ↓
Validate Data → express-validator
        ↓
Store in Database + Save Images
        ↓
Return Product Data
```

## Seguridad Implementada

### 1. Autenticación y Autorización

```typescript
// Middleware de autenticación
authenticate → Verify JWT → Attach user to request

// Middleware de autorización
isAdmin → Check user.role === 'ADMIN'
```

**Características:**
- Tokens con expiración configurable
- Refresh tokens (futuro)
- Role-based access control (RBAC)

### 2. Protección de Datos

- **Passwords:** bcrypt con salt rounds = 10
- **Tokens:** JWT firmados con secreto
- **Database:** Prepared statements (Prisma)
- **Validación:** express-validator en todos los endpoints

### 3. Protección contra Ataques

| Ataque | Protección |
|--------|-----------|
| SQL Injection | Prisma ORM (prepared statements) |
| XSS | Sanitización de inputs, CSP headers |
| CSRF | CORS configurado, SameSite cookies |
| Brute Force | Rate limiting en auth endpoints |
| DDoS | Rate limiting general |
| Man-in-the-Middle | HTTPS only en producción |

## Escalabilidad

### Horizontal Scaling

```
                Load Balancer
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
    Server 1      Server 2      Server 3
        │             │             │
        └─────────────┼─────────────┘
                      ▼
              PostgreSQL Master
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
    Read Replica  Read Replica  Read Replica
```

**Preparado para:**
- Load balancing con Nginx/HAProxy
- Database replication
- CDN para static assets
- Redis para caching (futuro)

### Vertical Scaling

- Índices en columnas frecuentemente consultadas
- Paginación en todos los listados
- Lazy loading de imágenes
- Code splitting en frontend

## Monitoreo y Logging

### Logs Implementados

```typescript
// Backend
console.log('[INFO] Server started on port 5000')
console.error('[ERROR] Database connection failed')

// Frontend
console.error('Error fetching products:', error)
```

### Futuras Mejoras

- Winston/Pino para structured logging
- Sentry para error tracking
- Analytics con Google Analytics o Mixpanel
- APM con New Relic o DataDog

## Testing Strategy (Futuro)

### Backend
```
Unit Tests (Jest)
├── Controllers
├── Middleware
└── Utils

Integration Tests (Supertest)
├── API Endpoints
└── Database Operations

E2E Tests (Cypress)
└── Complete User Flows
```

### Frontend
```
Unit Tests (Jest + RTL)
├── Components
├── Hooks
└── Utils

Integration Tests
└── User Interactions

E2E Tests (Playwright)
└── Critical Paths
```

## Deployment

### Backend (Node.js)

**Opciones:**
- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Vercel (serverless)

**Configuración:**
```yaml
# Dockerfile (futuro)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Frontend (Next.js)

**Opciones:**
- Vercel (recomendado)
- Netlify
- AWS Amplify

**Build:**
```bash
npm run build
npm start
```

### Base de Datos

**Opciones:**
- Supabase (PostgreSQL managed)
- Heroku Postgres
- AWS RDS
- DigitalOcean Managed Database

## Performance

### Backend Optimizations

- **Connection Pooling:** Prisma maneja pool de conexiones
- **Query Optimization:** Índices en columnas clave
- **Caching:** Redis para queries frecuentes (futuro)
- **Compression:** gzip middleware

### Frontend Optimizations

- **Image Optimization:** Next.js Image component
- **Code Splitting:** Automático con Next.js
- **Static Generation:** Para páginas que no cambian
- **Prefetching:** Links prefetch automático

### Métricas Objetivo

| Métrica | Objetivo |
|---------|----------|
| Time to First Byte | < 200ms |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| API Response Time | < 100ms |

## Estructura de Archivos

### Backend
```
backend/
├── prisma/
│   └── schema.prisma          # Schema de DB
├── src/
│   ├── controllers/           # Lógica de negocio
│   ├── middleware/            # Middleware reutilizable
│   ├── routes/                # Definición de rutas
│   ├── utils/                 # Funciones helper
│   └── server.ts              # Entry point
├── uploads/                   # Archivos subidos
├── .env                       # Variables de entorno
├── package.json
└── tsconfig.json
```

### Frontend
```
frontend/
├── src/
│   ├── app/                   # App Router (Next.js 14)
│   │   ├── (pages)/          # Rutas principales
│   │   ├── layout.tsx        # Layout global
│   │   └── globals.css       # Estilos globales
│   ├── components/           # Componentes React
│   ├── lib/                  # Utilidades
│   ├── store/                # Estado global (Zustand)
│   └── types/                # TypeScript types
├── public/                   # Assets estáticos
├── .env.local               # Variables de entorno
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Mantenibilidad

### Code Quality

- **TypeScript:** Tipado estático en todo el código
- **ESLint:** Linting rules (configurar)
- **Prettier:** Code formatting (configurar)
- **Git Hooks:** Pre-commit hooks con Husky (futuro)

### Documentación

- ✅ README.md - Overview del proyecto
- ✅ INSTALLATION.md - Guía de instalación
- ✅ DATABASE.md - Documentación de BD
- ✅ ARQUITECTURA.md - Este documento
- 📝 API.md - Documentación de API (futuro)
- 📝 CONTRIBUTING.md - Guía de contribución (futuro)

## Roadmap Técnico

### Fase 1 (Actual) ✅
- [x] Autenticación y autorización
- [x] CRUD de productos y categorías
- [x] Carrito de compras
- [x] Sistema de órdenes
- [x] Diseño responsive

### Fase 2 (Corto Plazo)
- [ ] Integración de pagos (Stripe/PayPal)
- [ ] Email notifications
- [ ] Panel de administración
- [ ] Sistema de reviews
- [ ] Wishlist

### Fase 3 (Mediano Plazo)
- [ ] Búsqueda avanzada
- [ ] Recomendaciones de productos
- [ ] Sistema de cupones
- [ ] Chat de soporte
- [ ] PWA support

### Fase 4 (Largo Plazo)
- [ ] Mobile apps (React Native)
- [ ] Multi-idioma
- [ ] Multi-moneda
- [ ] Analytics dashboard
- [ ] AI-powered recommendations

## Conclusión

La arquitectura de BellaStore está diseñada para ser:

- **Segura:** Múltiples capas de seguridad
- **Escalable:** Preparada para crecimiento horizontal y vertical
- **Mantenible:** Código limpio, tipado y bien documentado
- **Performante:** Optimizaciones en todos los niveles
- **Moderna:** Stack tecnológico actual y probado

El sistema está listo para producción con la capacidad de crecer según las necesidades del negocio.
