# Guía de Instalación Paso a Paso - BellaStore

Esta guía te llevará desde cero hasta tener el proyecto corriendo en tu máquina.

## Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Instalación de PostgreSQL](#instalación-de-postgresql)
3. [Configuración del Proyecto](#configuración-del-proyecto)
4. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
5. [Creación de Usuario Administrador](#creación-de-usuario-administrador)
6. [Ejecutar el Proyecto](#ejecutar-el-proyecto)
7. [Verificación](#verificación)

## Requisitos Previos

### 1. Node.js
- Versión: 18.x o superior
- Descargar: https://nodejs.org/

**Verificar instalación:**
```bash
node --version
npm --version
```

### 2. PostgreSQL
- Versión: 14.x o superior
- Descargar: https://www.postgresql.org/download/

## Instalación de PostgreSQL

### Windows

1. Descargar el instalador desde: https://www.postgresql.org/download/windows/
2. Ejecutar el instalador
3. Durante la instalación:
   - Puerto: 5432 (default)
   - Usuario: postgres
   - Contraseña: Anota la contraseña que elijas
4. Incluir pgAdmin 4 (herramienta visual)

### macOS

```bash
# Usando Homebrew
brew install postgresql@14
brew services start postgresql@14
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Configuración del Proyecto

### 1. Clonar/Descargar el Proyecto

```bash
# Si usas Git
git clone <url-del-repositorio>
cd ecommerce-accesorios-mujer

# O descomprime el archivo ZIP y navega a la carpeta
```

### 2. Instalar Dependencias

```bash
# Desde la raíz del proyecto
npm install
```

Esto instalará las dependencias de:
- Root workspace
- Backend
- Frontend

### 3. Configurar Variables de Entorno - Backend

```bash
cd backend
```

Crear archivo `.env` (copiar desde `.env.example`):

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Editar `backend/.env` con tus datos:

```env
# Reemplaza "usuario" y "contraseña" con tus credenciales de PostgreSQL
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/bellastore_db?schema=public"

# Genera un secreto seguro (puedes usar una cadena aleatoria larga)
JWT_SECRET="cambiar-por-un-secreto-super-seguro-minimo-32-caracteres"
JWT_EXPIRES_IN="7d"

PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"

# Para pruebas de Stripe (obtener en https://stripe.com)
STRIPE_SECRET_KEY="sk_test_tu_clave_secreta"
STRIPE_PUBLISHABLE_KEY="pk_test_tu_clave_publica"

# Configuración de envío gratis (en pesos colombianos)
FREE_SHIPPING_THRESHOLD=200000

# Configuración de uploads
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"
```

### 4. Configurar Variables de Entorno - Frontend

```bash
cd ../frontend
```

Crear archivo `.env.local`:

```bash
# Windows
copy .env.local.example .env.local

# macOS/Linux
cp .env.local.example .env.local
```

Editar `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica
```

## Configuración de la Base de Datos

### 1. Crear la Base de Datos

#### Opción A: Usando pgAdmin (GUI)
1. Abrir pgAdmin
2. Conectarse al servidor PostgreSQL
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `bellastore_db`
5. Click "Save"

#### Opción B: Usando línea de comandos

```bash
# Windows (PowerShell como administrador)
& 'C:\Program Files\PostgreSQL\14\bin\psql.exe' -U postgres

# macOS/Linux
psql -U postgres

# Dentro de psql:
CREATE DATABASE bellastore_db;
\q
```

### 2. Ejecutar Migraciones de Prisma

```bash
cd ../backend

# Generar el cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones (crear tablas)
npm run prisma:migrate
```

Cuando pregunte por el nombre de la migración, escribe: `init`

### 3. Verificar la Base de Datos

```bash
# Abrir Prisma Studio (interfaz visual)
npm run prisma:studio
```

Esto abrirá http://localhost:5555 donde podrás ver todas las tablas creadas.

### 4. Crear Carpeta de Uploads

```bash
# Desde backend/
# Windows
mkdir uploads

# macOS/Linux
mkdir uploads
```

## Creación de Usuario Administrador

### Opción 1: Usando Prisma Studio

1. Ejecutar `npm run prisma:studio` en backend/
2. Ir a la tabla "User"
3. Click en "Add record"
4. Completar:
   - email: `admin@bellastore.com`
   - firstName: `Admin`
   - lastName: `BellaStore`
   - password: (hash bcrypt - ver opción 2)
   - role: `ADMIN`
   - isActive: `true`

### Opción 2: Registrarse desde el Frontend y Actualizar

1. Ejecutar el proyecto (siguiente sección)
2. Registrarse normalmente en http://localhost:3000/login
3. En Prisma Studio, cambiar el `role` del usuario a `ADMIN`

### Opción 3: Script SQL Directo

```sql
-- Nota: Esta contraseña es "admin123" hasheada con bcrypt
-- CAMBIAR EN PRODUCCIÓN
INSERT INTO users (id, email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@bellastore.com',
  '$2a$10$YourHashedPasswordHere',
  'Admin',
  'BellaStore',
  'ADMIN',
  true,
  NOW(),
  NOW()
);
```

## Ejecutar el Proyecto

### Opción 1: Todo junto (Recomendado)

```bash
# Desde la raíz del proyecto
npm run dev
```

Esto ejecutará simultáneamente:
- Backend en http://localhost:5000
- Frontend en http://localhost:3000

### Opción 2: Por separado

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

## Verificación

### 1. Backend
Visita: http://localhost:5000/api/health

Deberías ver:
```json
{
  "status": "OK",
  "timestamp": "2024-01-..."
}
```

### 2. Frontend
Visita: http://localhost:3000

Deberías ver la página principal de BellaStore.

### 3. Pruebas Básicas

1. **Ver productos (sin login):**
   - Ir a http://localhost:3000/productos
   - Deberías ver la lista de productos (vacía si no has creado ninguno)

2. **Registrarse:**
   - Ir a http://localhost:3000/login
   - Click en "¿No tienes cuenta? Regístrate"
   - Completar el formulario
   - Deberías ser redirigido a la página principal autenticado

3. **Crear productos (como admin):**
   - Asegúrate de tener un usuario con role `ADMIN`
   - Usar herramientas como Postman o Thunder Client
   - POST http://localhost:5000/api/products
   - Headers: `Authorization: Bearer TU_TOKEN`
   - Body: FormData con los datos del producto

## Problemas Comunes

### Error: "Cannot connect to database"
**Solución:**
- Verificar que PostgreSQL esté corriendo
- Verificar las credenciales en `backend/.env`
- Verificar que la base de datos existe

```bash
# Ver servicios corriendo
# Windows
services.msc (buscar PostgreSQL)

# macOS
brew services list

# Linux
sudo systemctl status postgresql
```

### Error: "Port 5000 already in use"
**Solución:**
- Cambiar el puerto en `backend/.env`
- O matar el proceso que usa el puerto 5000

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Error: "Module not found"
**Solución:**
```bash
# Reinstalar dependencias
rm -rf node_modules
rm package-lock.json
npm install
```

### Error al cargar imágenes
**Solución:**
```bash
# Verificar que existe la carpeta uploads
cd backend
ls uploads  # macOS/Linux
dir uploads  # Windows

# Si no existe, crearla
mkdir uploads
```

## Siguiente Paso: Datos de Prueba

Una vez que todo funciona, puedes:

1. Crear categorías desde Prisma Studio o API
2. Crear productos de prueba
3. Probar el flujo completo de compra

## Soporte

Si encuentras problemas:
1. Verifica los logs en las consolas del backend y frontend
2. Revisa el archivo README.md principal
3. Verifica la configuración de variables de entorno
4. Asegúrate de que todas las dependencias estén instaladas

¡Listo! Tu tienda BellaStore debería estar funcionando correctamente. 🎉
