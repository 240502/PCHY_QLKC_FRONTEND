import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { QLKC_C4_GIAONHAN_KIM } from "../../../models/QLKC_C4_GIAONHAN_KIM";
import {
  create_PM_QLKC_C4_GIAONHAN_KIM,
  update_CD_QLKC_C4_GIAONHAN_KIM,
  update_KIM_TRANGTHAI,
} from "../../../services/quanlykimchi/QLKC_C4_GIAONHAN_KIMService";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { D_KIMService } from "../../../services/quanlykimchi/D_KIMService";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";
import { HT_NGUOIDUNG } from "../../../models/HT_NGUOIDUNG";

export const InputQLKC_KHO_CHI_TEMModal = ({
  isUpdate,
  giaoNhanKim,
  visible,
  setVisible,
  toast,
  loadData,
  fetchD_KIMData,
}) => {
  const [GIAONHANKIM, setC4GIAONHANKIM] = useState({ ...QLKC_C4_GIAONHAN_KIM });
  const [errors, setErrors] = useState({});
  const [dsDonvi, setDsDonvi] = useState([]);
  const [D_KIM, setD_KIM] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dsNguoiNhan, setDsNguoiNhan] = useState([]);
  const [users, setUsers] = useState([HT_NGUOIDUNG]);
  const [currentUserName, setCurrentUserName] = useState("");
  const [usedKimIds, setUsedKimIds] = useState([]);
  const [deleteKimID, setdeleteKimID] = useState([]);
  const [newKimID, setnewKimID] = useState([]);
  const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const [iD_KIM, setID_KIM] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      console.log("Current User ID:", currentUser.id);
      setC4GIAONHANKIM((prev) => ({
        ...prev,
        nguoI_GIAO: currentUser.id,
      }));
      setCurrentUserName(currentUser.ho_ten || "");
    } else {
      console.error("User data is not available or invalid:", currentUser);
    }
  }, [isUpdate]);

  useEffect(() => {
    if (isUpdate && giaoNhanKim) {
      setID_KIM(giaoNhanKim.iD_KIM);
    }
  }, [isUpdate, giaoNhanKim]);

  const getDSDVIQLY = () => {
    const storedDonvi = sessionStorage.getItem("ds_donvi");
    if (storedDonvi) {
      setDsDonvi(JSON.parse(storedDonvi));
    }
  };

  const getDSDVIQLY1 = () => {
    try {
      if (isUpdate && giaoNhanKim?.iD_KIM) {
        setC4GIAONHANKIM(giaoNhanKim);
        setSelectedItems(
          giaoNhanKim.iD_KIM.split(",").map((item) => parseInt(item))
        );
      } else {
        setC4GIAONHANKIM({ ...QLKC_C4_GIAONHAN_KIM });
        setSelectedItems([]);
      }
    } catch (err) {
      console.log("Error in getDSDVIQLY1:", err);
    }
  };

  useEffect(() => {
    getDSDVIQLY();
    getDSDVIQLY1();
  }, [isUpdate, giaoNhanKim]);

  const handleInputChange = (field, value) => {
    setC4GIAONHANKIM({
      ...GIAONHANKIM,
      [field]: value || "",
    });
  };

  useEffect(() => {
    const getAllD_KIM = async () => {
      try {
        const ma_dviqly = JSON.parse(
          sessionStorage.getItem("current_MADVIQLY") || ""
        );
        let requestData = {};
        if (!isUpdate) {
          requestData = {
            ma_dviqly: ma_dviqly,
            iD_KIM: "", // Trạng thái cần truyền
          };
        } else {
          requestData = {
            ma_dviqly: ma_dviqly,
            iD_KIM: giaoNhanKim.iD_KIM,
          };
        }

        // Gọi API với dữ liệu dạng JSON
        const res = await D_KIMService.get_ALL_D_KIMTTByMA_DVIQLY(requestData); // Gọi API với đối tượng requestData
        setD_KIM(res);

        console.log("1", res);

        // Kiểm tra xem có dữ liệu trả về không
        if (res) {
          // setUsedKimIds(usedKimResponse);
        } else {
          console.warn("Không có dữ liệu kìm nào được trả về.");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err.message); // In ra lỗi chi tiết
      }
    };
    getAllD_KIM();
  }, [isUpdate, iD_KIM]);

  useEffect(() => {
    const oldIdKim = giaoNhanKim?.iD_KIM
      ? giaoNhanKim.iD_KIM.split(",").map((item) => parseInt(item))
      : [];

    const updatedDeleteKimID = [];
    const updatedNewKimID = [];

    oldIdKim.forEach((item) => {
      if (!selectedItems.includes(item)) {
        console.log("Item bị bỏ chọn:", item);
        updatedDeleteKimID.push(item);
      }
    });

    selectedItems.forEach((item) => {
      if (!oldIdKim.includes(item)) {
        console.log("Item mới chọn:", item);
        updatedNewKimID.push(item);
      }
    });

    setdeleteKimID(updatedDeleteKimID);
    console.log("ok", giaoNhanKim);
    setnewKimID(updatedNewKimID);
  }, [selectedItems, giaoNhanKim]);

  console.log("Used Kim IDs:", usedKimIds);
  // console.log("Filtered Kim Options:", filteredKimOptions);

  const handleCreate = async () => {
    const ma_dviqly_raw = sessionStorage.getItem("current_MADVIQLY") || "";
    const ma_dviqly = ma_dviqly_raw.replace(/^"(.*)"$/, "$1"); // Loại bỏ dấu ngoặc kép nếu có

    const dataToSend = {
      ...GIAONHANKIM,
      nguoI_GIAO: currentUser?.id || "",
      iD_KIM: selectedItems.join(","),
      madonviqly: ma_dviqly, // Thêm trường madonviqly đã được xử lý
    };
    console.log("Dữ liệu gửi đi:", dataToSend);

    try {
      await create_PM_QLKC_C4_GIAONHAN_KIM(dataToSend);
      await Promise.all(selectedItems.map((id) => update_KIM_TRANGTHAI(id, 1))); // Cập nhật trạng thái lên 1
      setUsedKimIds((prev) => [...prev, ...selectedItems]);
      toast.current.show({
        severity: "success",
        summary: "Thông báo",
        detail: "Thêm dữ liệu thành công",
        life: 3000,
      });
      setVisible(false);
      loadData();
      fetchD_KIMData();
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
    // Cập nhật số lượng giao trước khi gửi
    handleInputChange("sO_LUONG_GIAO", selectedItems.length.toString());

    const updatedData = {
      ...GIAONHANKIM,
      iD_KIM: selectedItems.join(","), // Cập nhật iD_KIM với các giá trị đã chọn
    };

    console.log("Dữ liệu trước khi cập nhật:", updatedData);

    try {
      // Gửi dữ liệu cập nhật
      await update_CD_QLKC_C4_GIAONHAN_KIM(updatedData);

      // Cập nhật trạng thái kìm mới
      if (newKimID.length > 0) {
        console.log("Updating trạng thái kìm mới:", newKimID);
        await Promise.all(
          newKimID.map((iD_KIM) => update_KIM_TRANGTHAI(iD_KIM, 1))
        );
      }

      // Cập nhật trạng thái kìm bị bỏ
      if (deleteKimID.length > 0) {
        console.log("Updating trạng thái kìm bị bỏ:", deleteKimID);
        await Promise.all(
          deleteKimID.map((iD_KIM) => update_KIM_TRANGTHAI(iD_KIM, 0))
        );
      }

      toast.current.show({
        severity: "success",
        summary: "Thông báo",
        detail: "Cập nhật dữ liệu thành công",
        life: 3000,
      });

      setVisible(false);
      loadData();
    } catch (err) {
      console.error("Lỗi khi cập nhật dữ liệu:", err);

      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Lỗi khi cập nhật dữ liệu",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    const getHT_NGUOIDUNGByMA_DVIQLY = async () => {
      try {
        const ma_dviqly = JSON.parse(
          sessionStorage.getItem("current_MADVIQLY") || ""
        );
        const data = {ma_dviqly: ma_dviqly};
        const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY(
          data
        );
        setUsers(res);
      } catch (e) {
        console.log(e);
      }
    };

    getHT_NGUOIDUNGByMA_DVIQLY();

    console.log("GIAONHANKIM", GIAONHANKIM);
  }, []);

  return (
    <Dialog
      header={
        isUpdate
          ? "Sửa thông tin giao nhận kìm c4"
          : "Thêm mới giao nhận kìm c4"
      }
      visible={visible}
      className="w-6 md:w-5/12 lg:w-4/12"
      onHide={() => {
        setVisible(false);
        setC4GIAONHANKIM({});
      }}
    >
      <div className="flex flex-column gap-4">
        <div className="flex flex-row gap-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="sO_LUONG_GIAO" className="mb-2">
              Số lượng giao
            </label>
            <InputText
              id="sO_LUONG_GIAO"
              className="w-full"
              placeholder="Số lượng giao ..."
              value={GIAONHANKIM.sO_LUONG_GIAO}
              disabled
            />
          </div>
          <div className="flex flex-column flex-1">
            <label htmlFor="ma_kim" className="block">
              <span style={{ color: "red" }}>( * )</span>Mã kìm
            </label>
            <MultiSelect
              className="w-full mt-2"
              value={selectedItems}
              options={D_KIM}
              onChange={(e) => {
                console.log("test1", e.value);
                setSelectedItems(e.value);
                handleInputChange("sO_LUONG_GIAO", e.value.length.toString());
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

        <div className="flex flex-row gap-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="nguoI_GIAO" className="mb-2">
              Người giao
            </label>
            <InputText
              id="nguoI_GIAO"
              className="w-full"
              value={currentUserName}
              disabled
            />
          </div>
          <div className="flex flex-column flex-1">
            <label htmlFor="nguoI_NHAN" className="mb-2">
              <span style={{ color: "red" }}>( * )</span>
              Người nhận
            </label>
            <Dropdown
              value={GIAONHANKIM?.nguoI_NHAN}
              className="w-full"
              options={users}
              placeholder="Chọn"
              showClear
              filter
              optionValue="id"
              optionLabel="hO_TEN"
              onChange={(e) => {
                handleInputChange("nguoI_NHAN", e.value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-column flex-1">
            <label htmlFor="noI_DUNG" className="mb-2">
              Nội dung
            </label>
            <InputText
              id="noI_DUNG"
              className="w-full"
              onChange={(e) => handleInputChange("noI_DUNG", e.target.value)}
              value={GIAONHANKIM.noI_DUNG}
            />
          </div>
        </div>

        <div className="flex justify-content-center gap-4 mt-4">
          {selectedItems.length > 0 && (
            <Button
              label="Lưu"
              onClick={handleSubmit}
              severity="success"
              style={{ backgroundColor: "#1445a7" }}
            />
          )}
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
