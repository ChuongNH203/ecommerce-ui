import React, { useEffect, useState } from 'react';
import axiosInstanceL from '../../../../../api/api-login/axiosInstance-login';
import AddressList from './address/address-list'; // Import AddressList

// Đảm bảo kiểu dữ liệu Address đồng nhất
interface Address {
  id: string; // Đảm bảo id là string (hoặc sửa lại thành number nếu bạn muốn kiểu là number)
  full_name: string;
  phone_number: string;
  street_address: string;
  district: string;
  city: string;
  ward: string;
  postal_code: string;
  address_type: string;
  isDefault: boolean;
}

interface AddressSectionProps {
  setShippingAddressId: (id: string) => void; 
}

const AddressSection: React.FC<AddressSectionProps> = ({ setShippingAddressId }) => {
  const [address, setAddress] = useState<Address | null>(null); 
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axiosInstanceL.get('/api/addresses');
        if (response.data && response.data.length > 0) {
          const defaultAddress = response.data.find((addr: Address) => addr.isDefault);
          setAddress(defaultAddress || response.data[0]);
          setShippingAddressId(defaultAddress?.id || response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };

    fetchAddress();
  }, []);

  const handleSelectAddress = (selectedAddress: Address) => {
    console.log("Selected Address ID:", selectedAddress.id); 
    setShippingAddressId(selectedAddress.id); 
    setIsModalOpen(false);
  };

  const handleChangeAddress = () => {
    setIsModalOpen(true); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="pb-4 mb-5 border-b border-gray-200">
      <h3 className="text-orange-500 text-lg font-semibold mb-2">Địa Chỉ Nhận Hàng</h3>
      {address ? (
        <div className="flex justify-between items-center">
          <div>
            <p className="m-0 font-bold">{address.full_name} ({address.phone_number})</p>
            <p className="mt-1 text-gray-700 text-sm">
              {address.street_address}, {address.ward}, {address.district}, {address.city}, {address.postal_code}
            </p>
          </div>
          <div>
            {address.isDefault && (
              <span className="mx-2 inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">
                Mặc định
              </span>
            )}
            <button
              className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
              onClick={handleChangeAddress}
            >
              Thay Đổi
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700">Không có địa chỉ nhận hàng</p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <AddressList onSelect={handleSelectAddress} /> 
            <button
              onClick={closeModal}
              className="mt-4 text-white bg-gray-200 px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSection;
