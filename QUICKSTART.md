# Guía Rápida - BellaStore

## ⚡ Inicio Rápido (5 minutos)

### 1. Instalar PostgreSQL

**Windows:**
- Descargar: https://www.postgresql.org/download/windows/
- Instalar con configuración por defecto
- Recordar la contraseña de `postgres`

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Instalar Dependencias

```bash
cd "d:\Nueva carpeta (4)"
npm install
```

### 3. Configurar Variables de Entorno

**Backend:**
```bash
cd backend
copy .env.example .env
```

Editar `backend/.env` - **SOLO cambiar estas líneas:**
```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA_POSTGRES@localhost:5432/bellastore_db?schema=public"
JWT_SECRET="tu-secreto-super-seguro-minimo-32-caracteres-aqui"
```

**Frontend:**
```bash
cd ../frontend
copy .env.local.example .env.local
```

No necesitas cambiar nada en `.env.local` para desarrollo local.

### 4. Crear Base de Datos y Tablas

```bash
cd ../backend

# Generar cliente Prisma
npm run prisma:generate

# Crear base de datos y tablas
npm run prisma:migrate

# Cuando pregunte el nombre de la migración, escribe: init
```

### 5. Poblar con Datos de Prueba

```bash
npm run seed
```

Esto creará:
- ✅ 6 categorías (Bolsos, Moñas, Collares, Aretes, Pulseras, Anillos)
- ✅ 17 productos de ejemplo
- ✅ Usuario admin: `admin@bellastore.com` / `admin123`
- ✅ Usuario cliente: `cliente@bellastore.com` / `cliente123`

### 6. Crear Carpeta de Uploads

```bash
mkdir uploads
```

### 7. Ejecutar la Aplicación

**Opción A - Todo junto (Recomendado):**
```bash
cd ..
npm run dev
```

**Opción B - Por separado:**

Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd frontend
npm run dev
```

### 8. Abrir en el Navegador

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/health
- **Prisma Studio:** `npm run prisma:studio` (en carpeta backend)

## 🎯 Credenciales de Prueba

### Administrador
- **Email:** admin@bellastore.com
- **Password:** admin123
- **Permisos:** Crear/editar/eliminar productos y categorías

### Cliente
- **Email:** cliente@bellastore.com
- **Password:** cliente123
- **Permisos:** Comprar productos, ver órdenes

## ✅ Verificar que Todo Funciona

1. **Ver productos:**
   - Ir a http://localhost:3000
   - Deberías ver la página principal con productos

2. **Iniciar sesión:**
   - Click en "Iniciar Sesión"
   - Usar cliente@bellastore.com / cliente123
   - Deberías ver tu nombre en el navbar

3. **Agregar al carrito:**
   - Click en cualquier producto
   - Click en "Agregar al Carrito"
   - Icono del carrito debe mostrar (1)

4. **Ver API:**
   - Ir a http://localhost:5000/api/products
   - Deberías ver JSON con la lista de productos

## 🛠️ Comandos Útiles

```bash
# Backend
cd backend
npm run dev              # Ejecutar servidor
npm run prisma:studio    # Abrir interfaz de BD
npm run seed             # Volver a poblar datos

# Frontend
cd frontend
npm run dev              # Ejecutar Next.js
npm run build            # Crear build de producción

# Root
npm run dev              # Ejecutar todo junto
```

## 🐛 Problemas Comunes

### "Cannot connect to database"
```bash
# Verificar que PostgreSQL está corriendo
# Windows: services.msc → buscar PostgreSQL
# Mac: brew services list
# Linux: sudo systemctl status postgresql
```

### "Port 5000 already in use"
```bash
# Cambiar puerto en backend/.env
PORT=5001
```

### "Module not found"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### No se ven productos
```bash
# Ejecutar seed de nuevo
cd backend
npm run seed
```

## 📝 Próximos Pasos

1. **Agregar imágenes reales a los productos:**
   - Usar Prisma Studio
   - O crear endpoint para upload de imágenes

2. **Personalizar categorías y productos:**
   - Editar `backend/prisma/seed.ts`
   - Ejecutar `npm run seed` de nuevo

3. **Configurar Stripe (pagos):**
   - Obtener claves en https://stripe.com
   - Agregar a `.env`

4. **Desplegar a producción:**
   - Ver archivo `DEPLOYMENT.md` (próximamente)

## 🚀 ¡Listo!

Tu tienda BellaStore está funcionando. Ahora puedes:
- ✅ Ver y filtrar productos
- ✅ Registrar usuarios
- ✅ Agregar al carrito
- ✅ Realizar pedidos
- ✅ Gestionar inventario

**¿Necesitas ayuda?** Revisa [README.md](README.md) o [INSTALLATION.md](INSTALLATION.md) para más detalles.
