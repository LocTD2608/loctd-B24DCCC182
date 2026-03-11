// src/pages/QuanLy/index.tsx
import React, { useState } from 'react';
import { Tabs, Typography } from 'antd';
import { AppstoreOutlined, CalendarOutlined, ScheduleOutlined, TeamOutlined } from '@ant-design/icons';
import NhanVienTab from './NhanVien';
import DichVuTab from './DichVu';
import LichLamViecTab from './LichLamViec';
import LichHenTab from './LichHen';
import type { DichVu, LichHen, NhanVien } from './types';
import { INITIAL_DICH_VU, INITIAL_NHAN_VIEN } from './types';

const { TabPane } = Tabs;
const { Title } = Typography;

const QuanLyDatLich: React.FC = () => {
    // === STATE TRUNG TÂM ===
    // Tất cả dữ liệu được lưu ở đây và truyền xuống các Tab con qua props.
    const [nhanVienList, setNhanVienList] = useState<NhanVien[]>(INITIAL_NHAN_VIEN);
    const [dichVuList, setDichVuList] = useState<DichVu[]>(INITIAL_DICH_VU);
    const [lichHenList, setLichHenList] = useState<LichHen[]>([]);

    return (
        <div style={{ padding: 24 }}>
            <Title level={2} style={{ marginBottom: 24 }}>
                📅 Hệ Thống Quản Lý Đặt Lịch Hẹn
            </Title>
            <Tabs defaultActiveKey="nhan-vien" size="large" type="card">
                <TabPane tab={<span><TeamOutlined /> Nhân Viên</span>} key="nhan-vien">
                    <NhanVienTab nhanVienList={nhanVienList} setNhanVienList={setNhanVienList} />
                </TabPane>

                <TabPane tab={<span><AppstoreOutlined /> Dịch Vụ</span>} key="dich-vu">
                    <DichVuTab dichVuList={dichVuList} setDichVuList={setDichVuList} />
                </TabPane>

                <TabPane tab={<span><ScheduleOutlined /> Lịch Làm Việc</span>} key="lich-lam-viec">
                    <LichLamViecTab nhanVienList={nhanVienList} setNhanVienList={setNhanVienList} />
                </TabPane>

                <TabPane tab={<span><CalendarOutlined /> Lịch Hẹn</span>} key="lich-hen">
                    <LichHenTab
                        lichHenList={lichHenList}
                        setLichHenList={setLichHenList}
                        nhanVienList={nhanVienList}
                        dichVuList={dichVuList}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default QuanLyDatLich;
