import React, { useState, useEffect } from 'react';
import { formatRupiah } from '../utils/format';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState('all');
  const [filteredPaymentProof, setFilteredPaymentProof] = useState('all');
  const [unreadPaymentProofs, setUnreadPaymentProofs] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
      
      // Hitung jumlah bukti pembayaran yang belum dilihat
      const unreadCount = data.filter(order => 
        order.payment_proof && !order.payment_proof_viewed
      ).length;
      setUnreadPaymentProofs(unreadCount);
    } catch (error) {
      setError('Error fetching orders');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewPaymentProof = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/payment-proof`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 404) {
          alert('Bukti pembayaran belum diunggah oleh pembeli');
        } else {
          throw new Error('Terjadi kesalahan saat mengambil bukti pembayaran');
        }
        return;
      }

      if (!data.payment_proof) {
        alert('Bukti pembayaran belum diunggah oleh pembeli');
        return;
      }

      // Tandai bukti pembayaran sudah dilihat
      await fetch(`http://localhost:5000/api/admin/orders/${orderId}/mark-payment-proof-viewed`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Refresh data pesanan untuk memperbarui notifikasi
      fetchOrders();

      window.open(`http://localhost:5000/uploads/payment-proofs/${data.payment_proof}`, '_blank');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Terjadi kesalahan saat mengambil bukti pembayaran');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // Update status pesanan
      const statusResponse = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
  
      if (!statusResponse.ok) {
        throw new Error('Failed to update status');
      }
  
      // Jika status diubah menjadi Diproses atau Dibatalkan, tandai bukti pembayaran sebagai sudah dilihat
      if (newStatus === 'Diproses' || newStatus === 'Dibatalkan') {
        const markViewedResponse = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/mark-payment-proof-viewed`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!markViewedResponse.ok) {
          console.error('Gagal menandai bukti pembayaran sebagai sudah dilihat');
        }
      }
  
      // Refresh data pesanan
      fetchOrders();
    } catch (error) {
      setError('Error updating order status');
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Tertunda: 'bg-yellow-100 text-yellow-800',
      Diproses: 'bg-blue-100 text-blue-800',
      Dikirim: 'bg-purple-100 text-purple-800',
      Terkirim: 'bg-green-100 text-green-800',
      Dibatalkan: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter(order => {
        // Filter berdasarkan status
        const statusMatch = filteredStatus === 'all' || order.status === filteredStatus;
        
        // Filter berdasarkan bukti pembayaran
        const paymentProofMatch = 
          filteredPaymentProof === 'all' ||
          (filteredPaymentProof === 'uploaded' && order.payment_proof) ||
          (filteredPaymentProof === 'not_uploaded' && !order.payment_proof);
        
        return statusMatch && paymentProofMatch;
      })
    : [];

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Manajemen Pesanan</h1>
        {unreadPaymentProofs > 0 && (
          <div className='bg-red-500 text-white px-3 py-1 rounded-full text-sm mr-4'>
            {unreadPaymentProofs} bukti pembayaran baru
          </div>
        )}
        <div className='flex items-center gap-4'>
          {/* Filter Status */}
          <div className='flex items-center gap-2'>
            <label className='text-sm text-gray-600'>Status Pesanan:</label>
            <select
              value={filteredStatus}
              onChange={(e) => setFilteredStatus(e.target.value)}
              className='border rounded-md px-3 py-1'
            >
              <option value="all">Semua Status</option>
              <option value="Tertunda">Tertunda</option>
              <option value="Diproses">Diproses</option>
              <option value="Dikirim">Dikirim</option>
              <option value="Terkirim">Terkirim</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
          </div>

          {/* Filter Bukti Pembayaran */}
          <div className='flex items-center gap-2'>
            <label className='text-sm text-gray-600'>Bukti Pembayaran:</label>
            <select
              value={filteredPaymentProof}
              onChange={(e) => setFilteredPaymentProof(e.target.value)}
              className='border rounded-md px-3 py-1'
            >
              <option value="all">Semua</option>
              <option value="uploaded">Sudah Upload</option>
              <option value="not_uploaded">Belum Upload</option>
            </select>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Id Pesanan</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Pelanggan</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Total</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Tanggal</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Aksi</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredOrders.map((order) => (
              <tr key={order.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap'>#{order.id}</td>
                <td className='px-6 py-4'>
                  <div className='text-sm font-medium text-gray-900'>
                    {order.first_name} {order.last_name}
                  </div>
                  <div className='text-sm text-gray-500'>{order.email}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
               <td className='px-6 py-4 whitespace-nowrap'>{formatRupiah(order.total_amount)}</td>

                <td className='px-6 py-4 whitespace-nowrap text-xs text-gray-500'>
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm'>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className='text-blue-600 hover:text-blue-900 mr-4'
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => viewPaymentProof(order.id)}
                    className='text-green-600 hover:text-green-900 mr-4 relative'
                  >
                    Lihat Bukti
                    {order.payment_proof && !order.payment_proof_viewed && (
                      <span className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs'>
                        1
                      </span>
                    )}
                  </button>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className='border rounded px-2 py-1'
                  >
                  <option value="Tertunda">Tertunda</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Dikirim">Dikirim</option>
                    <option value="Terkirim">Terkirim</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>Rincian Pesanan #{selectedOrder.id}</h2>
              <button
                className='text-gray-500 hover:text-gray-700'
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className='space-y-4'>
              <div>
                <h3 className='font-semibold mb-2'>Informasi Pelanggan</h3>
                <p>Nama: {selectedOrder.first_name} {selectedOrder.last_name}</p>
                <p>Email: {selectedOrder.email}</p>
              </div>

              <div>
                <h3 className='font-semibold mb-2'>Informasi Pengiriman</h3>
                <p>Alamat: {selectedOrder.shipping_address}</p>
                <p>Kota: {selectedOrder.shipping_city}</p>
                <p>Kode Pos: {selectedOrder.shipping_postal_code}</p>
                <p>Nomer Hp: {selectedOrder.shipping_phone}</p>
              </div>

              <div>
                <h3 className='font-semibold mb-2'>Ringkasan Pesanan</h3>
                <p>
                  Status:{' '}
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </p>
                <p>Total Pesanan: {selectedOrder.total_amount}</p>
                <p>Tanggal Pemesanan: {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
              </div>

              <div>
                <h3 className='font-semibold mb-2'>Produk</h3>
                <p>{selectedOrder.products}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
