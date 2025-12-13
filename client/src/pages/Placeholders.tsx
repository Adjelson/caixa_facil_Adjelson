/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { cashSessionsService } from '../services/cashSessions.service';
import type { CashSession } from '../types';

export const Cash: React.FC = () => {
  const [openSession, setOpenSession] = useState<CashSession | null>(null);
  const [openingBalance, setOpeningBalance] = useState('0');
  const [closingBalance, setClosingBalance] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadSession();
  }, []);

  const loadSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await cashSessionsService.getOpen();
      setOpenSession(session);
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Erro ao carregar sessão de caixa');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const session = await cashSessionsService.open({
        openingBalance: Number(openingBalance) || 0,
        notes: notes || undefined,
      });
      setOpenSession(session);
      setNotes('');
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Erro ao abrir caixa');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openSession) return;
    setSaving(true);
    setError(null);
    try {
      const session = await cashSessionsService.close(openSession.id, {
        closingBalance: Number(closingBalance) || 0,
        notes: notes || undefined,
      });
      setOpenSession(session);
      setClosingBalance('');
      setNotes('');
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Erro ao fechar caixa');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Gestão de Caixa</h1>
      <p className="text-gray-600 mb-4">Abrir/fechar sessão de caixa e acompanhar saldos.</p>

      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-2 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">A carregar...</p>
      ) : openSession && openSession.status === 'OPEN' ? (
        <div className="space-y-4">
          <div className="rounded border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-700">Sessão aberta</p>
            <p className="text-2xl font-bold text-green-700">#{openSession.id}</p>
            <p className="text-gray-700">Abertura: R$ {Number(openSession.openingBalance).toFixed(2)}</p>
            <p className="text-gray-500 text-sm">
              Início: {new Date(openSession.openedAt).toLocaleString()}
            </p>
            {openSession.notes && <p className="text-gray-600 text-sm mt-1">Notas: {openSession.notes}</p>}
          </div>

          <form className="space-y-3" onSubmit={handleClose}>
            <div>
              <label className="block text-sm font-medium mb-1">Saldo de fecho</label>
              <input
                type="number"
                step="0.01"
                value={closingBalance}
                onChange={(e) => setClosingBalance(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notas (opcional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {saving ? 'A fechar...' : 'Fechar caixa'}
            </button>
          </form>
        </div>
      ) : (
        <form className="space-y-3" onSubmit={handleOpen}>
          <div>
            <label className="block text-sm font-medium mb-1">Saldo de abertura</label>
            <input
              type="number"
              step="0.01"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notas (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? 'A abrir...' : 'Abrir caixa'}
          </button>
        </form>
      )}
    </div>
  );
};

export const Reports: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h1 className="text-3xl font-bold mb-4">Relatórios</h1>
      <p className="text-gray-600 mb-6">Vendas, stock e movimentações financeiras.</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Funcionalidade em desenvolvimento</p>
      </div>
    </div>
  );
};

export const ProductForm: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h1 className="text-3xl font-bold mb-4">Novo Produto</h1>
      <p className="text-gray-600 mb-6">Formulário de cadastro de produtos.</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Funcionalidade em desenvolvimento</p>
      </div>
    </div>
  );
};
