import { Button, Card, Popconfirm, Table, Tag } from 'antd';
import { useModel } from 'umi';
import type { IColumn } from '@/components/Table/typing';

// Emoji đại diện cho mỗi lựa chọn
function layBieuTuong(luaChon: string): string {
    if (luaChon === 'Kéo') return '✌️ Kéo';
    if (luaChon === 'Búa') return '✊ Búa';
    if (luaChon === 'Bao') return '🖐️ Bao';
    return luaChon;
}

const OanTuTiPage = () => {
    const { lichSu, ketQuaHienTai, choi, xoaLichSu } = useModel('oantuti');

    const columns: IColumn<OanTuTi.IVan>[] = [
        {
            title: 'Người chơi',
            dataIndex: 'nguoiChon',
            width: 150,
            render: (val: string) => layBieuTuong(val),
        },
        {
            title: 'Máy chọn',
            dataIndex: 'mayChon',
            width: 150,
            render: (val: string) => layBieuTuong(val),
        },
        {
            title: 'Kết quả',
            dataIndex: 'ketQua',
            width: 120,
            align: 'center',
            render: (val: string) => {
                const mauSac = val === 'Thắng' ? 'green' : val === 'Thua' ? 'red' : 'default';
                return <Tag color={mauSac}>{val}</Tag>;
            },
        },
    ];

    // Hiển thị kết quả ván hiện tại
    function renderKetQua() {
        if (!ketQuaHienTai) return <p style={{ color: '#aaa' }}>Hãy chọn Kéo, Búa hoặc Bao để bắt đầu!</p>;

        const mau = ketQuaHienTai.ketQua === 'Thắng' ? 'green' : ketQuaHienTai.ketQua === 'Thua' ? 'red' : 'orange';
        return (
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <p>
                    Bạn: <b>{layBieuTuong(ketQuaHienTai.nguoiChon)}</b> &nbsp;vs&nbsp; Máy:{' '}
                    <b>{layBieuTuong(ketQuaHienTai.mayChon)}</b>
                </p>
                <h2 style={{ color: mau }}>{ketQuaHienTai.ketQua}!</h2>
            </div>
        );
    }

    return (
        <Card title="Oẳn Tù Tì">
            {/* Khu vực chọn */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h3>Chọn của bạn:</h3>
                <Button size="large" style={{ marginRight: 8 }} onClick={() => choi('Kéo')}>
                    ✌️ Kéo
                </Button>
                <Button size="large" style={{ marginRight: 8 }} onClick={() => choi('Búa')}>
                    ✊ Búa
                </Button>
                <Button size="large" onClick={() => choi('Bao')}>
                    🖐️ Bao
                </Button>
            </div>

            {/* Kết quả ván vừa chơi */}
            {renderKetQua()}

            {/* Lịch sử */}
            <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h3 style={{ margin: 0 }}>Lịch sử ({lichSu.length} ván)</h3>
                    {lichSu.length > 0 && (
                        <Popconfirm title="Xóa toàn bộ lịch sử?" onConfirm={xoaLichSu} okText="Xóa" cancelText="Hủy">
                            <Button danger size="small">
                                Xóa lịch sử
                            </Button>
                        </Popconfirm>
                    )}
                </div>
                <Table
                    dataSource={lichSu}
                    columns={columns}
                    rowKey={(_, index) => String(index)}
                    pagination={{ pageSize: 10 }}
                    size="small"
                />
            </div>
        </Card>
    );
};

export default OanTuTiPage;
