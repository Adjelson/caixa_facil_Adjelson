# 📚 Bibliotecário de Família

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

> Plataforma digital desenvolvida como projeto de conclusão de curso para apoiar a promoção da leitura infantil em São Tomé e Príncipe.

<div align="center">
  <img src="./imagemreadme/loginfamilia.png" alt="Ecrã de login do sistema">
  <p>
    <b>Figura 1 — Ecrã de autenticação da plataforma.</b><br>
    <b>Fonte:</b> Captura de ecrã do sistema Bibliotecário de Família, elaboração própria.
  </p>
</div>

---

## 📝 Resumo do projeto

A leitura na primeira infância é determinante para o desenvolvimento cognitivo, linguístico e social. Em São Tomé e Príncipe, persistem desafios relevantes, como o acesso reduzido a livros infantis, desigualdades na cobertura bibliotecária e escassez de soluções digitais centradas no apoio às famílias.

O projeto **Bibliotecário de Família** foi concebido para responder a esse contexto através de uma plataforma web que aproxima famílias, bibliotecários e bibliotecas. A solução permite disponibilizar recomendações de leitura, apoiar o acompanhamento da evolução leitora das crianças, facilitar o agendamento de consultas com bibliotecários e reforçar a mediação de leitura em ambiente familiar.

A implementação foi desenvolvida com **React, TypeScript, Tailwind CSS, Node.js, Express, Prisma e MySQL**, seguindo uma arquitetura baseada em **APIs REST**. O sistema foi construído com foco em **usabilidade, acessibilidade, responsividade, segurança e escalabilidade**, incluindo autenticação com **JWT**, controlo de acesso por perfis (**RBAC**) e estrutura preparada para funcionamento moderno em ambiente web.

Este trabalho enquadra-se numa abordagem **exploratória-descritiva**, permitindo levantar necessidades, estruturar a proposta tecnológica e validar a viabilidade da solução do ponto de vista técnico e social.

**Palavras-chave:** leitura infantil, usabilidade, acessibilidade, bibliotecas digitais, mediação de leitura, PWA.

---

## 🎯 Objetivo geral

Desenvolver uma plataforma digital de apoio à leitura infantil que permita às famílias em São Tomé e Príncipe aceder a recursos, serviços e orientação bibliotecária de forma simples, acessível e segura.

## 📌 Objetivos específicos

- Promover hábitos de leitura no contexto familiar.
- Facilitar o acesso a livros e conteúdos adequados à faixa etária da criança.
- Aproximar famílias e bibliotecários por meio de consultas e acompanhamento.
- Disponibilizar uma interface moderna, responsiva e intuitiva.
- Estruturar um sistema com autenticação e permissões por perfil.
- Apoiar a transformação digital de serviços de biblioteca com impacto social.

---

## 🏗️ Visão geral da solução

A plataforma está dividida em duas camadas principais:

- **Frontend:** interface web para famílias, bibliotecários e administradores.
- **Backend:** API responsável por autenticação, regras de negócio, persistência de dados, notificações e gestão dos módulos do sistema.

### 👥 Perfis de utilizador

- 🧑‍🧑‍🧒 **PAI** — responsável familiar que utiliza a plataforma para leitura, consultas, requisições e acompanhamento.
- 📚 **BIBLIOTECARIO** — profissional que gere livros, consultas, famílias, atividades e mediação.
- ⚙️ **ADMIN** — utilizador com visão global e gestão administrativa do sistema.

---

## 🛠️ Tecnologias utilizadas

### 🎨 Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Chakra UI
- TanStack Router
- React Query
- Zustand
- Axios
- Framer Motion
- Vitest
- Playwright

### ⚙️ Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- MySQL
- Zod
- JWT
- bcryptjs
- cookie-parser
- cors
- helmet
- multer
- Vitest

---

## 📸 Galeria de interfaces

### 1. Login
![Login da plataforma](./imagemreadme/loginfamilia.png)
> **Figura 2 — Página de login da plataforma.**  
> **Fonte:** Captura de ecrã do sistema Bibliotecário de Família, elaboração própria.

### 2. Registo de utilizador
![Registo da família](./imagemreadme/02-registar-familia.png)
> **Figura 3 — Interface de criação de conta para acesso ao sistema.**  
> **Fonte:** Captura de ecrã do sistema Bibliotecário de Família, elaboração própria.

### 3. Dashboard da família
![Dashboard da família](./imagemreadme/03-dashboard-familia.png)
> **Figura 4 — Painel principal da família com acesso rápido a livros, consultas, mensagens, pedidos e guia de leitura.**  
> **Fonte:** Captura de ecrã do sistema Bibliotecário de Família, elaboração própria.

### 4. Livros e requisições
![Área de livros e requisições](./imagemreadme/livrosrequisicoaesfamilia.png)
> **Figura 5 — Área de consulta e requisição de livros para utilização familiar.**  
> **Fonte:** Captura de ecrã do sistema Bibliotecário de Família, elaboração própria.

### 5. Carrinho / pedidos
![Carrinho da família](./imagemreadme/carinhofamilia.png)
> **Figura 6 — Fluxo de carrinho e pedidos associado à experiência do utilizador.**  
> **Fonte:** Captura de ecrã do sistema Bibliotecário de Família, elaboração própria.

### 6. Notificações
![Notificações da família](./imagemreadme/notficaçõesfamilia.png)
> **Figura 7 — Área de notificações para acompanhamento de ações e eventos do sistema.**  
> **Fonte:** Captura de ecrã do sistema Bibliotecário de Família, elaboração própria.

### 7. Histórico de consultas
![Histórico de consultas](./imagemreadme/dashboard.png)
> **Figura 8 — Ecrã de histórico de consultas realizadas pela família.**  
> **Fonte:** Captura de ecrã do sistema Bibliotecário de Família, elaboração própria.

### 8. Formulário de marcação de consulta
![Formulário de marcação de consulta](./imagemreadme/08-utilizadores-admin.png)
> **Figura 9 — Interface de submissão de pedido de consulta com bibliotecário.**  
> **Fonte:** Captura de ecrã do sistema Bibliotecário de Família, elaboração própria.

### 9. Gestão de livros
![Gestão de livros](./imagemreadme/livrosrequisicoaesfamilia.png)
> **Figura 10 — Vista administrativa orientada à gestão de livros e respetivos dados.**  
> **Fonte:** Captura de ecrã do sistema Bibliotecário de Família, elaboração própria.

### 10. Gestão de bibliotecas
![Gestão de bibliotecas](./imagemreadme/livrosrequisicoaesfamilia.png)
> **Figura 11 — Interface administrativa para gestão de bibliotecas e configurações associadas.**  
> **Fonte:** Captura de ecrã do sistema Bibliotecário de Família, elaboração própria.

---

# ⚙️ Backend — Biblioteca da Família

O backend da plataforma **Bibliotecário de Família** foi desenvolvido com **Node.js, Express, TypeScript, Prisma e MySQL**. Esta camada é responsável pela autenticação, persistência de dados, regras de negócio, autorização por perfil e exposição dos serviços REST consumidos pelo frontend.

A API foi estruturada para suportar um sistema multiutilizador com foco em bibliotecas, famílias e mediação de leitura. Entre as responsabilidades do backend estão:

- autenticação e gestão de sessão;
- gestão de famílias, bibliotecários e administradores;
- catálogo de livros e comentários;
- consultas com bibliotecários;
- requisições e devoluções;
- carrinho, pedidos e pagamentos;
- notificações, mensagens e atividades;
- indicadores e estatísticas operacionais.

## 📐 Arquitetura técnica do backend

A camada backend segue uma arquitetura modular baseada em Express e Prisma:

```text
Cliente Web (Frontend)
        ↓
API REST (Express + TypeScript)
        ↓
Camada de validação e middleware
        ↓
Prisma ORM
        ↓
MySQL
