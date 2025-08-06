import React from 'react';
import { useNavigate } from 'react-router-dom';
interface ActionButtonProps {
  onOpenReview: () => void; 
}
const ActionButton: React.FC<ActionButtonProps> = ({ onOpenReview }) => {
  const navigate = useNavigate(); 

  const handleBuyAgain = () => {
    navigate('/cart-list');
  };

  return (
    <div className="bg-yellow-50 p-2 shadow-sm rounded-lg mb-4">
        <div className="flex p-2 justify-end ">
            <button className="bg-orange-500 text-white px-6 py-2 rounded-md mr-2" onClick={handleBuyAgain}>Mua Lại</button>
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md" onClick={onOpenReview}>Đánh giá</button>
        </div>
    </div>
  );
};

export default ActionButton;
