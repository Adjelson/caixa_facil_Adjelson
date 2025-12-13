-- =============================================
-- Caixa Fácil - Database Schema
-- Sistema PDV + Estoque + Financeiro
-- =============================================

-- Criar base de dados
CREATE DATABASE IF NOT EXISTS caixa_facil CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE caixa_facil;

-- =============================================
-- TABELAS DE AUTENTICAÇÃO E PERMISSÕES
-- =============================================

-- Tabela de Permissões
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL UNIQUE COMMENT 'Ex: sale.cancel, stock.adjust',
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Roles (Perfis)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT 'Ex: admin, cashier, manager',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Utilizadores
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Relação Role-Permission
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Relação User-Role
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELAS DE PRODUTOS E STOCK
-- =============================================

-- Tabela de Categorias
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Produtos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    barcode VARCHAR(50) NOT NULL UNIQUE COMMENT 'Código de barras',
    sku VARCHAR(50) UNIQUE COMMENT 'SKU interno',
    price DECIMAL(10,2) NOT NULL COMMENT 'Preço de venda',
    cost_price DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Preço de custo',
    stock INT DEFAULT 0 COMMENT 'Stock atual',
    min_stock INT DEFAULT 5 COMMENT 'Stock mínimo',
    is_active BOOLEAN DEFAULT TRUE,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_barcode (barcode),
    INDEX idx_sku (sku),
    INDEX idx_active (is_active),
    INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Movimentos de Stock
CREATE TABLE stock_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    type ENUM('IN', 'OUT', 'ADJUST') NOT NULL COMMENT 'Tipo de movimento',
    amount INT NOT NULL COMMENT 'Quantidade (negativo para saída)',
    reason VARCHAR(255) COMMENT 'Motivo do movimento',
    reference_type VARCHAR(50) COMMENT 'SALE, ADJUSTMENT, etc',
    reference_id INT COMMENT 'ID da referência',
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product (product_id),
    INDEX idx_type (type),
    INDEX idx_reference (reference_type, reference_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELAS DE CAIXA
-- =============================================

-- Tabela de Sessões de Caixa
CREATE TABLE cash_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT 'Operador do caixa',
    status ENUM('OPEN', 'CLOSED') DEFAULT 'OPEN',
    opening_balance DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Saldo inicial',
    closing_balance DECIMAL(10,2) COMMENT 'Saldo final',
    notes TEXT COMMENT 'Observações',
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_opened (opened_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Movimentos de Caixa
CREATE TABLE cash_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    type ENUM('SALE', 'REFUND', 'MANUAL_IN', 'MANUAL_OUT') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason VARCHAR(255),
    reference_id INT COMMENT 'ID da venda, se aplicável',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES cash_sessions(id) ON DELETE CASCADE,
    INDEX idx_session (session_id),
    INDEX idx_type (type),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELAS DE VENDAS
-- =============================================

-- Tabela de Vendas
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT 'Vendedor',
    session_id INT COMMENT 'Sessão de caixa',
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_reason VARCHAR(255),
    status ENUM('COMPLETED', 'CANCELLED', 'REFUNDED') DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (session_id) REFERENCES cash_sessions(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_session (session_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Itens de Venda
CREATE TABLE sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL COMMENT 'Snapshot do nome',
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL COMMENT 'Preço no momento da venda',
    total DECIMAL(10,2) NOT NULL COMMENT 'Total do item',
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_sale (sale_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Pagamentos
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    method ENUM('CASH', 'CARD', 'PIX', 'TRANSFER') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    INDEX idx_sale (sale_id),
    INDEX idx_method (method)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA DE AUDITORIA (OPCIONAL)
-- =============================================

CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL COMMENT 'Ação realizada',
    entity_type VARCHAR(50) COMMENT 'Tipo de entidade',
    entity_id INT COMMENT 'ID da entidade',
    old_value TEXT COMMENT 'Valor anterior (JSON)',
    new_value TEXT COMMENT 'Novo valor (JSON)',
    reason VARCHAR(255) COMMENT 'Motivo da ação',
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- DADOS INICIAIS (SEED)
-- =============================================

-- Inserir Permissões Básicas
INSERT INTO permissions (action, description) VALUES
('sale.create', 'Criar vendas'),
('sale.cancel', 'Cancelar vendas'),
('sale.discount', 'Aplicar descontos'),
('sale.view', 'Visualizar vendas'),
('product.create', 'Criar produtos'),
('product.edit', 'Editar produtos'),
('product.delete', 'Remover produtos'),
('product.view', 'Visualizar produtos'),
('stock.adjust', 'Ajustar stock'),
('stock.view', 'Visualizar stock'),
('cashbox.open', 'Abrir caixa'),
('cashbox.close', 'Fechar caixa'),
('cashbox.movement', 'Movimentar caixa (sangria/reforço)'),
('user.create', 'Criar utilizadores'),
('user.edit', 'Editar utilizadores'),
('user.delete', 'Remover utilizadores'),
('reports.view', 'Visualizar relatórios');

-- Inserir Roles Básicos
INSERT INTO roles (name, description) VALUES
('admin', 'Administrador do sistema - acesso total'),
('manager', 'Gerente - acesso a relatórios e configurações'),
('cashier', 'Operador de caixa - vendas e caixa'),
('stock', 'Responsável de stock - produtos e inventário');

-- Atribuir Permissões ao Role Admin (todas)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Atribuir Permissões ao Role Cashier (vendas e caixa)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions 
WHERE action IN ('sale.create', 'sale.view', 'sale.discount', 'product.view', 'cashbox.open', 'cashbox.close', 'cashbox.movement');

-- Atribuir Permissões ao Role Stock (produtos e stock)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions 
WHERE action IN ('product.create', 'product.edit', 'product.view', 'stock.adjust', 'stock.view');

-- Criar Utilizador Admin (password: admin123)
-- Hash bcrypt de 'admin123': $2b$10$rGHvQZ9vXqJ5KZXqYJZqYeO8YqYqYqYqYqYqYqYqYqYqYqYqYqY
INSERT INTO users (name, username, password, is_active) VALUES
('Administrador', 'admin', '$2b$10$rGHvQZ9vXqJ5KZXqYJZqYeO8YqYqYqYqYqYqYqYqYqYqYqYqYqY', TRUE);

-- Atribuir Role Admin ao utilizador
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);

-- Inserir Categorias de Exemplo
INSERT INTO categories (name) VALUES
('Alimentação'),
('Bebidas'),
('Higiene'),
('Limpeza'),
('Diversos');

-- Inserir Produtos de Exemplo
INSERT INTO products (name, barcode, sku, price, cost_price, stock, min_stock, category_id) VALUES
('Arroz Branco 1kg', '7891234567890', 'ARR001', 5.50, 3.20, 100, 10, 1),
('Feijão Preto 1kg', '7891234567891', 'FEJ001', 6.80, 4.50, 80, 10, 1),
('Macarrão 500g', '7891234567892', 'MAC001', 3.20, 1.80, 150, 20, 1),
('Refrigerante Cola 2L', '7891234567893', 'REF001', 8.90, 5.50, 60, 15, 2),
('Água Mineral 1.5L', '7891234567894', 'AGU001', 2.50, 1.20, 200, 30, 2),
('Sabonete 90g', '7891234567895', 'SAB001', 2.80, 1.50, 120, 20, 3),
('Shampoo 400ml', '7891234567896', 'SHA001', 12.90, 7.50, 50, 10, 3),
('Detergente 500ml', '7891234567897', 'DET001', 3.50, 2.00, 100, 15, 4),
('Sabão em Pó 1kg', '7891234567898', 'SAP001', 15.90, 10.50, 40, 10, 4);

-- =============================================
-- VIEWS ÚTEIS
-- =============================================

-- View de Produtos com Stock Baixo
CREATE VIEW vw_low_stock AS
SELECT 
    p.id,
    p.name,
    p.barcode,
    p.stock,
    p.min_stock,
    c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.stock <= p.min_stock AND p.is_active = TRUE;

-- View de Vendas do Dia
CREATE VIEW vw_sales_today AS
SELECT 
    s.id,
    s.total_amount,
    s.discount_amount,
    s.status,
    u.name as seller_name,
    s.created_at
FROM sales s
INNER JOIN users u ON s.user_id = u.id
WHERE DATE(s.created_at) = CURDATE();

-- View de Resumo de Caixa
CREATE VIEW vw_cash_summary AS
SELECT 
    cs.id,
    u.name as operator_name,
    cs.status,
    cs.opening_balance,
    cs.closing_balance,
    COALESCE(SUM(cm.amount), 0) as total_movements,
    cs.opened_at,
    cs.closed_at
FROM cash_sessions cs
INNER JOIN users u ON cs.user_id = u.id
LEFT JOIN cash_movements cm ON cs.id = cm.session_id
GROUP BY cs.id;

-- =============================================
-- PROCEDURES ÚTEIS (OPCIONAL)
-- =============================================

DELIMITER //

-- Procedure para obter lucro de uma venda
CREATE PROCEDURE sp_sale_profit(IN sale_id INT)
BEGIN
    SELECT 
        s.id,
        s.total_amount as revenue,
        SUM(si.quantity * p.cost_price) as cost,
        (s.total_amount - SUM(si.quantity * p.cost_price)) as profit,
        ((s.total_amount - SUM(si.quantity * p.cost_price)) / s.total_amount * 100) as margin_percent
    FROM sales s
    INNER JOIN sale_items si ON s.id = si.sale_id
    INNER JOIN products p ON si.product_id = p.id
    WHERE s.id = sale_id
    GROUP BY s.id;
END //

DELIMITER ;

-- =============================================
-- FIM DO SCRIPT
-- =============================================
