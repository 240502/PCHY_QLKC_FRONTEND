import React, { useState, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { QLKC_C3_GIAONHAN_TEMCHI } from "../../../models/QLKC_C3_GIAONHAN_TEMCHI";
import {
  insert_QLKC_C3_GIAONHAN_TEMCHI,
  update_QLKC_C3_GIAONHAN_TEMCHI,
} from "../../../services/quanlykimchi/QLKC_C3_GIAONHAN_TEMCHIService";
import { getDM_PHONGBANByMA_DVIQLY } from "../../../services/quantrihethong/DM_PHONGBANService";
import { HT_NGUOIDUNG } from "../../../models/HT_NGUOIDUNG";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

export const InputDM_C3Modal = ({
  giaoNhanTemChi,
  isUpdate,
  visible,
  setVisible,
  toast,
  loadData,
  donViArr,
  bienBan,
  setBienBan,
}) => {
  const [C3GiaoNhanTemChi, setC3GiaoNhanTemChi] = useState(
    QLKC_C3_GIAONHAN_TEMCHI
  );
  const [errors, setErrors] = useState({});
  const [dsDonvi, setDsDonvi] = useState([]);
  const [users, setUsers] = useState([HT_NGUOIDUNG]);
  const [phongBanArr, setPhongBanArr] = useState([]);
  const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");

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
  const getHT_NGUOIDUNGByMA_DVIQLY = async (ma_dviqly) => {
    try {
      const data = { ma_dviqly: ma_dviqly };
      const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY(data);
      setUsers(res);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.id) {
      console.log("Current User ID:", currentUser.id);
      setC3GiaoNhanTemChi((prev) => ({
        ...prev,
        nguoi_giao: currentUser.id,
      }));
    } else {
      console.error("User data is not available or invalid:", currentUser);
    }
  }, [isUpdate]);

  // Hàm xử lý dữ liệu khi submit
  const handleCreate = async () => {
    // Chuẩn bị dữ liệu trước khi gửi
    const dataToSend = {
      ...C3GiaoNhanTemChi,
      soluong: C3GiaoNhanTemChi.soluong
        ? parseInt(C3GiaoNhanTemChi.soluong, 10)
        : 0,
    };

    // Loại bỏ các trường có giá trị null/undefined/empty string
    Object.keys(dataToSend).forEach((key) => {
      if (
        dataToSend[key] === null ||
        dataToSend[key] === undefined ||
        dataToSend[key] === ""
      ) {
        delete dataToSend[key];
      }
    });

    try {
      console.log("data C3", dataToSend);
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
      console.error("Error details:", err);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: err.response?.data?.message || "Lỗi khi gửi dữ liệu",
        life: 3000,
      });
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!C3GiaoNhanTemChi.don_vi_giao)
      newErrors.don_vi_giao = "Đơn vị giao là bắt buộc";
    if (!C3GiaoNhanTemChi.don_vi_nhan)
      newErrors.don_vi_nhan = "Đơn vị nhận là bắt buộc";
    if (!C3GiaoNhanTemChi.loai) newErrors.loai = "Loại là bắt buộc";
    if (!C3GiaoNhanTemChi.soluong) newErrors.soluong = "Số lượng là bắt buộc";
    if (!C3GiaoNhanTemChi.donvi_tinh)
      newErrors.donvi_tinh = "Đơn vị tính là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      if (isUpdate) {
        handleUpdate();
      } else {
        handleCreate();
      }
    } else {
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Vui lòng điền đầy đủ thông tin",
        life: 3000,
      });
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

  const getAllD_PhongBan = async () => {
    try {
      const res = await getDM_PHONGBANByMA_DVIQLY("PA23");
      setPhongBanArr(res);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getAllD_PhongBan();
  }, []);
  const handleInputChange = (field, value) => {
    console.log(`Updating field: ${field}, with value: ${value}`);
    setC3GiaoNhanTemChi({
      ...C3GiaoNhanTemChi,
      [field]: value || "",
    });
  };

  // const handleDateChange = useCallback((e) => {
  //   setC3GiaoNhanTemChi((prev) => ({
  //     ...prev,
  //     ngay_giao: e.value,
  //   }));
  // }, []);

  return (
    <Dialog
      header={
        isUpdate
          ? "Sửa thông tin giao nhận tem chì C3"
          : "Thêm mới giao nhận tem chì C3"
      }
      visible={visible}
      className="w-6 md:w-4/12 lg:w-3/12"
      onHide={() => {
        setVisible(false);
        setC3GiaoNhanTemChi({}); // Reset dữ liệu khi đóng modal
      }}
    >
      <div className="flex flex-column gap-4">
        <div className="flex gap-4 mt-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="don_vi_giao" className="mb-2">
              Đơn vị giao <span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              className={`mt-2 w-full ${errors.don_vi_giao ? "p-invalid" : ""}`}
              value={bienBan?.don_vi_giao}
              options={phongBanArr}
              filter
              onChange={(e) => {
                console.log(e.value);
                setBienBan({
                  ...bienBan,
                  don_vi_giao: e.value,
                });
                setC3GiaoNhanTemChi({
                  ...C3GiaoNhanTemChi,
                  don_vi_giao: e.value,
                });
              }}
              id="don_vi_giao"
              optionValue="id"
              optionLabel="ten"
              placeholder="Chọn đơn vị "
              onFocus={() => {
                setErrors({ ...errors, don_vi_giao: null });
              }}
            />
            {errors?.don_vi_giao && (
              <small className="p-error">{errors.don_vi_giao}</small>
            )}
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="don_vi_nhan" className="mb-2">
              Đơn vị nhận <span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              className={`mt-2 w-full ${errors.don_vi_nhan ? "p-invalid" : ""}`}
              value={bienBan?.don_vi_nhan}
              options={donViArr}
              filter
              onChange={(e) => {
                console.log(e.value);
                setBienBan({
                  ...bienBan,
                  don_vi_nhan: e.value,
                });
                getHT_NGUOIDUNGByMA_DVIQLY(e.value);
                setC3GiaoNhanTemChi({
                  ...C3GiaoNhanTemChi,
                  don_vi_nhan: e.value,
                });
              }}
              id="don_vi_nhan"
              optionValue="ma_dviqly"
              optionLabel="ten"
              placeholder="Chọn đơn vị "
              onFocus={() => {
                setErrors({ ...errors, don_vi_nhan: null });
              }}
            />
            {errors?.don_vi_nhan && (
              <small className="p-error">{errors.don_vi_nhan}</small>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="loai" className="mb-2">
              Loại <span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              id="loai"
              className={`w-full ${errors.loai ? "p-invalid" : ""}`}
              value={C3GiaoNhanTemChi.loai}
              options={[
                { label: "Tem", value: "Tem" },
                { label: "Chì", value: "Chì" },
              ]}
              onChange={(e) => {
                const newValue = e.value;
                setC3GiaoNhanTemChi({
                  ...C3GiaoNhanTemChi,
                  loai: newValue,
                  donvi_tinh: newValue === "Tem" ? "Cái" : "Viên",
                });
              }}
              placeholder="Chọn loại..."
            />
            {errors.loai && <small className="p-error">{errors.loai}</small>}
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="donvi_tinh" className="mb-2">
              Đơn vị tính <span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              id="donvi_tinh"
              className={`w-full ${errors.donvi_tinh ? "p-invalid" : ""}`}
              placeholder="Nhập đơn vị tính..."
              type="text"
              value={C3GiaoNhanTemChi.donvi_tinh}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="soluong" className="mb-2">
              Số lượng <span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              id="soluong"
              className={`w-full ${errors.soluong ? "p-invalid" : ""}`}
              placeholder="Nhập số lượng..."
              onChange={(e) => {
                setC3GiaoNhanTemChi({
                  ...C3GiaoNhanTemChi,
                  soluong: e.target.value,
                });
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
          <div className="flex flex-column flex-1">
            <label htmlFor="nguoi_nhan" className="mb-2">
              Người nhận <span style={{ color: "red" }}>*</span>
            </label>
            <Dropdown
              value={C3GiaoNhanTemChi?.nguoi_nhan}
              className={`w-full ${errors.nguoi_nhan ? "p-invalid" : ""}`}
              options={users}
              placeholder="Chọn"
              showClear
              filter
              optionValue="id"
              optionLabel="hO_TEN"
              onChange={(e) => {
                console.log(`Selected user: ${e.value}`);
                setC3GiaoNhanTemChi({
                  ...C3GiaoNhanTemChi,
                  nguoi_nhan: e.value,
                });
              }}
              onFocus={() => {
                if (errors.nguoi_nhan) {
                  setErrors({ ...errors, nguoi_nhan: null });
                }
              }}
            />
            {errors.nguoi_nhan && (
              <small className="p-error">{errors.nguoi_nhan}</small>
            )}
          </div>
        </div>

        {/*
        <div className="flex gap-4 mt-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="ngay_giao" className="mb-2">
              Ngày giao
            </label>
            <Calendar
              id="ngay_giao"
              className="w-full"
              placeholder="Chọn ngày giao..."
              onChange={handleDateChange}
              onBlur={() => {
                if (errors.ngay_giao) {
                  setErrors({});
                }
              }}
              value={
                C3GiaoNhanTemChi.ngay_giao
                  ? new Date(C3GiaoNhanTemChi.ngay_giao)
                  : null
              }
            />
            {errors.ngay_giao && (
              <small className="p-error">{errors.ngay_giao}</small>
            )}
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="ngay_nhan" className="mb-2">
              Ngày nhận
            </label>
            <Calendar
              id="ngay_nhan"
              className="w-full"
              placeholder="Chọn ngày nhận..."
              onChange={(e) => {
                setC3GiaoNhanTemChi({
                  ...C3GiaoNhanTemChi,
                  ngay_nhan: e.target.value,
                });
              }}
              onFocus={() => {
                if (errors.ngay_nhan) {
                  setErrors({});
                }
                console.log("focus");
              }}
              value={C3GiaoNhanTemChi.ngay_nhan}
            />
            {errors.ngay_nhan && (
              <small className="p-error">{errors.ngay_nhan}</small>
            )}
          </div>
        </div>*/}

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
