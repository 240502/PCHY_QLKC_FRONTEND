import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import {
  insert_BBAN_BANGIAO_KIM,
  update_QLKC_BBAN_BANGIAO_KIMChoDuyet,
} from "../../../services/quanlykimchi/BBAN_GIAO_KIMService";
import { D_KIMService } from "../../../services/quanlykimchi/D_KIMService";
import { MultiSelect } from "primereact/multiselect";
import { HT_NGUOIDUNG } from "../../../models/HT_NGUOIDUNG";
import { getDM_PHONGBANByMA_DVIQLY } from "../../../services/quantrihethong/DM_PHONGBANService";
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
  const [phongBanArr, setPhongBanArr] = useState([]);
  const [user, setUser] = useState(HT_NGUOIDUNG);
  const [newKimIds, setNewKimIds] = useState([]);
  const [deletedKimIds, setDeletedKimIds] = useState([]);
  useEffect(() => {
    //call api get all danh muc kim by ma_dviqly
    const getAllD_KIM = async () => {
      try {
        let ma_dviqly = "";
        if (!isUpdate) {
          ma_dviqly = JSON.parse(
            sessionStorage.getItem("current_MADVIQLY") || ""
          );
        }
        let kimIds = "";
        if (isUpdate) {
          kimIds = bienBan.id_kim;
        }
        const data = {
          ma_dviqly: ma_dviqly,
          kimIds: kimIds,
        };
        const res = await D_KIMService.get_All_D_KIMByMA_DVIQLY(data);
        console.log("danh muc kim", res);
        // handle view selected kim when update bien ban
        if (bienBan?.id_kim) {
          const selectedIds = bienBan.id_kim
            .split(",")
            .map((item) => Number(item));

          setSelectedItems(selectedIds);
        }
        setD_KIM(res);
      } catch (err) {
        console.log(err.message);
      }
    };

    // call api get all danh muc phong ban by ma_dviqly
    const getAllD_PhongBan = async () => {
      try {
        const res = await getDM_PHONGBANByMA_DVIQLY("PA23");
        setPhongBanArr(res);
      } catch (err) {
        console.log(err.message);
      }
    };
    getAllD_KIM();
    getAllD_PhongBan();
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    setUser(user);

    return () => {
      setSelectedItems([]);
      setD_KIM([]);
    };
  }, []);

  // handle data before call api insert or update
  const handleData = () => {
    let newErrors;
    if (!bienBan?.don_vi_giao) {
      newErrors = { ...newErrors, donViGiao: "Không được để trống ô này!" };
    }
    if (!bienBan?.don_vi_nhan) {
      newErrors = { ...newErrors, donViNhan: "Không được để trống ô này!" };
    }
    if (bienBan?.don_vi_giao && bienBan.don_vi_nhan) {
      if (bienBan?.don_vi_giao === bienBan.don_vi_nhan) {
        newErrors = {
          ...newErrors,
          donViNhan: "Đơn vị giao và đơn vị nhận phải khác nhau!",
          donViGiao: "Đơn vị giao và đơn vị nhận phải khác nhau!",
        };
      }
    }
    if (selectedItems.length == 0) {
      newErrors = { ...newErrors, maKim: "Không được để trống ô này!" };
    }
    if (!bienBan?.so_luong && bienBan?.id_bienban) {
      newErrors = { ...newErrors, soLuong: "Không được để trống ô này!" };
    } else {
      if (!/^\d+$/.test(bienBan?.so_luong) && bienBan?.id_bienban) {
        newErrors = {
          ...newErrors,
          soLuong: "Số lượng không bao gồm chữ, ký tự đặc biệt!",
        };
      }
    }
    if (newErrors) {
      setErrors(newErrors);
    } else {
      if (isUpdate) {
        const data = {
          don_vi_giao: bienBan?.don_vi_giao,
          nguoi_giao: bienBan.nguoi_giao,
          nguoi_nhan: bienBan?.nguoi_nhan,
          don_vi_nhan: bienBan?.don_vi_nhan,
          so_luong: selectedItems.length,
          id_kim: selectedItems.join(","),
          noi_dung: bienBan?.noi_dung,
          id_bienban: bienBan?.id_bienban,
          ngay_giao: bienBan?.ngay_giao,
          loai_bban: bienBan?.loai_bban,
        };
        update_BBAN(data);
      } else {
        const data = {
          don_vi_giao: bienBan?.don_vi_giao,
          nguoi_giao: user.id,
          nguoi_nhan: "",
          don_vi_nhan: bienBan?.don_vi_nhan,
          so_luong: bienBan?.so_luong ?? selectedItems.length,
          id_kim: selectedItems.join(","),
          noi_dung: bienBan?.noi_dung,
          loai_bban: bienBan?.loai_bban,
        };
        insert_BBAN(data);
      }
    }
  };

  // call api insert bien ban ban giao kim
  const insert_BBAN = async (data) => {
    try {
      const res = await insert_BBAN_BANGIAO_KIM(data);
      showToast("success", "Thêm thành công!");
      handleCloseModal();
      const dataUpdate = {
        ht_nguoidung_id: user.id,
        ma_dvigiao: data.don_vi_nhan,
        id_kim: null,
      };
      selectedItems.forEach((item) => {
        update_MA_DVIQLY_D_KIM({ ...dataUpdate, id_kim: item });
      });
      loadData();
    } catch (err) {
      console.log(err);
      showToast("error", "Thêm không thành công!");
    }
  };
  const update_MA_DVIQLY_D_KIM = async (id_kim) => {
    try {
      const res = await D_KIMService.update_MA_DVIQLY(id_kim);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  //call api update bien ban ban giao kim
  const update_BBAN = async (data) => {
    try {
      const res = await update_QLKC_BBAN_BANGIAO_KIMChoDuyet(data);
      showToast("success", "Sửa thành công!");
      handleCloseModal();
      loadData();

      if (deletedKimIds.length > 0) {
        const dataUpdate = {
          ht_nguoidung_id: user.id,
          ma_dvigiao: "PA23",
          id_kim: null,
        };
        deletedKimIds.forEach((item) => {
          update_MA_DVIQLY_D_KIM({ ...dataUpdate, id_kim: item });
        });
      }
      if (newKimIds.length > 0) {
        const dataUpdate = {
          ht_nguoidung_id: user.id,
          ma_dvigiao: data.don_vi_nhan,
          id_kim: null,
        };
        newKimIds.forEach((item) => {
          update_MA_DVIQLY_D_KIM({ ...dataUpdate, id_kim: item });
        });
      }
    } catch (err) {
      console.log(err.message);
      showToast("error", "Sửa không thành công!");
    }
  };
  const handleChangeSelectKim = (kimIds) => {
    let existsIds = [];
    let newKimIdsCopy = newKimIds;
    let deletedIdsCopy = deletedKimIds;

    if (bienBan?.id_kim?.length > 0) {
      existsIds = bienBan.id_kim.split(",").map((item) => Number(item));
    } else {
      existsIds = [Number(bienBan.id_kim)];
    }
    // xử lý khi người dùng chọn thêm kìm mới
    kimIds.forEach((item) => {
      if (!existsIds.includes(item)) {
        if (newKimIdsCopy.length > 0) {
          if (!newKimIdsCopy.includes(item)) {
            newKimIdsCopy = [...newKimIdsCopy, item];
          }
        } else {
          newKimIdsCopy = [item];
        }
        setNewKimIds(newKimIdsCopy);
      }
    });

    // xử lý nếu người dùng bỏ chọn lựa chọn kìm vừa chọn trước đó.
    // Ví dụ người dùng vừa chọn mới 1 kìm có mã là 4 nhưng rồi lại bỏ chọn.
    // Đoạn mã này xử lý việc loại bỏ các id bị bỏ chọn đó
    newKimIdsCopy = newKimIdsCopy.filter((item) => kimIds.includes(item));
    console.log("newKimIdsCopy", newKimIdsCopy);
    //////////

    // xử lý khi người dùng bỏ chọn kìm
    if (kimIds.length > 0) {
      existsIds.forEach((item) => {
        if (!kimIds.includes(item)) {
          if (deletedIdsCopy.length > 0) {
            if (!deletedIdsCopy.includes(item)) {
              deletedIdsCopy.push(item);
            }
          } else {
            deletedIdsCopy = [item];
          }
          console.log("unselect", item);
        }
      });
      setDeletedKimIds([...deletedIdsCopy]);
    } else {
      setDeletedKimIds([...existsIds]);
    }
    // xử lý nếu người dùng vừa bỏ chọn lựa chọn kìm nhưng sau đó lại chọn lại nó.
    // Ví dụ người dùng vừa bỏ chọn  1 kìm có mã là 4 nhưng rồi lại chọn lại ngay sau đó.
    // Đoạn mã này xử lý việc loại bỏ các id đó.
    if (kimIds.length > 0) {
      deletedIdsCopy = deletedIdsCopy.filter((item) => !kimIds.includes(item));
      console.log("deletedIdsCopy", deletedIdsCopy);
    } else {
      console.log("deletedIdsCopy else", deletedIdsCopy);
    }
    //////////
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
        <div>
          <label className="block mb-2">Loại biên bản</label>
          <Dropdown
            value={bienBan?.loai_bban}
            className="w-full"
            options={arrLoaiBienBan}
            placeholder="Chọn loại biên bản"
            showClear
            filter
            onChange={(e) => {
              setBienBan({ ...bienBan, loai_bban: e.value });
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
              value={bienBan?.don_vi_giao}
              options={phongBanArr}
              filter
              onChange={(e) => {
                const donVi = donViArr.find((item) => item.id === e.value);
                setBienBan({
                  ...bienBan,
                  don_vi_giao: e.value,
                });
              }}
              id="donViNhan"
              optionValue="id"
              optionLabel="ten"
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
              value={bienBan?.don_vi_nhan}
              options={donViArr}
              onChange={(e) => {
                const donVi = donViArr.find(
                  (item) => item.ma_dviqly === e.value
                );
                setBienBan({
                  ...bienBan,
                  don_vi_nhan: e.value,
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
                handleChangeSelectKim(e.value);
                setSelectedItems(e.value);
              }}
              placeholder="Chọn mã kìm"
              display="chip"
              optionValue="id_kim"
              optionLabel="ma_hieu"
              onFocus={() => {
                setErrors({ ...errors, maKim: null });
              }}
            />

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
                setBienBan({ ...bienBan, so_luong: e.target.value });
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
            value={bienBan?.noi_dung}
            onChange={(e) => {
              setBienBan({ ...bienBan, noi_dung: e.target.value });
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
