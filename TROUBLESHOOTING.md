# 🔧 Instruções para Corrigir e Executar o Sistema

## ⚠️ Problema Atual

### Backend - Erro de Base de Dados
```
QueryFailedError: Duplicate entry '' for key 'IDX_1c1e0637ecf1f6401beb9a68ab'
```

**Causa**: A base de dados tem dados corrompidos ou índices duplicados.

**Solução**: Resetar a base de dados.

---

## 📝 Passos para Resolver

### 1. Resetar a Base de Dados

**Opção A - MySQL Workbench:**
1. Abra o MySQL Workbench
2. Conecte ao servidor MySQL
3. Execute o script: `bd/reset_database.sql`

**Opção B - Linha de Comando:**
```bash
mysql -u root -p
```
Depois execute:
```sql
DROP DATABASE IF EXISTS caixa_facil;
CREATE DATABASE caixa_facil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. Reiniciar o Backend

```bash
cd server
npm run start:dev
```

Aguarde até ver:
```
[Nest] Application successfully started
```

### 3. Popular a Base de Dados

Em outro terminal:
```bash
cd server
npm run seed
```

Você verá:
```
✅ SEEDING CONCLUÍDO COM SUCESSO!
📋 Permissões: 17
👥 Roles: 4
👤 Utilizadores: 5
📂 Categorias: 8
📦 Produtos: 21
```

### 4. Iniciar o Frontend

```bash
cd client
npm run dev
```

Acesse: http://localhost:5173

---

## 🔑 Credenciais de Teste

| Utilizador | Username | Password | Role |
|------------|----------|----------|------|
| Admin | `admin` | `admin123` | Administrador |
| Gerente | `maria.santos` | `senha123` | Manager |
| Caixa | `joao.silva` | `senha123` | Cashier |
| Stock | `pedro.costa` | `senha123` | Stock |

---

## ✅ Verificação

### Backend está OK quando ver:
```
[Nest] Application successfully started
```

### Frontend está OK quando ver:
```
VITE v7.2.7  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 🐛 Troubleshooting

### Erro: "Unable to connect to the database"
- Verifique se o MySQL está rodando
- Verifique as credenciais no arquivo `server/.env`
- Teste a conexão: `mysql -u root -p`

### Erro: "Port 3000 already in use"
- Mate o processo: `npx kill-port 3000`
- Ou altere a porta no `.env`: `PORT=3001`

### Erro: "Port 5173 already in use"
- Mate o processo: `npx kill-port 5173`

### Frontend não carrega
- Limpe o cache: `npm run dev -- --force`
- Delete `node_modules` e reinstale: `npm install`

---

## 📊 Estrutura de Portas

- **Backend (NestJS)**: http://localhost:3000
- **Frontend (Vite)**: http://localhost:5173
- **MySQL**: localhost:3306

---

## 🎯 Próximos Passos Após Resolver

1. ✅ Testar login com `admin` / `admin123`
2. ✅ Verificar endpoints da API: http://localhost:3000
3. ✅ Desenvolver interface do PDV (Frontend)
4. ✅ Implementar fluxo de vendas
5. ✅ Testar transações completas

---

**Nota**: Se o erro persistir após resetar a base de dados, delete a pasta `server/node_modules` e execute `npm install` novamente.
