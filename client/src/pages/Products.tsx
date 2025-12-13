import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsService } from '../services/products.service';
import type { Product } from '../types';

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await productsService.getAll();
            setProducts(data);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.includes(searchTerm)
    );

    if (loading) {
        return <div className="text-center py-8">Carregando...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Produtos</h1>
                <Link
                    to="/products/new"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Novo Produto
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar produtos..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                />

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nome</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Código</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Preço</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stock</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{product.name}</td>
                                    <td className="px-4 py-3 font-mono text-sm">{product.barcode}</td>
                                    <td className="px-4 py-3 font-bold text-blue-600">
                                        R$ {product.price.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`${product.stock <= product.minStock ? 'text-red-600 font-bold' : ''}`}>
                                            {product.stock}
                                        </span>
                                        {product.stock <= product.minStock && (
                                            <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                                Baixo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${product.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {product.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredProducts.length === 0 && (
                        <p className="text-center py-8 text-gray-500">Nenhum produto encontrado</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
