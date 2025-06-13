import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Gagal mengambil data kategori');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Gagal mengambil data kategori');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ Perbaikan typo
    setLoading(true);
    setError('');

    try {
      const productformData = new FormData();

      Object.keys(formData).forEach(key => {
        productformData.append(key, formData[key]);
      });

      images.forEach(image => {
        productformData.append('images', image); // ✅ Menggunakan `image`, bukan `images`
      });

      const response = await fetch('http://localhost:5000/api/admin/products', { // ✅ http bukan https untuk localhost
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: productformData
      });

      if (!response.ok) {
        throw new Error('Failed to create product'); // ✅ Perbaikan penggunaan Error
      }

      navigate('/admin/products');
    } catch (error) {
      setError(error.message); // ✅ Perbaikan error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductForm 
      formData={formData}
      categories={categories}
      onSubmit={handleSubmit}
      onChange={(e) => setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }))}
      onImageChange={(e) => setImages(Array.from(e.target.files))}
      loading={loading}
      error={error}
      submitText="Create Product"
      onCancel={() => navigate('/admin/products')}
    />
  );
};

export default AdminProductCreate;
