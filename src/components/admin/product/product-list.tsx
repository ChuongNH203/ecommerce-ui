import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import ProductRow from './product-row';
import { debounce } from 'lodash';

interface ProductListProps {
  searchQuery: string; 
}

const ProductList = forwardRef(({ searchQuery }: ProductListProps, ref) => {
  const [selectAll, setSelectAll] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]); 
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstanceL.get('/api/product/all');
      setAllProducts(res.data?.data || []);  
    } catch (err) {
      console.error('Lỗi khi tải danh sách sản phẩm:', err);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchProducts,
  }));


  const handleSearch = debounce((query: string) => {
    if (query) {
      const filtered = allProducts.filter((product: any) =>
        product.name.toLowerCase().includes(query.toLowerCase()) 
      );
      setFilteredProducts(filtered);  
    } else {
      setFilteredProducts(allProducts); 
    }
  }, 0); 

 
  useEffect(() => {
    handleSearch(searchQuery);  
  }, [searchQuery, allProducts]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="mt-4 border border-zinc-300 rounded-lg overflow-hidden">
<table className="table-auto w-full text-sm text-left text-gray-700">
  <thead>
    <tr className="bg-zinc-100 text-neutral-800 font-semibold border-b border-zinc-300 text-left">
      <th className="p-6 text-center whitespace-nowrap">ID</th>
      <th className="p-3 whitespace-nowrap">Tên sản phẩm</th>
      <th className="p-3 whitespace-nowrap">Mô tả</th>
      <th className="p-3 whitespace-nowrap">Danh mục</th>
      <th className="p-3 whitespace-nowrap">Giảm giá</th>
      <th className="p-3 whitespace-nowrap">Thương hiệu</th>
      <th className="p-3 whitespace-nowrap">Ảnh</th>
      <th className="p-3 whitespace-nowrap">Chức năng</th>
    </tr>
  </thead>
        <tbody>
          {filteredProducts.map((product: any) => (
            <ProductRow
              key={product.id}
              product={product}
              selectAll={selectAll}
              onDeleted={fetchProducts}
              onUpdated={fetchProducts}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default ProductList;
