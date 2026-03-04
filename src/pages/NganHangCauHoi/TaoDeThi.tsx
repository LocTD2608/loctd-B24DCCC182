import { Alert, Button, Form, InputNumber, Select, Table, Tag } from 'antd';
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

const TaoDeThi = () => {
    const { danhSachMon, danhSachDeThi, taoDeThi } = useModel('nganhangcauhoi');
    const [form] = Form.useForm();
    const [thongBao, setThongBao] = useState<{ ok: boolean; message: string } | null>(null);

    function handleTaoDe(values: any) {
        const yeuCau: Record<string, number> = {};
        for (let i = 0; i < cacMucDo.length; i++) {
            yeuCau[cacMucDo[i]] = values[cacMucDo[i]] ?? 0;
        }

        const tongSoCau = Object.values(yeuCau).reduce((a, b) => a + b, 0);
        if (tongSoCau === 0) {
            setThongBao({ ok: false, message: 'Vui lòng nhập ít nhất 1 câu hỏi cho 1 mức độ.' });
            return;
        }

        const ketQua = taoDeThi(values.maMon, yeuCau);
        setThongBao({ ok: ketQua.ok, message: ketQua.message });
        if (ketQua.ok) form.resetFields();
    }

    // Cột cho bảng câu hỏi trong đề đã tạo (dùng trong expandable row)
    const cotCauHoi = [
        { title: 'Mã', dataIndex: 'maCauHoi', width: 120 },
        { title: 'Nội dung', dataIndex: 'noiDung' },
        {
            title: 'Mức độ',
            dataIndex: 'mucDo',
            width: 120,
            render: (val: string) => <Tag color={mauMucDo(val)}>{val}</Tag>,
        },
    ];

    // Cột tổng quan danh sách đề thi
    const cotDeThi = [
        { title: 'Mã đề', dataIndex: 'maDe', width: 160 },
        { title: 'Mã môn', dataIndex: 'maMon', width: 120 },
        {
            title: 'Số câu',
            dataIndex: 'danhSachCauHoi',
            width: 100,
            align: 'center' as const,
            render: (list: any[]) => list.length,
        },
        { title: 'Thời gian tạo', dataIndex: 'thoiGianTao', width: 180 },
    ];

    return (
        <div>
            {/* Form tạo đề */}
            <Form form={form} layout="vertical" onFinish={handleTaoDe} style={{ maxWidth: 600, marginBottom: 24 }}>
                <Form.Item name="maMon" label="Môn học" rules={[{ required: true, message: 'Chọn môn học' }]}>
                    <Select placeholder="Chọn môn học">
                        {danhSachMon.map((m) => (
                            <Option key={m.maMon} value={m.maMon}>
                                {m.tenMon}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <p style={{ marginBottom: 8, fontWeight: 500 }}>Số câu theo mức độ:</p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {cacMucDo.map((md) => (
                        <Form.Item key={md} name={md} label={md} initialValue={0}>
                            <InputNumber min={0} max={100} />
                        </Form.Item>
                    ))}
                </div>

                {thongBao && (
                    <Alert
                        type={thongBao.ok ? 'success' : 'error'}
                        message={thongBao.message}
                        showIcon
                        style={{ marginBottom: 12 }}
                    />
                )}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Tạo đề thi
                    </Button>
                </Form.Item>
            </Form>

            {/* Lịch sử đề thi đã tạo - bảng tổng quan dùng cotDeThi, chi tiết dùng expandable + cotCauHoi */}
            <h3>Đề thi đã tạo ({danhSachDeThi.length})</h3>
            {danhSachDeThi.length === 0 ? (
                <p style={{ color: '#aaa' }}>Chưa có đề thi nào được tạo.</p>
            ) : (
                <Table
                    dataSource={danhSachDeThi}
                    columns={cotDeThi}
                    rowKey="maDe"
                    size="small"
                    pagination={{ pageSize: 5 }}
                    expandable={{
                        expandedRowRender: (de) => (
                            <Table
                                dataSource={de.danhSachCauHoi}
                                columns={cotCauHoi}
                                rowKey="maCauHoi"
                                size="small"
                                pagination={false}
                            />
                        ),
                    }}
                />
            )}
        </div>
    );
};

export default TaoDeThi;

