import { Button, Form, Input, Select, Table, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const { Option } = Select;
const cacMucDo = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

// Màu tag theo mức độ khó
function mauMucDo(mucDo: string): string {
    if (mucDo === 'Dễ') return 'green';
    if (mucDo === 'Trung bình') return 'blue';
    if (mucDo === 'Khó') return 'orange';
    return 'red'; // Rất khó
}

const CauHoi = () => {
    const { danhSachCauHoi, danhSachMon, danhSachKhoi, themCauHoi, locCauHoi } = useModel('nganhangcauhoi');
    const [form] = Form.useForm();

    // Bộ lọc
    const [locMon, setLocMon] = useState('');
    const [locMucDo, setLocMucDo] = useState('');
    const [locKhoi, setLocKhoi] = useState('');

    function handleSubmit(values: any) {
        themCauHoi({
            maCauHoi: values.maCauHoi.trim(),
            maMon: values.maMon,
            noiDung: values.noiDung.trim(),
            mucDo: values.mucDo,
            maKhoi: values.maKhoi,
        });
        form.resetFields();
    }

    // Kết quả sau khi lọc
    const danhSachHienThi = locCauHoi(locMon, locMucDo, locKhoi);

    const columns = [
        { title: 'Mã câu hỏi', dataIndex: 'maCauHoi', width: 130 },
        { title: 'Mã môn', dataIndex: 'maMon', width: 100 },
        { title: 'Nội dung', dataIndex: 'noiDung' },
        {
            title: 'Mức độ',
            dataIndex: 'mucDo',
            width: 120,
            render: (val: string) => <Tag color={mauMucDo(val)}>{val}</Tag>,
        },
        { title: 'Khối kiến thức', dataIndex: 'maKhoi', width: 140 },
    ];

    return (
        <div>
            {/* Form thêm câu hỏi */}
            <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Form.Item name="maCauHoi" label="Mã câu hỏi" rules={[{ required: true }]} style={{ minWidth: 140 }}>
                        <Input placeholder="vd: CH001" />
                    </Form.Item>
                    <Form.Item name="maMon" label="Môn học" rules={[{ required: true }]} style={{ minWidth: 160 }}>
                        <Select placeholder="Chọn môn">
                            {danhSachMon.map((m) => (
                                <Option key={m.maMon} value={m.maMon}>
                                    {m.tenMon}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="mucDo" label="Mức độ" rules={[{ required: true }]} style={{ minWidth: 140 }}>
                        <Select placeholder="Chọn mức độ">
                            {cacMucDo.map((md) => (
                                <Option key={md} value={md}>
                                    {md}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="maKhoi" label="Khối kiến thức" rules={[{ required: true }]} style={{ minWidth: 160 }}>
                        <Select placeholder="Chọn khối">
                            {danhSachKhoi.map((k) => (
                                <Option key={k.ma} value={k.ma}>
                                    {k.ten}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
                <Form.Item name="noiDung" label="Nội dung câu hỏi" rules={[{ required: true }]}>
                    <Input.TextArea rows={2} placeholder="Nhập nội dung câu hỏi..." />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Thêm câu hỏi
                    </Button>
                </Form.Item>
            </Form>

            {/* Bộ lọc */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <Select
                    allowClear
                    placeholder="Lọc theo môn"
                    style={{ width: 180 }}
                    onChange={(v) => setLocMon(v ?? '')}
                >
                    {danhSachMon.map((m) => (
                        <Option key={m.maMon} value={m.maMon}>
                            {m.tenMon}
                        </Option>
                    ))}
                </Select>
                <Select
                    allowClear
                    placeholder="Lọc theo mức độ"
                    style={{ width: 160 }}
                    onChange={(v) => setLocMucDo(v ?? '')}
                >
                    {cacMucDo.map((md) => (
                        <Option key={md} value={md}>
                            {md}
                        </Option>
                    ))}
                </Select>
                <Select
                    allowClear
                    placeholder="Lọc theo khối"
                    style={{ width: 180 }}
                    onChange={(v) => setLocKhoi(v ?? '')}
                >
                    {danhSachKhoi.map((k) => (
                        <Option key={k.ma} value={k.ma}>
                            {k.ten}
                        </Option>
                    ))}
                </Select>
                <span style={{ lineHeight: '32px', color: '#888' }}>
                    Hiển thị {danhSachHienThi.length} / {danhSachCauHoi.length} câu hỏi
                </span>
            </div>

            <Table
                dataSource={danhSachHienThi}
                columns={columns}
                rowKey="maCauHoi"
                size="small"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default CauHoi;
