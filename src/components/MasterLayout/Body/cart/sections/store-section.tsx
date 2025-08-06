import React from 'react';
import { CartItem } from './cart-item';


interface StoreSectionProps {
  storeName: string; // Assuming a store name prop
  cartItems: any[]; // Items specific to this store
  isAllChecked: boolean;
  handleCheckAll: () => void; // For checking all items in this store
  getItemKey: (id: number, selectedClassify?: string) => string;
  getFullImageUrl: (thumbnail: string, images?: { image_url: string }[]) => string;
  handleCheckItem: (key: string) => void;
  decreaseQuantity: (id: number, selectedClassify?: string) => void;
  increaseQuantity: (id: number, selectedClassify?: string) => void;
  removeFromCart: (id: number, selectedClassify?: string) => void;

  checkedItems: string[];
}

export const StoreSection: React.FC<StoreSectionProps> = ({
  storeName,
  cartItems,
  getItemKey,
  getFullImageUrl,
  handleCheckItem,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  checkedItems,
}) => {
  // NOTE: For simplicity, `isAllChecked` and `handleCheckAll` are passed from parent CartForm
  // In a multi-store setup, you'd calculate and manage these specifically for each store.

  return (
    <div className="p-4 border-b">
      <div className="flex items-center mb-3">

        <span className="font-bold mr-2">{storeName}</span>

      </div>
      {/* Specific Products List */}
      {cartItems.length > 0 ? (
        cartItems.map((product, index) => (
          <CartItem
            key={index}
            product={product}
            checked={checkedItems.includes(getItemKey(product.id, product.selectedClassify))} // Passed from CartForm
            getItemKey={getItemKey}
            getFullImageUrl={getFullImageUrl}
            handleCheckItem={handleCheckItem}
            decreaseQuantity={decreaseQuantity}
            increaseQuantity={increaseQuantity}
            removeFromCart={removeFromCart}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 text-lg py-10">🛍️ Giỏ hàng trống</p>
      )}
    </div>
  );
};