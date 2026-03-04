import { useState } from 'react';

// Các lựa chọn hợp lệ
const cacLuaChon = ['Kéo', 'Búa', 'Bao'];

// Luật thắng: key thắng value
const luatThang: Record<string, string> = {
  Búa: 'Kéo',
  Kéo: 'Bao',
  Bao: 'Búa',
};

function chonMayNgauNhien(): string {
  const viTri = Math.floor(Math.random() * cacLuaChon.length);
  return cacLuaChon[viTri];
}

// So sánh lựa chọn người chơi với máy, trả về Thắng/Thua/Hòa
function soSanh(nguoi: string, may: string): string {
  if (nguoi === may) return 'Hòa';
  if (luatThang[nguoi] === may) return 'Thắng';
  return 'Thua';
}

export default () => {
  const [lichSu, setLichSu] = useState<OanTuTi.IVan[]>(() => {
    const raw = localStorage.getItem('oantuti_lichsu');
    return raw ? JSON.parse(raw) : [];
  });

  const [ketQuaHienTai, setKetQuaHienTai] = useState<OanTuTi.IVan | null>(null);

  function choi(luaChonNguoi: string) {
    const luaChonMay = chonMayNgauNhien();
    const ketQua = soSanh(luaChonNguoi, luaChonMay);

    const van: OanTuTi.IVan = { nguoiChon: luaChonNguoi, mayChon: luaChonMay, ketQua };

    // Thêm ván mới vào đầu lịch sử
    const lichSuMoi = [van, ...lichSu];
    setLichSu(lichSuMoi);
    setKetQuaHienTai(van);
    localStorage.setItem('oantuti_lichsu', JSON.stringify(lichSuMoi));
  }

  function xoaLichSu() {
    setLichSu([]);
    setKetQuaHienTai(null);
    localStorage.removeItem('oantuti_lichsu');
  }

  return { lichSu, ketQuaHienTai, choi, xoaLichSu };
};
