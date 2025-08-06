import React, { useEffect, useState, useRef } from 'react';
import OrderRow from './order-row';
import { Order } from '../../../types/order';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

const LIMIT = 10;

const statusMap: Record<string, string> = {
  Pending: 'Đang chờ xử lý',
  Processing: 'Đang xử lý',
  Shipping: 'Đang vận chuyển',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã huỷ'
};

interface OrderListProps {
  searchQuery: string;  
  selectedStatus: string;
}

const OrderList: React.FC<OrderListProps> = ({ searchQuery, selectedStatus }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders); 
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchOrders = async (currentPage: number) => {
    try {
      const res = await axiosInstanceL.get(`/api/orders/all`);
      const newOrders = res.data.orders || [];
      
      setOrders((prev) => {
        const allOrders = [...prev, ...newOrders];
        const uniqueOrders = Array.from(new Set(allOrders.map(order => order.id)))
          .map(id => allOrders.find(order => order.id === id));
        return uniqueOrders || [];
      });

      if (newOrders.length < LIMIT) setHasMore(false);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);


  useEffect(() => {
    let filtered = orders.filter((order) =>
      order.id.toString().includes(searchQuery)
    );

    if (selectedStatus) {
      filtered = filtered.filter((order) => order.order_status === selectedStatus);
    }

    setFilteredOrders(filtered);
  }, [searchQuery, orders, selectedStatus]); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore]);

  const handleSelectAll = () => {
    const allIds = orders.map((o) => o.id);
    setSelectedOrders(selectedOrders.length === allIds.length ? [] : allIds);
  };

  const handleToggleSelect = (orderId: number) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleUpdateStatus = async (orderId: number, status: string) => {
    console.log('Gửi cập nhật trạng thái:', { orderId, status });
    try {
      const res = await axiosInstanceL.patch(`/api/orders/${orderId}/status`, { status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, order_status: status } : order
        )
      );
  
      console.log('Cập nhật trạng thái thành công:', res.data.message);
    } catch (error: any) {
      console.error('Lỗi khi cập nhật trạng thái:', error?.response?.data?.message || error.message);
      alert(error?.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  return (
    <div className="mt-4 border border-zinc-300 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
    <table className=" w-full text-sm text-left text-gray-700">
      <thead>
        <tr className="bg-zinc-100 text-neutral-800 font-semibold border-b border-zinc-300 text-left">
          <th className="p-3 text-center whitespace-nowrap">Mã đơn hàng</th>
          <th className="w-48 whitespace-nowrap">Tên khách hàng</th>
          <th className="p-3 whitespace-nowrap">Đơn hàng</th>
          <th className="p-3 whitespace-nowrap">Số điện thoại</th>
          <th className="p-3 whitespace-nowrap">Số lượng</th>
          <th className="p-3 whitespace-nowrap">Tình trạng</th>
          <th className="w-28 whitespace-nowrap">Giá tiền</th>
          <th className="w-36 whitespace-nowrap">Trạng thái thanh toán</th>
          <th className="p-3 whitespace-nowrap">Chức năng</th>
        </tr>
      </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={{ ...order, order_status: statusMap[order.order_status] || order.order_status }}
                isSelected={selectedOrders.includes(order.id)}
                onToggleSelect={() => handleToggleSelect(order.id)}
                onUpdateStatus={(status) => handleUpdateStatus(order.id, status)}
              />
            ))}
          </tbody>
        </table>
        {hasMore && <div ref={loaderRef} className="text-center "></div>}

      </div>
    </div>
  );
};

export default OrderList;
