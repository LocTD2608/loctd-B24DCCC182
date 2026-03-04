import { Button, Form, Input, Table } from 'antd';
import { useModel } from 'umi';

const KhoiKienThuc = () => {
    const { danhSachKhoi, themKhoi } = useModel('nganhangcauhoi');
    const [form] = Form.useForm();

    function handleSubmit(values: { ma: string; ten: string }) {
        themKhoi({ ma: values.ma.trim(), ten: values.ten.trim() });
        form.resetFields();
    }

    const columns = [
        { title: 'Mã khối', dataIndex: 'ma', width: 120 },
        { title: 'Tên khối kiến thức', dataIndex: 'ten' },
    ];

    return (
        <div>
            <Form form={form} layout="inline" onFinish={handleSubmit} style={{ marginBottom: 16 }}>
                <Form.Item name="ma" rules={[{ required: true, message: 'Nhập mã khối' }]}>
                    <Input placeholder="Mã khối (vd: KT01)" />
                </Form.Item>
                <Form.Item name="ten" rules={[{ required: true, message: 'Nhập tên khối' }]}>
                    <Input placeholder="Tên khối kiến thức" style={{ width: 300 }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Thêm
                    </Button>
                </Form.Item>
            </Form>

            <Table
                dataSource={danhSachKhoi}
                columns={columns}
                rowKey="ma"
                size="small"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default KhoiKienThuc;
