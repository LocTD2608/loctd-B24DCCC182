// src/pages/QuanLy/LichLamViec.tsx
import React, { useState } from 'react';
import {
    Button,
    Card,
    Form,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    TimePicker,
    Typography,
    message,
} from 'antd';
import { DeleteOutlined, PlusOutlined, ScheduleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { LichLamViec, NhanVien, ThuTrongTuan } from './types';
import { THU_OPTIONS } from './types';

const { Title, Text } = Typography;

interface Props {
    nhanVienList: NhanVien[];
    setNhanVienList: React.Dispatch<React.SetStateAction<NhanVien[]>>;
}

// Màu sắc cho từng ngày trong tuần
const THU_COLOR: Record<ThuTrongTuan, string> = {
    'Thứ 2': 'blue',
    'Thứ 3': 'cyan',
    'Thứ 4': 'green',
    'Thứ 5': 'lime',
    'Thứ 6': 'orange',
    'Thứ 7': 'volcano',
    'Chủ nhật': 'red',
};

const LichLamViecTab: React.FC<Props> = ({ nhanVienList, setNhanVienList }) => {
    // Nhân viên đang được xem/chỉnh sửa lịch
    const [selectedNhanVien, setSelectedNhanVien] = useState<NhanVien | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();

    // Khi chọn nhân viên → cập nhật state selectedNhanVien từ danh sách mới nhất
    const handleSelectNhanVien = (id: string) => {
        const found = nhanVienList.find((nv) => nv.id === id) || null;
        setSelectedNhanVien(found);
    };

    // Mở modal thêm ca làm việc
    const openAdd = () => {
        form.resetFields();
        setModalOpen(true);
    };

    // Thêm ca làm việc mới cho nhân viên đang chọn
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const batDau = dayjs(values.batDau).format('HH:mm');
            const ketThuc = dayjs(values.ketThuc).format('HH:mm');

            // Kiểm tra giờ bắt đầu phải trước giờ kết thúc
            if (batDau >= ketThuc) {
                message.error('Giờ bắt đầu phải nhỏ hơn giờ kết thúc!');
                return;
            }

            const newCa: LichLamViec = { thu: values.thu, batDau, ketThuc };

            // Cập nhật lichLamViec cho nhân viên được chọn
            setNhanVienList((prev) =>
                prev.map((nv) =>
                    nv.id === selectedNhanVien!.id
                        ? { ...nv, lichLamViec: [...nv.lichLamViec, newCa] }
                        : nv,
                ),
            );

            // Cập nhật lại selectedNhanVien để UI hiển thị ngay
            setSelectedNhanVien((prev) =>
                prev ? { ...prev, lichLamViec: [...prev.lichLamViec, newCa] } : prev,
            );

            message.success('Đã thêm ca làm việc!');
            setModalOpen(false);
        } catch {
            // validation error
        }
    };

    // Xóa ca làm việc (xác định bằng index)
    const handleDeleteCa = (index: number) => {
        setNhanVienList((prev) =>
            prev.map((nv) =>
                nv.id === selectedNhanVien!.id
                    ? { ...nv, lichLamViec: nv.lichLamViec.filter((_, i) => i !== index) }
                    : nv,
            ),
        );
        setSelectedNhanVien((prev) =>
            prev ? { ...prev, lichLamViec: prev.lichLamViec.filter((_, i) => i !== index) } : prev,
        );
        message.success('Đã xóa ca làm việc!');
    };

    // Lấy dữ liệu lịch làm việc từ nhanVienList (source of truth)
    const currentLich =
        selectedNhanVien
            ? nhanVienList.find((nv) => nv.id === selectedNhanVien.id)?.lichLamViec ?? []
            : [];

    const columns = [
        {
            title: 'Ngày trong tuần',
            dataIndex: 'thu',
            key: 'thu',
            render: (thu: ThuTrongTuan) => <Tag color={THU_COLOR[thu]}>{thu}</Tag>,
        },
        {
            title: 'Giờ bắt đầu',
            dataIndex: 'batDau',
            key: 'batDau',
            width: 140,
            render: (val: string) => <Text strong>🕐 {val}</Text>,
        },
        {
            title: 'Giờ kết thúc',
            dataIndex: 'ketThuc',
            key: 'ketThuc',
            width: 140,
            render: (val: string) => <Text strong>🕔 {val}</Text>,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            render: (_: unknown, __: LichLamViec, index: number) => (
                <Popconfirm
                    title="Xóa ca làm việc này?"
                    onConfirm={() => handleDeleteCa(index)}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Button danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
            ),
        },
    ];

    return (
        <Card>
            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>
                    <ScheduleOutlined /> Lịch Làm Việc Nhân Viên
                </Title>
            </Space>

            {/* Bước 1: Chọn nhân viên */}
            <Card
                size="small"
                style={{ marginBottom: 16, background: '#f0f5ff', border: '1px solid #adc6ff' }}
            >
                <Space>
                    <Text strong>Chọn nhân viên:</Text>
                    <Select
                        style={{ width: 280 }}
                        placeholder="-- Chọn nhân viên để xem lịch --"
                        onChange={handleSelectNhanVien}
                        options={nhanVienList.map((nv) => ({
                            value: nv.id,
                            label: `${nv.maNV} - ${nv.hoTen} (${nv.chuyenMon})`,
                        }))}
                    />
                </Space>
            </Card>

            {/* Bước 2: Hiển thị lịch của nhân viên được chọn */}
            {selectedNhanVien ? (
                <>
                    <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Text>
                            Lịch làm việc của <Text strong>{selectedNhanVien.hoTen}</Text> —{' '}
                            <Tag color="blue">{currentLich.length} ca/tuần</Tag>
                        </Text>
                        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                            Thêm ca làm việc
                        </Button>
                    </Space>
                    <Table
                        dataSource={currentLich}
                        columns={columns}
                        rowKey={(_, index) => String(index)}
                        pagination={false}
                        locale={{ emptyText: 'Chưa có ca làm việc nào. Bấm "+ Thêm ca" để thêm.' }}
                    />
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: 40, color: '#8c8c8c' }}>
                    👆 Vui lòng chọn nhân viên ở trên để xem và quản lý lịch làm việc
                </div>
            )}

            {/* Modal thêm ca làm việc */}
            <Modal
                title="Thêm Ca Làm Việc"
                visible={modalOpen}
                onOk={handleSave}
                onCancel={() => setModalOpen(false)}
                okText="Thêm"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="thu" label="Ngày trong tuần" rules={[{ required: true, message: 'Chọn ngày!' }]}>
                        <Select
                            options={THU_OPTIONS.map((t) => ({ value: t, label: t }))}
                            placeholder="Chọn thứ..."
                        />
                    </Form.Item>
                    <Form.Item name="batDau" label="Giờ bắt đầu" rules={[{ required: true, message: 'Chọn giờ bắt đầu!' }]}>
                        <TimePicker format="HH:mm" minuteStep={30} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="ketThuc" label="Giờ kết thúc" rules={[{ required: true, message: 'Chọn giờ kết thúc!' }]}>
                        <TimePicker format="HH:mm" minuteStep={30} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default LichLamViecTab;
