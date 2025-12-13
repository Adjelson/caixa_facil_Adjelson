import api from './api';
import type { Product } from '../types';

export const productsService = {
    async getAll(): Promise<Product[]> {
        const response = await api.get<Product[]>('/products');
        return response.data;
    },

    async getById(id: number): Promise<Product> {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    async getByBarcode(barcode: string): Promise<Product> {
        const response = await api.get<Product>(`/products/barcode/${barcode}`);
        return response.data;
    },

    async create(product: Partial<Product>): Promise<Product> {
        const response = await api.post<Product>('/products', product);
        return response.data;
    },

    async update(id: number, product: Partial<Product>): Promise<Product> {
        const response = await api.patch<Product>(`/products/${id}`, product);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/products/${id}`);
    },
};
