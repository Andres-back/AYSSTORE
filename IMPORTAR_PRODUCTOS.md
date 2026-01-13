# 📦 Guía: Importar Productos desde JSON

## 🎯 Qué hace este script

Importa automáticamente todos los productos del archivo `products_final.json` a tu base de datos de BellaStore, incluyendo:
- ✅ Nombre del producto
- ✅ Precio final (precio de venta)
- ✅ Precio original (precio de comparación)
- ✅ Descripción
- ✅ Stock
- ✅ Categoría automática
- ✅ Imágenes copiadas a `/uploads`
- ✅ Slug único generado

---

## 📂 Estructura Esperada

Tu proyecto debe tener esta estructura:

```
d:\Nueva carpeta (4)\
├── backend\
│   ├── scripts\
│   │   └── import-products-from-json.ts ✅
│   ├── uploads\                         (se crea automáticamente)
│   └── package.json
├── PDF CATALOGO\
│   ├── products_final.json             ✅ (tu archivo)
│   └── product_images\                 ✅ (carpeta con imágenes)
│       ├── product_p001_i01.png
│       ├── product_p001_i02.png
│       └── ...
```

---

## 🚀 Cómo Ejecutar

### Paso 1: Asegúrate de tener las imágenes en el lugar correcto

Las imágenes deben estar en:
```
d:\Nueva carpeta (4)\PDF CATALOGO\product_images\
```

### Paso 2: Ejecuta el importador

```bash
cd backend
npm run import:products
```

---

## 📊 Lo que verás en la consola

```
🚀 Iniciando importación de productos desde JSON...

📦 Se encontraron 150 productos en el JSON

✅ Importado: LP016 - Rodio - (P001-01) - 4860
✅ Importado: Piercing balín X UNIDAD (P001-02) - 4860
⏭️  Omitiendo producto sin nombre válido: P001-03
✅ Importado: LP017 - Rodio - (P001-04) - 28966
...

📊 Resumen de Importación:
   ✅ Importados: 120
   ⏭️  Omitidos: 25
   ❌ Errores: 5
   📦 Total procesados: 150
```

---

## 🗂️ Categorías Automáticas

El script mapea automáticamente los tipos de producto a categorías:

| product_type en JSON | Categoría en BellaStore |
|---------------------|-------------------------|
| `aretes`            | Aretes                  |
| `collares`          | Collares                |
| `pulseras`          | Pulseras                |
| `anillos`           | Anillos                 |
| `bolsos`            | Bolsos                  |
| `moñas`             | Moñas                   |

Si un producto tiene un tipo no reconocido, se asigna por defecto a **Aretes**.

---

## ✅ Validaciones del Script

El script omite automáticamente:
- ❌ Productos cuyo nombre es solo un precio (ej: "$ 1.500")
- ❌ Productos con categoría inexistente
- ❌ Productos duplicados (mismo slug)

---

## 🖼️ Manejo de Imágenes

### Si encuentra la imagen:
```
✅ Copia: product_images\product_p001_i01.png
     → backend\uploads\product_p001_i01.png
```

### Si NO encuentra la imagen:
```
⚠️  Imagen no encontrada: product_images\product_p001_i01.png
   → Asigna: /placeholder.svg (imagen por defecto)
```

---

## 🔧 Solución de Problemas

### Error: "No se encontró el archivo products_final.json"

**Solución:** Verifica que el archivo esté en:
```
d:\Nueva carpeta (4)\PDF CATALOGO\products_final.json
```

### Error: "Imagen no encontrada"

**Solución:**
1. Verifica que las imágenes estén en la carpeta correcta
2. Verifica que el nombre coincida con `image_path` en el JSON
3. O ejecuta de todos modos, usará placeholder

### Los productos no aparecen en el frontend

**Solución:**
1. Verifica en Prisma Studio: `npm run prisma:studio`
2. Busca en la tabla `products`
3. Verifica que `isActive = true`

### Algunos productos no se importan

**Posibles razones:**
- Nombre inválido (solo precio)
- Producto duplicado (ya existe)
- Categoría no encontrada

Revisa el resumen al final para ver cuántos fueron omitidos.

---

## 🔄 Reimportar Productos

Si quieres volver a importar:

### Opción 1: Eliminar productos anteriores

```bash
# En Prisma Studio
# Eliminar todos los productos importados manualmente
```

### Opción 2: El script omite duplicados

Si ejecutas el script de nuevo, omitirá productos que ya existen (mismo slug).

---

## 📝 Personalizar la Importación

### Cambiar descripción por defecto

Edita: `backend/scripts/import-products-from-json.ts`

Línea ~120:
```typescript
description: product.description || `${product.name}. Código: ${product.code}`,
```

### Cambiar stock por defecto

Línea ~123:
```typescript
stock: product.stock || 10, // ← Cambiar el 10
```

### Marcar algunos como destacados

Línea ~127:
```typescript
isFeatured: product.final_price > 50000, // Ejemplo: destacar productos caros
```

---

## 🎯 Después de Importar

1. **Verifica en Prisma Studio:**
   ```bash
   npm run prisma:studio
   ```

2. **Revisa en el frontend:**
   - Ve a http://localhost:3000/productos
   - Deberías ver todos los productos importados

3. **Ajusta manualmente (opcional):**
   - En Prisma Studio puedes editar:
     - Descripciones
     - Marcar favoritos (`isFeatured`)
     - Ajustar precios
     - Cambiar categorías

---

## 📊 Formato del JSON (Referencia)

```json
{
  "name": "LP016 - Rodio -",
  "original_price": 1500.0,       // Precio antes de markup
  "final_price": 4860.0,          // Precio de venta
  "code": "P001-01",              // Código único
  "description": "Descripción",
  "stock": 10,
  "product_type": "aretes",       // Tipo de producto
  "images": ["/uploads/..."],
  "image_path": "product_images\\product_p001_i01.png"
}
```

---

## ✅ Checklist

Antes de ejecutar:
- [ ] Archivo JSON en `PDF CATALOGO/products_final.json`
- [ ] Imágenes en `PDF CATALOGO/product_images/`
- [ ] Base de datos creada y migrada
- [ ] Categorías creadas (ejecutar `npm run seed` primero)

Después de ejecutar:
- [ ] Revisar resumen en consola
- [ ] Verificar en Prisma Studio
- [ ] Probar en el frontend
- [ ] Ajustar productos si es necesario

---

## 🎉 ¡Listo!

Con este script puedes importar cientos de productos en segundos.

**¿Tienes más catálogos?** Solo actualiza el `products_final.json` y vuelve a ejecutar.
