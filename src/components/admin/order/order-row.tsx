import React from 'react';
import { Order } from '../../../types/order';

interface Props {
  order: Order;
  isSelected: boolean;
  onToggleSelect: () => void;
  onUpdateStatus: (newStatus: string) => void;
}

const statusMap: Record<string, string> = {
  Pending: 'Đang chờ xử lý',
  Processing: 'Đang xử lý',
  Shipping: 'Đang vận chuyển',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã huỷ',
};

const OrderRow: React.FC<Props> = ({
  order,
  isSelected,
  onToggleSelect,
  onUpdateStatus,
}) => {
  const productNames = order.orderItems
    ?.map(
      (item) =>
        `${item.product_variant.Product.name} (${item.product_variant.variant_name}) x${item.quantity}`
    )
    .join(', ');

  const totalQuantity = order.orderItems?.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const isCompleted = order.order_status === 'Hoàn thành';  
  const isCancelled = order.order_status === 'Đã huỷ';  

  return (
    <tr className="text-sm text-gray-700 border-b border-gray-200 hover:bg-gray-50 transition-all">
      <td className="text-center py-3">{order.id}</td>
      <td className="py-3 px-2">{order.User?.full_name || 'N/A'}</td>

      <td className="py-3 px-2">{productNames}</td>
            <td className="py-3 px-2">{order.User?.phone_number || 'N/A'}</td>
      <td className="py-3 px-2">{totalQuantity}</td>
      <td className="text-green-600 w-36">{statusMap[order.order_status] || order.order_status}</td>
      <td className="py-3 px-2">{order.total_amount.toLocaleString()} đ</td>
      <td className="py-3 w-40">

        <span
          className={`py-1 px-2 rounded text-xs ${
            order.Payment?.payment_method === 'Momo' && order.Payment?.payment_status === 'Pending'
              ? 'bg-yellow-500 text-white'
              : order.Payment?.payment_method !== 'Momo'
              ? 'bg-blue-500 text-white'
              : 'bg-green-500 text-white'
          }`}
        >
          {
            order.Payment?.payment_method === 'Momo' && order.Payment?.payment_status === 'Pending' 
              ? 'Chưa thanh toán' 
              : order.Payment?.payment_method !== 'Momo' 
              ? 'Thanh toán khi nhận hàng' 
              : 'Đã thanh toán'
          }
        </span>
      </td>
      <td className="py-3 px-2">
        {isCancelled ? (
          <span className="text-gray-500">Đã hủy</span>
        ) : isCompleted ? (
          <span className="text-gray-500">Đã hoàn thành</span>
        ) : (
          <select
            className="border rounded px-2 py-1 text-sm"
            defaultValue=""
            onChange={(e) => onUpdateStatus(e.target.value)}
          >
            <option value="" disabled>
              Cập nhật trạng thái
            </option>
            {Object.keys(statusMap).map((status) => (
              <option key={status} value={status}>
                {statusMap[status]}
              </option>
            ))}
          </select>
        )}
      </td>
    </tr>
  );
};

export default OrderRow;
