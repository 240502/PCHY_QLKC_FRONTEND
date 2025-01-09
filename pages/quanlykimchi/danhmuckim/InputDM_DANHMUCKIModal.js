import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { QLKC_D_KIM } from "../../../models/QLKC_D_KIM";
import { Button } from "primereact/button";

import {
  D_KIMService,
  insert_D_KIM,
  update_D_KIM,
} from "../../../services/quanlykimchi/D_KIMService";

export const InputDM_DANHMUCKIMModal = ({
  currentMA_DVIQLY,
  isUpdate,
  danhmuckim,
  visible,
  setVisible,
  toast,
  loadData,
}) => {
  const [danhMucKim, setDanhMucKim] = useState(QLKC_D_KIM);
  const [errors, setErrors] = useState({});
  const arrMaKim = [
    { label: "Kìm 1 pha", value: 1 },
    { label: "Kìm 3 pha", value: 3 },
  ];
  const arrTrangThai = [
    { label: "Có hiệu lực", value: 0 },
    { label: "Hết hiệu lực", value: 1 },
  ];

  useEffect(() => {
    if (isUpdate) {
      setDanhMucKim(danhmuckim);
      // setTrangThai(danhmuckim.trang_thai);
    } else {
      setDanhMucKim(QLKC_D_KIM);
    }
  }, []);

  const handleValidate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!danhMucKim.loai_ma_kim) {
      isValid = false;
      tempErrors.loai_ma_kim = "Loại mã kìm không được để trống";
    }

    if (!danhMucKim.ma_hieu) {
      isValid = false;
      tempErrors.ma_hieu = "Mã hiệu không được để trống";
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (isUpdate) {
      Update();
    } else {
      Create();
    }
  };

  const Create = async () => {
    try {
      const userLocal = JSON.parse(sessionStorage.getItem("user"));

      if (handleValidate()) {
        const result = await D_KIMService.insert_D_KIM({
          ...danhMucKim,
          id_kim: 0,
          ma_dviqly: currentMA_DVIQLY,
          nguoi_tao: userLocal.id,
        });
        toast.current.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Thêm danh mục kim thành công",
          life: 3000,
        });
        setVisible(false);
        loadData();
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.current.show({
          severity: "error",
          summary: "Thông báo",
          detail: err.response.data.message,
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Thông báo",
          detail: "Thêm danh mục kim không thành công",
          life: 3000,
        });
      }
    }
  };

  const Update = async () => {
    console.log(danhMucKim);
    try {
      if (handleValidate()) {
        const result = await update_D_KIM({
          ...danhMucKim,
          nguoi_sua: "1",
        });
        toast.current.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Cập nhật danh mục kim thành công",
          life: 3000,
        });
        setVisible(false);
        loadData();
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.current.show({
          severity: "error",
          summary: "Thông báo",
          detail: err.response.data.message,
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Thông báo",
          detail: "Cập nhật danh mục kim không thành công",
          life: 3000,
        });
      }
    }
  };

  return (
    <Dialog
      header={!isUpdate ? "Thêm mới danh mục kim" : "Sửa danh mục kim"}
      visible={visible}
      className="p-fluid w-11 md:w-6"
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        setDanhMucKim(null);
      }}
    >
      <div className="flex flex-column gap-4">
        <div className="flex gap-4 mt-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="LOAI_MA_KIM" className="mb-2">
              Loại má kim
            </label>
            <Dropdown
              onChange={(e) => {
                setDanhMucKim({ ...danhMucKim, loai_ma_kim: e.value });
              }}
              optionLabel="label"
              id="TRANG_THAI"
              className="w-full"
              options={arrMaKim}
              placeholder="Chọn má kìm"
              onFocus={() => {
                if (errors.loai_ma_kim) {
                  setErrors({});
                }
              }}
              value={danhMucKim.loai_ma_kim}
            />
            {errors.loai_ma_kim && (
              <small className="p-error">{errors.loai_ma_kim}</small>
            )}
          </div>
          <div className="flex flex-column flex-1">
            <label htmlFor="MA_HIEU" className="mb-2">
              Mã hiệu
            </label>
            <InputText
              id="MA_HIEU"
              className="w-full"
              placeholder="Nhập mã hiệu..."
              onChange={(e) => {
                setDanhMucKim({ ...danhMucKim, ma_hieu: e.target.value });
              }}
              onFocus={() => {
                if (errors.ma_hieu) {
                  setErrors({});
                }
              }}
              type="text"
              value={danhMucKim.ma_hieu}
            />
            {errors.ma_hieu && (
              <small className="p-error">{errors.ma_hieu}</small>
            )}
          </div>
        </div>
        {isUpdate && (
          <div className="flex gap-4 mt-4">
            <div className="flex flex-column flex-1">
              <label htmlFor="LOAI_MA_KIM" className="mb-2">
                Trạng thái
              </label>
              <Dropdown
                onChange={(e) => {
                  setDanhMucKim({ ...danhMucKim, trang_thai: e.value });
                }}
                optionLabel="label"
                id="TRANG_THAI"
                className="w-full"
                options={arrTrangThai}
                placeholder="Chọn trạng thái"
                value={danhMucKim.trang_thai}
              />
            </div>
          </div>
        )}

        <div className="flex justify-content-center gap-4 mt-4">
          <Button
            label="Lưu"
            onClick={handleSubmit}
            severity="success"
            style={{
              backgroundColor: "#1445a7",
            }}
          />
          <Button
            label="Đóng"
            outlined
            severity="secondary"
            onClick={() => {
              setVisible(false);
              setDanhMucKim(null);
            }}
          />
        </div>
      </div>
    </Dialog>
  );
};
