/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { productsService } from '../services/products.service';
import { salesService } from '../services/sales.service';
import type { Product, CartItem } from '../types';

const PDV: React.FC = () => {
    const [barcode, setBarcode] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [showPayment, setShowPayment] = useState(false);
    const barcodeInputRef = useRef<HTMLInputElement>(null);
    const { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();

    const loadProducts = async () => {
        try {
            const data = await productsService.getAll();
            setProducts(data.filter(p => p.isActive));
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    };

    useEffect(() => {
        void loadProducts();
    }, []);

    const handleBarcodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!barcode.trim()) return;

        try {
            const product = await productsService.getByBarcode(barcode);
            addItem(product);
            setBarcode('');
            barcodeInputRef.current?.focus();
        } catch {
            alert('Produto nao encontrado!');
            setBarcode('');
        }
    };

    const handleProductClick = (product: Product) => {
        addItem(product);
        barcodeInputRef.current?.focus();
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.includes(searchTerm)
    );

    const handleFinalizeSale = () => {
        if (items.length === 0) {
            alert('Carrinho vazio!');
            return;
        }
        setShowPayment(true);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
            {/* Left: Product Search */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 overflow-hidden flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Buscar Produtos</h2>

                {/* Barcode Scanner */}
                <form onSubmit={handleBarcodeSubmit} className="mb-4">
                    <input
                        ref={barcodeInputRef}
                        type="text"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        placeholder="Código de barras (F2)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        autoFocus
                    />
                </form>

                {/* Search */}
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto flex-1">
                    {filteredProducts.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            className="bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg p-3 text-left transition"
                        >
                            <h3 className="font-medium text-sm mb-1 truncate">{product.name}</h3>
                            <p className="text-blue-600 font-bold">R$ {product.price.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Cart */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Carrinho ({itemCount})</h2>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                    {items.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Carrinho vazio</p>
                    ) : (
                        items.map((item) => (
                            <div key={item.product.id} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-sm flex-1">{item.product.name}</h4>
                                    <button
                                        onClick={() => removeItem(item.product.id)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="font-bold text-blue-600">
                                        R$ {(item.product.price * item.quantity - item.discount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Total */}
                <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold">Total:</span>
                        <span className="text-3xl font-bold text-blue-600">
                            R$ {total.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                    <button
                        onClick={handleFinalizeSale}
                        disabled={items.length === 0}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Finalizar Venda (F12)
                    </button>
                    <button
                        onClick={clearCart}
                        disabled={items.length === 0}
                        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Limpar Carrinho
                    </button>
                </div>
            </div>

            {/* Payment Modal */}
            {showPayment && (
                <PaymentModal
                    total={total}
                    items={items}
                    onClose={() => setShowPayment(false)}
                    onSuccess={() => {
                        clearCart();
                        setShowPayment(false);
                        alert('Venda realizada com sucesso!');
                    }}
                />
            )}
        </div>
    );
};

// Payment Modal Component
const PaymentModal: React.FC<{
    total: number;
    items: CartItem[];
    onClose: () => void;
    onSuccess: () => void;
}> = ({ total, items, onClose, onSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'PIX' | 'TRANSFER'>('CASH');
    const [amountPaid, setAmountPaid] = useState(total.toString());
    const [loading, setLoading] = useState(false);

    const change = parseFloat(amountPaid) - total;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await salesService.create({
                items: items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    discount: item.discount,
                })),
                payments: [{
                    method: paymentMethod,
                    amount: total,
                }],
            });
            onSuccess();
        } catch (error: unknown) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            alert(message || 'Erro ao processar venda');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">Pagamento</h2>

                <div className="mb-6">
                    <p className="text-gray-600 mb-2">Total a Pagar:</p>
                    <p className="text-4xl font-bold text-blue-600">R$ {total.toFixed(2)}</p>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Forma de Pagamento</label>
                    <select
                        value={paymentMethod}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setPaymentMethod(e.target.value as typeof paymentMethod)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="CASH">Dinheiro</option>
                        <option value="CARD">Cartão</option>
                        <option value="PIX">PIX</option>
                        <option value="TRANSFER">Transferência</option>
                    </select>
                </div>

                {paymentMethod === 'CASH' && (
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Valor Recebido</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        {change >= 0 && (
                            <p className="mt-2 text-green-600 font-bold">
                                Troco: R$ {change.toFixed(2)}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || (paymentMethod === 'CASH' && change < 0)}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processando...' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PDV;
