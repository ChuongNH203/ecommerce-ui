import React, { useState, useEffect } from 'react';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login'; // Import axiosInstanceL
import Pagination from './pagination';
import OrderList from './order-list';
import ActionButtonsOrder from './action-buttons';
import CancelOrderModal from './cancel-order-modal';

const OrderIndex = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [cancelRequestsCount, setCancelRequestsCount] = useState<number>(0);  // Track cancel requests
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Fetch the count of orders with cancellation requests
    const fetchCancelRequests = async () => {
      try {
        const response = await axiosInstanceL.get('/api/orders/cancellation-requests');
    console.log('Response data:', response.data);

    // Lọc các đơn hàng có cancellation_requested là true
    const cancelRequests = response.data.orders.filter((order: any) => order.cancellation_requested);

    // Cập nhật số lượng đơn hàng yêu cầu hủy
    setCancelRequestsCount(cancelRequests.length);
      } catch (error) {
        console.error('Error fetching cancel requests:', error);
      }
    };

    fetchCancelRequests();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleCancelOrderClick = () => {
    // Open the modal when the button is clicked
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);  // Close the modal
  };
  return (
    <div className="flex-1 p-5">
      <div className="bg-white p-5 rounded-md shadow-sm border">
        <ActionButtonsOrder />
        <Pagination
          onSearch={handleSearch}
          onStatusChange={handleStatusChange}
          onCancelOrderClick={handleCancelOrderClick}
          cancelRequestsCount={cancelRequestsCount}
        />
        <OrderList searchQuery={searchQuery} selectedStatus={selectedStatus} />
      </div>
      <CancelOrderModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default OrderIndex;
