/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/users/entities/role.entity';
import { Permission } from '../src/users/entities/permission.entity';
import { Product } from '../src/products/entities/product.entity';
import { Category } from '../src/products/entities/category.entity';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const configService = new ConfigService();

// Configuração da conexão
const AppDataSource = new DataSource({
    type: 'mysql',
    host: configService.get<string>('DB_HOST') || 'localhost',
    port: configService.get<number>('DB_PORT') || 3306,
    username: configService.get<string>('DB_USERNAME') || 'root',
    password: configService.get<string>('DB_PASSWORD') || '',
    database: configService.get<string>('DB_NAME') || 'caixa_facil',
    entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
    synchronize: false,
});

async function seed() {
    console.log('🌱 Iniciando seeding da base de dados...\n');

    try {
        await AppDataSource.initialize();
        console.log('✅ Conexão com a base de dados estabelecida\n');

        // ==========================================
        // 1. PERMISSÕES
        // ==========================================
        console.log('📋 Criando permissões...');
        const permissionsData = [
            { action: 'sale.create', description: 'Criar vendas' },
            { action: 'sale.cancel', description: 'Cancelar vendas' },
            { action: 'sale.discount', description: 'Aplicar descontos' },
            { action: 'sale.view', description: 'Visualizar vendas' },
            { action: 'product.create', description: 'Criar produtos' },
            { action: 'product.edit', description: 'Editar produtos' },
            { action: 'product.delete', description: 'Remover produtos' },
            { action: 'product.view', description: 'Visualizar produtos' },
            { action: 'stock.adjust', description: 'Ajustar stock' },
            { action: 'stock.view', description: 'Visualizar stock' },
            { action: 'cashbox.open', description: 'Abrir caixa' },
            { action: 'cashbox.close', description: 'Fechar caixa' },
            { action: 'cashbox.movement', description: 'Movimentar caixa' },
            { action: 'user.create', description: 'Criar utilizadores' },
            { action: 'user.edit', description: 'Editar utilizadores' },
            { action: 'user.delete', description: 'Remover utilizadores' },
            { action: 'reports.view', description: 'Visualizar relatórios' },
        ];

        const permissions: Permission[] = [];
        for (const permData of permissionsData) {
            const permission = AppDataSource.getRepository(Permission).create(permData);
            const saved = await AppDataSource.getRepository(Permission).save(permission);
            permissions.push(saved);
        }
        console.log(`✅ ${permissions.length} permissões criadas\n`);

        // ==========================================
        // 2. ROLES
        // ==========================================
        console.log('👥 Criando roles...');
        const rolesData = [
            {
                name: 'admin',
                description: 'Administrador - acesso total',
                permissions: permissions, // Todas as permissões
            },
            {
                name: 'manager',
                description: 'Gerente - relatórios e configurações',
                permissions: permissions.filter((p) =>
                    ['sale.view', 'product.view', 'stock.view', 'reports.view', 'cashbox.close'].includes(
                        p.action,
                    ),
                ),
            },
            {
                name: 'cashier',
                description: 'Operador de caixa',
                permissions: permissions.filter((p) =>
                    [
                        'sale.create',
                        'sale.view',
                        'sale.discount',
                        'product.view',
                        'cashbox.open',
                        'cashbox.close',
                        'cashbox.movement',
                    ].includes(p.action),
                ),
            },
            {
                name: 'stock',
                description: 'Responsável de stock',
                permissions: permissions.filter((p) =>
                    [
                        'product.create',
                        'product.edit',
                        'product.view',
                        'stock.adjust',
                        'stock.view',
                    ].includes(p.action),
                ),
            },
        ];

        const roles: Role[] = [];
        for (const roleData of rolesData) {
            const role = AppDataSource.getRepository(Role).create(roleData);
            const saved = await AppDataSource.getRepository(Role).save(role);
            roles.push(saved);
        }
        console.log(`✅ ${roles.length} roles criados\n`);

        // ==========================================
        // 3. UTILIZADORES
        // ==========================================
        console.log('👤 Criando utilizadores...');
        const usersData = [
            {
                name: 'Administrador',
                username: 'admin',
                password: 'admin123',
                roles: [roles[0]], // Admin
            },
            {
                name: 'João Silva',
                username: 'joao.silva',
                password: 'senha123',
                roles: [roles[2]], // Cashier
            },
            {
                name: 'Maria Santos',
                username: 'maria.santos',
                password: 'senha123',
                roles: [roles[1]], // Manager
            },
            {
                name: 'Pedro Costa',
                username: 'pedro.costa',
                password: 'senha123',
                roles: [roles[3]], // Stock
            },
            {
                name: 'Ana Oliveira',
                username: 'ana.oliveira',
                password: 'senha123',
                roles: [roles[2]], // Cashier
            },
        ];

        const users: User[] = [];
        for (const userData of usersData) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const user = AppDataSource.getRepository(User).create({
                name: userData.name,
                username: userData.username,
                password: hashedPassword,
                roles: userData.roles,
                isActive: true,
            });

            const saved = await AppDataSource.getRepository(User).save(user);
            users.push(saved);
            console.log(`   ✓ ${userData.name} (${userData.username})`);
        }
        console.log(`✅ ${users.length} utilizadores criados\n`);

        // ==========================================
        // 4. CATEGORIAS
        // ==========================================
        console.log('📂 Criando categorias...');
        const categoriesData = [
            'Alimentação',
            'Bebidas',
            'Higiene',
            'Limpeza',
            'Padaria',
            'Frios e Laticínios',
            'Hortifruti',
            'Diversos',
        ];

        const categories: Category[] = [];
        for (const catName of categoriesData) {
            const category = AppDataSource.getRepository(Category).create({ name: catName });
            const saved = await AppDataSource.getRepository(Category).save(category);
            categories.push(saved);
        }
        console.log(`✅ ${categories.length} categorias criadas\n`);

        // ==========================================
        // 5. PRODUTOS
        // ==========================================
        console.log('📦 Criando produtos...');
        const productsData = [
            // Alimentação
            {
                name: 'Arroz Branco 1kg',
                barcode: '7891234567890',
                sku: 'ARR001',
                price: 5.5,
                costPrice: 3.2,
                stock: 100,
                minStock: 10,
                category: categories[0],
            },
            {
                name: 'Feijão Preto 1kg',
                barcode: '7891234567891',
                sku: 'FEJ001',
                price: 6.8,
                costPrice: 4.5,
                stock: 80,
                minStock: 10,
                category: categories[0],
            },
            {
                name: 'Macarrão 500g',
                barcode: '7891234567892',
                sku: 'MAC001',
                price: 3.2,
                costPrice: 1.8,
                stock: 150,
                minStock: 20,
                category: categories[0],
            },
            {
                name: 'Óleo de Soja 900ml',
                barcode: '7891234567893',
                sku: 'OLE001',
                price: 8.9,
                costPrice: 6.2,
                stock: 60,
                minStock: 15,
                category: categories[0],
            },
            {
                name: 'Açúcar 1kg',
                barcode: '7891234567894',
                sku: 'ACU001',
                price: 4.5,
                costPrice: 2.8,
                stock: 90,
                minStock: 15,
                category: categories[0],
            },

            // Bebidas
            {
                name: 'Refrigerante Cola 2L',
                barcode: '7891234567895',
                sku: 'REF001',
                price: 8.9,
                costPrice: 5.5,
                stock: 60,
                minStock: 15,
                category: categories[1],
            },
            {
                name: 'Água Mineral 1.5L',
                barcode: '7891234567896',
                sku: 'AGU001',
                price: 2.5,
                costPrice: 1.2,
                stock: 200,
                minStock: 30,
                category: categories[1],
            },
            {
                name: 'Suco de Laranja 1L',
                barcode: '7891234567897',
                sku: 'SUC001',
                price: 6.5,
                costPrice: 4.0,
                stock: 50,
                minStock: 10,
                category: categories[1],
            },

            // Higiene
            {
                name: 'Sabonete 90g',
                barcode: '7891234567898',
                sku: 'SAB001',
                price: 2.8,
                costPrice: 1.5,
                stock: 120,
                minStock: 20,
                category: categories[2],
            },
            {
                name: 'Shampoo 400ml',
                barcode: '7891234567899',
                sku: 'SHA001',
                price: 12.9,
                costPrice: 7.5,
                stock: 50,
                minStock: 10,
                category: categories[2],
            },
            {
                name: 'Pasta de Dente 90g',
                barcode: '7891234567900',
                sku: 'PAS001',
                price: 5.9,
                costPrice: 3.2,
                stock: 80,
                minStock: 15,
                category: categories[2],
            },

            // Limpeza
            {
                name: 'Detergente 500ml',
                barcode: '7891234567901',
                sku: 'DET001',
                price: 3.5,
                costPrice: 2.0,
                stock: 100,
                minStock: 15,
                category: categories[3],
            },
            {
                name: 'Sabão em Pó 1kg',
                barcode: '7891234567902',
                sku: 'SAP001',
                price: 15.9,
                costPrice: 10.5,
                stock: 40,
                minStock: 10,
                category: categories[3],
            },
            {
                name: 'Amaciante 2L',
                barcode: '7891234567903',
                sku: 'AMA001',
                price: 12.5,
                costPrice: 8.0,
                stock: 35,
                minStock: 8,
                category: categories[3],
            },

            // Padaria
            {
                name: 'Pão Francês (unidade)',
                barcode: '7891234567904',
                sku: 'PAO001',
                price: 0.5,
                costPrice: 0.25,
                stock: 300,
                minStock: 50,
                category: categories[4],
            },
            {
                name: 'Pão de Forma',
                barcode: '7891234567905',
                sku: 'PAO002',
                price: 6.9,
                costPrice: 4.2,
                stock: 40,
                minStock: 10,
                category: categories[4],
            },

            // Frios e Laticínios
            {
                name: 'Leite Integral 1L',
                barcode: '7891234567906',
                sku: 'LEI001',
                price: 4.8,
                costPrice: 3.2,
                stock: 100,
                minStock: 20,
                category: categories[5],
            },
            {
                name: 'Queijo Mussarela 500g',
                barcode: '7891234567907',
                sku: 'QUE001',
                price: 28.9,
                costPrice: 20.5,
                stock: 25,
                minStock: 5,
                category: categories[5],
            },
            {
                name: 'Presunto 200g',
                barcode: '7891234567908',
                sku: 'PRE001',
                price: 12.5,
                costPrice: 8.5,
                stock: 30,
                minStock: 8,
                category: categories[5],
            },

            // Hortifruti
            {
                name: 'Tomate (kg)',
                barcode: '7891234567909',
                sku: 'TOM001',
                price: 7.9,
                costPrice: 4.5,
                stock: 50,
                minStock: 10,
                category: categories[6],
            },
            {
                name: 'Batata (kg)',
                barcode: '7891234567910',
                sku: 'BAT001',
                price: 5.5,
                costPrice: 3.0,
                stock: 80,
                minStock: 15,
                category: categories[6],
            },
        ];

        const products: Product[] = [];
        for (const prodData of productsData) {
            const product = AppDataSource.getRepository(Product).create(prodData);
            const saved = await AppDataSource.getRepository(Product).save(product);
            products.push(saved);
        }
        console.log(`✅ ${products.length} produtos criados\n`);

        // ==========================================
        // RESUMO
        // ==========================================
        console.log('═══════════════════════════════════════');
        console.log('✅ SEEDING CONCLUÍDO COM SUCESSO!');
        console.log('═══════════════════════════════════════');
        console.log(`📋 Permissões: ${permissions.length}`);
        console.log(`👥 Roles: ${roles.length}`);
        console.log(`👤 Utilizadores: ${users.length}`);
        console.log(`📂 Categorias: ${categories.length}`);
        console.log(`📦 Produtos: ${products.length}`);
        console.log('═══════════════════════════════════════\n');

        console.log('🔑 CREDENCIAIS DE ACESSO:');
        console.log('─────────────────────────────────────');
        console.log('Admin:    admin / admin123');
        console.log('Gerente:  maria.santos / senha123');
        console.log('Caixa 1:  joao.silva / senha123');
        console.log('Caixa 2:  ana.oliveira / senha123');
        console.log('Stock:    pedro.costa / senha123');
        console.log('─────────────────────────────────────\n');

        await AppDataSource.destroy();
        console.log('✅ Conexão fechada\n');
    } catch (error) {
        console.error('❌ Erro durante o seeding:', error);
        process.exit(1);
    }
}

// Executar seed
seed()
    .then(() => {
        console.log('🎉 Processo finalizado!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Erro fatal:', error);
        process.exit(1);
    });
