import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { QLKC_KHO_CHI_TEM } from "../../../models/QLKC_KHO_CHI_TEM";
import { insertDM_PHONGBAN, update_QLKC_KHO_CHI_TEM } from "../../../services/quanlykimchi/QLKC_KHO_CHI_TEMService";

export const InputQLKC_KHO_CHI_TEMModal = ({
  isUpdate,
  KHOCHITEM,
  visible,
  setVisible,
  toast,
  loadData,
}) => {
  // Đảm bảo rằng `phongBan` luôn có giá trị mặc định cho các thuộc tính
  const [phongBan, setPhongBan] = useState({
    loai: '', // Giá trị mặc định cho `loai`
    ...QLKC_KHO_CHI_TEM, // Kết hợp với đối tượng mặc định từ QLKC_KHO_CHI_TEM
  });
  const [errors, setErrors] = useState({});

  // Hàm lấy dữ liệu phòng ban và đơn vị quản lý
  const getDSDVIQLY = async () => {
    try {
      if (isUpdate && KHOCHITEM) {
        setPhongBan(KHOCHITEM); // Cập nhật phongBan khi isUpdate
      } else {
        setPhongBan({
          loai: '', // Đảm bảo `loai` có giá trị mặc định
          ...QLKC_KHO_CHI_TEM, // Đặt lại các giá trị mặc định nếu không cập nhật
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {             
    getDSDVIQLY();
  }, [isUpdate, KHOCHITEM]);

  // Kiểm tra dữ liệu hợp lệ trước khi submit
  const handleCreate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!phongBan.loai) {
      isValid = false;
      tempErrors.loai = "Loại phòng ban không được để trống";
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Xử lý submit
  const handleSubmit = () => {
    if (isUpdate) {
      Update();
    } else {
      Create();
    }
  };

  const Create = async () => {
    try {
      if (handleCreate()) {
        const result = await insertDM_PHONGBAN({
          ...phongBan,
          nguoi_tao: "1",
        });

        toast.current.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Thêm phòng ban thành công",
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
        detail: "Thêm phòng ban không thành công",
        life: 3000,
      });
    }
  };

  const Update = async () => {
    try {
      if (handleCreate()) {
        const result = await update_QLKC_KHO_CHI_TEM(phongBan);

        toast.current.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Cập nhật phòng ban thành công",
          life: 3000,
        });
        setVisible(false);
        loadData();
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Cập nhật phòng ban không thành công",
        life: 3000,
      });
    }
  };

  return (
    <Dialog
      header={isUpdate ? "Sửa kho chì tem" : "Thêm mới danh mục phòng ban"}
      visible={visible}
      className="w-6 md:w-5/12 lg:w-4/12"
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        setPhongBan({ loai: '' }); // Đảm bảo phòng ban luôn được reset khi đóng modal
      }}
      >
      <div className="flex flex-column gap-4">
        {/* Loại phòng ban */}
    

        <div className="flex flex-column">
          <label htmlFor="loai" className="mb-2">
            Loại
          </label>
          <InputText
            id="loai"
            className="w-full"
            placeholder="Tên phòng ban ..."
            onChange={(e) => {
              setPhongBan({ ...phongBan, loai: e.target.value });
            }}
            onFocus={() => {
              if (errors.loai) {
                setErrors({});
              }
            }}
            type="text"
            value={phongBan.loai}
          />
          {errors.loai && <small className="p-error">{errors.ten}</small>}
        </div>

        <div className="flex flex-column">
          <label htmlFor="sO_LUONG" className="mb-2">
            Số lượng
          </label>
          <InputText
            id="sO_LUONG"
            className="w-full"
            placeholder="Tên phòng ban ..."
            onChange={(e) => {
              setPhongBan({ ...phongBan, sO_LUONG: e.target.value });
            }}
            onFocus={() => {
              if (errors.sO_LUONG) {
                setErrors({});
              }
            }}
            type="text"
            value={phongBan.sO_LUONG}
          />
          {errors.loai && <small className="p-error">{errors.ten}</small>}
     

          <div className="flex flex-column flex-grow-1">
            <label htmlFor="thang" className="mb-2">
              Tháng
            </label>
            <InputText
              id="thang"
              className="w-full"
              onChange={(e) => {
                setPhongBan({ ...phongBan, thang: e.target.value });
              }}
              type="text"
              value={phongBan.thang}
            />
          </div>

          <div className="flex flex-column flex-grow-1">
            <label htmlFor="SAP_XEP" className="mb-2">
              Năm 
            </label>
            <InputText
              id="nam"
              className="w-full"
              onChange={(e) => {
                setPhongBan({ ...phongBan, nam: e.target.value });
              }}
              type="text"
              value={phongBan.nam}
            />
          </div>

          <div className="flex flex-column flex-grow-1">
            <label htmlFor="doN_VI_TINH" className="mb-2">
              Đơn vị tính 
            </label>
            <InputText
              id="doN_VI_TINH"
              className="w-full"
              onChange={(e) => {
                setPhongBan({ ...phongBan, doN_VI_TINH: e.target.value });
              }}
              type="text"
              value={phongBan.doN_VI_TINH}
            />
          </div>

        <div className="flex justify-content-center gap-4 mt-4">
          <Button
            label="Lưu"
            onClick={handleSubmit}
            severity="success"
            style={{ backgroundColor: '#1445a7' }}
          />
          <Button
            label="Đóng"
            outlined
            severity="secondary"
            onClick={() => {
              setVisible(false);
              setPhongBan({ loai: '' }); // Reset khi đóng modal
            }}
          />
        </div>
      </div>

      </div>
    </Dialog>
  );
};
