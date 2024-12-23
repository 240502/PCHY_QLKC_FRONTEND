import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { QLKC_D_KIM } from "../../../models/QLKC_D_KIM";
import { getAllD_DVIQLY } from "../../../services/quantrihethong/DM_DVIQLYService";
import { Button } from "primereact/button";

import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
import {
  insert_D_KIM,
  update_D_KIM,
} from "../../../services/quanlykimchi/D_KIMService";

export const InputDM_DANHMUCKIMModal = ({
  isUpdate,
  danhmuckim,
  visible,
  setVisible,
  toast,
  loadData,
}) => {
  const [danhMucKim, setDanhMucKim] = useState(QLKC_D_KIM);
  const [donViQuanLy, setDonViQuanLy] = useState([]);
  const [dsDonViQuanLy, setDSDonViQuanLy] = useState([]);
  const [trangThai, setTrangThai] = useState();
  const [errors, setErrors] = useState({});

  const arrTrangThai = [
    { label: "Có hiệu lực", value: 1 },
    { label: "Hết hiệu lực", value: 0 },
  ];

  useEffect(() => {
    let dvi =
      dsDonViQuanLy.find((d) => d.id === danhMucKim.dm_donvi_id) || null;
    setDanhMucKim({
      ...danhMucKim,
      ma_dviqly: dvi?.ma_dviqly,
      ten_dviqly: dvi?.ten,
    });
  }, [danhMucKim.dm_donvi_id]);

  useEffect(() => {
    if (isUpdate) {
      setDanhMucKim(danhmuckim);
      setTrangThai(danhmuckim.trang_thai);
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
    console.log(danhMucKim);
    try {
      if (handleValidate()) {
        const result = await insert_D_KIM({
          ...danhMucKim,
          nguoi_tao: danhMucKim.nguoi_tao,
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
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Thêm danh mục kim không thành công",
        life: 3000,
      });
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
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Cập nhật danh mục kim không thành công",
        life: 3000,
      });
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
              Loại mã kim
            </label>
            <InputText
              id="LOAI_MA_KIM"
              className="w-full"
              placeholder="Nhập loại mã kim..."
              onChange={(e) => {
                setDanhMucKim({ ...danhMucKim, loai_ma_kim: e.target.value });
              }}
              onFocus={() => {
                if (errors.loai_ma_kim) {
                  setErrors({});
                }
              }}
              type="text"
              value={danhMucKim.loai_ma_kim}
            />
            {errors.loai_ma_kim && (
              <small className="p-error">{errors.loai_ma_kim}</small>
            )}
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="MA_DVIQLY" className="mb-2">
              Mã đơn vị quản lý
            </label>
            <InputText
              id="MA_DVIQLY"
              className="w-full"
              placeholder="Nhập mã đơn vị quản lý..."
              onChange={(e) => {
                setDanhMucKim({ ...danhMucKim, ma_dviqly: e.target.value });
              }}
              type="text"
              value={danhMucKim.ma_dviqly}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="TRANG_THAI" className="mb-2">
              Trạng thái
            </label>
            <Dropdown
              onChange={(e) => {
                setTrangThai(e.value);
                setDanhMucKim({ ...danhMucKim, trang_thai: e.value });
              }}
              optionLabel="label"
              id="TRANG_THAI"
              className="w-full"
              options={arrTrangThai}
              placeholder="Chọn một trạng thái"
              value={trangThai}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="NGUOI_TAO" className="mb-2">
              Người tạo
            </label>
            <InputText
              id="NGUOI_TAO"
              className="w-full"
              placeholder="Nhập người tạo..."
              onChange={(e) => {
                setDanhMucKim({ ...danhMucKim, nguoi_tao: e.target.value });
              }}
              onFocus={() => {
                if (errors.nguoi_tao) {
                  setErrors({});
                }
              }}
              type="text"
              value={danhMucKim.nguoi_tao}
            />
            {errors.nguoi_tao && (
              <small className="p-error">{errors.nguoi_tao}</small>
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
