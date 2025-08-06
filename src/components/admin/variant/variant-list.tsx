import React, { useState, useEffect, useMemo } from 'react';
import VariantRow from './variant-row';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

const VariantList = ({ searchQuery, variants, onDeleted, onUpdated }: { searchQuery: string, variants: any[], onDeleted: () => void, onUpdated: () => void }) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const filteredVariants = useMemo(() => {
    return variants.filter(variants =>
      variants.product_id.toString().includes(searchQuery)
    );
  }, [variants, searchQuery]);

  return (
    <div className="mt-4 border border-zinc-300 rounded-lg">
      <table className="table-auto w-full text-sm">
        <thead>
          <tr className="bg-zinc-100 text-neutral-800 font-semibold border-b border-zinc-300 text-left">
            <th className="py-3 px-2 whitespace-nowrap">Mã biến thể</th>
            <th className="py-3 px-2 whitespace-nowrap">Mã sản phẩm</th>
            <th className="py-3 px-2 whitespace-nowrap">Tên biến thể</th>
            <th className="py-3 px-2 whitespace-nowrap">Màu</th>
            <th className="py-3 px-2 whitespace-nowrap">Size</th>
            <th className="py-3 px-2 whitespace-nowrap">Tồn kho</th>
            <th className="py-3 px-2 whitespace-nowrap">Giá</th>
            <th className="py-3 px-2 whitespace-nowrap">SKU</th>
            <th className="py-3 px-2 whitespace-nowrap">Khối lượng</th>
            <th className="py-3 px-2 whitespace-nowrap">Kích thước (D x R x C)</th>
            <th className="py-3 px-2 whitespace-nowrap">Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {filteredVariants.length > 0 ? (
            filteredVariants.map((variant) => (
              <VariantRow
                key={variant.id}
                variant={variant}
                selectAll={selectAll}
                onDeleted={onDeleted}
                onUpdated={onUpdated}
              />
            ))
          ) : (
            <tr>
              <td colSpan={12} className="text-center py-4 text-gray-500">
                Không có phân loại nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VariantList;
