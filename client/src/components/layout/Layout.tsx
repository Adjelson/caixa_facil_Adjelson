import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-2xl font-bold">Caixa Fácil</h1>
                            <div className="hidden md:flex space-x-4">
                                <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">
                                    Dashboard
                                </Link>
                                <Link to="/pdv" className="hover:bg-blue-700 px-3 py-2 rounded">
                                    PDV
                                </Link>
                                <Link to="/products" className="hover:bg-blue-700 px-3 py-2 rounded">
                                    Produtos
                                </Link>
                                <Link to="/users" className="hover:bg-blue-700 px-3 py-2 rounded">
                                    Utilizadores
                                </Link>
                                <Link to="/cash" className="hover:bg-blue-700 px-3 py-2 rounded">
                                    Caixa
                                </Link>
                                <Link to="/reports" className="hover:bg-blue-700 px-3 py-2 rounded">
                                    Relatórios
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm">{user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
