import React, { useState } from 'react';
import { FiHelpCircle } from 'react-icons/fi'; 
import axiosInstanceL from '../../../../../api/api-login/axiosInstance-login';


interface VoucherInputProps {
  onClose: () => void; 
  onVoucherApplied: (voucherCode: string, discountAmount: number) => void; 
}

const VoucherInput: React.FC<VoucherInputProps> = ({ onClose, onVoucherApplied }) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const [validVoucher, setValidVoucher] = useState(false); 
  const [voucherDiscount, setVoucherDiscount] = useState(0); 
  const [confirmationMessage, setConfirmationMessage] = useState(''); 


  const handleVoucherCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };


  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      setErrorMessage('Vui lòng nhập mã voucher');
      return;
    }

    try {
      const response = await axiosInstanceL.get(`/api/vouchers/${voucherCode}`);

      if (response.data) {
        // Kiểm tra nếu voucher có usage_limit >= 1
        const voucher = response.data;
        if (voucher.is_active && voucher.usage_limit > 0) {
          setVoucherDiscount(voucher.discount_amount || 0);
          setValidVoucher(true); 
          setErrorMessage(''); 
          setConfirmationMessage(`Voucher hợp lệ, bạn sẽ được giảm ₫${voucher.discount_amount.toLocaleString()}! Bạn có muốn sử dụng voucher này?`);
        } else {
          // Nếu voucher hết hạn sử dụng hoặc usage_limit = 0
          setErrorMessage('Voucher không hợp lệ, hết lượt sử dụng hoặc đã hết hạn');
          setVoucherDiscount(0);
          setValidVoucher(false);
        }
      }
    } catch (error) {
      setErrorMessage('Voucher không hợp lệ hoặc đã hết hạn');
      setVoucherDiscount(0);
      setValidVoucher(false); 
    }
  };

  const handleConfirmVoucher = () => {
    if (validVoucher) {
      onVoucherApplied(voucherCode, voucherDiscount); 
      onClose(); 
    }
  };

  return (
    <div className="p-4 bg-white">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Nhập Voucher</h2>
        <button
          className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 -mr-1"
          onClick={onClose}
        >
          <span className="mr-1 text-base">Đóng</span>
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="voucherCode" className="text-gray-600 whitespace-nowrap text-sm">Mã Voucher</label>
        <input
          type="text"
          id="voucherCode"
          placeholder="Mã Shopee Voucher"
          value={voucherCode}
          onChange={handleVoucherCodeChange}
          className="flex-grow p-2 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        />
        <button
          onClick={handleApplyVoucher} 
          className="px-4 py-2 bg-gray-200 text-gray-500 rounded-md font-medium text-sm"
        >
          ÁP DỤNG
        </button>
      </div>


      {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

      {validVoucher && (
        <div className="mt-4">
          <p className="text-green-500 font-medium">{confirmationMessage}</p>
          <button
            onClick={handleConfirmVoucher}
            className="px-4 py-2 bg-green-600 text-white rounded-md font-medium text-sm mt-2"
          >
            Áp dụng voucher
          </button>
        </div>
      )}
    </div>
  );
};

export default VoucherInput;
