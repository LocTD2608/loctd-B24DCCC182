declare module NganHangCauHoi {
    export interface ICauHoi {
        maCauHoi: string;
        monHoc: string;
        noiDung: string;
        mucDo: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
    }
}
