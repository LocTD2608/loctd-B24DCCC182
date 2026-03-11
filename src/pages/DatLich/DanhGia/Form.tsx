import { Button, Form, Input, Select, Rate, message } from 'antd';
import { useModel } from 'umi';

const FormDanhGia = () => {
    const { data, getDataDanhGia, row, isEdit, setVisible } = useModel('danhgia');
    const [form] = Form.useForm();

    const lichHenList = JSON.parse(localStorage.getItem('lichhen_data') || '[]');
    const danhGiaList = data;

    const lichHenHoanThanhChuaDanhGia = lichHenList.filter(
        (lh: any) => lh.trangThai === 'Hoàn thành' && !danhGiaList.find((dg: any) => dg.lichHenId === lh.id)
    );

    return (
        <Form
            form={form}
            onFinish={(values) => {
                const dataTemp = [...data];

                if (isEdit) {
                    const index = data.findIndex((item: any) => item.id === row?.id);
                    dataTemp.splice(index, 1, { ...row, ...values });
                } else {
                    const lichHen = lichHenList.find((lh: any) => lh.id === values.lichHenId);
                    if (!lichHen) {
                        message.error('Không tìm thấy lịch hẹn');
                        return;
                    }
                    const newId = new Date().getTime().toString();
                    dataTemp.unshift({
                        id: newId,
                        lichHenId: values.lichHenId,
                        nhanVienId: lichHen.nhanVienId,
                        danhGiaDiem: values.danhGiaDiem,
                        nhanXetKhachHang: values.nhanXetKhachHang,
                        phanHoiNhanVien: ''
                    });
                }

                localStorage.setItem('danhgia_data', JSON.stringify(dataTemp));
                setVisible(false);
                getDataDanhGia();
                message.success('Đã lưu thông tin đánh giá');
            }}
            initialValues={row}
            layout='vertical'
        >
            {!isEdit ? (
                <>
                    <Form.Item
                        label='Lịch hẹn đã hoàn thành'
                        name='lichHenId'
                        rules={[{ required: true, message: 'Vui lòng chọn lịch hẹn!' }]}
                    >
                        <Select showSearch optionFilterProp='children'>
                            {lichHenHoanThanhChuaDanhGia.map((lh: any) => (
                                <Select.Option key={lh.id} value={lh.id}>
                                    {lh.khachHang} - {lh.ngay} {lh.gio}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label='Đánh giá mức độ hài lòng'
                        name='danhGiaDiem'
                        rules={[{ required: true, message: 'Vui lòng đánh giá điểm!' }]}
                    >
                        <Rate />
                    </Form.Item>

                    <Form.Item
                        label='Nhận xét của khách hàng'
                        name='nhanXetKhachHang'
                        rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </>
            ) : (
                <Form.Item
                    label='Phản hồi của nhân viên'
                    name='phanHoiNhanVien'
                    rules={[{ required: true, message: 'Vui lòng nhập phản hồi!' }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button onClick={() => setVisible(false)}>Hủy</Button>
                <Button htmlType='submit' type='primary'>
                    {isEdit ? 'Gửi phản hồi' : 'Gửi đánh giá'}
                </Button>
            </div>
        </Form>
    );
};

export default FormDanhGia;