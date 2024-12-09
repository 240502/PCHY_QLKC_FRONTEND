import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { QLKC_C4_GIAONHAN_KIM } from "../../../models/QLKC_C4_GIAONHAN_KIM";
import { create_PM_QLKC_C4_GIAONHAN_KIM, update_CD_QLKC_C4_GIAONHAN_KIM } from "../../../services/quanlykimchi/QLKC_C4_GIAONHAN_KIMService";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

export const InputQLKC_KHO_CHI_TEMModal = ({
  isUpdate,
  giaoNhanKim,
  visible,
  setVisible,
  toast,
  loadData,
}) => {
  const [GIAONHANKIM, setC4GIAONHANKIM] = useState({ ...QLKC_C4_GIAONHAN_KIM });
  const [errors, setErrors] = useState({});
  const [dsDonvi, setDsDonvi] = useState([]);

  // Hàm lấy dữ liệu đơn vị từ sessionStorage
  const getDSDVIQLY = () => {
    const storedDonvi = sessionStorage.getItem("ds_donvi");
    if (storedDonvi) {
      setDsDonvi(JSON.parse(storedDonvi));
    }
  };

  // Hàm cập nhật dữ liệu khi modal mở
  const getDSDVIQLY1 = () => {
    try {
      if (isUpdate && giaoNhanKim) {
        setC4GIAONHANKIM(giaoNhanKim);
      } else {
        setC4GIAONHANKIM({ ...QLKC_C4_GIAONHAN_KIM });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDSDVIQLY();
    getDSDVIQLY1();
  }, [isUpdate, giaoNhanKim]);

  // Hàm cập nhật dữ liệu trong state
  const handleInputChange = (field, value) => {
    setC4GIAONHANKIM({
      ...GIAONHANKIM,
      [field]: value || "",  // Default to empty string if no value is provided
    });
  };
  

  // Hàm xử lý dữ liệu khi submit
  const handleCreate = async () => {
    const dataToSend = Object.fromEntries(
      Object.entries(GIAONHANKIM).map(([key, value]) => [
        key,
        value === null || value === undefined ? "" : value,  // Ensure all values are non-null strings
      ])
    );
  
    try {
      await create_PM_QLKC_C4_GIAONHAN_KIM(dataToSend);
      toast.current.show({
        severity: "success",
        summary: "Thông báo",
        detail: "Thêm dữ liệu thành công",
        life: 3000,
      });
      setVisible(false);
      loadData();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Lỗi khi gửi dữ liệu",
        life: 3000,
      });
    }
  };
  
  const handleSubmit = () => {
    if (isUpdate) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleUpdate = async () => {
    try {
      await update_CD_QLKC_C4_GIAONHAN_KIM(GIAONHANKIM);
      toast.current.show({
        severity: "success",
        summary: "Thông báo",
        detail: "Cập nhật dữ liệu thành công",
        life: 3000,
      });
      setVisible(false);
      loadData();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Lỗi khi cập nhật dữ liệu",
        life: 3000,
      });
    }
  };

  return (
    <Dialog
      header={isUpdate ? "Sửa thông tin giao nhận kìm c4" : "Thêm mới giao nhận kìm c4"}
      visible={visible}
      className="w-6 md:w-5/12 lg:w-4/12"
      onHide={() => {
        setVisible(false);
        setC4GIAONHANKIM({}); // Reset dữ liệu khi đóng modal
      }}
    >
      <div className="flex flex-column gap-4">
        {/* Số lượng giao */}
        <div className="flex flex-column">
          <label htmlFor="sO_LUONG_GIAO" className="mb-2">Số lượng giao</label>
          <InputText
            id="sO_LUONG_GIAO"
            className="w-full"
            placeholder="Số lượng giao ..."
            onChange={(e) => handleInputChange("sO_LUONG_GIAO", e.target.value)}
            value={GIAONHANKIM.sO_LUONG_GIAO}
          />  
        </div>

        {/* Số lượng trả */}
        <div className="flex flex-column">
          <label htmlFor="sO_LUONG_TRA" className="mb-2">Số lượng trả</label>
          <InputText
            id="sO_LUONG_TRA"
            className="w-full"
            placeholder="Số lượng trả ..."
            onChange={(e) => handleInputChange("sO_LUONG_TRA", e.target.value)}
            value={GIAONHANKIM.sO_LUONG_TRA}
          />
        </div>

        {/* Số lượng thu hồi */}
        <div className="flex flex-column">
          <label htmlFor="sO_LUONG_THUHOI" className="mb-2">Số lượng thu hồi</label>
          <InputText
            id="sO_LUONG_THUHOI"
            className="w-full"
            placeholder="Số lượng thu hồi ..."
            onChange={(e) => handleInputChange("sO_LUONG_THUHOI", e.target.value)}
            value={GIAONHANKIM.sO_LUONG_THUHOI}
          />
        </div>

        <div className="flex flex-column">
          <label htmlFor="loai" className="mb-2">Loại</label>
          <InputText
            id="loai"
            className="w-full"
            placeholder="Số lượng thu hồi ..."
            onChange={(e) => handleInputChange("loai", e.target.value)}
            value={GIAONHANKIM.loai}
          />
        </div>

        <div className="flex flex-column">
          <label htmlFor="donvI_TINH" className="mb-2">Đơn vị tính</label>
          <InputText
            id="donvI_TINH"
            className="w-full"
            placeholder="Số lượng thu hồi ..."
            onChange={(e) => handleInputChange("donvI_TINH", e.target.value)}
            value={GIAONHANKIM.donvI_TINH}
          />
        </div>



        {/* Đơn vị giao */}
        <div className="flex flex-column">
          <label htmlFor="doN_VI_GIAO" className="mb-2">Đơn vị giao</label>
          <Dropdown
            id="doN_VI_GIAO"
            value={GIAONHANKIM.doN_VI_GIAO}
            options={dsDonvi}
            onChange={(e) => handleInputChange("doN_VI_GIAO", e.value)}
            optionLabel="ten"
            optionValue="ma_dviqly"
            placeholder="Chọn đơn vị giao"
            className="w-full"
          />
        </div>

        {/* Đơn vị nhận */}
        <div className="flex flex-column">
          <label htmlFor="doN_VI_NHAN" className="mb-2">Đơn vị nhận</label>
          <Dropdown
            id="doN_VI_NHAN"
            value={GIAONHANKIM.doN_VI_NHAN}
            options={dsDonvi}
            onChange={(e) => handleInputChange("doN_VI_NHAN", e.value)}
            optionLabel="ten"
            optionValue="ma_dviqly"
            placeholder="Chọn đơn vị nhận"
            className="w-full"
          />
        </div>

        {/* Các trường khác */}
        <div className="flex flex-column">
          <label htmlFor="nguoI_NHAN" className="mb-2">Người nhận</label>
          <InputText
            id="nguoI_NHAN"
            className="w-full"
            onChange={(e) => handleInputChange("nguoI_NHAN", e.target.value)}
            value={GIAONHANKIM.nguoI_NHAN}
          />
        </div>

        <div className="flex flex-column">
          <label htmlFor="nguoI_GIAO" className="mb-2">Người giao</label>
          <InputText
            id="nguoI_GIAO"
            className="w-full"
            onChange={(e) => handleInputChange("nguoI_GIAO", e.target.value)}
            value={GIAONHANKIM.nguoI_GIAO}
          />
        </div>

        <div className="flex flex-column">
  <label htmlFor="ngaY_GIAO" className="mb-2">Ngày giao</label>
  <Calendar
    id="ngaY_GIAO"
    className="w-full"
    value={GIAONHANKIM.ngaY_GIAO ? new Date(GIAONHANKIM.ngaY_GIAO) : null} // Chuyển giá trị về kiểu Date
    onChange={(e) => handleInputChange("ngaY_GIAO", e.value?.toISOString().split("T")[0])} // Lấy giá trị dạng YYYY-MM-DD
    dateFormat="yy-mm-dd"
    showIcon
    placeholder="Chọn ngày giao"
  />
</div>

<div className="flex flex-column">
  <label htmlFor="ngaY_NHAN" className="mb-2">Ngày nhận</label>
  <Calendar
    id="ngaY_NHAN"
    className="w-full"
    value={GIAONHANKIM.ngaY_NHAN ? new Date(GIAONHANKIM.ngaY_NHAN) : null} // Chuyển giá trị về kiểu Date
    onChange={(e) => handleInputChange("ngaY_NHAN", e.value?.toISOString().split("T")[0])} // Lấy giá trị dạng YYYY-MM-DD
    dateFormat="yy-mm-dd"
    showIcon
    placeholder="Chọn ngày nhận"
  />
</div>


        
        <div className="flex flex-column">
          <label htmlFor="tranG_THAI" className="mb-2">Trạng thái</label>
          <InputText
            id="tranG_THAI"
            className="w-full"
            onChange={(e) => handleInputChange("tranG_THAI", e.target.value)}
            value={GIAONHANKIM.tranG_THAI}
          />
        </div>

        <div className="flex flex-column">
          <label htmlFor="loaI_BBAN" className="mb-2">Loại biên bản</label>
          <InputText
            id="loaI_BBAN"
            className="w-full"
            onChange={(e) => handleInputChange("loaI_BBAN", e.target.value)}
            value={GIAONHANKIM.loaI_BBAN}
          />
        </div>

        {/* Các trường "nội dung" khác */}
        <div className="flex flex-column">
          <label htmlFor="noI_DUNG" className="mb-2">Nội dung</label>
          <InputText
            id="noI_DUNG"
            className="w-full"
            onChange={(e) => handleInputChange("noI_DUNG", e.target.value)}
            value={GIAONHANKIM.noI_DUNG}
          />
        </div>

        {/* Nút hành động */}
        <div className="flex justify-content-center gap-4 mt-4">
          <Button
            label="Lưu"
            onClick={handleSubmit}
            severity="success"
            style={{ backgroundColor: "#1445a7" }}
          />
          <Button
            label="Đóng"
            outlined
            severity="secondary"
            onClick={() => setVisible(false)}
          />
        </div>
      </div>
    </Dialog>
  );
};
