import React from 'react'
import { Link } from 'react-router-dom'
const OrderSucces = () => {
  return (
    <div>
        <div className='container mx-auto px-4 py-16'>
            <div>
            <svg className="h-12-w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="MS 13L4 4L19 7" />
            </svg>
            </div>
            <h1 className='text-3xl font-bold mb-4'>Pesanan Berhasil Dilakukan</h1>
            <p className='text-gray-600 mb-8'>
            Terima kasih atas pembelian Anda. Kami akan mengirimkan email berisi detail pesanan Anda.
            </p>
            <Link to='/products' className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700'>
            Lanjutkan Belanja
            </Link>
        </div>
      
    </div>
  )
}

export default OrderSucces
