import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                Bem-vindo, {user?.name}!
            </h1>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link
                    to="/pdv"
                    className="bg-blue-600 text-white p-6 rounded-lg shadow-lg hover:bg-blue-700 transition"
                >
                    <div className="text-4xl mb-2">🛒</div>
                    <h3 className="text-xl font-bold">Nova Venda</h3>
                    <p className="text-sm opacity-90">Iniciar PDV</p>
                </Link>

                <Link
                    to="/products/new"
                    className="bg-green-600 text-white p-6 rounded-lg shadow-lg hover:bg-green-700 transition"
                >
                    <div className="text-4xl mb-2">📦</div>
                    <h3 className="text-xl font-bold">Novo Produto</h3>
                    <p className="text-sm opacity-90">Cadastro rápido</p>
                </Link>

                <Link
                    to="/cash"
                    className="bg-yellow-600 text-white p-6 rounded-lg shadow-lg hover:bg-yellow-700 transition"
                >
                    <div className="text-4xl mb-2">💰</div>
                    <h3 className="text-xl font-bold">Caixa</h3>
                    <p className="text-sm opacity-90">Abrir/Fechar</p>
                </Link>

                <Link
                    to="/reports"
                    className="bg-purple-600 text-white p-6 rounded-lg shadow-lg hover:bg-purple-700 transition"
                >
                    <div className="text-4xl mb-2">📊</div>
                    <h3 className="text-xl font-bold">Relatórios</h3>
                    <p className="text-sm opacity-90">Vendas e Stock</p>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Vendas Hoje</h3>
                    <p className="text-3xl font-bold text-blue-600">R$ 0,00</p>
                    <p className="text-sm text-gray-500 mt-1">0 transações</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Produtos</h3>
                    <p className="text-3xl font-bold text-green-600">0</p>
                    <p className="text-sm text-gray-500 mt-1">0 com stock baixo</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Caixa</h3>
                    <p className="text-3xl font-bold text-yellow-600">Fechado</p>
                    <p className="text-sm text-gray-500 mt-1">Abra para iniciar vendas</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
