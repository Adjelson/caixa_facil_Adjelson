// User types
export interface User {
    id: number;
    name: string;
    username: string;
    isActive: boolean;
    roles: Role[];
}

export interface Role {
    id: number;
    name: string;
    description: string;
    permissions: Permission[];
}

export interface Permission {
    id: number;
    action: string;
    description: string;
}

// Product types
export interface Product {
    id: number;
    name: string;
    barcode: string;
    sku?: string;
    price: number;
    costPrice: number;
    stock: number;
    minStock: number;
    isActive: boolean;
    categoryId?: number;
    category?: Category;
}

export interface Category {
    id: number;
    name: string;
}

// Sale types
export interface Sale {
    id: number;
    userId: number;
    sessionId?: number;
    totalAmount: number;
    discountAmount: number;
    discountReason?: string;
    status: 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
    items: SaleItem[];
    payments: Payment[];
    createdAt: string;
}

export interface SaleItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Payment {
    id: number;
    method: 'CASH' | 'CARD' | 'PIX' | 'TRANSFER';
    amount: number;
}

// Cart types
export interface CartItem {
    product: Product;
    quantity: number;
    discount: number;
}

// Cash Session types
export interface CashSession {
    id: number;
    userId: number;
    status: 'OPEN' | 'CLOSED';
    openingBalance: number;
    closingBalance?: number;
    notes?: string;
    openedAt: string;
    closedAt?: string;
}

// API Response types
export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface ApiError {
    message: string;
    statusCode: number;
}
