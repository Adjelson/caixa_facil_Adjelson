/* eslint-disable prettier/prettier */
import api from './api';
import type { User, Role } from '../types';

export interface CreateUserInput {
  name: string;
  username: string;
  password: string;
  roleIds: number[];
  isActive?: boolean;
}

export const usersService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async getRoles(): Promise<Role[]> {
    const response = await api.get<Role[]>('/users/roles');
    return response.data;
  },

  async create(data: CreateUserInput): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },
};
