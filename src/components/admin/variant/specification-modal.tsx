import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, Typography, message, Table, Popconfirm } from 'antd';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

interface SpecificationListModalProps {
  variantId: number;
  categoryId: number;
  onClose: () => void;
}

interface Specification {
  id: number;
  spec_name: string;
  spec_value?: string;
}

const SpecificationListModal: React.FC<SpecificationListModalProps> = ({ variantId, categoryId, onClose }) => {
  const [specs, setSpecs] = useState<Specification[]>([]);  // Các thông số hiện có của biến thể
  const [templates, setTemplates] = useState<Specification[]>([]);  // Các template thông số kỹ thuật
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false); // Để kiểm tra trạng thái chỉnh sửa
  const [editingSpec, setEditingSpec] = useState<Specification | null>(null); // Thông số hiện tại để chỉnh sửa

  const fetchData = async () => {
    try {
      const res2 = await axiosInstanceL.get(`/api/specifications/template/${categoryId}`);
      setTemplates(res2.data.data);

      const res1 = await axiosInstanceL.get(`/api/specifications/variant/${variantId}`);
      setSpecs(res1.data.data);
    } catch (err) {

      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [variantId, categoryId]);


  const handleAddSpec = async (values: any) => {
    try {
      await axiosInstanceL.post(`/api/specifications/variant/${variantId}`, values);
      message.success('Thêm thông số thành công!');
      form.resetFields();
      fetchData();
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Thêm thất bại');
    }
  };

  const handleEditSpec = async (values: any) => {
    if (!editingSpec) return;

    try {
      await axiosInstanceL.put(`/api/specifications/variant/${variantId}/${editingSpec.id}`, values);
      message.success('Cập nhật thông số thành công!');
      fetchData();
      setIsEditing(false);
      setEditingSpec(null);
      form.resetFields();
    } catch (err) {
      message.error('Cập nhật thất bại!');
    }
  };


  const handleDeleteSpec = async (specId: number) => {
    try {
      await axiosInstanceL.delete(`/api/specifications/variant/${variantId}/${specId}`);
      message.success('Xóa thông số thành công!');
      fetchData();
    } catch (err) {
      message.error('Xóa thất bại!');
    }
  };

  const existingNames = specs.map(s => s.spec_name?.toLowerCase());
  const availableTemplates = templates.filter(t => !!t.spec_name && !existingNames.includes(t.spec_name.toLowerCase()));


  const columns = [
    {
      title: 'Tên thông số',
      dataIndex: 'spec_name',
      key: 'spec_name',
    },
    {
      title: 'Giá trị',
      dataIndex: 'spec_value',
      key: 'spec_value',
    },
{
  title: 'Hành động',
  key: 'action',
  render: (_: any, record: any) => (
    <>
      <Button
        type="link"
        icon={<EditOutlined />}
        onClick={() => {
          setIsEditing(true);
          setEditingSpec(record);
          form.setFieldsValue({ spec_name: record.spec_name, spec_value: record.spec_value });
        }}
        style={{ marginRight: 8 }}
      >
      </Button>
      <Popconfirm
        title="Bạn có chắc muốn xóa thông số này?"
        onConfirm={() => handleDeleteSpec(record.id)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          
        >
        </Button>
      </Popconfirm>
    </>
  ),
},
  ];

  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={null}
      width={800}
      title={<Title level={4}>Thông số kỹ thuật của biến thể #{variantId}</Title>}
    >


      <Form layout="vertical" form={form} onFinish={isEditing ? handleEditSpec : handleAddSpec}>
        <Form.Item
          label="Tên thông số (spec_name)"
          name="spec_name"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Chọn hoặc nhập"
            showSearch
            allowClear
            onChange={(val) => form.setFieldValue('spec_name', val)}
          >
            {availableTemplates.map((t) => (
              <Option key={t.id} value={t.spec_name}>{t.spec_name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá trị (spec_value)"
          name="spec_value"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditing ? 'Cập nhật thông số' : 'Thêm thông số'}
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={specs}
        pagination={false}
        bordered
        size="small"
        style={{ marginBottom: '20px' }}
        scroll={{ y: 300 }} 
      />
    </Modal>
  );
};

export default SpecificationListModal;
