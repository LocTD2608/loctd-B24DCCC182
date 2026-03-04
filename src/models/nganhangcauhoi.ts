import { useState } from 'react';

// Đọc dữ liệu từ localStorage
function docLocalStorage<T>(key: string): T[] {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
}

function luuLocalStorage<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Chọn ngẫu nhiên `soLuong` phần tử từ mảng
function chonNgauNhien<T>(mang: T[], soLuong: number): T[] {
    const ban = [...mang];
    const ketQua: T[] = [];
    for (let i = 0; i < soLuong && ban.length > 0; i++) {
        const viTri = Math.floor(Math.random() * ban.length);
        ketQua.push(ban[viTri]);
        ban.splice(viTri, 1);
    }
    return ketQua;
}

export default () => {
    const [danhSachCauHoi, setDanhSachCauHoi] = useState<NganHangCauHoi.ICauHoi[]>(() =>
        docLocalStorage<NganHangCauHoi.ICauHoi>('nhch_cauhoi_v2'),
    );

    function themCauHoi(cauHoi: NganHangCauHoi.ICauHoi) {
        const moi = [cauHoi, ...danhSachCauHoi];
        setDanhSachCauHoi(moi);
        luuLocalStorage('nhch_cauhoi_v2', moi);
    }

    function xoaCauHoi(maCauHoi: string) {
        const moi = danhSachCauHoi.filter((c) => c.maCauHoi !== maCauHoi);
        setDanhSachCauHoi(moi);
        luuLocalStorage('nhch_cauhoi_v2', moi);
    }

    // Lấy dánh sách các môn học (Unique từ các câu hỏi đã thêm)
    function layDanhSachMon(): string[] {
        const cacMon = danhSachCauHoi.map((c) => c.monHoc);
        return Array.from(new Set(cacMon)).sort();
    }

    // Tạo đề ngẫu nhiên theo môn và số lượng (không màng độ khó)
    function taoDeThi(monHoc: string, soLuong: number): { ok: boolean; message: string; deThi?: NganHangCauHoi.ICauHoi[] } {
        const cauHoiMon = danhSachCauHoi.filter((c) => c.monHoc === monHoc);

        if (cauHoiMon.length < soLuong) {
            return {
                ok: false,
                message: `Môn "${monHoc}" chỉ có ${cauHoiMon.length} câu, không đủ ${soLuong} câu để tạo đề.`,
            };
        }

        const deChon = chonNgauNhien(cauHoiMon, soLuong);
        return { ok: true, message: 'Tạo đề thành công!', deThi: deChon };
    }

    return {
        danhSachCauHoi,
        themCauHoi,
        xoaCauHoi,
        layDanhSachMon,
        taoDeThi,
    };
};
