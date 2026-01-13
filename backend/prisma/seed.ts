import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // 1. Crear usuario administrador
  console.log('👤 Creando usuario administrador...');
  const adminPassword = await hashPassword('admin123');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bellastore.com' },
    update: {},
    create: {
      email: 'admin@bellastore.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'BellaStore',
      phone: '3001234567',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Usuario administrador creado:', admin.email);

  // 2. Crear usuario cliente de prueba
  console.log('👤 Creando usuario cliente de prueba...');
  const clientPassword = await hashPassword('cliente123');

  const client = await prisma.user.upsert({
    where: { email: 'cliente@bellastore.com' },
    update: {},
    create: {
      email: 'cliente@bellastore.com',
      password: clientPassword,
      firstName: 'María',
      lastName: 'González',
      phone: '3009876543',
      role: 'CUSTOMER',
      isActive: true,
    },
  });
  console.log('✅ Usuario cliente creado:', client.email);

  // 3. Crear categorías
  console.log('📁 Creando categorías...');

  const categories = [
    {
      name: 'Bolsos',
      slug: 'bolsos',
      description: 'Bolsos elegantes para toda ocasión',
    },
    {
      name: 'Moñas',
      slug: 'monas',
      description: 'Moñas y accesorios para el cabello',
    },
    {
      name: 'Collares',
      slug: 'collares',
      description: 'Collares y cadenas de moda',
    },
    {
      name: 'Aretes',
      slug: 'aretes',
      description: 'Aretes para complementar tu estilo',
    },
    {
      name: 'Pulseras',
      slug: 'pulseras',
      description: 'Pulseras y brazaletes únicos',
    },
    {
      name: 'Anillos',
      slug: 'anillos',
      description: 'Anillos hermosos para cada ocasión',
    },
    {
      name: 'Tobilleras',
      slug: 'tobilleras',
      description: 'Tobilleras y accesorios para el tobillo',
    },
    {
      name: 'Conjuntos',
      slug: 'conjuntos',
      description: 'Sets y conjuntos de joyería',
    },
    {
      name: 'Accesorios',
      slug: 'accesorios',
      description: 'Cofres, bolsas, joyeros y otros accesorios',
    },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    createdCategories.push(created);
    console.log(`✅ Categoría creada: ${created.name}`);
  }

  // 4. Crear productos de ejemplo
  console.log('🛍️  Creando productos de ejemplo...');

  const products = [
    // Bolsos
    {
      name: 'Bolso Tote Elegante',
      slug: 'bolso-tote-elegante',
      description: 'Bolso tote de cuero sintético ideal para el día a día. Espacioso y con múltiples compartimentos.',
      price: 89900,
      stock: 15,
      images: ['/placeholder-bolso-1.jpg'],
      isFeatured: true,
      categoryId: createdCategories.find(c => c.slug === 'bolsos')!.id,
    },
    {
      name: 'Bolso Crossbody Chic',
      slug: 'bolso-crossbody-chic',
      description: 'Bolso pequeño perfecto para salidas. Correa ajustable y diseño moderno.',
      price: 65900,
      stock: 20,
      images: ['/placeholder-bolso-2.jpg'],
      isFeatured: true,
      categoryId: createdCategories.find(c => c.slug === 'bolsos')!.id,
    },
    {
      name: 'Bolso Clutch Noche',
      slug: 'bolso-clutch-noche',
      description: 'Elegante clutch para eventos especiales. Acabado brillante con cadena dorada.',
      price: 49900,
      stock: 10,
      images: ['/placeholder-bolso-3.jpg'],
      isFeatured: false,
      categoryId: createdCategories.find(c => c.slug === 'bolsos')!.id,
    },

    // Moñas
    {
      name: 'Set 3 Moñas Satinadas',
      slug: 'set-3-monas-satinadas',
      description: 'Set de 3 moñas en colores pastel. Material satinado de alta calidad.',
      price: 24900,
      stock: 30,
      images: ['/placeholder-mona-1.jpg'],
      isFeatured: true,
      categoryId: createdCategories.find(c => c.slug === 'monas')!.id,
    },
    {
      name: 'Moña XL Terciopelo',
      slug: 'mona-xl-terciopelo',
      description: 'Moña grande de terciopelo, perfecta para looks elegantes.',
      price: 19900,
      stock: 25,
      images: ['/placeholder-mona-2.jpg'],
      isFeatured: false,
      categoryId: createdCategories.find(c => c.slug === 'monas')!.id,
    },
    {
      name: 'Diadema con Moña',
      slug: 'diadema-con-mona',
      description: 'Diadema decorada con moña central. Cómoda y estilosa.',
      price: 29900,
      stock: 18,
      images: ['/placeholder-mona-3.jpg'],
      isFeatured: false,
      categoryId: createdCategories.find(c => c.slug === 'monas')!.id,
    },

    // Collares
    {
      name: 'Collar Cadena Corazón',
      slug: 'collar-cadena-corazon',
      description: 'Delicado collar con dije de corazón. Baño de oro 18k.',
      price: 45900,
      stock: 22,
      images: ['/placeholder-collar-1.jpg'],
      isFeatured: true,
      categoryId: createdCategories.find(c => c.slug === 'collares')!.id,
    },
    {
      name: 'Collar Perlas Cultivadas',
      slug: 'collar-perlas-cultivadas',
      description: 'Elegante collar de perlas cultivadas. Ideal para ocasiones especiales.',
      price: 89900,
      stock: 12,
      images: ['/placeholder-collar-2.jpg'],
      isFeatured: true,
      categoryId: createdCategories.find(c => c.slug === 'collares')!.id,
    },
    {
      name: 'Choker Ajustable',
      slug: 'choker-ajustable',
      description: 'Choker moderno con cierre ajustable. Diseño minimalista.',
      price: 32900,
      stock: 28,
      images: ['/placeholder-collar-3.jpg'],
      isFeatured: false,
      categoryId: createdCategories.find(c => c.slug === 'collares')!.id,
    },

    // Aretes
    {
      name: 'Aretes Argolla Grandes',
      slug: 'aretes-argolla-grandes',
      description: 'Aretes de argolla grandes con acabado brillante. Muy ligeros.',
      price: 35900,
      stock: 35,
      images: ['/placeholder-arete-1.jpg'],
      isFeatured: true,
      categoryId: createdCategories.find(c => c.slug === 'aretes')!.id,
    },
    {
      name: 'Aretes Piedras Cristal',
      slug: 'aretes-piedras-cristal',
      description: 'Aretes con cristales brillantes. Perfectos para eventos.',
      price: 42900,
      stock: 20,
      images: ['/placeholder-arete-2.jpg'],
      isFeatured: true,
      categoryId: createdCategories.find(c => c.slug === 'aretes')!.id,
    },
    {
      name: 'Aretes Botón Perla',
      slug: 'aretes-boton-perla',
      description: 'Clásicos aretes de botón con perla. Elegancia atemporal.',
      price: 28900,
      stock: 40,
      images: ['/placeholder-arete-3.jpg'],
      isFeatured: false,
      categoryId: createdCategories.find(c => c.slug === 'aretes')!.id,
    },

    // Pulseras
    {
      name: 'Pulsera Cadena Dijes',
      slug: 'pulsera-cadena-dijes',
      description: 'Pulsera con cadena fina y múltiples dijes decorativos.',
      price: 38900,
      stock: 25,
      images: ['/placeholder-pulsera-1.jpg'],
      isFeatured: false,
      categoryId: createdCategories.find(c => c.slug === 'pulseras')!.id,
    },
    {
      name: 'Brazalete Rígido Dorado',
      slug: 'brazalete-rigido-dorado',
      description: 'Brazalete rígido con grabado elegante. Baño de oro.',
      price: 52900,
      stock: 15,
      images: ['/placeholder-pulsera-2.jpg'],
      isFeatured: false,
      categoryId: createdCategories.find(c => c.slug === 'pulseras')!.id,
    },

    // Anillos
    {
      name: 'Anillo Solitario Zirconia',
      slug: 'anillo-solitario-zirconia',
      description: 'Hermoso anillo con zirconia central. Diseño clásico.',
      price: 45900,
      stock: 18,
      images: ['/placeholder-anillo-1.jpg'],
      isFeatured: false,
      categoryId: createdCategories.find(c => c.slug === 'anillos')!.id,
    },
    {
      name: 'Set 3 Anillos Apilables',
      slug: 'set-3-anillos-apilables',
      description: 'Set de 3 anillos finos para combinar. Diseño minimalista.',
      price: 34900,
      stock: 22,
      images: ['/placeholder-anillo-2.jpg'],
      isFeatured: false,
      categoryId: createdCategories.find(c => c.slug === 'anillos')!.id,
    },
  ];

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
    console.log(`✅ Producto creado: ${created.name}`);
  }

  // 5. Crear dirección de ejemplo para el cliente
  console.log('📍 Creando dirección de ejemplo...');
  await prisma.address.create({
    data: {
      userId: client.id,
      fullName: 'María González',
      phone: '3009876543',
      street: 'Calle 123 #45-67, Apto 801',
      city: 'Bogotá',
      department: 'Cundinamarca',
      postalCode: '110111',
      isDefault: true,
    },
  });
  console.log('✅ Dirección creada');

  console.log('\n🎉 ¡Seed completado exitosamente!');
  console.log('\n📝 Credenciales creadas:');
  console.log('   Admin:');
  console.log('   - Email: admin@bellastore.com');
  console.log('   - Password: admin123');
  console.log('\n   Cliente:');
  console.log('   - Email: cliente@bellastore.com');
  console.log('   - Password: cliente123');
  console.log('\n📊 Datos creados:');
  console.log(`   - ${createdCategories.length} categorías`);
  console.log(`   - ${products.length} productos`);
  console.log('   - 2 usuarios (1 admin, 1 cliente)');
  console.log('   - 1 dirección de ejemplo');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
