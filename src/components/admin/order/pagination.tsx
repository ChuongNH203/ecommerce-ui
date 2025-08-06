import React from 'react';

interface PaginationProps {
  onSearch: (query: string) => void;  
  onStatusChange: (status: string) => void;
  onCancelOrderClick: () => void;  // Callback for when admin wants to see cancel requests
  cancelRequestsCount: number;  // Number of pending cancel requests
}

const Pagination: React.FC<PaginationProps> = ({ onSearch, onStatusChange, onCancelOrderClick, cancelRequestsCount }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);  
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(e.target.value); 
  };

  return (
    <div className="flex justify-between items-center pt-4">
      <div className="flex items-center border rounded-md p-2">
        <label htmlFor="status" className="text-sm text-neutral-800 mr-2">Trạng thái:</label>
        <select
          id="status"
          className="bg-transparent outline-none text-sm text-neutral-800"
          onChange={handleStatusChange}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Pending">Đang chờ xử lý</option>
          <option value="Processing">Đang xử lý</option>
          <option value="Shipping">Đang vận chuyển</option>
          <option value="Completed">Hoàn thành</option>
          <option value="Cancelled">Đã huỷ</option>
        </select>
      </div>
        {cancelRequestsCount > 0 && (
          <button
            onClick={onCancelOrderClick}
            className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
          >
            Thông báo ({cancelRequestsCount} đơn đang chờ hủy)
          </button>
        )}
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-md p-2">
          <label htmlFor="search" className="text-sm text-neutral-800 mr-2">Tìm kiếm:</label>
          <input
            id="search"
            type="text"
            placeholder="Nhập tên sản phẩm"
            className="bg-transparent outline-none text-sm text-neutral-800"
            onChange={handleSearchChange}  
          />
        </div>
        

      </div>
    </div>
  );
};

export default Pagination;
