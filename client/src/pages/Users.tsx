/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import type { Role, User } from '../types';
import { usersService, type CreateUserInput } from '../services/users.service';

interface FormState {
  name: string;
  username: string;
  password: string;
  roleIds: number[];
  isActive: boolean;
}

const defaultForm: FormState = {
  name: '',
  username: '',
  password: '',
  roleIds: [],
  isActive: true,
};

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersResp, rolesResp] = await Promise.all([
        usersService.getAll(),
        usersService.getRoles(),
      ]);
      setUsers(usersResp);
      setRoles(rolesResp);
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Erro ao carregar utilizadores');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormState, value: string | boolean | number[]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoleToggle = (roleId: number) => {
    setForm((prev) => {
      const hasRole = prev.roleIds.includes(roleId);
      const roleIds = hasRole ? prev.roleIds.filter((id) => id !== roleId) : [...prev.roleIds, roleId];
      return { ...prev, roleIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload: CreateUserInput = {
      name: form.name.trim(),
      username: form.username.trim(),
      password: form.password,
      roleIds: form.roleIds,
      isActive: form.isActive,
    };
    try {
      await usersService.create(payload);
      setForm(defaultForm);
      await loadData();
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Erro ao criar utilizador');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Utilizadores</h1>
          {loading && <span className="text-sm text-gray-500">A carregar...</span>}
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-2 text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Username</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Perfis</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3 font-mono text-sm">{u.username}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {u.roles.map((r) => r.name).join(', ')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {u.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={4}>
                    Nenhum utilizador encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Novo utilizador</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Perfis</label>
            <div className="space-y-2 rounded border border-gray-200 p-3">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.roleIds.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                  />
                  <span className="font-medium">{role.name}</span>
                  <span className="text-gray-500 text-xs">{role.description}</span>
                </label>
              ))}
              {roles.length === 0 && <p className="text-sm text-gray-500">Nenhum perfil disponível</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
            />
            <label htmlFor="isActive" className="text-sm">
              Ativo
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? 'A gravar...' : 'Criar utilizador'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Users;
