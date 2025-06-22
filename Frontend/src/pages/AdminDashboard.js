import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { formatRupiah } from '../utils/format';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0,
    orderStats: {
      tertunda: 0,
      diproses: 0,
      dikirim: 0,
      terkirim: 0,
      dibatalkan: 0
    }
  });

  useEffect(() => {
    fetchStats()
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Admin Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-gray-600 mb-2'>Total Produk</h3>
          <p className='text-2xl font-bold'>{stats.products}</p>
        </div>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-gray-600 mb-2'>Total User</h3>
          <p className='text-2xl font-bold'>{stats.users}</p>
        </div>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-gray-600 mb-2'>Total Pesanan</h3>
          <p className='text-2xl font-bold'>{stats.orders}</p>
        </div>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-gray-600 mb-2'>Total Pendapatan</h3>
          <p className='text-2xl font-bold'>{formatRupiah(stats.revenue || 0)}</p>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
        <h2 className='text-xl font-bold mb-4'>Statistik Pesanan</h2>
        <div className='grid grid-cols-5 gap-4'>
          <div className='bg-yellow-200 p-4 rounded-lg'>
            <h3 className='font-semibold mb-2'>Tertunda</h3>
            <p className='text-xl'>{stats.orderStats.tertunda}</p>
          </div>
          <div className='bg-blue-200 p-4 rounded-lg'>
            <h3 className='font-semibold mb-2'>Proses</h3>
            <p className='text-xl'>{stats.orderStats.diproses}</p>
          </div>
          <div className='bg-fuchsia-200 p-4 rounded-lg'>
            <h3 className='font-semibold mb-2'>Dikirim</h3>
            <p className='text-xl'>{stats.orderStats.dikirim}</p>
          </div>
          <div className='bg-green-200 p-4 rounded-lg'>
            <h3 className='font-semibold mb-2'>Terkirim</h3>
            <p className='text-xl'>{stats.orderStats.terkirim}</p>
          </div>
          <div className='bg-red-200 p-4 rounded-lg'>
            <h3 className='font-semibold mb-2'>Dibatalkan</h3>
            <p className='text-xl'>{stats.orderStats.dibatalkan}</p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Link to='/admin/products' className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
          <h2 className='text-xl font-bold mb-2'>Kelola Produk</h2>
          <p className='text-gray-600'>Tambah, edit atau hapus produk</p>
        </Link>
        <Link to='/admin/categories' className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
          <h2 className='text-xl font-bold mb-2'>Mengelola Kategori</h2>
          <p className='text-gray-600'>Mengatur Produk Kategori</p>
        </Link>
        <Link to='/admin/users' className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
          <h2 className='text-xl font-bold mb-2'>Mengelola User</h2>
          <p className='text-gray-600'>Melihat dan mengelola akun pengguna</p>
        </Link>
        <Link to='/admin/orders' className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
          <h2 className='text-xl font-bold mb-2'>Mengelola Pesanan</h2>
          <p className='text-gray-600'>Lacak dan perbarui status pesanan</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
