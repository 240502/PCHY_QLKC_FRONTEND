import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import { useRouter } from "next/router";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import TableQLKC_C4_GIAONHAN_KIM from "./TableQLKC_C4_GIAONHAN_KIM";
import BienBanViewer from "./BienBanViewer";
import {
  InputDM_PHONGBANModal,
  InputQLKC_KHO_CHI_TEMModal,
} from "./InputQLKC_C4_GIAONHAN_KIMModal";
import { QLKC_C4_GIAONHAN_KIM } from "../../../models/QLKC_C4_GIAONHAN_KIM";
import { search_C4_GIAONHAN_KIM } from "../../../services/quanlykimchi/QLKC_C4_GIAONHAN_KIMService";
import { Calendar } from "primereact/calendar";
import { formatISO } from "date-fns";
import { clamp } from "date-fns";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";
import { D_KIMService } from "../../../services/quanlykimchi/D_KIMService";

const GiaonhankimC4 = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [dsDonvi, setDsDonvi] = useState([]);
  const [users, setUsers] = useState([]);
  const [bienBan, setBienBan] = useState({});
  const [visibleViewer, setVisibleViewer] = useState(false);
  const currentMenu = sessionStorage.getItem("currentMenu");
  const [options, setOptions] = useState({
    loai: "",
    tranG_THAI: "",
    doN_VI_GIAO: "",
    doN_VI_NHAN: "",
    ngaY_GIAO: "",
    ngaY_NHAN: "",
  });
  const [arrC4GiaoNhanKim, setArrC4GiaoNhanKim] = useState([
    QLKC_C4_GIAONHAN_KIM,
  ]);
  const [GIAONHANKIM, setC4GIAONHANKIM] = useState(QLKC_C4_GIAONHAN_KIM);
  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const toast = useRef(null);
  const [selectedGiaoNhanKim, setSelectedGiaoNhanKim] = useState(null);
  const [isViewerVisible, setViewerVisible] = useState(false);
  useEffect(() => {
    const storedDsDonvi = sessionStorage.getItem("ds_donvi");
    if (storedDsDonvi) {
      setDsDonvi(JSON.parse(storedDsDonvi));
    }

    const fetchUsers = async () => {
      try {
        const ma_dviqly = JSON.parse(
          sessionStorage.getItem("current_MADVIQLY") || ""
        );
        const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY(
          ma_dviqly
        );
        setUsers(res);
      } catch (e) {
        console.error("Error fetching users:", e);
      }
    };

    fetchUsers();
  }, []);
  const [idToMaHieuMap, setIdToMaHieuMap] = useState({});

  const fetchD_KIMData = async () => {
    try {
      const ma_dviqly = JSON.parse(
        sessionStorage.getItem("current_MADVIQLY") || ""
      );

      const res = await D_KIMService.get_ALL_D_KIMTTByMA_DVIQLY1(ma_dviqly);
      console.log("Res", res);
      // Create a mapping of id_kim to ma_hieu
      const mapping = res.reduce((acc, item) => {
        acc[item.id_kim] = item.ma_hieu;
        return acc;
      }, {});

      setIdToMaHieuMap(mapping);
    } catch (err) {
      console.error("Error fetching D_KIM data:", err);
    }
  };
  const loadData = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const isPhongKinhDoanh = user && user.ten_phongban === "Phòng kinh doanh";

      const ma_dviqly = JSON.parse(
        sessionStorage.getItem("current_MADVIQLY") || ""
      );

      const data = {
        pageIndex: page,
        pageSize: pageSize,
        ma_dviqly,
        ...(isPhongKinhDoanh ? {} : { userId: user.id }), // Nếu là phòng kinh doanh, không thêm userId
        ...(options.doN_VI_GIAO ? { doN_VI_GIAO: options.doN_VI_GIAO } : {}),
        ...(options.doN_VI_NHAN ? { doN_VI_NHAN: options.doN_VI_NHAN } : {}),
        ...(options.loai ? { loai: options.loai } : {}),
        ...(options.ngaY_GIAO ? { ngaY_GIAO: options.ngaY_GIAO } : {}),
        ...(options.ngaY_NHAN ? { ngaY_NHAN: options.ngaY_NHAN } : {}),
        ...(options.tranG_THAI !== undefined
          ? { tranG_THAI: options.tranG_THAI }
          : {}),
      };

      console.log("Payload gửi lên API:", data);

      const items = await search_C4_GIAONHAN_KIM(data);
      console.log("Phản hồi từ API:", items);

      if (items && items.data) {
        const mappedData = await Promise.all(
          items.data.map(async (item) => {
            let nguoiGiao = {};
            let nguoiNhan = {};

            if (item.nguoI_GIAO) {
              try {
                const res = await HT_NGUOIDUNG_Service.getById(item.nguoI_GIAO);
                nguoiGiao = res;
              } catch (err) {
                console.error("Error fetching nguoI_GIAO:", err);
              }
            }

            if (item.nguoI_NHAN) {
              try {
                const res = await HT_NGUOIDUNG_Service.getById(item.nguoI_NHAN);
                nguoiNhan = res;
              } catch (err) {
                console.error("Error fetching nguoI_NHAN:", err);
              }
            }

            return {
              ...item,
              ten_nguoi_giao: nguoiGiao.ho_ten || "Không xác định",
              ten_nguoi_nhan: nguoiNhan.ho_ten || "Không xác định",
            };
          })
        );

        setArrC4GiaoNhanKim(mappedData);
        console.log("mappedData", mappedData);
      } else {
        console.error("Không có dữ liệu trong phản hồi từ API");
      }

      setPageCount(Math.ceil((items?.totalItems || 0) / pageSize));
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err.message);
      setArrC4GiaoNhanKim([]);
      setPageCount(0);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  console.log("GIAONHANKIM", GIAONHANKIM);

  const onClinkSearchBtn = (e) => {
    console.log("Nút Tìm kiếm được bấm");
    loadData();
  };

  const formatDateToDMY = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const formatDateToISO = (date) => {
    if (!date) return null;
    return new Date(date).toISOString();
  };

  const handleCloseModalViewer = () => {
    setVisibleViewer(false);
    setBienBan({});
  };

  const handleCloseModal = () => {
    setVisible(false);
    setIsUpdate(false);
    setBienBan({});
  };
  const handleOpenModal = () => {
    setVisible(true);
  };
  // const handleCloseModalViewer = () => {
  //   setVisibleViewer(false);
  //   setBienBan({});
  // };
  const handleOnClickUpdateBtn = (giaoNhanKim) => {
    setIsUpdate(true);
    setVisible(true);
    setBienBan(giaoNhanKim);
  };
  const handleOnClickKySoBtn = (rowData) => {
    console.log("Dữ liệu khi nhấn nút:", rowData);
    setVisibleViewer(true);
    setBienBan(rowData);
  };

  const showToast = (type, message) => {
    toast.current.show({
      severity: type,
      summary: "Thông báo",
      detail: message,
    });
  };
  console.log("setBienBan", setBienBan);
  console.log("options.ngaY_GIAO", options.ngaY_GIAO);
  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <Panel header={currentMenu} className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />

            <div className="flex flex-column lg:flex-row gap-3">
              <div className="flex-auto">
                <label htmlFor="tranG_THAI" className="mb-2 block">
                  Trạng thái
                </label>
                <Dropdown
                  id="tranG_THAI"
                  className="w-full"
                  placeholder="Chọn trạng thái"
                  value={options.tranG_THAI}
                  options={[
                    { label: "Chờ xác nhận", value: 0 },
                    { label: "Ký cấp 1", value: 1 },
                    { label: "Ký cấp 2", value: 2 },
                  ]}
                  onChange={(e) =>
                    setOptions({ ...options, tranG_THAI: e.value })
                  }
                  showClear
                />
              </div>

              <div className="flex-auto">
                <label htmlFor="ngaY_GIAO" className="mb-2 block">
                  Ngày giao
                </label>
                <Calendar
                  id="ngaY_GIAO"
                  className="w-full"
                  placeholder="Chọn ngày giao"
                  value={options.ngaY_GIAO ? new Date(options.ngaY_GIAO) : null}
                  onChange={(e) => {
                    if (e.value) {
                      const selectedDate = new Date(e.value);
                      setOptions({
                        ...options,
                        ngaY_GIAO: selectedDate.toISOString(),
                      });
                    } else {
                      setOptions({ ...options, ngaY_GIAO: null });
                    }
                  }}
                  dateFormat="dd/mm/yy"
                  showIcon
                />
              </div>

              <div className="flex-auto">
                <label htmlFor="ngaY_NHAN" className="mb-2 block">
                  Ngày nhận
                </label>
                <Calendar
                  id="ngaY_NHAN"
                  className="w-full"
                  placeholder="Chọn ngày nhận"
                  value={options.ngaY_NHAN ? new Date(options.ngaY_NHAN) : null}
                  onChange={(e) => {
                    if (e.value) {
                      const selectedDate = new Date(e.value);
                      setOptions({
                        ...options,
                        ngaY_NHAN: selectedDate.toISOString(),
                      });
                    } else {
                      setOptions({ ...options, ngaY_NHAN: null });
                    }
                  }}
                  dateFormat="dd/mm/yy"
                  showIcon
                />
              </div>
            </div>

            <div className="flex justify-content-center mt-4">
              <Button
                style={{ backgroundColor: "#1445a7", color: "#fff" }}
                label="Tìm kiếm"
                onClick={onClinkSearchBtn}
                severity="info"
              />
            </div>
          </Panel>

          <TableQLKC_C4_GIAONHAN_KIM
            setVisible={setVisible}
            setIsUpdate={setIsUpdate}
            setC4GIAONHANKIM={setC4GIAONHANKIM}
            data={arrC4GiaoNhanKim}
            pageCount={pageCount}
            setPage={setPage}
            setPageSize={setPageSize}
            page={page}
            showToast={showToast}
            pageSize={pageSize}
            loadData={loadData}
            toast={toast}
            handleOpenModal={handleOpenModal}
            handleOnClickUpdateBtn={handleOnClickUpdateBtn}
            handleOnClickKySoBtn={handleOnClickKySoBtn}
            fetchD_KIMData={fetchD_KIMData}
            idToMaHieuMap={idToMaHieuMap}
          />

          {visible && (
            <InputQLKC_KHO_CHI_TEMModal
              giaoNhanKim={GIAONHANKIM}
              isUpdate={isUpdate}
              handleCloseModal={handleCloseModal}
              visible={visible}
              showToast={showToast}
              setVisible={setVisible}
              toast={toast}
              loadData={loadData}
              fetchD_KIMData={fetchD_KIMData}
            />
          )}
          {visibleViewer && (
            <BienBanViewer
              giaoNhanKim={bienBan}
              visible={visibleViewer}
              handleCloseModalViewer={handleCloseModalViewer}
              showToast={showToast}
              setBienBan={setBienBan}
              loadData={loadData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GiaonhankimC4;
