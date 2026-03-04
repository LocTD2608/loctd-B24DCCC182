import { Button, Form, Input, InputNumber, Table } from 'antd';
import { useModel } from 'umi';

const MonHoc = () => {
    const { danhSachMon, themMon } = useModel('nganhangcauhoi');
    const [form] = Form.useForm();

    function handleSubmit(values: { maMon: string; tenMon: string; soTinChi: number }) {
        themMon({ maMon: values.maMon.trim(), tenMon: values.tenMon.trim(), soTinChi: values.soTinChi });
        form.resetFields();
    }

    const columns = [
        { title: 'Mã môn', dataIndex: 'maMon', width: 120 },
        { title: 'Tên môn học', dataIndex: 'tenMon' },
        { title: 'Số tín chỉ', dataIndex: 'soTinChi', width: 120, align: 'center' as const },
    ];

    return (
        <div>
            <Form form={form} layout="inline" onFinish={handleSubmit} style={{ marginBottom: 16 }}>
                <Form.Item name="maMon" rules={[{ required: true, message: 'Nhập mã môn' }]}>
                    <Input placeholder="Mã môn (vd: CNTT01)" />
                </Form.Item>
                <Form.Item name="tenMon" rules={[{ required: true, message: 'Nhập tên môn' }]}>
                    <Input placeholder="Tên môn học" style={{ width: 260 }} />
                </Form.Item>
                <Form.Item name="soTinChi" rules={[{ required: true, message: 'Nhập số tín chỉ' }]}>
                    <InputNumber min={1} max={10} placeholder="Tín chỉ" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Thêm
                    </Button>
                </Form.Item>
            </Form>

            <Table
                dataSource={danhSachMon}
                columns={columns}
                rowKey="maMon"
                size="small"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default MonHoc;
