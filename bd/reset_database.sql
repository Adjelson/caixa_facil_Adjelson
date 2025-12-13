-- =============================================
-- Script para Resetar Base de Dados
-- Execute este script para resolver erros de sincronização
-- =============================================

-- Dropar base de dados existente
DROP DATABASE IF EXISTS caixa_facil;

-- Criar nova base de dados
CREATE DATABASE caixa_facil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar a base de dados
USE caixa_facil;

-- Pronto! Agora pode executar o servidor
-- O TypeORM criará as tabelas automaticamente
-- Depois execute: npm run seed
