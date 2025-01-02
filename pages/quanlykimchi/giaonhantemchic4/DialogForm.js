import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { create_QLKC_C4_GIAONHAN_TEMCHI, get_HT_NGUOIDUNGbyMA_DVIQLY, update_QLKC_C4_GIAONHAN_TEMCHI } from "../../../services/quanlykimchi/QLKC_C4_GIAONHAN_TEMCHIService";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";

const mockData = {
    arrTrangThai: [
        { label: "Đang chờ duyệt", value: 0 },
        { label: "C1 đã ký", value: 1 },
        { label: "C2 đã ký", value: 2 },
        { label: "Bị hủy", value: 3 },
    ],
    arrLoaiBienBan: [
        { name: "-Chọn loại biên bản-", id: 0 },
        { name: "Phiếu mượn", id: 1 },
        { name: "Phiếu trả", id: 2 },
        { name: "Phiếu quyết toán", id: 3 }
    ],
    arrLoai: [
        { id: "Chì", name: "Chì" },
        { id: "Tem", name: "Tem" },
    ]
};

const FormField = ({ label, value, options, onChange, id, isDropdown = false, typeInput = "text", disabled = false, required = true }) => (
    <div className="field col-12 md:col-6">
        <label className='font-bold text-sm my-3 block' htmlFor={id}>
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isDropdown ? (
            <Dropdown
                filter
                placeholder={`Chọn ${label.toLowerCase()}`}
                id={id}
                name={id}
                value={value}
                optionValue="id"
                optionLabel="name"
                options={options}
                onChange={onChange}
                className="w-full"
                disabled={disabled}
            />
        ) : (
            <InputText
                type={typeInput}
                placeholder={`Nhập ${label.toLowerCase()}`}
                id={id}
                name={id}
                value={value || ''}
                onChange={onChange}
                className="w-full"
                disabled={disabled}
            />
        )}
    </div>
);

export const DialogForm = ({ isAdd, formData, setFormData, visible, setVisible, toast, loadData, DM_DONVI, DM_PHONGBAN }) => {
    const [loading, setLoading] = useState(false);
    const [dsPhongBan, setDsPhongBan] = useState([]);
    const [dsPhongBanGiao, setDsPhongBanGiao] = useState([]);
    const [dsNguoiDung, setDsNguoiDung] = useState([]);
    const [HT_NGUOIDUNG, setHT_NGUOIDUNG] = useState([]);
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    const currentDonVi = JSON.parse(sessionStorage.getItem("current_MADVIQLY"));

    // useEffect(() => {
    //     if (formData.doN_VI_NHAN) {
    //         setDsPhongBan(DM_PHONGBAN.filter(pb => pb.dm_donvi_id === formData.doN_VI_NHAN));
    //     }
    // }, [formData.doN_VI_NHAN, DM_PHONGBAN]);

    useEffect(() => {
        if (formData.doN_VI_NHAN) {
            console.log("DM_DONVI: ",DM_DONVI)
            const filteredPhongBan = DM_DONVI
                .filter(pb => pb.dm_donvi_id === formData.doN_VI_NHAN)
                .map(pb => ({ id: pb.id, name: pb.name, dm_donvi_id: pb.dm_donvi_id })); // Lấy cả ID và tên hoặc chỉ name nếu bạn cần
            setDsPhongBan(filteredPhongBan);
        }
    }, [formData.doN_VI_NHAN, DM_DONVI]);
    
    // useEffect(() => {
    //     if (formData.doN_VI_NHAN) {
    //         // const filteredUsers = HT_NGUOIDUNG.filter(user => 
    //         //     user.dm_donvi_id === formData.doN_VI_NHAN
    //         // );
    //         const filteredUsers = loadHT_NGUOIDUNG(formData.doN_VI_NHAN)
    //         setDsNguoiDung(filteredUsers);
    //     } else {
    //         setDsNguoiDung([]); // Reset danh sách khi không có đơn vị được chọn
    //     }
    // }, [formData.doN_VI_NHAN, HT_NGUOIDUNG]);
    useEffect(() => {
        const fetchUsersByDonViNhan = async () => {
            if (formData.doN_VI_NHAN) {
                try {
                    console.log("formData.doN_VI_NHAN: ",formData.doN_VI_NHAN)
                    const res = await get_HT_NGUOIDUNGbyMA_DVIQLY(formData.doN_VI_NHAN);
                    if (res) {
                        setDsNguoiDung([
                            { id: "", name: "Chọn người nhận" }, // Thêm option mặc định
                            ...res.map(item => ({
                                id: item.id,
                                name: item.hO_TEN,
                            }))
                        ]);
                    }
                    console.log("res: ",res)
                    console.log("dsNguoiDung: ",dsNguoiDung)
                } catch (error) {
                    console.error("Lỗi khi tải danh sách người dùng:", error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Lỗi',
                        detail: 'Không thể tải danh sách người dùng',
                        life: 3000
                    });
                }
            } 
        };
    
        fetchUsersByDonViNhan();
    }, [formData.doN_VI_NHAN]);
    
    useEffect(() => {
        if (currentDonVi) {
            setDsPhongBanGiao(DM_PHONGBAN.filter(pb => pb.dm_donvi_id === currentDonVi));
            setFormData(prev => ({
                ...prev,
                doN_VI_GIAO: currentDonVi,
                nguoI_GIAO: currentUser?.ho_ten || '',
                ngaY_GIAO: new Date().toISOString().slice(0, 16)
            }));
        }
    }, [currentDonVi]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "doN_VI_NHAN") {
            // Reset người nhận khi đổi đơn vị
            setFormData(prev => ({ 
                ...prev, 
                [name]: value,
                nguoI_NHAN: null // Reset người nhận
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        const requiredFields = {
            "sO_LUONG_GIAO": "Số lượng giao",
            "sO_LUONG_TRA": "Số lượng trả",
            "sO_LUONG_THUHOI": "Số lượng thu hồi",
            "loai": "Loại",
            "donvI_TINH": "Đơn vị tính",
            "doN_VI_NHAN": "Đơn vị nhận",
            "nguoI_NHAN": "Người nhận",
            "ngaY_NHAN": "Ngày nhận",
            // "loaI_BBAN": "Loại biên bản",
            "noI_DUNG": "Nội dung"
        };

        for (const [field, label] of Object.entries(requiredFields)) {
            if (!formData[field]) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Thông báo!',
                    detail: `Trường ${field} không được để trống.`,
                    life: 3000
                });
                return false;
            }
        }

        // Validate số lượng
        if (formData.sO_LUONG_GIAO < 0 || formData.sO_LUONG_TRA < 0 || formData.sO_LUONG_THUHOI < 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Lỗi!',
                detail: 'Số lượng không được âm',
                life: 3000
            });
            return false;
        }

        return true;
    };
  const loadHT_NGUOIDUNG = async (searchTerm) => {
    try {
        const res = await HT_NGUOIDUNG_Service.search(searchTerm);
        console.log("res: ",res)
        if (res && res.data) {
            // Map data để có cấu trúc phù hợp

            setHT_NGUOIDUNG([{id: "", name: "Chọn người nhận"}, ...res.data.map(item => ({
                id: item.id,
                name: item.hO_TEN,
                dm_donvi_id: item.dM_DONVI_ID,
            }))]);
        }
        console.log("HT_NGUOIDUNG: ",HT_NGUOIDUNG)
    } catch (error) { 
        console.error("Lỗi khi tải danh sách người dùng:", error);
        toast.current.show({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tải danh sách người dùng',
            life: 3000
        });
    }
  };
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                loaI_BBAN: Number(formData.loaI_BBAN),
                nguoI_GIAO: currentUser?.id,
                ngaY_GIAO: new Date().toISOString().slice(0, 16),
                tranG_THAI: 0 // Mặc định là đang chờ duyệt
            };
            console.log("submitData: ",submitData)
            const res = isAdd
                ? await create_QLKC_C4_GIAONHAN_TEMCHI(submitData)
                : await update_QLKC_C4_GIAONHAN_TEMCHI(submitData);

            if (res) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Thành công!',
                    detail: `${isAdd ? "Thêm" : "Cập nhật"} biên bản thành công`,
                    life: 3000
                });
                setVisible(false);
                loadData();
            }
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Lỗi!',
                detail: `${isAdd ? "Thêm" : "Cập nhật"} biên bản thất bại`,
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            position={"top"}
            header={<h4>{(isAdd ? "Thêm mới" : "Sửa thông tin") + " biên bản tem chì (C4)"}</h4>}
            visible={visible}
            className='w-11 md:w-8'
            onHide={() => setVisible(false)}
        >
            <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
                <div className="grid">
                    <FormField
                        label="Đơn vị giao"
                        value={formData.doN_VI_GIAO}
                        options={DM_DONVI}
                        onChange={handleInputChange}
                        id="doN_VI_GIAO"
                        isDropdown
                        disabled={true}
                    />
                    <FormField
                        label="Đơn vị nhận"
                        value={formData.doN_VI_NHAN}
                        options={DM_DONVI}
                        onChange={handleInputChange}
                        id="doN_VI_NHAN"
                        isDropdown
                    />
                    <FormField
                        label="Người giao"
                        value={formData.nguoI_GIAO}
                        onChange={handleInputChange}
                        id="nguoI_GIAO"
                        disabled={true}
                    />
                    {/* <FormField
                        label="Người nhận"
                        value={formData.nguoI_NHAN}
                        options={dsNguoiDung}
                        onChange={handleInputChange}
                        id="nguoI_NHAN"
                        isDropdown
                        disabled={!formData.doN_VI_NHAN}
                        placeholder={formData.doN_VI_NHAN ? "Chọn người nhận" : "Vui lòng chọn đơn vị trước"}
                    /> */}
                    <FormField
                        label="Số lượng giao"
                        value={formData.sO_LUONG_GIAO}
                        onChange={handleInputChange}
                        id="sO_LUONG_GIAO"
                        typeInput="number"
                    />
                    <FormField
                        label="Số lượng trả"
                        value={formData.sO_LUONG_TRA}
                        onChange={handleInputChange}
                        id="sO_LUONG_TRA"
                        typeInput="number"
                    />
                    <FormField
                        label="Số lượng thu hồi"
                        value={formData.sO_LUONG_THUHOI}
                        onChange={handleInputChange}
                        id="sO_LUONG_THUHOI"
                        typeInput="number"
                    />
                    <FormField
                        label="Loại"
                        value={formData.loai}
                        options={mockData.arrLoai}
                        onChange={handleInputChange}
                        id="loai"
                        isDropdown
                    />
                    <FormField
                        label="Đơn vị tính"
                        value={formData.donvI_TINH}
                        onChange={handleInputChange}
                        id="donvI_TINH"
                    />
                    <FormField
                        label="Ngày giao"
                        value={formData.ngaY_GIAO}
                        onChange={handleInputChange}
                        id="ngaY_GIAO"
                        typeInput="datetime-local"
                        disabled={true}
                    />
                    <FormField
                        label="Ngày nhận"
                        value={formData.ngaY_NHAN}
                        onChange={handleInputChange}
                        id="ngaY_NHAN"
                        typeInput="datetime-local"
                    />
                    <FormField
                        label="Loại biên bản"
                        value={formData.loaI_BBAN}
                        options={mockData.arrLoaiBienBan}
                        onChange={handleInputChange}
                        id="loaI_BBAN"
                        isDropdown
                    />
                    <div className="field col-12">
                        <label className='font-bold text-sm my-3 block'>
                            Nội dung <span className="text-red-500">*</span>
                        </label>
                        <InputText
                            value={formData.noI_DUNG || ''}
                            onChange={handleInputChange}
                            id="noI_DUNG"
                            name="noI_DUNG"
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            <div className='flex justify-content-end gap-2 mt-4'>
                <Button
                    label="Đóng"
                    icon="pi pi-times"
                    onClick={() => setVisible(false)}
                    className='p-button-outlined'
                />
                <Button
                    label={isAdd ? "Thêm mới" : "Lưu"}
                    icon="pi pi-check"
                    loading={loading}
                    onClick={handleSubmit}
                />
            </div>
        </Dialog>
    );
};
