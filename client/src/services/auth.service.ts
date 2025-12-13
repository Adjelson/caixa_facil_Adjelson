import api from './api';
import type { LoginResponse, User } from '../types';

export const authService = {
    async login(username: string, password: string): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/auth/login', {
            username,
            password,
        });
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    getUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        // Handle previous incorrect values like the string "undefined"
        if (userStr === 'undefined') {
            localStorage.removeItem('user');
            return null;
        }
        try {
            return JSON.parse(userStr);
        } catch {
            localStorage.removeItem('user');
            return null;
        }
    },

    setToken(token: string) {
        localStorage.setItem('token', token);
    },

    setUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },
};
