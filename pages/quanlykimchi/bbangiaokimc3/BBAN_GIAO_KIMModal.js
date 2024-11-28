import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { isEmptyData } from "../../../utils/BBAN_GIAOKIM";
import {
  insert_BBAN_BANGIAO_KIM,
  update_QLKC_BBAN_BANGIAO_KIMChoDuyet,
} from "../../../services/quanlykimchi/BBAN_GIAO_KIMService";
const BBAN_GIAO_KIMModal = ({
  isUpdate,
  visible,
  handleCloseModal,
  loadData,
  donViArr,
  bienBan,
  setBienBan,
  showToast,
}) => {
  const [errors, setErrors] = useState({});
  useEffect(() => {
    console.log(bienBan);
  }, [bienBan]);
  const handleData = () => {
    let newErrors;
    if (!bienBan?.doN_VI_GIAO) {
      console.log("err1", {
        ...errors,
        donViGiao: "Không được để trống ô này!",
      });
      newErrors = { ...newErrors, donViGiao: "Không được để trống ô này!" };
    }
    if (!bienBan?.doN_VI_NHAN) {
      console.log("err2");

      newErrors = { ...newErrors, donViNhan: "Không được để trống ô này!" };
    }
    if (bienBan?.doN_VI_GIAO && bienBan.doN_VI_NHAN) {
      if (bienBan?.doN_VI_GIAO === bienBan.doN_VI_NHAN) {
        newErrors = {
          ...newErrors,
          donViNhan: "Đơn vị giao và đơn vị nhận phải khác nhau!",
          donViGiao: "Đơn vị giao và đơn vị nhận phải khác nhau!",
        };
      }
    }
    if (!bienBan?.iD_KIM) {
      console.log("err3");

      newErrors = { ...newErrors, maKim: "Không được để trống ô này!" };
    }
    if (!bienBan?.sO_LUONG) {
      newErrors = { ...newErrors, soLuong: "Không được để trống ô này!" };
    } else {
      if (!/^\d+$/.test(bienBan?.sO_LUONG)) {
        newErrors = {
          ...newErrors,
          soLuong: "Số lượng không bao gồm chữ, ký tự đặc biệt!",
        };
      }
    }
    if (newErrors) {
      setErrors(newErrors);
    } else {
      const data = {
        don_vi_giao: bienBan?.doN_VI_GIAO,
        nguoi_giao: bienBan?.nguoI_GIAO,
        nguoi_nhan: bienBan?.nguoI_NHAN,
        don_vi_nhan: bienBan?.doN_VI_NHAN,
        so_luong: Number(bienBan?.sO_LUONG),
        id_kim: bienBan?.iD_KIM,
        noi_dung: bienBan?.noi_dung,
        id_bienban: bienBan?.iD_BIENBAN,
        ngay_giao: bienBan?.ngaY_GIAO,
      };
      if (isUpdate) {
        update_BBAN(data);
      } else {
        insert_BBAN(data);
      }
    }
  };
  const insert_BBAN = async (data) => {
    try {
      console.log(data);
      const res = await insert_BBAN_BANGIAO_KIM(data);
      showToast("success", "Thêm thành công!");
      handleCloseModal();
      loadData();
    } catch (err) {
      console.log(err);
      showToast("error", "Thêm không thành công!");
    }
  };
  const update_BBAN = async (data) => {
    try {
      console.log(data);
      const res = await update_QLKC_BBAN_BANGIAO_KIMChoDuyet(data);
      showToast("success", "Sửa thành công!");
      handleCloseModal();
      loadData();
    } catch (err) {
      console.log(err.message);
      showToast("error", "Sửa không thành công!");
    }
  };
  return (
    <Dialog
      className="w-6 md:w-5/12 lg:w-4/12"
      header={isUpdate ? "Sửa biên bản" : "Thêm mới biên bản"}
      visible={visible}
      onHide={() => {
        handleCloseModal();
      }}
    >
      <div className="flex flex-column gap-4">
        <div className="flex flex-row justify-content-between">
          <div className="w-5">
            <label htmlFor="SAP_XEP" className="mb-5">
              Chọn đơn vị giao
            </label>
            <Dropdown
              disabled={isView}
              className="mt-2 w-full"
              value={bienBan.doN_VI_GIAO}
              options={donViArr}
              onChange={(e) => {
                const donVi = donViArr.find(
                  (item) => item.ma_dviqly === e.value
                );
                setBienBan({
                  ...bienBan,
                  doN_VI_GIAO: e.value,
                  nguoI_GIAO: donVi.ten,
                });
              }}
              optionLabel="ten"
              id="donViNhan"
              optionValue="ma_dviqly"
              placeholder="Chọn đơn vị "
              onFocus={() => {
                setErrors({ ...errors, donViGiao: null });
              }}
            />
            {errors?.donViGiao && (
              <small className="p-error">{errors.donViGiao}</small>
            )}
          </div>
          <div className="w-5">
            <label htmlFor="SAP_XEP" className="mb-2">
              Chọn đơn vị nhận
            </label>
            <Dropdown
              disabled={isView}
              className="mt-2 w-full"
              value={bienBan.doN_VI_NHAN}
              options={donViArr}
              onChange={(e) => {
                const donVi = donViArr.find(
                  (item) => item.ma_dviqly === e.value
                );
                setBienBan({
                  ...bienBan,
                  doN_VI_NHAN: e.value,
                  nguoI_NHAN: donVi.ten,
                });
              }}
              optionLabel="ten"
              id="donViNhan"
              optionValue="ma_dviqly"
              placeholder="Chọn đơn vị "
              onFocus={() => {
                setErrors({ ...errors, donViNhan: null });
              }}
            />
            {errors?.donViNhan && (
              <small className="p-error">{errors?.donViNhan}</small>
            )}
          </div>
        </div>

        <div className="flex flex-row justify-content-between">
          <div className="w-5">
            <label htmlFor="ma_kim">Mã kìm</label>
            <InputText
              readOnly={isView}
              className="block w-full mt-2"
              id="ma_kim"
              placeholder="Nhập mã kìm ..."
              value={bienBan.iD_KIM}
              onChange={(e) => {
                setBienBan({ ...bienBan, iD_KIM: e.target.value });
              }}
              onFocus={() => {
                setErrors({ ...errors, maKim: null });
              }}
            />
            {errors?.maKim && (
              <small className="p-error">{errors?.maKim}</small>
            )}
          </div>
          <div className="w-5">
            <label htmlFor="so_luong">Số lượng kìm</label>
            <InputText
              readOnly={isView}
              className="block w-full mt-2"
              id="so_luong"
              placeholder="Nhập số lượng kìm ..."
              value={bienBan.sO_LUONG}
              onChange={(e) => {
                setBienBan({ ...bienBan, sO_LUONG: e.target.value });
              }}
              onFocus={() => {
                setErrors({ ...errors, soLuong: null });
              }}
            />
            {errors?.soLuong && (
              <small className="p-error">{errors.soLuong}</small>
            )}
          </div>
        </div>
        <div className="flex flex-column">
          <label htmlFor="TEN" className="mb-2">
            Nhập nội dung
          </label>
          <InputText
            id="TEN"
            readOnly={isView}
            className="w-full"
            placeholder="Nội dung bàn giao ..."
            value={bienBan.noI_DUNG}
            onChange={(e) => {
              setBienBan({ ...bienBan, noI_DUNG: e.target.value });
            }}
            type="text"
          />
        </div>

        <div className="flex justify-content-center gap-4 mt-4">
          {isView ? (
            <></>
          ) : (
            <Button
              label="Lưu"
              onClick={handleData}
              severity="success"
              style={{
                backgroundColor: "#1445a7",
              }}
            />
          )}
          <Button
            label="Đóng"
            outlined
            severity="secondary"
            onClick={() => {
              handleCloseModal();
            }}
          />
        </div>
      </div>
    </Dialog>
  );
};
export default BBAN_GIAO_KIMModal;
