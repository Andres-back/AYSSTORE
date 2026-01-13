import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ProductFromJSON {
  name: string;
  original_price: number;
  final_price: number;
  code: string;
  description: string;
  stock: number;
  product_type: string;
  material?: string;
  images: string[];
  image_path?: string;
}

// Mapeo de tipos de producto a categorías de BellaStore
const CATEGORY_MAPPING: { [key: string]: string } = {
  'aretes': 'aretes',
  'collares': 'collares',
  'pulseras': 'pulseras',
  'anillos': 'anillos',
  'bolsos': 'bolsos',
  'moñas': 'monas', // nota: en la BD es "monas" sin tilde
  'tobilleras': 'tobilleras',
  'sin_clasificar': 'accesorios', // Por defecto, sin_clasificar va a accesorios
};

// Función para determinar la categoría correcta basada en el nombre del producto
function determineCategory(product: ProductFromJSON, defaultCategory: string): string {
  const name = product.name.toLowerCase();
  const description = product.description?.toLowerCase() || '';

  // CONJUNTOS: Si menciona "conjunto" o "collar y topos/aretes"
  if (name.includes('conjunto') ||
      (name.includes('collar') && (name.includes('topo') || name.includes('arete')))) {
    return 'conjuntos';
  }

  // ACCESORIOS: Cofres, bolsas, joyeros, cajas, denarios
  if (name.includes('cofre') || name.includes('bolsa') || name.includes('joyero') ||
      name.includes('caja') || name.includes('estuche') || name.includes('denario')) {
    return 'accesorios';
  }

  // ANILLOS: Si el producto dice "anillo" en el nombre (excepto "anillado" que es cadena)
  if (name.includes('anillo') && !name.includes('anillado')) {
    return 'anillos';
  }

  // TOBILLERAS
  if (name.includes('tobillera')) {
    return 'tobilleras';
  }

  // PULSERAS
  if (name.includes('pulsera') || name.includes('brazalete') || name.includes('manilla')) {
    return 'pulseras';
  }

  // COLLARES (asegurarse que no sean anillos)
  if ((name.includes('collar') || name.includes('cadena') || name.includes('gargantilla')) &&
      !name.includes('anillo')) {
    return 'collares';
  }

  // ARETES
  if (name.includes('arete') || name.includes('topo') || name.includes('candonga') ||
      name.includes('argolla') || name.includes('piercing')) {
    return 'aretes';
  }

  // MOÑAS
  if (name.includes('moña') || name.includes('mona') || name.includes('diadema')) {
    return 'monas';
  }

  // Si no coincide con nada específico, usar la categoría por defecto
  return defaultCategory;
}

// Función para generar slug único
function generateSlug(name: string, code: string): string {
  const baseName = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-z0-9\s-]/g, '') // solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, '-') // espacios a guiones
    .replace(/-+/g, '-') // múltiples guiones a uno
    .substring(0, 50); // máximo 50 caracteres

  return `${baseName}-${code.toLowerCase()}`;
}

// Función para copiar imágenes
function copyImages(sourcePath: string, destPath: string): string[] {
  const uploadsDir = path.join(__dirname, '../../uploads');

  // Las imágenes están en frontend/public/uploads/products
  // sourcePath viene como "product_images_paddleocr\\product_p001_i01.png"
  // pero en el JSON también hay "images" que tiene "/uploads/products/product_p001_i01.png"

  const fileName = path.basename(sourcePath);
  const sourceImagePath = path.join(__dirname, '../..', 'frontend', 'public', 'uploads', 'products', fileName);

  // Crear directorio de uploads si no existe
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  if (fs.existsSync(sourceImagePath)) {
    const destFullPath = path.join(uploadsDir, fileName);

    // Copiar imagen
    fs.copyFileSync(sourceImagePath, destFullPath);

    return [`/uploads/${fileName}`];
  }

  console.warn(`⚠️  Imagen no encontrada: ${sourceImagePath}`);
  return ['/placeholder.svg'];
}

async function importProducts() {
  console.log('🚀 Iniciando importación de productos desde JSON...\n');

  // Leer el archivo JSON desde la nueva ubicación
  const jsonPath = path.join(__dirname, '../..', 'products_paddleocr.json');

  if (!fs.existsSync(jsonPath)) {
    console.error('❌ No se encontró el archivo products_paddleocr.json');
    console.error(`   Ruta buscada: ${jsonPath}`);
    process.exit(1);
  }

  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const products: ProductFromJSON[] = JSON.parse(jsonData);

  console.log(`📦 Se encontraron ${products.length} productos en el JSON\n`);

  // PASO 1: Eliminar todos los productos existentes
  console.log('🗑️  Eliminando productos existentes...');
  const deletedCount = await prisma.product.deleteMany({});
  console.log(`   ✅ ${deletedCount.count} productos eliminados\n`);

  // PASO 2: Limpiar directorio de uploads (opcional)
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (fs.existsSync(uploadsDir)) {
    console.log('🧹 Limpiando directorio de uploads...');
    const files = fs.readdirSync(uploadsDir);
    files.forEach(file => {
      fs.unlinkSync(path.join(uploadsDir, file));
    });
    console.log(`   ✅ ${files.length} archivos eliminados\n`);
  }

  // PASO 3: Obtener categorías de la base de datos
  const categories = await prisma.category.findMany({
    where: { isActive: true },
  });

  const categoryMap = new Map(categories.map(cat => [cat.slug, cat.id]));

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  console.log('📥 Importando nuevos productos...\n');

  for (const product of products) {
    try {
      // Validar que el nombre no sea solo un precio
      if (product.name.match(/^\$?\s*[\d,]+\.?\d*$/)) {
        console.log(`⏭️  Omitiendo producto sin nombre válido: ${product.code}`);
        skipped++;
        continue;
      }

      // Obtener categoría base del mapeo
      const baseCategorySlug = CATEGORY_MAPPING[product.product_type.toLowerCase()] || 'accesorios';

      // Determinar categoría final usando lógica inteligente
      const categorySlug = determineCategory(product, baseCategorySlug);
      const categoryId = categoryMap.get(categorySlug);

      if (!categoryId) {
        console.log(`⚠️  Categoría no encontrada para: ${categorySlug} - ${product.code}`);
        skipped++;
        continue;
      }

      // Generar slug único
      const slug = generateSlug(product.name, product.code);

      // Copiar imágenes desde la nueva ubicación
      const images = product.image_path
        ? copyImages(product.image_path, `/uploads/${path.basename(product.image_path)}`)
        : ['/placeholder.svg'];

      // Crear producto
      await prisma.product.create({
        data: {
          name: product.name.substring(0, 100), // Limitar a 100 caracteres
          slug,
          description: product.description || `${product.name}. Código: ${product.code}`,
          price: Math.round(product.final_price),
          stock: product.stock || 10,
          images,
          material: product.material || null,
          categoryId,
          isActive: true,
          isFeatured: false,
        },
      });

      console.log(`✅ Importado: ${product.name} (${product.code}) - ${product.final_price}`);
      imported++;
    } catch (error: any) {
      console.error(`❌ Error importando ${product.code}: ${error.message}`);
      errors++;
    }
  }

  console.log('\n📊 Resumen de Importación:');
  console.log(`   ✅ Importados: ${imported}`);
  console.log(`   ⏭️  Omitidos: ${skipped}`);
  console.log(`   ❌ Errores: ${errors}`);
  console.log(`   📦 Total procesados: ${products.length}`);
}

// Ejecutar importación
importProducts()
  .catch((e) => {
    console.error('❌ Error fatal durante la importación:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
