import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/AuthContext";
import { formatRupiah } from '../utils/format';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // ⬅️ Ambil user login dari context
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError("Error loading product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login"); // ⬅️ Redirect jika belum login
      return;
    }

    addToCart(product); // ⬅️ Lanjutkan kalau sudah login
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  if (error || !product)
    return (
      <div className="text-center py-8 text-red-600">
        {error || "Product not found"}
      </div>
    );

  const images = Array.isArray(product.images)
    ? product.images
    : product.images?.split(",") || [];

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        {images.length > 0 ? (
          <img
            src={`http://localhost:5000/api/products/images/${images[selectedImage]}`}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            Tidak Ada Gambar Tersedia
          </div>
        )}

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative ${
                  selectedImage === index ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <img
                  src={`http://localhost:5000/api/products/images/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.category_name}</p>
       <p className="text-2xl font-bold text-blue-600 mb-4">
  {formatRupiah(product.price)}
</p>

        <p className="text-gray-700 mb-6">{product.description}</p>

        <div className="mb-6">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              product.stock > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.stock > 0
              ? `Ada Stok (${product.stock})`
              : "Stok Habis"}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? "Tambahkan ke Keranjang" : "Stok Habis"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
