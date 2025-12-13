# Database Seeding

Este diretório contém scripts para popular a base de dados com dados iniciais para desenvolvimento e testes.

## 📋 O que é criado?

O script `seed.ts` cria:

### Autenticação & Permissões
- **17 Permissões** (sale.create, sale.cancel, product.edit, etc.)
- **4 Roles** (Admin, Manager, Cashier, Stock)
- **5 Utilizadores** com passwords hash bcrypt

### Produtos & Categorias
- **8 Categorias** (Alimentação, Bebidas, Higiene, etc.)
- **21 Produtos** com códigos de barras, preços, stock

## 🚀 Como usar

### 1. Configurar Base de Dados

Certifique-se que o arquivo `.env` está configurado:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sua_password
DB_NAME=caixa_facil
```

### 2. Criar a Base de Dados

```sql
CREATE DATABASE caixa_facil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Executar Migrations

O TypeORM criará as tabelas automaticamente com `synchronize: true` (apenas em desenvolvimento).

### 4. Executar o Seed

```bash
npm run seed
```

## 🔑 Credenciais Criadas

| Nome | Username | Password | Role |
|------|----------|----------|------|
| Administrador | admin | admin123 | Admin |
| Maria Santos | maria.santos | senha123 | Manager |
| João Silva | joao.silva | senha123 | Cashier |
| Ana Oliveira | ana.oliveira | senha123 | Cashier |
| Pedro Costa | pedro.costa | senha123 | Stock |

## 📦 Produtos Criados

### Alimentação (5 produtos)
- Arroz Branco 1kg
- Feijão Preto 1kg
- Macarrão 500g
- Óleo de Soja 900ml
- Açúcar 1kg

### Bebidas (3 produtos)
- Refrigerante Cola 2L
- Água Mineral 1.5L
- Suco de Laranja 1L

### Higiene (3 produtos)
- Sabonete 90g
- Shampoo 400ml
- Pasta de Dente 90g

### Limpeza (3 produtos)
- Detergente 500ml
- Sabão em Pó 1kg
- Amaciante 2L

### Padaria (2 produtos)
- Pão Francês (unidade)
- Pão de Forma

### Frios e Laticínios (3 produtos)
- Leite Integral 1L
- Queijo Mussarela 500g
- Presunto 200g

### Hortifruti (2 produtos)
- Tomate (kg)
- Batata (kg)

## ⚠️ Avisos

- **NÃO executar em produção** - Este script é apenas para desenvolvimento
- Os dados serão inseridos na base de dados configurada no `.env`
- Se já existirem dados, pode haver conflitos de chaves únicas
- As passwords são apenas para testes - alterar em produção

## 🔄 Re-executar o Seed

Para limpar e re-executar:

```bash
# Opção 1: Dropar e recriar a base de dados
DROP DATABASE caixa_facil;
CREATE DATABASE caixa_facil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Opção 2: Limpar tabelas manualmente
TRUNCATE TABLE user_roles;
TRUNCATE TABLE role_permissions;
TRUNCATE TABLE users;
TRUNCATE TABLE roles;
TRUNCATE TABLE permissions;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;

# Depois executar o seed novamente
npm run seed
```

## 📝 Personalizar Dados

Para adicionar mais dados, edite o arquivo `seed.ts`:

```typescript
// Adicionar mais produtos
const productsData = [
  // ... produtos existentes
  {
    name: 'Novo Produto',
    barcode: '7891234567999',
    sku: 'NPR001',
    price: 10.00,
    costPrice: 6.00,
    stock: 50,
    minStock: 10,
    category: categories[0],
  },
];
```

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "Connection refused"
Verifique se o MySQL está rodando e as credenciais no `.env` estão corretas.

### Erro: "Duplicate entry"
A base de dados já tem dados. Limpe as tabelas ou use uma nova base de dados.
