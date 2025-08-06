import React from 'react';
import { Link } from 'react-router-dom';

export const PromotionalBanner: React.FC = () => {
  return (
    <div className="p-3 bg-orange-50 border-b border-orange-200 flex justify-between items-center">
      <span className="flex items-center text-red-500 text-xs">

      </span>
      <Link to="/product" className="text-red-500 text-sm hover:underline">
        Thêm &gt;
      </Link>
    </div>
  );
};