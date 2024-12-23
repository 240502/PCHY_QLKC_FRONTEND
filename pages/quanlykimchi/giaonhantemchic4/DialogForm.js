import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import { useRef, useState, useEffect } from "react";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";
import UploadFileService from "../../../services/UploadFileService";
import { urlServer } from "../../../constants/api";
import { validatePassword } from "../../../utils/Function";
import { create_QLKC_C4_GIAONHAN_TEMCHI, update_QLKC_C4_GIAONHAN_TEMCHI } from "../../../services/quanlykimchi/QLKC_C4_GIAONHAN_TEMCHIService";

const mockData = {
    trangThaiOptions: [
        { name: 'Còn hiệu lực', id: 1 },
        { name: 'Hết hiệu lực', id: 0 }
    ],

    gioiTinhOptions: [
        { name: 'Nam', id: 1 },
        { name: 'Nữ', id: 0 }
    ]
};

const FormField = ({ label, value, options, onChange, id, isDropdown = false, typeInput = "text" }) => (
    <div className="field col-12 md:col-6">
        <label className='font-bold text-sm my-3 block' htmlFor={id}>{label}</label>
        {isDropdown ? (
            <Dropdown filter placeholder="Chọn giá trị " id={id} name={id} value={value} optionValue="id" optionLabel="name" options={options} onChange={onChange} className="w-full" />
        ) : (
            <InputText type={typeInput} placeholder="Nhập thông tin" id={id} name={id} value={value} onChange={onChange} className="w-full" />
        )}
    </div>
);

export const DialogForm = ({ isAdd, formData, setFormData, visible, setVisible, toast, loadData, DM_DONVI, DM_CHUCVU, DM_PHONGBAN, search }) => {
    const [loading, setLoading] = useState(false);
    const [filePath, setFilePath] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [dsPhongBan, setDsPhongBan] = useState([]);
    const fileUploadRef = useRef(null);

    // useEffect(() => {
    //     console.log("test:" + formData.dm_donvi_id)
    //     console.log(DM_PHONGBAN)
    //     console.log(DM_PHONGBAN.filter(s => s.dm_donvi_id === formData.dm_donvi_id))
    //     setDsPhongBan(DM_PHONGBAN.filter(s => s.dm_donvi_id === formData.dm_donvi_id))
    // }, [formData.dm_donvi_id])


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateEmptyFields = () => {
        const requiredFields = ["sO_LUONG_GIAO", "sO_LUONG_TRA", "sO_LUONG_TRA", "sO_LUONG_THUHOI", "loai", "donvI_TINH", "doN_VI_GIAO", "doN_VI_NHAN", "nguoI_NHAN", "nguoI_GIAO", "ngaY_GIAO", "ngaY_NHAN", "loaI_BBAN", "noI_DUNG"];
        for (const field of requiredFields) {
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
        return true;
    };


    const handleSubmit = async () => {
        if (validateEmptyFields()) {
            setLoading(true);
            try {
                let anhchuky = formData.anhchukynhay;
                if (filePath) {
                    const res = await UploadFileService.image(filePath);
                    anhchuky = res.filePath;
                }
                const res = isAdd
                    ? await create_QLKC_C4_GIAONHAN_TEMCHI({ ...formData, trang_thai: 1, anhchukynhay: anhchuky })
                    : await update_QLKC_C4_GIAONHAN_TEMCHI({ ...formData, anhchukynhay: anhchuky });

                toast.current.show({ severity: 'success', summary: 'Thông báo!', detail: `${(isAdd ? "Thêm" : "Sửa")} thành công người dùng.`, life: 3000 });

                loadData(search);

            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Thông báo!', detail: `${(isAdd ? "Thêm" : "Sửa")} thất bại.`, life: 3000 });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Dialog position={"top"} header={<h4>{(isAdd ? "Thêm mới" : "Sửa thông tin") + " người dùng"}</h4>} visible={visible} className='w-11 md:w-8' onHide={() => setVisible(false)}>
            <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
                <div className="grid">
                    <FormField label="Số lượng giao" value={formData.sO_LUONG_GIAO} onChange={handleInputChange} id="sO_LUONG_GIAO" isDropdown />
                    {/* <FormField label="Số lượng trả" value={formData.sO_LUONG_TRA} options={dsPhongBan} onChange={handleInputChange} id="sO_LUONG_TRA" isDropdown /> */}

                    <FormField label="Số lượng trả" value={formData.sO_LUONG_TRA} onChange={handleInputChange} id="sO_LUONG_TRA" />
                    <FormField label="Số lượng thu hồi" value={formData.sO_LUONG_THUHOI} onChange={handleInputChange} id="sO_LUONG_THUHOI" />
                   
                    <FormField label="Loại" value={formData.loai} onChange={handleInputChange} id="loai" />
                    <FormField label="Đơn vị tính" value={formData.donvI_TINH} onChange={handleInputChange} id="donvI_TINH" typeInput="number"  />
                    <FormField label="Đơn vị giao" value={formData.doN_VI_GIAO} onChange={handleInputChange} id="doN_VI_NHAN" typeInput="number" />
                    <FormField label="Đơn vị nhận" value={formData.doN_VI_NHAN} onChange={handleInputChange} id="doN_VI_NHAN" typeInput="number" />
                    <FormField label="Người nhận" value={formData.nguoI_NHAN} options={mockData.gioiTinhOptions} onChange={handleInputChange} id="nguoI_NHAN" />
                    <FormField label="Người giao" value={formData.nguoI_GIAO} onChange={handleInputChange} id="nguoI_GIAO" />
                    {/* <FormField label="Ngày giao" value={formData.ngaY_GIAO} options={[
                        { name: '1-VNPT SmartCA', id: 1 },
                        { name: '2-Viettel SmartCA', id: 2 },
                        { name: '3-VNPT Token', id: 3 },
                        { name: '4-Viettel Token', id: 4 },
                        { name: '5-EVN CA', id: 5 }
                    ]} onChange={handleInputChange} id="hrms_type" isDropdown /> */}
                    <FormField label="Ngày giao" value={formData.ngaY_GIAO} onChange={handleInputChange} id="ngaY_GIAO" />
                    <FormField label="Ngày nhận" value={formData.ngaY_NHAN} onChange={handleInputChange} id="ngaY_NHAN" />
                    <FormField label="Ngày giao" value={formData.loaI_BBAN} onChange={handleInputChange} id="loaI_BBAN" />
                    <FormField label="Nội dung" value={formData.noI_DUNG} onChange={handleInputChange} id="noI_DUNG" />
                    {!isAdd && <FormField label="Trạng thái" value={formData.trang_thai} options={mockData.trangThaiOptions} onChange={handleInputChange} id="trang_thai" isDropdown />}
                </div>

                {(previewImage) && (
                    <div className="mt-3">
                        <h5 className="text-sm font-bold">Ảnh chữ ký đã tải lên:</h5>
                        <img src={previewImage} alt="Ảnh chữ ký nháy" style={{ width: "200px", height: "100px" }} />
                    </div>
                )}
                <div className="block my-3" >
                    <FileUpload
                        ref={fileUploadRef}
                        mode="basic"
                        id="fileUpload"
                        name="fileUpload"
                        accept="image/*"
                        chooseLabel="Chọn ảnh chữ ký mới"
                        className="p-inputtext-sm"
                        onSelect={handleUploadImage}
                    />
                </div>
            </div>

            <div className='flex justify-content-end gap-2 mt-4'>
                <Button label="Đóng" icon="pi pi-times" onClick={() => setVisible(false)} className='p-button-outlined' />
                <Button label={isAdd ? "Thêm mới" : "Lưu"} icon="pi pi-check" loading={loading} onClick={handleSubmit} />
            </div>

        </Dialog>
    );
};
