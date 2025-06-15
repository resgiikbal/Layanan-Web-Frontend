import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/cartContext'
import { useAuth } from '../context/AuthContext'

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user ? `${user.first_name} ${user.last_name}` : '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cart.items,
        totalAmount: cart.totalAmount,
        shippingDetails: formData,
        userID: user?.id
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      clearCart();
      navigate('/order-success'); // typo diperbaiki dari 'order-succes'
    } catch (error) {
      setError('Error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
          <h2 className='text-2xl font-bold mb-6'>Rincian Pengiriman</h2>
          {error && <div className='text-red-600'>{error}</div>}

          <form className='space-y-4' onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>Nama lengkap</label>
              <input
                type='text'
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
                required
                className='mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500'
              />
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>Email</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                className='mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500'
              />
            </div>

            {/* Address */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>Alamat</label>
              <input
                type='text'
                name='address'
                value={formData.address}
                onChange={handleChange}
                required
                className='mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500'
              />
            </div>

            {/* City and Postal Code */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Kota</label>
                <input
                  type='text'
                  name='city'
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Kode Pos</label>
                <input
                  type='text'
                  name='postalCode'
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>Telepon</label>
              <input
                type='text'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                required
                className='mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-blue-500 focus:ring-blue-500'
              />
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300'
            >
              {loading ? 'Processing...' : 'Pesan Sekarang'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className='bg-gray-50 p-6 rounded-lg shadow'>
            <h2 className='text-xl font-bold mb-4'>Ringkasan Pesanan</h2>
            {cart.items.map((item) => (
              <div key={item.id} className='flex justify-between py-2 border-b'>
                <div>
                  <p className='font-medium'>{item.name}</p>
                  <p className='text-sm text-gray-600'>Jumlah: {item.quantity}</p>
                </div>
                <p>Rs {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <div className='mt-4 space-y-2'>
              <div className='flex justify-between'>
                <span>Jumlah keseluruhan</span>
                <span>Rp {cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <span>Pengiriman</span>
                <span>Bebas</span>
              </div>
              <div className='flex justify-between font-bold text-lg pt-2 border-t'>
                <span>Total</span>
                <span>Rp {cart.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
