import React, { useState } from 'react';
import axiosInstanceL from '../../../../../api/api-login/axiosInstance-login';

interface ProductReviewProps {
  onClose: () => void; 
  product: any; 
  variantId: number;
  orderId: number;
}

const ProductReview: React.FC<ProductReviewProps> = ({ onClose, product,variantId, orderId }) => {
  const [rating, setRating] = useState(5); 
  const [reviewText, setReviewText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); 

 
  const handleRatingChange = (rating: number) => {
    setRating(rating);
  };

 
  const handleReviewTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
  };

 
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file); 
    }
  };

  const handleSubmitReview = async () => {

    const formData = new FormData();
    formData.append('product_id', product.id);
    formData.append('rating', rating.toString());
    formData.append('comment', reviewText);
    formData.append('variant_id', variantId.toString());
    formData.append('order_id', orderId.toString());
    if (image) {
      formData.append('image', image); 
    }

    try {
      const response = await axiosInstanceL.post('/api/review/product-reviews', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        console.log('Đánh giá đã được thêm thành công:', response.data);
        alert('Đánh giá đã được thêm thành công!');
        onClose(); 
        window.location.reload();
      }
    } catch (error) {
      console.error('Lỗi khi thêm đánh giá:', error);
      console.log("sssssss",variantId)
      alert('Lỗi khi thêm đánh giá!');
    }
  };
  
  return (
    <div className="min-h-screen fixed top-0 left-0 right-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">

        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Đánh Giá Sản Phẩm</h1>
        </div>


        <div className="flex items-center p-6 border-b border-gray-200">
          <img
            src={`http://localhost:3000${product.thumbnail}`} 
            alt="Sản phẩm"
            className="w-16 h-16 rounded-md mr-4 object-cover border border-gray-200"
          />
          <span className="text-gray-800 text-base">{product.name}</span>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className="text-gray-700 mr-4 text-base">Chất lượng sản phẩm</span>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-6 h-6 ${i < rating ? 'text-yellow-400' : 'text-gray-300'} fill-current cursor-pointer`}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => handleRatingChange(i + 1)}
                >
                  <path d="M12 .587l3.668 7.425L24 9.425l-6 5.86 1.414 8.261L12 18.295l-7.414 3.236L6 15.285l-6-5.86 8.332-1.413L12 .587z" />
                </svg>
              ))}
            </div>
            <span className="ml-3 text-orange-500 font-semibold text-base">
              {rating === 5 ? 'Tuyệt vời' : rating === 4 ? 'Rất tốt' : rating === 3 ? 'Tốt' : rating === 2 ? 'Khá' : 'Không hài lòng'}
            </span>
          </div>

          <div className="mb-4">
            <label htmlFor="review" className="block text-gray-700 text-base font-medium mb-2">
              Chất lượng sản phẩm:
            </label>
            <textarea
              id="review"
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-700 resize-none"
              placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác nhé."
              value={reviewText}
              onChange={handleReviewTextChange}
            ></textarea>
          </div>
            <div className="flex items-center space-x-4 mb-6">
  
            <label className="cursor-pointer flex items-center justify-center p-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                <span className="mr-3">Chọn ảnh</span>
                <input
                type="file"
                onChange={handleImageChange}
                className="hidden"
                />
            </label>


            {previewImage && (
                <div className="w-16 h-16">
                <img
                    src={previewImage}
                    alt="Ảnh xem trước"
                    className="w-full h-full object-cover rounded-md border-2 border-orange-500"
                />
                </div>
            )}
            </div>
        </div>

        <div className="p-6 flex justify-end space-x-3 border-t border-gray-200">
          <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors" onClick={onClose}>
            Đóng
          </button>
          <button className="px-6 py-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors" onClick={handleSubmitReview}>
            Hoàn Thành
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;
