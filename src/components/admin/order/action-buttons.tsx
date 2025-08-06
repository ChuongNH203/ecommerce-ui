import React, { useState } from 'react';
import { FaPlus, FaFileImport, FaPrint, FaClipboard, FaFileExcel, FaFilePdf, FaTrashAlt } from 'react-icons/fa';
import OrderAdd from './order-add'; 

const ActionButtonsOrder = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleCreateOrderForm = () => {
    setShowCreateForm(!showCreateForm); 
  };

  return (
    <div className="w-full border-b border-gray-300 pb-4 mb-4">
      <div className="flex flex-wrap gap-2.5 justify-start">
        <button

        >


        </button>

      </div>
      {showCreateForm && <OrderAdd />} 
    </div>
  );
};

export default ActionButtonsOrder;
