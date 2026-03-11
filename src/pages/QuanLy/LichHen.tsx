import React, { useMemo, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Statistic,
    Table,
    Tag,
    TimePicker,
    Typography,
    message,
} from 'antd';
import {
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { DichVu, LichHen, NhanVien, TrangThaiLichHen } from './types';
import { TRANG_THAI_COLOR } from './types';

const { Title, Text } = Typography;

interface Props {
    lichHenList: LichHen[];
    setLichHenList: React.Dispatch<React.SetStateAction<LichHen[]>>;
    nhanVienList: NhanVien[];
    dichVuList: DichVu[];
}

// Map ngày JS (0=CN, 1=T2...) sang tên thứ
const JS_DAY_TO_THU: Record<number, string> = {
    1: 'Thứ 2',
    2: 'Thứ 3',
    3: 'Thứ 4',
    4: 'Thứ 5',
    5: 'Thứ 6',
    6: 'Thứ 7',
    0: 'Chủ nhật',
};

const TRANG_THAI_OPTIONS: TrangThaiLichHen[] = ['Chờ xác nhận', 'Đã xác nhận', 'Hoàn thành', 'Đã hủy'];

const LichHenTab: React.FC<Props> = ({ lichHenList, setLichHenList, nhanVienList, dichVuList }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<LichHen | null>(null);
    const [filterNhanVien, setFilterNhanVien] = useState<string | undefined>();
    const [filterTrangThai, setFilterTrangThai] = useState<TrangThaiLichHen | undefined>();
    const [form] = Form.useForm();

    // Thống kê nhanh
    const stats = useMemo(
        () => ({
            total: lichHenList.length,
            choXacNhan: lichHenList.filter((l) => l.trangThai === 'Chờ xác nhận').length,
            daXacNhan: lichHenList.filter((l) => l.trangThai === 'Đã xác nhận').length,
            hoanThanh: lichHenList.filter((l) => l.trangThai === 'Hoàn thành').length,
        }),
        [lichHenList],
    );

    // Lọc danh sách hiển thị
    const filteredList = useMemo(
        () =>
            lichHenList.filter((lh) => {
                if (filterNhanVien && lh.nhanVienId !== filterNhanVien) return false;
                if (filterTrangThai && lh.trangThai !== filterTrangThai) return false;
                return true;
            }),
        [lichHenList, filterNhanVien, filterTrangThai],
    );

    const openAdd = () => {
        setEditingItem(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = (item: LichHen) => {
        setEditingItem(item);
        form.setFieldsValue({
            ...item,
            ngayHen: dayjs(item.ngayHen),
            gioHen: dayjs(item.gioHen, 'HH:mm'),
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const ngayHen = dayjs(values.ngayHen).format('YYYY-MM-DD');
            const gioHen = dayjs(values.gioHen).format('HH:mm');

            if (!editingItem) {
                // === KIỂM TRA GIỚI HẠN KHÁCH/NGÀY ===
                const nhanVien = nhanVienList.find((nv) => nv.id === values.nhanVienId);
                const soLichTrongNgay = lichHenList.filter(
                    (lh) =>
                        lh.nhanVienId === values.nhanVienId &&
                        lh.ngayHen === ngayHen &&
                        lh.trangThai !== 'Đã hủy',
                ).length;

                if (nhanVien && soLichTrongNgay >= nhanVien.soKhachToiDa) {
                    message.error(
                        `${nhanVien.hoTen} đã đủ ${nhanVien.soKhachToiDa} khách trong ngày ${ngayHen}! Vui lòng chọn ngày khác hoặc nhân viên khác.`,
                    );
                    return;
                }

                // === KIỂM TRA LỊCH LÀM VIỆC ===
                if (nhanVien) {
                    const dayOfWeek = dayjs(values.ngayHen).day();
                    const thuName = JS_DAY_TO_THU[dayOfWeek];
                    const coLich = nhanVien.lichLamViec.some((l) => l.thu === thuName);
                    if (!coLich) {
                        message.warning(`${nhanVien.hoTen} không có lịch làm việc vào ${thuName}. Bạn có muốn đặt không?`);
                    }
                }

                const newItem: LichHen = {
                    id: Date.now().toString(),
                    maLichHen: `LH${Date.now().toString().slice(-6)}`,
                    ...values,
                    ngayHen,
                    gioHen,
                    trangThai: values.trangThai ?? 'Chờ xác nhận',
                };
                setLichHenList((prev) => [...prev, newItem]);
                message.success('Đã đặt lịch hẹn!');
            } else {
                setLichHenList((prev) =>
                    prev.map((lh) => (lh.id === editingItem.id ? { ...lh, ...values, ngayHen, gioHen } : lh)),
                );
                message.success('Đã cập nhật lịch hẹn!');
            }
            setModalOpen(false);
        } catch {
            // validation errors shown by Ant Design
        }
    };

    const handleDelete = (id: string) => {
        setLichHenList((prev) => prev.filter((lh) => lh.id !== id));
        message.success('Đã xóa lịch hẹn!');
    };

    // Thay đổi nhanh trạng thái ngay trên bảng
    const handleChangeTrangThai = (id: string, trangThai: TrangThaiLichHen) => {
        setLichHenList((prev) => prev.map((lh) => (lh.id === id ? { ...lh, trangThai } : lh)));
        message.success('Đã cập nhật trạng thái!');
    };

    const columns = [
        { title: 'Mã LH', dataIndex: 'maLichHen', key: 'maLichHen', width: 110 },
        { title: 'Khách hàng', dataIndex: 'tenKhach', key: 'tenKhach' },
        { title: 'SĐT', dataIndex: 'soDienThoai', key: 'soDienThoai', width: 120 },
        {
            title: 'Nhân viên',
            dataIndex: 'nhanVienId',
            key: 'nhanVienId',
            render: (id: string) => nhanVienList.find((nv) => nv.id === id)?.hoTen ?? '—',
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'dichVuId',
            key: 'dichVuId',
            render: (id: string) => dichVuList.find((dv) => dv.id === id)?.tenDV ?? '—',
        },
        {
            title: 'Ngày hẹn',
            dataIndex: 'ngayHen',
            key: 'ngayHen',
            width: 110,
            render: (val: string) => <Text strong>{val}</Text>,
        },
        {
            title: 'Giờ hẹn',
            dataIndex: 'gioHen',
            key: 'gioHen',
            width: 90,
            render: (val: string) => <Tag icon={<ClockCircleOutlined />}>{val}</Tag>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            width: 165,
            render: (trangThai: TrangThaiLichHen, record: LichHen) => (
                <Select
                    value={trangThai}
                    size="small"
                    style={{ width: 155 }}
                    onChange={(val) => handleChangeTrangThai(record.id, val)}
                    options={TRANG_THAI_OPTIONS.map((t) => ({
                        value: t,
                        label: <Tag color={TRANG_THAI_COLOR[t]}>{t}</Tag>,
                    }))}
                />
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            render: (_: unknown, record: LichHen) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
                    <Popconfirm
                        title="Xóa lịch hẹn này?"
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
            {/* Thống kê */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                    <Card size="small">
                        <Statistic title="Tổng lịch hẹn" value={stats.total} prefix={<CalendarOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Chờ xác nhận"
                            value={stats.choXacNhan}
                            valueStyle={{ color: '#d48806' }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Đã xác nhận"
                            value={stats.daXacNhan}
                            valueStyle={{ color: '#1677ff' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card size="small">
                        <Statistic
                            title="Hoàn thành"
                            value={stats.hoanThanh}
                            valueStyle={{ color: '#52c41a' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card>
                {/* Bộ lọc + nút thêm */}
                <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Space wrap>
                        <Title level={4} style={{ margin: 0 }}>
                            Danh sách Lịch Hẹn
                        </Title>
                        <Select
                            allowClear
                            placeholder="Lọc theo nhân viên"
                            style={{ width: 200 }}
                            onChange={setFilterNhanVien}
                            options={nhanVienList.map((nv) => ({ value: nv.id, label: nv.hoTen }))}
                        />
                        <Select
                            allowClear
                            placeholder="Lọc theo trạng thái"
                            style={{ width: 160 }}
                            onChange={setFilterTrangThai}
                            options={TRANG_THAI_OPTIONS.map((t) => ({
                                value: t,
                                label: <Tag color={TRANG_THAI_COLOR[t]}>{t}</Tag>,
                            }))}
                        />
                    </Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        Đặt lịch hẹn
                    </Button>
                </Space>

                {nhanVienList.length === 0 && (
                    <Alert
                        message="Chưa có nhân viên nào!"
                        description="Vui lòng thêm nhân viên ở tab Nhân Viên trước khi đặt lịch."
                        type="warning"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Table dataSource={filteredList} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
            </Card>

            {/* Modal đặt/sửa lịch hẹn */}
            <Modal
                title={editingItem ? 'Chỉnh sửa Lịch Hẹn' : 'Đặt Lịch Hẹn Mới'}
                visible={modalOpen}
                onOk={handleSave}
                onCancel={() => setModalOpen(false)}
                okText={editingItem ? 'Lưu' : 'Đặt lịch'}
                cancelText="Hủy"
                width={560}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="tenKhach"
                                label="Tên khách hàng"
                                rules={[{ required: true, message: 'Nhập tên khách!' }]}
                            >
                                <Input placeholder="Nguyễn Văn A" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="soDienThoai" label="Số điện thoại" rules={[{ required: true }]}>
                                <Input placeholder="090xxxxxxx" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="nhanVienId"
                                label="Nhân viên phụ trách"
                                rules={[{ required: true, message: 'Chọn nhân viên!' }]}
                            >
                                <Select
                                    placeholder="Chọn nhân viên..."
                                    options={nhanVienList.map((nv) => ({
                                        value: nv.id,
                                        label: `${nv.hoTen} (tối đa ${nv.soKhachToiDa}/ngày)`,
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="dichVuId"
                                label="Dịch vụ"
                                rules={[{ required: true, message: 'Chọn dịch vụ!' }]}
                            >
                                <Select
                                    placeholder="Chọn dịch vụ..."
                                    options={dichVuList.map((dv) => ({
                                        value: dv.id,
                                        label: `${dv.tenDV} (${dv.thoiGian} phút)`,
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="ngayHen"
                                label="Ngày hẹn"
                                rules={[{ required: true, message: 'Chọn ngày hẹn!' }]}
                            >
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="gioHen"
                                label="Giờ hẹn"
                                rules={[{ required: true, message: 'Chọn giờ hẹn!' }]}
                            >
                                <TimePicker format="HH:mm" minuteStep={30} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    {editingItem && (
                        <Form.Item name="trangThai" label="Trạng thái">
                            <Select
                                options={TRANG_THAI_OPTIONS.map((t) => ({
                                    value: t,
                                    label: <Tag color={TRANG_THAI_COLOR[t]}>{t}</Tag>,
                                }))}
                            />
                        </Form.Item>
                    )}
                    <Form.Item name="ghiChu" label="Ghi chú">
                        <Input.TextArea rows={2} placeholder="Yêu cầu đặc biệt, dị ứng, v.v..." />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default LichHenTab;
