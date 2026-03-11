// src/pages/QuanLy/DichVu.tsx
import React, { useState } from 'react';
import {
    Button,
    Card,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Space,
    Table,
    Tag,
    Typography,
    message,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { DichVu } from './types';

const { Title } = Typography;

interface Props {
    dichVuList: DichVu[];
    setDichVuList: React.Dispatch<React.SetStateAction<DichVu[]>>;
}

// Định dạng tiền VND
const formatGia = (gia: number) =>
    gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const DichVuTab: React.FC<Props> = ({ dichVuList, setDichVuList }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DichVu | null>(null);
    const [form] = Form.useForm();

    // Mở modal THÊM MỚI
    const openAdd = () => {
        setEditingItem(null);
        form.resetFields();
        setModalOpen(true);
    };

    // Mở modal CHỈNH SỬA - điền dữ liệu hiện tại vào form
    const openEdit = (item: DichVu) => {
        setEditingItem(item);
        form.setFieldsValue(item);
        setModalOpen(true);
    };

    // Lưu (thêm mới hoặc cập nhật)
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingItem) {
                // Cập nhật: dùng map() để tìm và thay thế đúng phần tử
                setDichVuList((prev) => prev.map((dv) => (dv.id === editingItem.id ? { ...dv, ...values } : dv)));
                message.success('Đã cập nhật dịch vụ!');
            } else {
                // Kiểm tra mã dịch vụ trùng
                if (dichVuList.some((dv) => dv.maDV === values.maDV)) {
                    message.error('Mã dịch vụ đã tồn tại!');
                    return;
                }
                const newItem: DichVu = { id: Date.now().toString(), ...values };
                setDichVuList((prev) => [...prev, newItem]);
                message.success('Đã thêm dịch vụ mới!');
            }
            setModalOpen(false);
        } catch {
            // Ant Design tự hiển thị lỗi validation trên form
        }
    };

    // Xóa dịch vụ
    const handleDelete = (id: string) => {
        setDichVuList((prev) => prev.filter((dv) => dv.id !== id));
        message.success('Đã xóa dịch vụ!');
    };

    const columns = [
        { title: 'Mã DV', dataIndex: 'maDV', key: 'maDV', width: 100 },
        { title: 'Tên dịch vụ', dataIndex: 'tenDV', key: 'tenDV' },
        {
            title: 'Thời gian',
            dataIndex: 'thoiGian',
            key: 'thoiGian',
            width: 120,
            render: (val: number) => <Tag color="purple">{val} phút</Tag>,
        },
        {
            title: 'Giá',
            dataIndex: 'gia',
            key: 'gia',
            width: 150,
            render: (val: number) => <span style={{ color: '#cf1322', fontWeight: 600 }}>{formatGia(val)}</span>,
        },
        { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa' },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            render: (_: unknown, record: DichVu) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa dịch vụ này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Card>
                <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Title level={4} style={{ margin: 0 }}>
                        Danh mục Dịch Vụ
                    </Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        Thêm dịch vụ
                    </Button>
                </Space>
                <Table dataSource={dichVuList} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
            </Card>

            <Modal
                title={editingItem ? 'Chỉnh sửa Dịch Vụ' : 'Thêm Dịch Vụ'}
                visible={modalOpen}
                onOk={handleSave}
                onCancel={() => setModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        name="maDV"
                        label="Mã dịch vụ"
                        rules={[{ required: true, message: 'Vui lòng nhập mã dịch vụ!' }]}
                    >
                        <Input placeholder="VD: DV001" disabled={!!editingItem} />
                    </Form.Item>
                    <Form.Item
                        name="tenDV"
                        label="Tên dịch vụ"
                        rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
                    >
                        <Input placeholder="VD: Cắt tóc nam, Spa mặt..." />
                    </Form.Item>
                    <Form.Item
                        name="thoiGian"
                        label="Thời gian thực hiện (phút)"
                        rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
                    >
                        <InputNumber min={5} max={480} step={5} style={{ width: '100%' }} placeholder="30" />
                    </Form.Item>
                    <Form.Item
                        name="gia"
                        label="Giá (VND)"
                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                    >
                        <InputNumber
                            min={0}
                            step={10000}
                            style={{ width: '100%' }}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                            placeholder="100000"
                        />
                    </Form.Item>
                    <Form.Item name="moTa" label="Mô tả">
                        <Input.TextArea rows={2} placeholder="Mô tả ngắn về dịch vụ..." />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default DichVuTab;
