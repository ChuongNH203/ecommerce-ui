import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, List, message, Upload } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import { RcFile } from 'antd/es/upload';

interface ProductImageModalProps {
  visible: boolean;
  onClose: () => void;
  productId: number;
}

const ProductImageModal: React.FC<ProductImageModalProps> = ({ visible, onClose, productId }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch images from the API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axiosInstanceL.get(`/api/product/images/${productId}`);
        setImages(response.data.images); // Giả sử API trả về danh sách hình ảnh
      } catch (error) {
        console.error('Lỗi khi tải hình ảnh:', error);
      }
    };

    if (visible) {
      fetchImages();
    }
  }, [visible, productId]);

  // Handle image delete
  const handleDeleteImage = async (imageUrl: string) => {
    try {
      await axiosInstanceL.delete('/api/product/delete-image', { data: { productId, imageUrl } });
      setImages(images.filter(img => img !== imageUrl));
      message.success('Xóa hình ảnh thành công!');
    } catch (error) {
      message.error('Lỗi khi xóa hình ảnh');
    }
  };

  // Handle image upload (multiple files)
  const handleImageUpload = async (fileList: RcFile[]) => {
    const formData = new FormData();
    formData.append('productId', productId.toString());
    
    // Thêm tất cả các file vào FormData
    fileList.forEach((file) => {
      formData.append('images', file);
    });

    try {
      setLoading(true);
      await axiosInstanceL.post('/api/product/upload-images', formData);
      const response = await axiosInstanceL.get(`/api/product/images/${productId}`);
      setImages(response.data.images);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('Lỗi khi tải lên hình ảnh');
    }
  };

  return (
    <Modal
      title="Danh sách hình ảnh sản phẩm"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className="mb-4">
        <Upload
          customRequest={({ file, onSuccess, onError }) => {
            handleImageUpload([file as RcFile])
              .then(() => {
                onSuccess?.('ok');
              })
              .catch((error) => {
                onError?.(error);
              });
          }}
          showUploadList={false}
          accept="image/*"
          multiple
        >
          <Button icon={<UploadOutlined />} loading={loading}>
            Thêm hình ảnh
          </Button>
        </Upload>
      </div>

      {images.length > 0 ? (
        <List
          bordered
          dataSource={images}
          renderItem={(image, index) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteImage(image)}
                >
                  Xóa
                </Button>
              ]}
            >
              <img
                src={`http://localhost:3000${image}`}
                alt={`product-image-${index}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <span>{image}</span>
            </List.Item>
          )}
        />
      ) : (
        <div>Không có hình ảnh cho sản phẩm này.</div>
      )}
    </Modal>
  );
};

export default ProductImageModal;
