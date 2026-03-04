import { Button, Card, Col, Form, Input, InputNumber, Modal, Row, Select, Table, Tag, message } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const { Option } = Select;
const cacMucDo = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

function mauMucDo(mucDo: string): string {
    if (mucDo === 'Dễ') return 'green';
    if (mucDo === 'Trung bình') return 'blue';
    if (mucDo === 'Khó') return 'orange';
    return 'red';
}

const NganHangCauHoiPage = () => {
    const {
        danhSachCauHoi,
        danhSachDeThi,
        themCauHoi,
        xoaCauHoi,
        layDanhSachMon,
        taoDeThi,
        xoaDeThi,
    } = useModel('nganhangcauhoi');
    const [form] = Form.useForm();

    // State cho Modal "Tạo đề ngẫu nhiên"
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formTaoDe] = Form.useForm();
    const [deThiHienTai, setDeThiHienTai] = useState<NganHangCauHoi.ICauHoi[] | null>(null);

    const danhSachMonHoc = layDanhSachMon();

    // Xử lý thêm câu hỏi
    function handleSubmitThem(values: any) {
        themCauHoi({
            maCauHoi: values.maCauHoi.trim(),
            monHoc: values.monHoc.trim(),
            noiDung: values.noiDung.trim(),
            mucDo: values.mucDo,
        });
        form.resetFields();
        message.success('Đã thêm 1 câu hỏi vào ngân hàng');
    }

    // Xử lý tạo đề thi
    function handleTaoDe() {
        formTaoDe.validateFields().then((values) => {
            const kq = taoDeThi(values.monHoc, values.soLuong);
            if (kq.ok && kq.deThi) {
                setDeThiHienTai(kq.deThi);
                message.success(kq.message);
            } else {
                message.error(kq.message);
            }
        });
    }

    const columns = [
        { title: 'Mã', dataIndex: 'maCauHoi', width: 100 },
        {
            title: 'Môn học',
            dataIndex: 'monHoc',
            width: 150,
            filters: danhSachMonHoc.map((m) => ({ text: m, value: m })),
            onFilter: (value: any, record: any) => record.monHoc === value,
        },
        { title: 'Nội dung', dataIndex: 'noiDung' },
        {
            title: 'Mức độ',
            dataIndex: 'mucDo',
            width: 120,
            filters: cacMucDo.map((m) => ({ text: m, value: m })),
            onFilter: (value: any, record: any) => record.mucDo === value,
            render: (val: string) => <Tag color={mauMucDo(val)}>{val}</Tag>,
        },
        {
            title: 'Thao tác',
            width: 100,
            align: 'center' as const,
            render: (_: any, record: NganHangCauHoi.ICauHoi) => (
                <Button danger type="link" onClick={() => xoaCauHoi(record.maCauHoi)}>
                    Xóa
                </Button>
            ),
        },
    ];

    return (
        <Card
            title="Ngân hàng Câu hỏi"
            extra={
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    ⚡ Tạo đề ngẫu nhiên
                </Button>
            }
        >
            {/* KHU VỰC THÊM CÂU HỎI */}
            <Card type="inner" title="Thêm câu hỏi mới" style={{ marginBottom: 24 }}>
                <Form form={form} layout="vertical" onFinish={handleSubmitThem}>
                    <Row gutter={16}>
                        <Col span={4}>
                            <Form.Item name="maCauHoi" label="Mã câu hỏi" rules={[{ required: true }]}>
                                <Input placeholder="VD: CH001" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            {/* Cho phép nhập text tự do, hoặc gợi ý môn cũ nếu dùng tooltip */}
                            <Form.Item name="monHoc" label="Môn học" rules={[{ required: true }]}>
                                <Input placeholder="Nhập tên môn học..." />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name="mucDo" label="Mức độ" rules={[{ required: true }]}>
                                <Select placeholder="Chọn mức độ">
                                    {cacMucDo.map((md) => (
                                        <Option key={md} value={md}>
                                            {md}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item name="noiDung" label="Nội dung câu hỏi" rules={[{ required: true }]}>
                                <Input.TextArea rows={1} placeholder="Nhập nội dung câu hỏi..." />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type="primary" htmlType="submit">
                        + Thêm vào Ngân hàng
                    </Button>
                </Form>
            </Card>

            {/* BẢNG CÂU HỎI */}
            <h3>Danh sách Câu hỏi ({danhSachCauHoi.length} câu)</h3>
            <Table
                dataSource={danhSachCauHoi}
                columns={columns}
                rowKey="maCauHoi"
                size="middle"
                pagination={{ pageSize: 15 }}
            />

            {/* MODAL TẠO ĐỀ THI */}
            <Modal
                title="Tạo đề thi ngẫu nhiên"
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setDeThiHienTai(null);
                    formTaoDe.resetFields();
                }}
                footer={null}
                width={700}
            >
                <Form form={formTaoDe} layout="inline" style={{ marginBottom: 24 }}>
                    <Form.Item name="monHoc" rules={[{ required: true, message: 'Chọn môn học' }]}>
                        <Select placeholder="Chọn môn học" style={{ width: 250 }}>
                            {danhSachMonHoc.map((m) => (
                                <Option key={m} value={m}>
                                    {m}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="soLuong" rules={[{ required: true, message: 'Nhập số câu' }]}>
                        <InputNumber min={1} max={100} placeholder="Số câu" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={handleTaoDe}>
                            Tạo đề ngay
                        </Button>
                    </Form.Item>
                </Form>

                {/* Kết quả đề thi */}
                {deThiHienTai && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4>Đề thi được tạo ({deThiHienTai.length} câu)</h4>
                            <Button size="small" onClick={() => setDeThiHienTai(null)}>
                                Xóa kết quả
                            </Button>
                        </div>
                        <Table
                            dataSource={deThiHienTai}
                            columns={[
                                { title: 'Mã', dataIndex: 'maCauHoi', width: 80 },
                                { title: 'Nội dung', dataIndex: 'noiDung' },
                                {
                                    title: 'Mức độ',
                                    dataIndex: 'mucDo',
                                    width: 100,
                                    render: (val: string) => <Tag color={mauMucDo(val)}>{val}</Tag>,
                                },
                            ]}
                            rowKey={(record) => record.maCauHoi + Math.random()} // random để key unique khi gen lại
                            size="small"
                            pagination={false}
                            bordered
                        />
                    </div>
                )}
            </Modal>

            {/* BẢNG LỊCH SỬ ĐỀ THI */}
            {danhSachDeThi.length > 0 && (
                <div style={{ marginTop: 32 }}>
                    <h3>Lịch sử Đề thi ({danhSachDeThi.length} đề)</h3>
                    <Table
                        dataSource={danhSachDeThi}
                        columns={[
                            { title: 'Mã đề', dataIndex: 'maDe', width: 140 },
                            { title: 'Môn học', dataIndex: 'monHoc', width: 150 },
                            {
                                title: 'Số câu',
                                dataIndex: 'danhSachCauHoi',
                                width: 100,
                                align: 'center' as const,
                                render: (list: any[]) => list.length,
                            },
                            { title: 'Thời gian tạo', dataIndex: 'thoiGianTao', width: 160 },
                            {
                                title: 'Thao tác',
                                width: 100,
                                align: 'center' as const,
                                render: (_: any, record: any) => (
                                    <Button danger type="link" onClick={() => xoaDeThi(record.maDe)}>
                                        Xóa biểu ghi
                                    </Button>
                                ),
                            },
                        ]}
                        rowKey="maDe"
                        size="small"
                        pagination={{ pageSize: 5 }}
                        expandable={{
                            expandedRowRender: (de) => (
                                <Table
                                    dataSource={de.danhSachCauHoi}
                                    columns={[
                                        { title: 'Mã', dataIndex: 'maCauHoi', width: 80 },
                                        { title: 'Nội dung', dataIndex: 'noiDung' },
                                        {
                                            title: 'Mức độ',
                                            dataIndex: 'mucDo',
                                            width: 100,
                                            render: (val: string) => <Tag color={mauMucDo(val)}>{val}</Tag>,
                                        },
                                    ]}
                                    rowKey="maCauHoi"
                                    size="small"
                                    pagination={false}
                                />
                            ),
                        }}
                    />
                </div>
            )}
        </Card>
    );
};

export default NganHangCauHoiPage;
