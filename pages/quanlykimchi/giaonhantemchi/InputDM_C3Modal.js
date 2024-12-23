import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { QLKC_C3_GIAONHAN_TEMCHI } from "../../../models/QLKC_C3_GIAONHAN_TEMCHI";
// import { insert_QLKC_C3_GIAONHAN_TEMCHI, update_QLKC_C3_GIAONHAN_TEMCHI } from "../../../services/quanlykimchi/QLKC_C3_GIAONHAN_TEMCHIService";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import {
  insert_QLKC_C3_GIAONHAN_TEMCHI,
  update_QLKC_C3_GIAONHAN_TEMCHI,
} from "../../../services/quanlykimchi/QLKC_C3_GIAONHAN_TEMCHIService";

const InputDM_C3Modal = ({
  isUpdate,
  danhmucc3,
  visible,
  setVisible,
  toast,
  loadData,
}) => {
  const [danhMucC3, setDanhMucC3] = useState(QLKC_C3_GIAONHAN_TEMCHI);
  const [errors, setErrors] = useState({});
  const [dsDonvi, setDsDonvi] = useState([]);

  const getDSDVIQLY = () => {
    const storedDonvi = sessionStorage.getItem("ds_donvi");
    if (storedDonvi) {
      setDsDonvi(JSON.parse(storedDonvi));
    }
  };

  const getDSDVIQLY1 = () => {
    try {
      if (isUpdate && danhmucc3) {
        setDanhMucC3(danhmucc3);
      } else {
        setDanhMucC3({ ...QLKC_C3_GIAONHAN_TEMCHI });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDSDVIQLY();
    getDSDVIQLY1();
  }, [isUpdate, danhmucc3]);

  // Hàm cập nhật dữ liệu trong state
  const handleInputChange = (field, value) => {
    setDanhMucC3({
      ...danhMucC3,
      [field]: value || "", // Default to empty string if no value is provided
    });
  };

  const handleValidate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!danhMucC3.don_vi_giao) {
      isValid = false;
      tempErrors.don_vi_giao = "Đơn vị giao không được để trống";
    }

    if (!danhMucC3.nguoi_nhan) {
      isValid = false;
      tempErrors.nguoi_nhan = "Người nhận không được để trống";
    }

    if (!danhMucC3.loai_bban) {
      isValid = false;
      tempErrors.loai_bban = "Loại biên bản không được để trống";
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (isUpdate) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  // const Create = async () => {
  //   try {
  //     if (handleValidate()) {
  //       const result = await insert_QLKC_C3_GIAONHAN_TEMCHI({
  //         ...danhMucC3,
  //         nguoi_tao: danhMucC3.nguoi_tao,
  //       });
  //       toast.current.show({
  //         severity: "success",
  //         summary: "Thông báo",
  //         detail: "Thêm giao nhận tem chì thành công",
  //         life: 3000,
  //       });
  //       setVisible(false);
  //       loadData();
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Thông báo",
  //       detail: "Thêm giao nhận tem chì không thành công",
  //       life: 3000,
  //     });
  //   }
  // };

  const handleCreate = async () => {
    const dataToSend = Object.fromEntries(
      Object.entries(danhMucC3).map(([key, value]) => [
        key,
        value === null || value === undefined ? "" : value, // Ensure all values are non-null strings
      ])
    );

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
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Lỗi khi gửi dữ liệu",
        life: 3000,
      });
    }
  };

  // const Update = async () => {
  //   try {
  //     if (handleValidate()) {
  //       const result = await update_QLKC_C3_GIAONHAN_TEMCHI({
  //         ...danhMucC3,
  //         nguoi_sua: "1",
  //       });
  //       toast.current.show({
  //         severity: "success",
  //         summary: "Thông báo",
  //         detail: "Cập nhật giao nhận tem chì thành công",
  //         life: 3000,
  //       });
  //       setVisible(false);
  //       loadData();
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Thông báo",
  //       detail: "Cập nhật giao nhận tem chì không thành công",
  //       life: 3000,
  //     });
  //   }
  // };

  const handleUpdate = async () => {
    try {
      await update_QLKC_C3_GIAONHAN_TEMCHI(danhMucC3);
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
      header={
        !isUpdate ? "Thêm mới giao nhận tem chì" : "Sửa giao nhận tem chì"
      }
      visible={visible}
      className="w-11 md:w-5/12 lg:w-4/12"
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        setDanhMucC3(null);
      }}
    >
      <div className="flex flex-column gap-4">
        <div className="flex gap-4 mt-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="don_vi_giao" className="mb-2">
              Đơn vị giao
            </label>
            <Dropdown
              id="don_vi_giao"
              value={danhMucC3.don_vi_giao}
              options={dsDonvi}
              onChange={(e) => handleInputChange("don_vi_giao", e.value)}
              optionLabel="ten"
              optionValue="ma_dviqly"
              placeholder="Chọn đơn vị giao"
              className="w-full"
            />
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="don_vi_nhan" className="mb-2">
              Đơn vị nhận
            </label>
            <Dropdown
              id="don_vi_nhan"
              value={danhMucC3.don_vi_nhan}
              options={dsDonvi}
              onChange={(e) => handleInputChange("don_vi_nhan", e.value)}
              optionLabel="ten"
              optionValue="ma_dviqly"
              placeholder="Chọn đơn vị nhận"
              className="w-full"
            />
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="DONVI_TINH" className="mb-2">
              Đơn vị tính
            </label>
            <InputText
              id="DONVI_TINH"
              className="w-full"
              placeholder="Nhập đơn vị tính..."
              onChange={(e) => {
                setDanhMucC3({ ...danhMucC3, donvi_tinh: e.target.value });
              }}
              onFocus={() => {
                if (errors.donvi_tinh) {
                  setErrors({});
                }
              }}
              type="text"
              value={danhMucC3.donvi_tinh}
            />
            {errors.donvi_tinh && (
              <small className="p-error">{errors.donvi_tinh}</small>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="LOAI_BBAN" className="mb-2">
              Loại biên bản
            </label>
            <InputText
              id="LOAI_BBAN"
              className="w-full"
              placeholder="Nhập loại biên bản..."
              onChange={(e) => {
                setDanhMucC3({ ...danhMucC3, loai_bban: e.target.value });
              }}
              onFocus={() => {
                if (errors.loai_bban) {
                  setErrors({});
                }
              }}
              type="text"
              value={danhMucC3.loai_bban}
            />
            {errors.loai_bban && (
              <small className="p-error">{errors.loai_bban}</small>
            )}
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="TRANG_THAI" className="mb-2">
              Trạng thái
            </label>
            <Dropdown
              id="TRANG_THAI"
              className="w-full"
              options={[
                { label: "Có hiệu lực", value: 1 },
                { label: "Hết hiệu lực", value: 0 },
              ]}
              placeholder="Chọn trạng thái"
              onChange={(e) => {
                setDanhMucC3({ ...danhMucC3, trang_thai: e.value });
              }}
              value={danhMucC3.trang_thai}
            />
            {errors.trang_thai && (
              <small className="p-error">{errors.trang_thai}</small>
            )}
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="SOLUONG" className="mb-2">
              Số lượng
            </label>
            <InputText
              id="SOLUONG"
              className="w-full"
              placeholder="Nhập số lượng..."
              onChange={(e) => {
                setDanhMucC3({ ...danhMucC3, soluong: e.target.value });
              }}
              onFocus={() => {
                if (errors.soluong) {
                  setErrors({});
                }
              }}
              type="text"
              value={danhMucC3.soluong}
            />
            {errors.soluong && (
              <small className="p-error">{errors.soluong}</small>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="NGUOI_GIAO" className="mb-2">
              Người giao
            </label>
            <InputText
              id="NGUOI_GIAO"
              className="w-full"
              placeholder="Nhập người giao..."
              onChange={(e) => {
                setDanhMucC3({ ...danhMucC3, nguoi_giao: e.target.value });
              }}
              onFocus={() => {
                if (errors.nguoi_giao) {
                  setErrors({});
                }
              }}
              type="text"
              value={danhMucC3.nguoi_giao}
            />
            {errors.nguoi_giao && (
              <small className="p-error">{errors.nguoi_giao}</small>
            )}
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="NGUOI_NHAN" className="mb-2">
              Người nhận
            </label>
            <InputText
              id="NGUOI_NHAN"
              className="w-full"
              placeholder="Nhập người nhận..."
              onChange={(e) => {
                setDanhMucC3({ ...danhMucC3, nguoi_nhan: e.target.value });
              }}
              onFocus={() => {
                if (errors.nguoi_nhan) {
                  setErrors({});
                }
              }}
              type="text"
              value={danhMucC3.nguoi_nhan}
            />
            {errors.nguoi_nhan && (
              <small className="p-error">{errors.nguoi_nhan}</small>
            )}
          </div>

          <div className="flex flex-column flex-1">
            <label htmlFor="LOAI" className="mb-2">
              Loại
            </label>
            <InputText
              id="LOAI"
              className="w-full"
              placeholder="Nhập loại..."
              onChange={(e) => {
                setDanhMucC3({ ...danhMucC3, loai: e.target.value });
              }}
              onFocus={() => {
                if (errors.loai) {
                  setErrors({});
                }
              }}
              type="text"
              value={danhMucC3.loai}
            />
            {errors.loai && <small className="p-error">{errors.loai}</small>}
          </div>
        </div>

        <div className="flex flex-column flex-1">
          <label htmlFor="NGAY_GIAO" className="mb-2">
            Ngày giao
          </label>
          <Calendar
            id="NGAY_GIAO"
            className="w-full"
            placeholder="Chọn ngày giao..."
            onChange={(e) => {
              setDanhMucC3({ ...danhMucC3, ngay_giao: e.target.value });
            }}
            onFocus={() => {
              if (errors.ngay_giao) {
                setErrors({});
              }
            }}
            value={danhMucC3.ngay_giao}
          />
          {errors.ngay_giao && (
            <small className="p-error">{errors.ngay_giao}</small>
          )}
        </div>

        <div className="flex flex-column flex-1">
          <label htmlFor="NGAY_NHAN" className="mb-2">
            Ngày nhận
          </label>
          <Calendar
            id="NGAY_NHAN"
            className="w-full"
            placeholder="Chọn ngày nhận..."
            onChange={(e) => {
              setDanhMucC3({ ...danhMucC3, ngay_nhan: e.target.value });
            }}
            onFocus={() => {
              if (errors.ngay_nhan) {
                setErrors({});
              }
            }}
            value={danhMucC3.ngay_nhan}
          />
          {errors.ngay_nhan && (
            <small className="p-error">{errors.ngay_nhan}</small>
          )}
        </div>

        <div className="flex flex-column flex-1">
          <label htmlFor="LOAI_BBAN" className="mb-2">
            Loại biên bản
          </label>
          <InputText
            id="LOAI_BBAN"
            className="w-full"
            placeholder="Nhập loại biên bản..."
            onChange={(e) => {
              setDanhMucC3({ ...danhMucC3, loai_bban: e.target.value });
            }}
            onFocus={() => {
              if (errors.loai_bban) {
                setErrors({});
              }
            }}
            value={danhMucC3.loai_bban}
          />
          {errors.loai_bban && (
            <small className="p-error">{errors.loai_bban}</small>
          )}
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
              setDanhMucC3(null);
            }}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default InputDM_C3Modal;
