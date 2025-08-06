import React, { useEffect, useMemo, useState } from 'react';
import SpecificationRow from './specification-row';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

interface Specification {
  id: number;
  variant_id: number | null;
  spec_name: string;
  spec_value: string;
  spec_group?: string;
}

interface SpecificationListProps {
  searchQuery: string;
  specifications: Specification[];
  onDeleted: () => Promise<void>;
  onUpdated: () => Promise<void>;
}
const SpecificationList: React.FC<SpecificationListProps> = ({ searchQuery, specifications, onDeleted, onUpdated }) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const filteredSpecifications = useMemo(() => {
    return specifications.filter((specification) =>
      (specification.variant_id?.toString().includes(searchQuery) || '') || // Dùng optional chaining để tránh lỗi khi variant_id là null
      specification.spec_name.toLowerCase().includes(searchQuery.toLowerCase()) // Thêm điều kiện tìm kiếm cho spec_name
    );
  }, [specifications, searchQuery]);

  return (
    <div className="mt-4 border border-zinc-300 rounded-lg overflow-x-auto">
      <table className="table-fixed w-full min-w-[900px]">
  <thead>
    <tr className="bg-zinc-100 text-neutral-800 text-sm font-semibold border-b border-zinc-300 text-left">
      <th className="w-2/12 py-3 px-2 text-center">Mã thông số</th>
      <th className="w-2/12 py-3 px-2">Mã biến thể</th>
      <th className="w-3/12 py-3 px-2">Tên thông số</th>
      <th className="w-4/12 py-3 px-2">Giá trị</th>
      <th className="w-1/12 py-3 px-2"></th>
      <th className="w-2/12 py-3 px-2">Chức năng</th>
    </tr>
  </thead>
        <tbody>
          {filteredSpecifications.length > 0 ? (
            filteredSpecifications.map((spec) => (
              <SpecificationRow key={spec.id} spec={spec} selectAll={selectAll} onDeleted={onDeleted} onUpdated={onUpdated} />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">Không có thông số kỹ thuật nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SpecificationList;
