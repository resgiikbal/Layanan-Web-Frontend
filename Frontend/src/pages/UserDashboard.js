import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatRupiah } from '../utils/format';
const UserDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching orders');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Selamat Datang, {user?.first_name}!</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Informasi Pribadi</h2>
          <p className="text-gray-600">Email: {user?.email}</p>
          <p className="text-gray-600">Nama: {user?.first_name} {user?.last_name}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Pesanan Terbaru</h2>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border-b pb-4">
                <p>Order #{order.id}</p>
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-600">Total: {formatRupiah(order.total_amount)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Tidak Ada Pesanan</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;