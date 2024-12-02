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
import { D_KIMService } from "../../../services/quanlykimchi/D_KIMService";
import { MultiSelect } from "primereact/multiselect";
const arrLoaiBienBan = [
  { label: "Bàn giao", value: 0 },
  { label: "Nhận lại", value: 1 },
];
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
  const [D_KIM, setD_KIM] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
    const getAllD_KIM = async () => {
      try {
        const data = {};
        const res = await D_KIMService.search_D_KIM(data);
        setD_KIM(res.data);
        console.log(res);
        if (bienBan) {
          console.log("bienBan", bienBan);
          const arrId = bienBan?.iD_KIM?.split(",").map(Number);
          const selectItems = res.data.filter((item) =>
            arrId.includes(item.id_kim)
          );
          setSelectedItems(selectItems);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getAllD_KIM();
    return () => {
      setSelectedItems([]);
      setD_KIM([]);
      console.log("unmounted");
    };
  }, []);
  useEffect(() => {
    console.log("D_KIm", D_KIM);
  }, [D_KIM]);
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
      newErrors = { ...newErrors, maKim: "Không được để trống ô này!" };
    }
    if (!bienBan?.sO_LUONG && bienBan?.iD_BIENBAN) {
      newErrors = { ...newErrors, soLuong: "Không được để trống ô này!" };
    } else {
      if (!/^\d+$/.test(bienBan?.sO_LUONG) && bienBan?.iD_BIENBAN) {
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
        so_luong: bienBan?.sO_LUONG ?? selectedItems.length,
        id_kim: bienBan?.iD_KIM,
        noi_dung: bienBan?.noI_DUNG,
        id_bienban: bienBan?.iD_BIENBAN,
        ngay_giao: bienBan?.ngaY_GIAO,
        loai_bban: bienBan?.loaI_BBAN,
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
  useEffect(() => {
    if (!bienBan?.iD_KIM) {
      const itemIds = selectedItems.map((item) => item.id_kim);
      console.log("itemIds", itemIds.join(","));
      setBienBan({ ...bienBan, iD_KIM: itemIds.join(",") });
    }
  }, [selectedItems]);

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
        <div>
          <label className="block mb-2">Loại biên bản</label>
          <Dropdown
            value={bienBan?.loaI_BBAN}
            className="w-full"
            options={arrLoaiBienBan}
            placeholder="Chọn loại biên bản"
            showClear
            onChange={(e) => {
              setBienBan({ ...bienBan, loaI_BBAN: e.value });
            }}
          />
        </div>
        <div className="flex flex-row justify-content-between">
          <div className="w-5">
            <label htmlFor="SAP_XEP" className="mb-5">
              Chọn đơn vị giao
            </label>
            <Dropdown
              className="mt-2 w-full"
              value={bienBan?.doN_VI_GIAO}
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
              className="mt-2 w-full"
              value={bienBan?.doN_VI_NHAN}
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
          <div className="w-full">
            <label htmlFor="ma_kim" className="block">
              Mã kìm
            </label>
            <MultiSelect
              className=" w-full mt-2"
              value={selectedItems}
              options={D_KIM}
              onChange={(e) => {
                setSelectedItems(e.value);
              }}
              placeholder="Chọn mã kìm"
              display="chip"
              optionLabel="ma_hieu"
              onFocus={() => {
                setErrors({ ...errors, maKim: null });
              }}
            />
            {/* <p>Các mục đã chọn: {selectedItems.join(", ")}</p> */}
            {/* <InputText
              className="block w-full mt-2"
              id="ma_kim"
              placeholder="Nhập mã kìm ..."
              value={bienBan?.iD_KIM}
              onChange={(e) => {
                setBienBan({ ...bienBan, iD_KIM: e.target.value });
              }}
              onFocus={() => {
                setErrors({ ...errors, maKim: null });
              }}
            /> */}
            {errors?.maKim && (
              <small className="p-error">{errors?.maKim}</small>
            )}
          </div>
        </div>
        <div>
          <div className="">
            <label htmlFor="so_luong">Số lượng kìm</label>
            <InputText
              className="block w-full mt-2"
              id="so_luong"
              placeholder="Nhập số lượng kìm ..."
              value={selectedItems.length}
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
            className="w-full"
            placeholder="Nội dung bàn giao ..."
            value={bienBan?.noI_DUNG}
            onChange={(e) => {
              setBienBan({ ...bienBan, noI_DUNG: e.target.value });
            }}
            type="text"
          />
        </div>

        <div className="flex justify-content-center gap-4 mt-4">
          <Button
            label="Lưu"
            onClick={handleData}
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
              handleCloseModal();
            }}
          />
        </div>
      </div>
    </Dialog>
  );
};
export default BBAN_GIAO_KIMModal;
