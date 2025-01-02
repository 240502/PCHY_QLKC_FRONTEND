import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import {
  create_QLKC_C4_CHITIET_QUYETTOANCHI,
  update_QLKC_C4_CHITIET_QUYETTOANCHI,
} from "../../../services/quanlykimchi/QLKC_C4_CHITIET_QUYETTOANCHIService";

const mockData = {
  arrTrangThai: [
    { label: "Đang chờ duyệt", value: 0 },
    { label: "C1 đã ký", value: 1 },
    { label: "C2 đã ký", value: 2 },
    { label: "Bị hủy", value: 3 },
  ],
  arrLoaiBienBan: [
    { name: "Phiếu mượn", id: 0 },
    { name: "Phiếu trả", id: 1 },
  ],
  arrLoai: [
    { id: "Chì", name: "Chì" },
    { id: "Tem", name: "Tem" },
  ],
};

const FormField = ({
  label,
  value,
  options,
  onChange,
  id,
  isDropdown = false,
  typeInput = "text",
  disabled = false,
  required = true,
}) => (
  <div className="field col-12 md:col-6">
    <label className="font-bold text-sm my-3 block" htmlFor={id}>
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
        value={value || ""}
        onChange={onChange}
        className="w-full"
        disabled={disabled}
      />
    )}
  </div>
);

export const DialogFormQuyetToan = ({
  isAdd,
  formDataQuyetToan,
  setFormDataQuyetToan,
  visible,
  setVisible,
  toast,
  loadData,
  DM_DONVI,
  DM_PHONGBAN,
}) => {
  const [loading, setLoading] = useState(false);
  const [dsPhongBan, setDsPhongBan] = useState([]);
  const [dsPhongBanGiao, setDsPhongBanGiao] = useState([]);
  const [dsNguoiDung, setDsNguoiDung] = useState([]);

  const currentUser = JSON.parse(sessionStorage.getItem("user"));
  const currentDonVi = JSON.parse(sessionStorage.getItem("current_MADVIQLY"));

  // useEffect(() => {
  //     if (formData.doN_VI_NHAN) {
  //         setDsPhongBan(DM_PHONGBAN.filter(pb => pb.dm_donvi_id === formData.doN_VI_NHAN));
  //     }
  // }, [formData.doN_VI_NHAN, DM_PHONGBAN]);

//   useEffect(() => {
//     if (formData.doN_VI_NHAN) {
//       const filteredPhongBan = DM_PHONGBAN.filter(
//         (pb) => pb.dm_donvi_id === formData.doN_VI_NHAN
//       ).map((pb) => ({ id: pb.id, name: pb.name })); // Lấy cả ID và tên hoặc chỉ name nếu bạn cần
//       setDsPhongBan(filteredPhongBan);
//     }
//   }, [formData.doN_VI_NHAN, DM_PHONGBAN]);

//   useEffect(() => {
//     if (formData.nguoI_NHAN) {
//       const filteredNguoiDung = HT_NGUOIDUNG.filter(
//         (pb) => pb.dm_donvi_id === formData.nguoI_NHAN
//       ).map((pb) => ({ id: pb.id, name: pb.name })); // Lấy cả ID và tên hoặc chỉ name nếu bạn cần
//       setDsNguoiDung(filteredNguoiDung);
//     }
//   }, [formData.nguoI_NHAN, HT_NGUOIDUNG]);
//   useEffect(() => {
//     if (currentDonVi) {
//       setDsPhongBanGiao(
//         DM_PHONGBAN.filter((pb) => pb.dm_donvi_id === currentDonVi)
//       );
//       setFormData((prev) => ({
//         ...prev,
//         doN_VI_GIAO: currentDonVi,
//         nguoI_GIAO: currentUser?.ho_ten || "",
//         ngaY_GIAO: new Date().toISOString().slice(0, 16),
//       }));
//     }
//   }, [currentDonVi]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDataQuyetToan((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = {
      "teN_KHACH_HANG": "Tên khách hàng",
      "mA_KHACH_HANG": "Mã khách hàng",
      "hop": "Hộp",
      "cot": "Cột",
      "teN_TBA": "Tên TBA",
      "booC_CONGQUANG": "Booc, cổng quang",
      "cuA_TU": "Cửa tủ",
      "chup_buzi_ti_tu": "Chụp buzi, TI, TU",
      "tong_so_chi_niem_phong": "Tổng số chì niêm phong",
      "ly_do": "Lý do",
      "tong_so_chi_thu_hoi": "Tổng số chì thu hồi",
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        toast.current.show({
          severity: "error",
          summary: "Thông báo!",
          detail: `Trường ${field} không được để trống.`,
          life: 3000,
        });
        return false;
      }
    }

    // Validate số lượng
    if (
      formData.chup_buzi_ti_tu < 0 ||
      formData.cuA_TU < 0 ||
      formData.tong_so_chi_thu_hoi < 0
    ) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi!",
        detail: "Số lượng không được âm",
        life: 3000,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        booC_CONGQUANG: 0,
        cuA_TU: 0,
        chuP_BUZI_TI_TU: 0,
        ngaY_NIEM_PHONG: new Date().toISOString().slice(0, 16),
      };

      const res = isAdd
        ? await create_QLKC_C4_CHITIET_QUYETTOANCHI(submitData)
        : await update_QLKC_C4_CHITIET_QUYETTOANCHI(submitData);
      if (res) {
        toast.current.show({
          severity: "success",
          summary: "Thành công!",
          detail: `${isAdd ? "Thêm" : "Cập nhật"} biên bản thành công`,
          life: 3000,
        });
        setVisible(false);
        loadData();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi!",
        detail: `${isAdd ? "Thêm" : "Cập nhật"} biên bản thất bại`,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      position={"top"}
      header={
        <h4>
          {(isAdd ? "Thêm mới" : "Sửa thông tin") + " biên bản tem chì (C4)"}
        </h4>
      }
      visible={visible}
      className="w-11 md:w-8"
      onHide={() => setVisible(false)}
    >
      <div className="p-fluid border-solid p-4 border-100 border-round-2xl">
        <div className="grid">
          <FormField
            label="Tên khách hàng"
            value={formDataQuyetToan.teN_KHACH_HANG}
            onChange={handleInputChange}
            id="teN_KHACH_HANG"
          />
          <FormField
            label="Mã khách hàng"
            value={formDataQuyetToan.mA_KHACH_HANG}
            onChange={handleInputChange}
            id="mA_KHACH_HANG"
          />
          <FormField
            label="Hộp"
            value={formDataQuyetToan.hop}
            typeInput="number"
            onChange={handleInputChange}
            id="hop"
          />
          <FormField
            label="Cột"
            value={formDataQuyetToan.cot}
            typeInput="number"
            onChange={handleInputChange}
            id="cot"
          />
          <FormField
            label="Tên TBA"
            value={formDataQuyetToan.teN_TBA}
            onChange={handleInputChange}
            id="teN_TBA"
            typeInput="text"
          />
          <FormField
            label="Booc, cổng quang"
            value={formDataQuyetToan.booC_CONGQUANG}
            typeInput="number"
            defaultValue={1}
            onChange={handleInputChange}
            id="booC_CONGQUANG"
          />
          <FormField
            label="Cửa tủ"
            value={formDataQuyetToan.cuA_TU}
            typeInput="number"
            onChange={handleInputChange}
            id="cuA_TU"
          />
          <FormField
            label="Chụp buzi, TI, TU"
            value={formDataQuyetToan.chup_buzi_ti_tu}
            typeInput="number"
            onChange={handleInputChange}
            id="chup_buzi_ti_tu"
          />
          <FormField
            label="Tổng số chì niêm phong"
            value={formDataQuyetToan.tong_so_chi_niem_phong}
            typeInput="number"
            onChange={handleInputChange}
            id="tong_so_chi_niem_phong"
          />
          <FormField
            label="Lý do    "
            value={formDataQuyetToan.ly_do}
            onChange={handleInputChange}
            id="ly_do"
          />

          <FormField
            label="Tổng số chì thu hồi"
            value={formDataQuyetToan.tong_so_chi_thu_hoi}
            typeInput="number"
            onChange={handleInputChange}
            id="tong_so_chi_thu_hoi"
          />
        </div>
      </div>

      <div className="flex justify-content-end gap-2 mt-4">
        <Button
          label="Đóng"
          icon="pi pi-times"
          onClick={() => setVisible(false)}
          className="p-button-outlined"
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
