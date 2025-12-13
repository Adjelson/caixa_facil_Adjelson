/* eslint-disable prettier/prettier */
import api from './api';
import type { CashSession } from '../types';

export interface OpenSessionInput {
  openingBalance: number;
  notes?: string;
}

export interface CloseSessionInput {
  closingBalance: number;
  notes?: string;
}

export const cashSessionsService = {
  async getOpen(): Promise<CashSession | null> {
    const response = await api.get<CashSession | null>('/cash-sessions/open');
    return response.data;
  },

  async open(data: OpenSessionInput): Promise<CashSession> {
    const response = await api.post<CashSession>('/cash-sessions', data);
    return response.data;
  },

  async close(id: number, data: CloseSessionInput): Promise<CashSession> {
    const response = await api.patch<CashSession>(`/cash-sessions/${id}/close`, data);
    return response.data;
  },
};
