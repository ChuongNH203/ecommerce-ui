import React, { useState } from 'react';
import AddressSection from './sections/address-section';
import ProductDetailsSection from './sections/product-section';
import ShopVoucherSection from './sections/shop-voucher-section';
import DeliveryAndNotesSection from './sections/delivery-notes-section';
import VoucherSection from './sections/voucher-section';
import PaymentMethodSection from './sections/payment-method-section';
import OrderTotalSummary from './sections/order-total-summary';

interface PaymentFormProps {
  productPrice: number;
  standardShippingFee: number;
  selectedShippingOption: 'standard' | 'express';
  onShippingOptionChange: (option: 'standard' | 'express') => void;
  onMessageChange: (message: string) => void;
  isVoucherChecked: boolean;
  onVoucherChange: (checked: boolean, discount: number) => void;
  selectedPaymentMethod: 'COD' | 'Momo';
  onPaymentMethodChange: (method: 'COD' | 'Momo') => void;
  totalPrice: number; // Total price coming from PaymentPage
  setTotalPrice: (total: number) => void;
  setShippingAddressId: (id: string) => void; // Prop to set shipping address ID
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  productPrice,
  standardShippingFee,
  selectedShippingOption,
  onShippingOptionChange,
  onMessageChange,
  isVoucherChecked,
  onVoucherChange,
  selectedPaymentMethod,
  onPaymentMethodChange,
  totalPrice,
  setTotalPrice,
  setShippingAddressId,
}) => {
  const [voucherDiscount, setVoucherDiscount] = useState(0); 


  const calculateTotalPrice = (productTotal: number) => {
    let finalPrice = productTotal + standardShippingFee; 
    finalPrice -= voucherDiscount; 
    setTotalPrice(finalPrice); 
  };


  const handleVoucherChange = (checked: boolean, discount: number) => {
    onVoucherChange(checked, discount);

    if (checked) {
      setVoucherDiscount(discount); 
    } else {
      setVoucherDiscount(0); 
    }
    calculateTotalPrice(productPrice);
  };

  return (
    <div className="font-sans max-w-6xl mx-auto border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
      <AddressSection setShippingAddressId={setShippingAddressId} /> 
      <ProductDetailsSection
        onTotalPriceChange={calculateTotalPrice}
      />
      <ShopVoucherSection />
      <DeliveryAndNotesSection
        standardShippingFee={standardShippingFee}
        selectedShippingOption={selectedShippingOption}
        onShippingOptionChange={onShippingOptionChange}
        onMessageChange={onMessageChange}
      />
      <VoucherSection
        isVoucherChecked={isVoucherChecked}
        onVoucherChange={handleVoucherChange}
      />
      <PaymentMethodSection
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
      />
      <OrderTotalSummary
        productPrice={productPrice}
        shippingFee={standardShippingFee} 
        totalPrice={totalPrice} 
        voucherAmount={voucherDiscount}
      />
    </div>
  );
};

export default PaymentForm;
