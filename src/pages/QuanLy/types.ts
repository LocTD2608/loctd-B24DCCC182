// ===== TYPES cho module Quản Lý Đặt Lịch Hẹn =====

// Trạng thái lịch hẹn
export type TrangThaiLichHen = 'Chờ xác nhận' | 'Đã xác nhận' | 'Hoàn thành' | 'Đã hủy';

// Các ngày trong tuần
export type ThuTrongTuan =
    | 'Thứ 2'
    | 'Thứ 3'
    | 'Thứ 4'
    | 'Thứ 5'
    | 'Thứ 6'
    | 'Thứ 7'
    | 'Chủ nhật';

// Ca làm việc trong tuần
export interface LichLamViec {
    thu: ThuTrongTuan;
    batDau: string; // 'HH:mm'
    ketThuc: string; // 'HH:mm'
}

// Nhân viên
export interface NhanVien {
    id: string;
    maNV: string;
    hoTen: string;
    soDienThoai: string;
    chuyenMon: string;
    soKhachToiDa: number;
    lichLamViec: LichLamViec[];
}

// Dịch vụ
export interface DichVu {
    id: string;
    maDV: string;
    tenDV: string;
    thoiGian: number; // phút
    gia: number; // VND
    moTa?: string;
}

// Lịch hẹn
export interface LichHen {
    id: string;
    maLichHen: string;
    tenKhach: string;
    soDienThoai: string;
    nhanVienId: string;
    dichVuId: string;
    ngayHen: string; // 'YYYY-MM-DD'
    gioHen: string; // 'HH:mm'
    trangThai: TrangThaiLichHen;
    ghiChu?: string;
}

// Màu trạng thái - dùng trong Tag của Ant Design
export const TRANG_THAI_COLOR: Record<TrangThaiLichHen, string> = {
    'Chờ xác nhận': 'gold',
    'Đã xác nhận': 'blue',
    'Hoàn thành': 'green',
    'Đã hủy': 'red',
};

export const THU_OPTIONS: ThuTrongTuan[] = [
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
    'Chủ nhật',
];

// Dữ liệu mẫu ban đầu
export const INITIAL_NHAN_VIEN: NhanVien[] = [
    {
        id: '1',
        maNV: 'NV001',
        hoTen: 'Nguyễn Văn An',
        soDienThoai: '0901234567',
        chuyenMon: 'Cắt tóc, Uốn',
        soKhachToiDa: 8,
        lichLamViec: [
            { thu: 'Thứ 2', batDau: '09:00', ketThuc: '17:00' },
            { thu: 'Thứ 3', batDau: '09:00', ketThuc: '17:00' },
            { thu: 'Thứ 5', batDau: '09:00', ketThuc: '17:00' },
            { thu: 'Thứ 6', batDau: '09:00', ketThuc: '17:00' },
        ],
    },
    {
        id: '2',
        maNV: 'NV002',
        hoTen: 'Trần Thị Bình',
        soDienThoai: '0912345678',
        chuyenMon: 'Nail, Spa',
        soKhachToiDa: 6,
        lichLamViec: [
            { thu: 'Thứ 3', batDau: '10:00', ketThuc: '18:00' },
            { thu: 'Thứ 4', batDau: '10:00', ketThuc: '18:00' },
            { thu: 'Thứ 6', batDau: '09:00', ketThuc: '17:00' },
            { thu: 'Thứ 7', batDau: '08:00', ketThuc: '16:00' },
        ],
    },
];

export const INITIAL_DICH_VU: DichVu[] = [
    { id: '1', maDV: 'DV001', tenDV: 'Cắt tóc nam', thoiGian: 30, gia: 80000, moTa: 'Cắt kiểu + gội đầu' },
    { id: '2', maDV: 'DV002', tenDV: 'Uốn tóc', thoiGian: 90, gia: 350000, moTa: 'Uốn xoăn/duỗi' },
    { id: '3', maDV: 'DV003', tenDV: 'Spa mặt cơ bản', thoiGian: 60, gia: 200000, moTa: 'Làm sạch + massage mặt' },
    { id: '4', maDV: 'DV004', tenDV: 'Làm nail', thoiGian: 45, gia: 150000, moTa: 'Sơn gel 10 móng' },
];
