import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Popconfirm, message, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

const { Option } = Select;

interface ManageSpecificationsProps {
  visible: boolean;
  onClose: () => void;
  categoryId?: number; 
  onCreated: () => void; 
}

const ManageSpecifications: React.FC<ManageSpecificationsProps> = ({
  visible,
  onClose,
  categoryId, 
  onCreated, 
}) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState(false); 
  const [currentTemplate, setCurrentTemplate] = useState<any>(null); 
  const [form] = Form.useForm();

  const fetchTemplates = async (categoryId: number) => {
    try {
      const res = await axiosInstanceL.get(`/api/specifications/template/${categoryId}`);
      setTemplates(res.data.data); 
    } catch (error) {
      message.error('Lỗi khi tải thông số kỹ thuật mẫu!');
      console.error('Error fetching templates:', error);
    }
  };

  useEffect(() => {
    if (visible && categoryId) {
      fetchTemplates(categoryId);
    }
  }, [visible, categoryId]); 

  const handleAddTemplate = async (values: any) => {
    if (!categoryId) {
      message.error('Vui lòng chọn danh mục!');
      return;
    }

    try {
      await axiosInstanceL.post('/api/specifications/template', {
        category_id: categoryId,
        spec_name: values.spec_name,
        spec_group: values.spec_group,
      });
      message.success('Thêm thông số kỹ thuật mẫu thành công!');
      fetchTemplates(categoryId);
      onCreated();
      form.resetFields();
    } catch (error) {
      message.error('Thêm thất bại!');
    }
  };

  const handleEditTemplate = async (values: any) => {
    if (!categoryId) {
      message.error('Vui lòng chọn danh mục!');
      return;
    }

    try {
      await axiosInstanceL.put(`/api/specifications/template/${currentTemplate.id}`, values);
      message.success('Cập nhật thông số kỹ thuật mẫu thành công!');
      fetchTemplates(categoryId); 
      onCreated(); 
      setIsEdit(false);
      setCurrentTemplate(null);
    } catch (error) {
      message.error('Cập nhật thất bại!');
    }
  };

  const handleDeleteTemplate = async (templateId: number) => {
    if (!categoryId) {
      message.error('Vui lòng chọn danh mục!');
      return;
    }

    try {
      await axiosInstanceL.delete(`/api/specifications/template/${templateId}`);
      message.success('Xóa thông số kỹ thuật mẫu thành công!');
      fetchTemplates(categoryId); 
      onCreated(); 
    } catch (error) {
      message.error('Xóa thất bại!');
    }
  };

  const columns = [
    {
      title: 'Tên thông số',
      dataIndex: 'spec_name',
      key: 'spec_name',
    },

    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setIsEdit(true);
              setCurrentTemplate(record);
              form.setFieldsValue({ spec_name: record.spec_name, spec_group: record.spec_group });
            }}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDeleteTemplate(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Modal
      title="Quản lý thông số kỹ thuật mẫu"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={isEdit ? handleEditTemplate : handleAddTemplate}>
        <Form.Item
          label="Tên thông số (spec_name)"
          name="spec_name"
          rules={[{ required: true, message: 'Vui lòng nhập tên thông số!' }]}
        >
          <Input placeholder="VD: Chất liệu, Công suất..." />
        </Form.Item>



        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEdit ? 'Cập nhật' : 'Thêm thông số'}
          </Button>
        </Form.Item>
      </Form>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={templates}
        pagination={false}
        bordered
        size="small"
      />
    </Modal>
  );
};

export default ManageSpecifications;
