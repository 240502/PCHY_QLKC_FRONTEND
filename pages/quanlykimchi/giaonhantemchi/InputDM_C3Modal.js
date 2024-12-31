import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { QLKC_C3_GIAONHAN_TEMCHI } from "../../../models/QLKC_C3_GIAONHAN_TEMCHI";
import { insert_QLKC_C3_GIAONHAN_TEMCHI, update_QLKC_C3_GIAONHAN_TEMCHI } from "../../../services/quanlykimchi/QLKC_C3_GIAONHAN_TEMCHIService";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

export const InputDM_C3Modal = ({
  giaoNhanTemChi,
  isUpdate,
  visible,
  setVisible,
  toast,
  loadData,
}) => {
  const [C3GiaoNhanTemChi, setC3GiaoNhanTemChi] = useState({ ...QLKC_C3_GIAONHAN_TEMCHI });
  const [errors, setErrors] = useState({});
  const [dsDonvi, setDsDonvi] = useState([]);

  const getDSDVIQLY = () => {
    const storedDonvi = sessionStorage.getItem("ds_donvi");
    if (storedDonvi) {
      setDsDonvi(JSON.parse(storedDonvi));
    }
  };

  // Hàm cập nhật dữ liệu khi modal mở
  const getDSDVIQLY1 = () => {
    try {
      if (isUpdate && giaoNhanTemChi) {
        setC3GiaoNhanTemChi(giaoNhanTemChi);
      } else {
        setC3GiaoNhanTemChi({ ...QLKC_C3_GIAONHAN_TEMCHI });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDSDVIQLY();
    getDSDVIQLY1();
  }, [isUpdate, giaoNhanTemChi]);

  // Hàm cập nhật dữ liệu trong state
  const handleInputChange = (field, value) => {
    setC3GiaoNhanTemChi({
      ...C3GiaoNhanTemChi,
      [field]: value || "",  // Default to empty string if no value is provided
    });
  };
  

  // Hàm xử lý dữ liệu khi submit
  const handleCreate = async () => {
    // Chuẩn bị dữ liệu trước khi gửi
    const dataToSend = {
      ...C3GiaoNhanTemChi,
      ngay_giao: C3GiaoNhanTemChi.ngay_giao ? new Date(C3GiaoNhanTemChi.ngay_giao).toISOString() : null,
      ngay_nhan: C3GiaoNhanTemChi.ngay_nhan ? new Date(C3GiaoNhanTemChi.ngay_nhan).toISOString() : null,
      soluong: C3GiaoNhanTemChi.soluong ? parseInt(C3GiaoNhanTemChi.soluong, 10) : 0
    };

    // Loại bỏ các trường có giá trị null/undefined/empty string
    Object.keys(dataToSend).forEach(key => {
      if (dataToSend[key] === null || dataToSend[key] === undefined || dataToSend[key] === '') {
        delete dataToSend[key];
      }
    });

    try {
      await insert_QLKC_C3_GIAONHAN_TEMCHI(dataToSend);
      toast.current.show({
        severity: "success",
        summary: "Thông báo",
        detail: "Thêm dữ liệu thành công",
        life: 3000,
      });
      setVisible(false);
      loadData();
    } catch (err) {
      console.error('Error details:', err);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: err.response?.data?.message || "Lỗi khi gửi dữ liệu",
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
      await update_QLKC_C3_GIAONHAN_TEMCHI(C3GiaoNhanTemChi);
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
      header={isUpdate ? "Sửa thông tin giao nhận tem chì C3" : "Thêm mới giao nhận tem chì C3"}
      visible={visible}
      className=  "w-6 md:w-4/12 lg:w-3/12"
      onHide={() => {
        setVisible(false);
        setC3GiaoNhanTemChi({}); // Reset dữ liệu khi đóng modal
      }}>
      <div className="flex flex-column gap-4">
        <div className="flex gap-4 mt-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="don_vi_giao" className="mb-2"> Đơn vị giao </label>

            <Dropdown
              id="don_vi_giao"
              value={C3GiaoNhanTemChi.don_vi_giao}
              options={dsDonvi}
              onChange={(e) => handleInputChange("don_vi_giao", e.value)}
              optionLabel="ten"
              optionValue="ma_dviqly"
              placeholder="Chọn đơn vị giao"
              className="w-full"/>
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="don_vi_nhan" className="mb-2"> Đơn vị nhận </label>

            <Dropdown
              id="don_vi_nhan"
              value={C3GiaoNhanTemChi.don_vi_nhan}
              options={dsDonvi}
              onChange={(e) => handleInputChange("don_vi_nhan", e.value)}
              optionLabel="ten"
              optionValue="ma_dviqly"
              placeholder="Chọn đơn vị nhận"
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex gap-4 mt-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="loai" className="mb-2"> Loại </label>
            <Dropdown
              id="loai"
              className="w-full"
              value={C3GiaoNhanTemChi.loai}
              options={[
                { label: 'Tem', value: 'Tem' },
                { label: 'Chì', value: 'Chì' }
              ]}
              onChange={(e) => {
                const newValue = e.value;
                setC3GiaoNhanTemChi({ 
                  ...C3GiaoNhanTemChi, 
                  loai: newValue,
                  donvi_tinh: newValue === 'Tem' ? 'Cái' : 'Viên'
                });
              }}
              placeholder="Chọn loại..."
            />
            {errors.loai && <small className="p-error">{errors.loai}</small>}
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="donvi_tinh" className="mb-2">Đơn vị tính</label>

            <InputText
              id="donvi_tinh"
              className="w-full"
              placeholder="Nhập đơn vị tính..."
              onChange={(e) => {
                setC3GiaoNhanTemChi({ ...C3GiaoNhanTemChi, donvi_tinh: e.target.value });
              }}
              onFocus={() => {
                if (errors.donvi_tinh) {
                  setErrors({});
                }
              }}
              type="text"
              value={C3GiaoNhanTemChi.donvi_tinh}
            />
            {errors.donvi_tinh && (
              <small className="p-error">{errors.donvi_tinh}</small>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="nguoi_giao" className="mb-2"> Người giao</label>
            <InputText
              id="nguoi_giao"
              className="w-full"
              placeholder="Nhập người giao..."
              onChange={(e) => {
                setC3GiaoNhanTemChi({ ...C3GiaoNhanTemChi, nguoi_giao: e.target.value });
              }}
              onFocus={() => {
                if (errors.nguoi_giao) {
                  setErrors({});
                }
              }}
              type="text"
              value={C3GiaoNhanTemChi.nguoi_giao}
            />
            {errors.nguoi_giao && (
              <small className="p-error">{errors.nguoi_giao}</small>
            )}
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="nguoi_nhan" className="mb-2"> Người nhận </label>
            <InputText
              id="nguoi_nhan"
              className="w-full"
              placeholder="Nhập người nhận..."
              onChange={(e) => {
                setC3GiaoNhanTemChi({ ...C3GiaoNhanTemChi, nguoi_nhan: e.target.value });
              }}
              onFocus={() => {
                if (errors.nguoi_nhan) {
                  setErrors({});
                }
              }}
              type="text"
              value={C3GiaoNhanTemChi.nguoi_nhan}
            />
            {errors.nguoi_nhan && (
              <small className="p-error">{errors.nguoi_nhan}</small>
            )}
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="soluong" className="mb-2"> Số lượng </label>
            <InputText
              id="soluong"
              className="w-full"
              placeholder="Nhập số lượng..."
              onChange={(e) => {
                setC3GiaoNhanTemChi({ ...C3GiaoNhanTemChi, soluong: e.target.value });
              }}
              onFocus={() => {
                if (errors.soluong) {
                  setErrors({});
                }
              }}
              type="text"
              value={C3GiaoNhanTemChi.soluong}
            />
            {errors.soluong && (
              <small className="p-error">{errors.soluong}</small>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="ngay_giao" className="mb-2"> Ngày giao </label>
            <Calendar
              id="ngay_giao"
              className="w-full"
              placeholder="Chọn ngày giao..."
              onChange={(e) => {
                setC3GiaoNhanTemChi({ ...C3GiaoNhanTemChi, ngay_giao: e.target.value });
              }}
              onFocus={() => {
                if (errors.ngay_giao) {
                  setErrors({});
                }
              }}
              value={C3GiaoNhanTemChi.ngay_giao}
            />
            {errors.ngay_giao && (
              <small className="p-error">{errors.ngay_giao}</small>
            )}
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="ngay_nhan" className="mb-2"> Ngày nhận </label>
            <Calendar
              id="ngay_nhan"
              className="w-full"
              placeholder="Chọn ngày nhận..."
              onChange={(e) => {
                setC3GiaoNhanTemChi({ ...C3GiaoNhanTemChi, ngay_nhan: e.target.value });
              }}
              onFocus={() => {
                if (errors.ngay_nhan) {
                  setErrors({});
                }
              }}
              value={C3GiaoNhanTemChi.ngay_nhan}
            />
            {errors.ngay_nhan && (
              <small className="p-error">{errors.ngay_nhan}</small>
            )}
          </div>
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