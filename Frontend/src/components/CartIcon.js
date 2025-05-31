import React, { use } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cartContext';

const CartIcon = () => {
    const {cart} = useCart();
  return (
    <Link to="/cart" className='relative'>
      <div className='p-2'>
      <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="currentColor"
  className="w-6 h-6"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M2.25 3h1.5l1.5 13.5h13.5l1.5-9H6.75M9 21a.75.75 0 100-1.5.75.75 0 000 1.5zm9 0a.75.75 0 100-1.5.75.75 0 000 1.5z"
  />
</svg>

        {cart.totalItems > 0 && (
    <span className='absolute -top-1 right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs'>
        {cart.totalItems}
    </span>
)}

      </div>
    </Link>
  );
};

export default CartIcon;
