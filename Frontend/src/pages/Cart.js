import React from 'react';
import { useCart } from '../context/cartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className='container mx-auto px-4 py-8'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold mb-4'>Keranjang Anda kosong</h2>
                    <Link
                        to="/products"
                        className='text-blue-600 hover:text-blue-700'
                    >
                        Lanjutkan Belanja
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold mb-8'>Keranjang Belanja</h1>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                <div className='lg:col-span-2'>
                    {cart.items.map(item => (
                        <div
                            key={item.id}
                            className='flex items-center gap-4 border-b py-4'
                        >
                            <img
                                src={`http://localhost:5000/api/products/images/${item.image}`}
                                alt=''
                                className='w-20 h-20 object-cover'
                            />

                            <div className='flex-1'>
                                <h3 className='font-semibold'>{item.name}</h3>
                                <p className='text-gray-600'>Rp {item.price}</p>

                                <div className='flex items-center gap-4 mt-2'>
                                    <select
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                        className='border rounded p-1'
                                    >
                                        {[...Array(10)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className='text-red-600 hover:text-red-700'
                                    >
                                        Menghapus
                                    </button>
                                </div>
                            </div>

                            <div className='text-right'>
                                <p className='font-semibold'>
                                    Rp {(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}

                    <div className='mt-4'>
                        <button
                            onClick={clearCart}
                            className='text-red-600 hover:text-red-700'
                        >
                            Kosongkan Keranjang
                        </button>
                    </div>
                </div>

                <div className='lg:col-span-1'>
                    <div className='bg-gray-50 p-6 rounded-lg'>
                        <h2 className='text-xl font-bold mb-4'>Ringkasan Pesanan</h2>

                        <div className='space-y-2 mb-4'>
                            <div className='flex justify-between'>
                                <span>Jumlah keseluruhan ({cart.totalItems} items)</span>
                                <span>Rp {cart.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span>Pengiriman</span>
                                <span>Bebas</span>
                            </div>
                        </div>

                        <div className='border-t pt-4'>
                            <div className='flex justify-between font-bold'>
                                <span>Total</span>
                                <span>Rp {cart.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <Link
                            to="/checkout"
                            className='w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 inline-block text-center'
                        >
                            Lanjutkan ke Pembayaran
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
