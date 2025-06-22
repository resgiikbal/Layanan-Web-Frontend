import React, { useState, useEffect } from 'react';
import { formatRupiah } from '../utils/format'; // pastikan path sesuai struktur proyekmu
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setError('Error fetching your orders');
      console.error('Error', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Tertunda: 'bg-yellow-100 text-yellow-800',
      Diproses: 'bg-blue-100 text-blue-800',
      Dikirim: 'bg-purple-100 text-purple-800',
      Terkirim: 'bg-green-100 text-green-800',
      Dibatalkan: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  if (loading) return <div className='text-center py-8'>Proses...</div>;
  if (error) return <div className='text-center py-8 text-red-600'>{error}</div>;

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-8'>Pesanan</h1>

      {orders.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-600'>Anda belum melakukan pemesanan apa pun</p>
        </div>
      ) : (
        <div className='space-y-6'>
          {orders.map((order) => (
            <div key={order.id} className='bg-white rounded-lg shadow p-6'>
              <div className='flex justify-between items-start mb-4'>
                <h3 className='text-lg font-semibold'>Pesanan #{order.id}</h3>
                <p className='text-sm text-gray-500'>
                  Ditempatkan {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              {getStatusBadge(order.status)}

              <div className='flex justify-between items-center mt-4'>
                <div>
                 <p className='font-medium'>Jumlah Total: {formatRupiah(order.total_amount)}</p>
                  <p className='text-sm text-gray-600'>Barang: {formatRupiah(order.total_amount)}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className='text-blue-600 hover:text-blue-800'
                >
                    Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-bold'>Rincian Pesanan  #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className='text-gray-500 hover:text-gray-700 text-2xl'
              >
                ×
              </button>
            </div>

            <div className='space-y-4'>
              <div>
                <h3 className='font-semibold mb-2'>Informasi Pemesanan</h3>
                <div className='bg-gray-100 p-4 rounded-lg space-y-2'>
                  <p>Status: {getStatusBadge(selectedOrder.status)}</p>
                  <p>Tanggal: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                 <p>Total: {formatRupiah(selectedOrder.total_amount)}</p>
                </div>
              </div>

              <div>
                <h3 className='font-semibold mb-2'>Alamat pengiriman</h3>
                <div className='bg-gray-100 p-4 rounded-lg space-y-1'>
                  <p>{selectedOrder.shipping_address}</p>
                  <p>{selectedOrder.shipping_city}, {selectedOrder.shipping_postal_code}</p>
                  <p>Nomer Hp: {selectedOrder.shipping_phone}</p>
                </div>
              </div>
             <div className='bg-gray-100 rounded-lg divide-y'>
                    {selectedOrder.product_names?.split(',').map((product, index) => {
                        const category = selectedOrder.product_categories?.split(',')[index]?.trim();
                        return (
                        <div key={index} className='p-4'>
                            <p className='font-medium'>{product.trim()}</p>
                            {category && <p className='text-sm text-gray-600'>Kategori: {category}</p>}
                        </div>
                        );
                    })}

                </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
