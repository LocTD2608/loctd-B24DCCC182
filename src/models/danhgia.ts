import { useState } from 'react';

export default () => {
    const [data, setData] = useState<any[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [row, setRow] = useState<any>();

    const getDataDanhGia = async () => {
        const dataLocal: any = JSON.parse(localStorage.getItem('danhgia_data') || '[]');
        setData(dataLocal);
    };

    return {
        data,
        visible,
        setVisible,
        row,
        setRow,
        isEdit,
        setIsEdit,
        setData,
        getDataDanhGia,
    };
};