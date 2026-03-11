import { Button, Modal, Table, Rate, Card, Col, Row, Statistic } from 'antd';
import { useEffect, useMemo } from 'react';
import { useModel } from 'umi';
import FormDanhGia from './Form';
import { MessageOutlined, PlusOutlined } from '@ant-design/icons';

const DanhGia = () => {
    const { data, getDataDanhGia, setRow, isEdit, setVisible, setIsEdit, visible } = useModel('danhgia');
    const nhanVienList = JSON.parse(localStorage.getItem('nhanvien_data') || '[]');
    const lichHenList = JSON.parse(localStorage.getItem('lichhen_data') || '[]');

    useEffect(() => {
        getDataDanhGia();
    }, []);

    const trungBinhNhanVien = useMemo(() => {
        const stats: any = {};
        nhanVienList.forEach((nv: any) => {
            const diems = data.filter((item: any) => item.nhanVienId === nv.id).map((item: any) => item.danhGiaDiem);
            if (diems.length > 0) {
                const avg = diems.reduce((a: number, b: number) => a + b, 0) / diems.length;
                stats[nv.id] = { ten: nv.tenNhanVien, tb: avg.toFixed(1), sl: diems.length };
            }
        });
        return Object.values(stats);
    }, [data, nhanVienList]);

    const columns: any[] = [
        {
            title: 'Khách hàng',
            key: 'khachHang',
            render: (record: any) => {
                const lh = lichHenList.find((item: any) => item.id === record.lichHenId);
                return lh ? lh.khachHang : '';
            }
        },
        {
            title: 'Nhân viên phục vụ',
            dataIndex: 'nhanVienId',
            key: 'nhanVienId',
            render: (id: string) => {
                const nv = nhanVienList.find((item: any) => item.id === id);
                return nv ? nv.tenNhanVien : id;
            }
        },
        {
            title: 'Điểm',
            dataIndex: 'danhGiaDiem',
            key: 'danhGiaDiem',
            render: (diem: number) => <Rate disabled defaultValue={diem} />
        },
        {
            title: 'Nhận xét',
            dataIndex: 'nhanXetKhachHang',
            key: 'nhanXetKhachHang',
        },
        {
            title: 'Phản hồi NV',
            dataIndex: 'phanHoiNhanVien',
            key: 'phanHoiNhanVien',
            render: (text: string) => text ? <i style={{ color: 'gray' }}>"{text}"</i> : <span style={{ color: '#ccc' }}>Chưa có</span>
        },
        {
            title: 'Thao tác',
            width: 150,
            align: 'center',
            render: (record: any) => {
                return (
                    <div>
                        <Button
                            type='primary'
                            icon={<MessageOutlined />}
                            disabled={!!record.phanHoiNhanVien}
                            onClick={() => {
                                setVisible(true);
                                setRow(record);
                                setIsEdit(true);
                            }}
                        >
                            Phản hồi
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div style={{ padding: 24, background: '#fff' }}>
            <div style={{ marginBottom: 24 }}>
                <h3>Đánh giá trung bình theo nhân viên</h3>
                <Row gutter={[16, 16]}>
                    {trungBinhNhanVien.map((stat: any, idx: number) => (
                        <Col span={6} key={idx}>
                            <Card bordered={true}>
                                <Statistic
                                    title={stat.ten}
                                    value={stat.tb}
                                    suffix={`/ 5.0 (${stat.sl} lượt)`}
                                />
                                <Rate disabled allowHalf value={parseFloat(stat.tb)} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={() => {
                    setVisible(true);
                    setRow(undefined);
                    setIsEdit(false);
                }}
                style={{ marginBottom: 16 }}
            >
                Khách Thêm đánh giá
            </Button>

            <Table
                dataSource={data}
                columns={columns}
                rowKey="id"
                bordered
            />

            <Modal
                destroyOnClose
                footer={false}
                title={isEdit ? 'Nhân viên Phản hồi' : 'Khách hàng Đánh giá'}
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                }}
            >
                <FormDanhGia />
            </Modal>
        </div>
    );
};

export default DanhGia;