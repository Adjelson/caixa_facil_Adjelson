# Caixa Fácil - Sistema PDV

Sistema completo de **Ponto de Venda (PDV) + Estoque + Financeiro** focado em velocidade e simplicidade. Desenvolvido para realizar vendas em 10-30 segundos.

## 🚀 Tecnologias

### Backend
- **NestJS** - Framework Node.js
- **TypeORM** - ORM para MySQL
- **MySQL** - Base de dados
- **JWT** - Autenticação
- **Bcrypt** - Hash de passwords

### Frontend
- **React** + **Vite** - Interface moderna
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização

## 📋 Funcionalidades

### ✅ Implementado

#### Autenticação & Permissões (RBAC)
- Sistema de login com JWT
- Refresh tokens
- Roles e permissões granulares
- Guards de proteção de rotas

#### Gestão de Produtos
- Cadastro rápido de produtos
- Suporte a código de barras
- Categorias
- Controlo de stock
- Alertas de stock mínimo

#### Controlo de Stock
- Movimentos automáticos (entrada/saída)
- Histórico completo de movimentações
- Ajustes manuais com motivo
- Auditoria de alterações

#### Caixa (Sessões)
- Abertura/fecho de caixa
- Saldo inicial e final
- Movimentos (sangria, reforço)
- Relatório de fecho

#### PDV (Vendas)
- Processamento de vendas com transação
- Multi-pagamento (Dinheiro, Cartão, PIX, Transferência)
- Descontos com motivo
- Baixa automática de stock
- Registo em caixa automático

#### Auditoria
- Log de todas as ações críticas
- Rastreamento de alterações
- Histórico de utilizadores

## 🗄️ Estrutura da Base de Dados

### Principais Entidades

**Autenticação**
- `users` - Utilizadores do sistema
- `roles` - Perfis de acesso
- `permissions` - Permissões granulares
- `user_roles` - Relação utilizador-perfil
- `role_permissions` - Relação perfil-permissão

**Produtos & Stock**
- `products` - Catálogo de produtos
- `categories` - Categorias de produtos
- `stock_movements` - Movimentos de stock

**Vendas**
- `sales` - Vendas realizadas
- `sale_items` - Itens de cada venda
- `payments` - Pagamentos recebidos

**Caixa**
- `cash_sessions` - Sessões de caixa
- `cash_movements` - Movimentos de caixa

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- MySQL 8+
- npm ou yarn

### 1. Clonar o Repositório
```bash
git clone <repository-url>
cd caixa_facil_Adjelson
```

### 2. Configurar Backend

```bash
cd server
npm install
```

Criar ficheiro `.env` (copiar de `.env.example`):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sua_password
DB_NAME=caixa_facil
JWT_SECRET=sua_chave_secreta_aqui
PORT=3000
```

### 3. Configurar Base de Dados

Criar a base de dados MySQL:
```sql
CREATE DATABASE caixa_facil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

O TypeORM criará as tabelas automaticamente na primeira execução (modo `synchronize: true`).

⚠️ **IMPORTANTE**: Em produção, desativar `synchronize` e usar migrations.

### 4. Configurar Frontend

```bash
cd ../client
npm install
```

### 5. Executar o Sistema

**Backend** (porta 3000):
```bash
cd server
npm run start:dev
```

**Frontend** (porta 5173):
```bash
cd client
npm run dev
```

Aceder a aplicação em: `http://localhost:5173`

## 📚 API Endpoints

### Autenticação
- `POST /auth/login` - Login de utilizador
- `POST /auth/register` - Registo (se habilitado)

### Produtos
- `GET /products` - Listar produtos
- `GET /products/:id` - Obter produto
- `POST /products` - Criar produto
- `PATCH /products/:id` - Atualizar produto
- `DELETE /products/:id` - Remover produto

### Vendas
- `GET /sales` - Listar vendas
- `GET /sales/:id` - Obter venda
- `POST /sales` - Criar venda

### Sessões de Caixa
- `GET /cash-sessions` - Listar sessões
- `POST /cash-sessions` - Abrir caixa
- `PATCH /cash-sessions/:id` - Fechar caixa

## 🔐 Sistema de Permissões

O sistema usa RBAC (Role-Based Access Control) com permissões granulares:

### Exemplos de Permissões
- `sale.create` - Criar vendas
- `sale.cancel` - Cancelar vendas
- `sale.discount` - Aplicar descontos
- `stock.adjust` - Ajustar stock
- `cashbox.open` - Abrir caixa
- `cashbox.close` - Fechar caixa

### Uso no Backend
```typescript
@RequirePermission('sale.cancel')
@Delete(':id')
cancelSale(@Param('id') id: string) {
  return this.salesService.cancel(+id);
}
```

## 🎯 Fluxo de Venda (PDV)

1. **Abrir Sessão de Caixa**
   - Operador abre caixa com saldo inicial
   - Sistema cria `cash_session` com status OPEN

2. **Processar Venda**
   - Adicionar produtos (por código de barras ou busca)
   - Aplicar descontos (se autorizado)
   - Selecionar formas de pagamento
   - Confirmar venda

3. **Transação Automática**
   - Cria registo em `sales`
   - Cria itens em `sale_items`
   - Deduz stock em `products`
   - Regista movimentos em `stock_movements`
   - Regista pagamentos em `payments`
   - Atualiza caixa em `cash_movements`
   - **Tudo em transação** - rollback automático em caso de erro

4. **Fechar Caixa**
   - Contagem de valores
   - Relatório de vendas
   - Registo de diferenças (quebra/sobra)

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
caixa_facil_Adjelson/
├── server/                 # Backend NestJS
│   ├── src/
│   │   ├── auth/          # Autenticação e autorização
│   │   ├── users/         # Gestão de utilizadores
│   │   ├── products/      # Produtos e stock
│   │   ├── sales/         # PDV e vendas
│   │   ├── cash-sessions/ # Controlo de caixa
│   │   └── app.module.ts  # Módulo principal
│   └── package.json
│
└── client/                # Frontend React
    ├── src/
    │   ├── components/    # Componentes reutilizáveis
    │   ├── pages/         # Páginas da aplicação
    │   └── App.tsx        # Componente principal
    └── package.json
```

### Scripts Disponíveis

**Backend:**
```bash
npm run start:dev    # Desenvolvimento com hot-reload
npm run build        # Build de produção
npm run start:prod   # Executar build de produção
npm run test         # Testes unitários
```

**Frontend:**
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
```

## 📊 Modelo de Dados

### Relacionamentos Principais

```
User ──< UserRoles >── Role ──< RolePermissions >── Permission
User ──< CashSession ──< CashMovement
User ──< Sale ──< SaleItem >── Product
Sale ──< Payment
Product ──< StockMovement
Product >── Category
```

## 🚧 Próximos Passos

### Funcionalidades Pendentes
- [ ] Interface PDV completa (Frontend)
- [ ] Impressão de recibos
- [ ] Cancelamento e devolução de vendas
- [ ] Relatórios avançados
- [ ] Dashboard com gráficos
- [ ] Importação CSV de produtos
- [ ] Gestão de clientes
- [ ] Contas a receber (fiado)

### Melhorias Técnicas
- [ ] Migrations TypeORM
- [ ] Testes E2E
- [ ] Docker Compose
- [ ] CI/CD pipeline
- [ ] Documentação Swagger/OpenAPI

## 📝 Notas Importantes

### Segurança
- ⚠️ Alterar `JWT_SECRET` em produção
- ⚠️ Usar HTTPS em produção
- ⚠️ Configurar CORS adequadamente
- ⚠️ Desativar `synchronize` do TypeORM em produção

### Performance
- Índices criados em campos críticos (barcode, SKU)
- Transações para garantir consistência
- Eager loading de relações necessárias

### Auditoria
- Todas as ações críticas são registadas
- Histórico completo de movimentos
- Rastreamento de alterações por utilizador

## 🤝 Contribuir

1. Fork o projeto
2. Criar branch de feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit das alterações (`git commit -m 'Adicionar nova funcionalidade'`)
4. Push para o branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir Pull Request

## 📄 Licença

Este projeto está sob licença MIT.

## 👥 Autores

Desenvolvido como sistema PDV completo e funcional.

---

**Caixa Fácil** - Sistema PDV rápido e confiável 🚀