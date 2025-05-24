import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className='bg-white shadow-md'>
            <div className='container mx-auto px-4'>
                <div className='flex justify-between items-center h-16'>
                    <Link to="/" className='text-2xl font-bold text-blue-600'>
                        Fashion Store
                    </Link>

                    <div className='flex items-center space-x-8'>
                        {/* Public Links */}
                        {!isAdmin && (
                            <Link to="/products" className='text-gray-600 hover:text-blue-600'>
                                Produk
                            </Link>
                        )}
                        
                        {user ? (
                            <div className='flex items-center space-x-6'>
                                {isAdmin && (
                                    <>
                                        <Link to='/admin' className='text-gray-600 hover:text-blue-600'>
                                            AdminDashboard
                                        </Link>
                                        <Link to='/admin/products' className='text-gray-600 hover:text-blue-600'>
                                            Produk
                                        </Link>
                                    </>
                                )}
                                
                                <button onClick={handleLogout} className='text-gray-600 hover:text-blue-600'>
                                    Keluar
                                </button>
                            </div>
                        ) : (
                            <div className='flex items-center space-x-4'>
                                <Link to='/login' className='text-gray-600 hover:text-blue-600'>
                                    Masuk
                                </Link>
                                <Link to='/register' className='text-gray-600 hover:text-blue-600'>
                                    Mendaftar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
