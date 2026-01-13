# 🔐 Credenciales de Acceso - BellaStore

## 📋 Información General

- **URL Frontend**: http://localhost:3000
- **URL Backend**: http://localhost:5000
- **Base de Datos**: PostgreSQL en localhost:5432

---

## 👤 Usuarios del Sistema

### 🔴 Usuario Administrador
```
Email: admin@bellastore.com
Contraseña: admin123
Rol: ADMIN
```

**Permisos:**
- Acceso completo al panel de administración (`/admin`)
- Gestión de productos (crear, editar, eliminar)
- Gestión de categorías
- Ver todos los usuarios
- Ver estadísticas y reportes

**Cómo acceder:**
1. Ir a http://localhost:3000/login
2. Iniciar sesión con las credenciales de arriba
3. Verás un botón morado "Admin" en la barra de navegación
4. Accede al panel de administración en `/admin`

---

### 🟢 Usuario Cliente (Pruebas)
```
Email: cliente@bellastore.com
Contraseña: cliente123
Rol: CUSTOMER
```

**Permisos:**
- Navegar productos
- Agregar al carrito
- Realizar compras
- Ver historial de pedidos
- Gestionar su cuenta

---

## 🗄️ Base de Datos PostgreSQL

```
Host: localhost
Puerto: 5432
Base de datos: ecommerce_db
Usuario: postgres
Contraseña: postgres
```

**Conexión desde pgAdmin o DBeaver:**
```
postgresql://postgres:postgres@localhost:5432/ecommerce_db
```

---

## 📦 Datos Iniciales

### Categorías Disponibles:
1. **Anillos** - 120 productos
2. **Aretes** - 257 productos
3. **Bolsos** - 189 productos
4. **Collares** - 241 productos
5. **Moñas** - 0 productos
6. **Pulseras** - 212 productos

**Total de productos activos:** 1,019

---

## 🚀 Comandos para Iniciar la Aplicación

### Iniciar todo el sistema:
```bash
cd "d:\Nueva carpeta (4)"
npm run dev
```

### Solo Backend:
```bash
cd "d:\Nueva carpeta (4)\backend"
npm run dev
```

### Solo Frontend:
```bash
cd "d:\Nueva carpeta (4)\frontend"
npm run dev
```

### Importar productos desde JSON:
```bash
cd "d:\Nueva carpeta (4)\backend"
npm run import-products
```

---

## 📱 WhatsApp Integración

**Número de WhatsApp configurado:**
```
+57 300 123 4567 (Número de prueba)
```

**Ubicación para cambiar el número:**
- `frontend/src/components/WhatsAppButton.tsx` (línea 9)
- `frontend/src/lib/whatsapp.ts` (exportar con nuevo número)

---

## 🔧 Configuración de Entorno

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_db"
JWT_SECRET="tu-secreto-jwt-super-seguro-cambialo-en-produccion"
PORT=5000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📝 Notas Importantes

1. **Cambiar contraseñas en producción**: Las contraseñas actuales son para desarrollo. Cámbialas antes de publicar.

2. **Usuario admin** tiene acceso completo al sistema, incluyendo:
   - Panel de administración en `/admin`
   - Gestión de productos en `/admin/productos`
   - Editar, eliminar y crear productos

3. **Imágenes de productos**: Las imágenes se guardan en `backend/uploads/` y se sirven desde `http://localhost:5000/uploads/`

4. **Puerto 5000 en uso**: Si el backend no inicia porque el puerto está ocupado, verifica con:
   ```bash
   netstat -ano | findstr :5000
   taskkill /PID <numero_pid> /F
   ```

5. **Base de datos**: Asegúrate de que PostgreSQL esté corriendo en Docker o localmente antes de iniciar el backend.

---

## 🎨 Panel de Administración

**URL Directa:** http://localhost:3000/admin

**Funcionalidades:**
- ✅ Ver todos los productos en tabla
- ✅ Buscar productos por nombre
- ✅ Filtrar por categoría
- ✅ Editar productos (nombre, precio, stock, descripción, etc.)
- ✅ Eliminar productos (soft delete)
- ✅ Crear nuevos productos manualmente

---

## 📧 Contacto y Soporte

Para cualquier problema o duda sobre el sistema, contacta al desarrollador.

**Última actualización:** 2026-01-09
