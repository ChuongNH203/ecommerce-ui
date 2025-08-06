import React, { useEffect, useState } from 'react';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';  // Import axiosInstanceL

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ isOpen, onClose }) => {
  const [cancelOrders, setCancelOrders] = useState<any[]>([]);  // Lưu trữ các đơn hàng chờ hủy

  useEffect(() => {
    if (isOpen) {
      fetchCancelRequests();
    }
  }, [isOpen]);

  const fetchCancelRequests = async () => {
    try {
      const response = await axiosInstanceL.get('/api/orders/cancellation-requests');  // Lấy danh sách đơn hàng chờ hủy
      setCancelOrders(response.data.orders);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách yêu cầu hủy đơn hàng:', error);
    }
  };

  const handleApproveCancellation = async (orderId: number) => {
    try {
      await axiosInstanceL.post(`/api/orders/approve-cancellation/${orderId}`);
      fetchCancelRequests();
        window.location.reload();
    } catch (error) {
      console.error('Lỗi khi xác nhận hủy đơn hàng:', error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${!isOpen && 'hidden'}`}>
      <div className="w-1/2 mx-auto mt-20 bg-white p-5 rounded-md">
        <h2 className="text-xl font-semibold mb-4">Danh sách đơn hàng chờ hủy</h2>
        <button onClick={handleCancel} className="mb-4 text-red-500">Đóng</button>
        <ul>
          {cancelOrders.length === 0 ? (
            <p>Không có đơn hàng chờ hủy.</p>
          ) : (
            cancelOrders.map((order) => (
              <li key={order.id} className="flex justify-between items-center border-b py-2">
                <span>{order.User.full_name} - Đơn hàng #{order.id}</span>
                <button
                  onClick={() => handleApproveCancellation(order.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded-md text-sm"
                >
                  Xác nhận hủy
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default CancelOrderModal;
