// src/pages/DatLichHen/NhanVien.tsx
import React, { useState } from 'react';
import {
    Card, Table, Button, Modal, Form, Input, 
    InputNumber, Space, Popconfirm, message, Tag
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { NhanVien } from './types';

interface Props {
    nhanVienList: NhanVien[];
    setNhanVienList: React.Dispatch<React.SetStateAction<NhanVien[]>>;
}

const NhanVienTab: React.FC<Props> = ({ nhanVienList, setNhanVienList }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NhanVien | null>(null);
    const [form] = Form.useForm();

    const openAdd = () => {
        setEditingItem(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (item: NhanVien) => {
        setEditingItem(item);
        form.setFieldsValue(item);  // ← Điền sẵn dữ liệu vào form
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingItem) {
                // CẬP NHẬT: tìm theo id và thay thế
                setNhanVienList(prev =>
                    prev.map(nv => nv.id === editingItem.id ? { ...nv, ...values } : nv)
                );
                message.success('Đã cập nhật nhân viên!');
            } else {
                // THÊM MỚI
                const newItem: NhanVien = {
                    id: Date.now().toString(),
                    lichLamViec: [],
                    ...values
                };
                setNhanVienList(prev => [...prev, newItem]);
                message.success('Đã thêm nhân viên mới!');
            }
            setModalOpen(false);
        } catch {
            // validation error - Ant Design tự hiển thị lỗi
        }
    };

    const handleDelete = (id: string) => {
        setNhanVienList(prev => prev.filter(nv => nv.id !== id));
        message.success('Đã xóa nhân viên!');
    };

    const columns = [
        { title: 'Mã NV', dataIndex: 'maNV', key: 'maNV', width: 100 },
        { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
        { title: 'SĐT', dataIndex: 'soDienThoai', key: 'soDienThoai', width: 130 },
        { title: 'Chuyên môn', dataIndex: 'chuyenMon', key: 'chuyenMon' },
        {
            title: 'Khách tối đa/ngày',
            dataIndex: 'soKhachToiDa',
            key: 'soKhachToiDa',
            width: 150,
            render: (val: number) => <Tag color="blue">{val} khách</Tag>
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            render: (_: any, record: NhanVien) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa nhân viên này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa" cancelText="Hủy"
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
                    <span style={{ fontSize: 18, fontWeight: 600 }}>Danh sách Nhân Viên</span>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        Thêm nhân viên
                    </Button>
                </Space>
                <Table dataSource={nhanVienList} columns={columns} rowKey="id" />
            </Card>

            <Modal
                title={editingItem ? 'Chỉnh sửa Nhân Viên' : 'Thêm Nhân Viên'}
                open={modalOpen}
                onOk={handleSave}
                onCancel={() => setModalOpen(false)}
                okText="Lưu" cancelText="Hủy"
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="maNV" label="Mã nhân viên"
                        rules={[{ required: true, message: 'Vui lòng nhập mã NV!' }]}>
                        <Input disabled={!!editingItem} />
                    </Form.Item>
                    <Form.Item name="hoTen" label="Họ tên"
                        rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="soDienThoai" label="Số điện thoại">
                        <Input />
                    </Form.Item>
                    <Form.Item name="chuyenMon" label="Chuyên môn"
                        rules={[{ required: true }]}>
                        <Input placeholder="VD: Cắt tóc, Gội đầu..." />
                    </Form.Item>
                    <Form.Item name="soKhachToiDa" label="Số khách tối đa/ngày"
                        rules={[{ required: true }]}>
                        <InputNumber min={1} max={50} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default NhanVienTab;
