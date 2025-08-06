import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd'; // Import message from Ant Design
import { Order } from '../../../../types/order';
import axiosInstanceL from '../../../../api/api-login/axiosInstance-login'; // Import axiosInstanceL

const BASE_URL = 'http://localhost:3000';
const statusMap: Record<string, string> = {
  Pending: 'Đang chờ xử lý',
  Processing: 'Đang xử lý',
  Shipping: 'Đang vận chuyển',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã huỷ',
};
const statusStyles: Record<string, string> = {
  Pending: 'text-yellow-500',
  Processing: 'text-blue-500',
  Shipping: 'text-orange-500',
  Completed: 'text-green-600',
  Cancelled: 'text-gray-500',
};

interface Props {
  orders: Order[];
  loading: boolean;
  lastOrderRef?: (node: HTMLLIElement) => void;
}

const OrderList: React.FC<Props> = ({ orders, loading, lastOrderRef }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isCancellationRequested, setIsCancellationRequested] = useState<boolean>(false);

  const handleRequestCancellation = (orderId: number, cancellationRequested: boolean) => {
    setSelectedOrderId(orderId);
    setIsCancellationRequested(cancellationRequested); // Lưu trạng thái yêu cầu hủy
    setIsModalOpen(true); 
  };
  const handleCancelRequest = async () => {
    if (selectedOrderId !== null) {
      try {
        const response = await axiosInstanceL.post(`/api/orders/request-cancellation/${selectedOrderId}`);
        console.log(response.data.message);
        message.success(response.data.message);
        setIsModalOpen(false);
        window.location.reload();
      } catch (error) {
        console.error('Lỗi khi yêu cầu hủy đơn hàng:', error);
        message.error('Đã xảy ra lỗi khi yêu cầu hủy đơn hàng.');
      }
    }
  };

  return (
    <div className="bg-gray-100 max-h-[460px] overflow-y-auto border border-gray-200 rounded-md p-4">
      {loading && orders.length === 0 ? (
        <p className="text-center text-gray-500">Đang tải đơn hàng...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order, index) => {
            const isLast = index === orders.length - 1;
            return (
              <li
                key={order.id}
                ref={isLast ? lastOrderRef : undefined}
                className="bg-white rounded-md border p-4 shadow"
              >
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-2 font-semibold text-gray-800">
                    <span className="bg-red-500 text-white px-2 py-0.5 text-xs rounded">Mall</span>
                    <span>Express Center</span>
                  </div>
                  <div className={`text-sm font-medium ${statusStyles[order.order_status] || 'text-gray-600'}`}>
                    {statusMap[order.order_status] || order.order_status}
                  </div>
                </div>

                {order.orderItems?.map((item) => {
                  const variant = item.product_variant;
                  const product = variant?.Product;
                  const imageUrl = product?.images?.[0]?.image_url;
                  const discountedPrice = Number(variant?.price || 0);
                  const discount = Number(product?.discount_percentage || 0);
                  const price_variant = Number(variant.price);
                  const originalPrice = discount > 0
                    ? Math.round(discountedPrice / (1 - discount / 100))
                    : 0;

                  return (
                    <div key={item.id} className="flex items-start gap-4 py-4 border-b">
                      <img
                        src={imageUrl ? `${BASE_URL}${imageUrl}` : '/placeholder.png'}
                        alt="product"
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{product?.name || 'Tên sản phẩm'}</p>
                        <p className="text-sm text-gray-500">Phân loại: {variant?.variant_name || 'N/A'} x{item.quantity}</p>
                      </div>
                      <div className="text-right text-sm">
                        {discount > 0 && (
                          <p className="text-gray-400 line-through">₫ {originalPrice.toLocaleString()}</p>
                        )}
                        <p className="text-red-500 font-semibold">₫ {price_variant.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-end items-center pt-4">
                  <span className="mr-2 text-gray-700">Thành tiền:</span>
                  <span className="text-red-500 text-xl font-semibold">
                    ₫{order.total_amount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => navigate(`/account/order-tracking?orderId=${order.id}`)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Xem chi tiết
                  </button>
                  {/* Thêm nút yêu cầu hủy hoặc hủy yêu cầu */}
                  {order.order_status !== 'Cancelled' && order.order_status !== 'Completed' && (
                    <button
                    onClick={() => handleRequestCancellation(order.id, order.cancellation_requested ?? false)}
                      className="text-red-500 hover:underline text-sm ml-2"
                    >
                      {order.cancellation_requested ? 'Hủy yêu cầu ' : 'Yêu cầu hủy đơn hàng'}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-md w-96">
            <h3 className="text-lg font-semibold text-center mb-4">
              {isCancellationRequested ? 'Hủy yêu cầu hủy đơn hàng' : 'Xác nhận yêu cầu hủy đơn hàng'}
            </h3>
            <p className="text-center mb-6">
              {isCancellationRequested
                ? 'Bạn có chắc chắn muốn hủy yêu cầu hủy đơn hàng này?'
                : 'Bạn có chắc chắn muốn yêu cầu hủy đơn hàng này?'}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelRequest}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Xác nhận
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
