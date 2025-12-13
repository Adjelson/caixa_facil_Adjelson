import api from './api';
import type { Sale } from '../types';

interface CreateSaleDto {
    items: {
        productId: number;
        quantity: number;
        discount?: number;
    }[];
    payments: {
        method: 'CASH' | 'CARD' | 'PIX' | 'TRANSFER';
        amount: number;
    }[];
    discountAmount?: number;
    discountReason?: string;
}

export const salesService = {
    async create(saleData: CreateSaleDto): Promise<Sale> {
        const response = await api.post<Sale>('/sales', saleData);
        return response.data;
    },

    async getAll(): Promise<Sale[]> {
        const response = await api.get<Sale[]>('/sales');
        return response.data;
    },

    async getById(id: number): Promise<Sale> {
        const response = await api.get<Sale>(`/sales/${id}`);
        return response.data;
    },
};
