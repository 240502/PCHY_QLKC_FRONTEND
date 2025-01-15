import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { TableDM_C3 } from "./TableDM_C3";
import { InputDM_C3Modal } from "./InputDM_C3Modal";
import { QLKC_C3_GIAONHAN_TEMCHI } from "../../../models/QLKC_C3_GIAONHAN_TEMCHI";
import { search_QLKC_C3_GIAONHAN_TEMCHI } from "../../../services/quanlykimchi/QLKC_C3_GIAONHAN_TEMCHIService";
import { getDM_PHONGBANByMA_DVIQLY } from "../../../services/quantrihethong/DM_PHONGBANService";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
import BienBanViewer from "./BienBanViewer";

import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";

const GiaoNhanTemChiC3 = () => {
  const currentMenu = sessionStorage.getItem("currentMenu");
  const [page, setPage] = useState(1);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [dsDonvi, setDsDonvi] = useState([]);
  const [donViArr, setDonViArr] = useState([]);
  const [options, setOptions] = useState({
    loai: "",
    trang_thai: "",
    don_vi_giao: "",
    don_vi_nhan: "",
  });
  const [arrC3GiaoNhanTemChi, setArrC3GiaoNhanTemChi] = useState([
    QLKC_C3_GIAONHAN_TEMCHI,
  ]);
  const [GiaoNhanTemChi, setGiaoNhanTemChi] = useState(QLKC_C3_GIAONHAN_TEMCHI);
  const [bienBan, setBienBan] = useState({});
  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [visibleViewer, setVisibleViewer] = useState(false);
  const [phongBanArr, setPhongBanArr] = useState([]);
  const [bienBanArr, setBienBanArr] = useState([]);

  const toast = useRef(null);
  const current_MADVIQLY = JSON.parse(
    sessionStorage.getItem("current_MADVIQLY")
  );
  const userLocal = JSON.parse(sessionStorage.getItem("user"));
  useEffect(() => {
    const storedDsDonvi = sessionStorage.getItem("ds_donvi");
    if (storedDsDonvi) {
      setDsDonvi(JSON.parse(storedDsDonvi));
    }
  }, []);

  // const loadData = async () => {
  //   try {
  //     const data = {
  //       pageIndex: page,
  //       pageSize: pageSize,
  //       ...(options.don_vi_giao ? { don_vi_giao: options.don_vi_giao} : {}),
  //       ...(options.don_vi_nhan ? { don_vi_nhan: options.don_vi_nhan } : {}),
  //       ...(options.loai ? { loai: options.loai } : {}),
  //       ...(options.trang_thai !== undefined
  //         ? { trang_thai: options.trang_thai }: {}),
  //     };

  //     console.log("Payload gửi lên API:", data);

  //     const items = await search_QLKC_C3_GIAONHAN_TEMCHI(data);
  //     console.log("Phản hồi từ API:", items);

  //     if (items && items.data) {
  //       const mappedData = await Promise.all(
  //         items.data.map(async (item) => {
  //           let nguoiGiao = {};
  //           let nguoiNhan = {};

  //           // Fetching user data with error handling
  //           const [giaoRes, nhanRes] = await Promise.allSettled([
  //             item.nguoi_giao ? HT_NGUOIDUNG_Service.getById(item.nguoi_giao) : Promise.resolve(null),
  //             item.nguoi_nhan ? HT_NGUOIDUNG_Service.getById(item.nguoi_nhan) : Promise.resolve(null),
  //           ]);

  //           nguoiGiao = giaoRes.status === 'fulfilled' ? giaoRes.value : {};
  //           nguoiNhan = nhanRes.status === 'fulfilled' ? nhanRes.value : {};

  //           return {
  //             ...item,
  //             ten_nguoi_giao: nguoiGiao.ho_ten || "Không xác định",
  //             ten_nguoi_nhan: nguoiNhan.ho_ten || "Không xác định",
  //           };
  //         })
  //       );

  //       setArrC3GiaoNhanTemChi(mappedData);
  //       console.log("mappedData", mappedData);
  //     } else {
  //       console.error("Không có dữ liệu trong phản hồi từ API");
  //     }

  //     // Ensure totalItems exists before calculating pageCount
  //     setPageCount(Math.ceil((items?.totalItems || 0) / pageSize));
  //   } catch (err) {
  //     console.error("Lỗi tải dữ liệu:", err.message);
  //     setArrC3GiaoNhanTemChi([]);
  //     setPageCount(0);
  //   }
  // };

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
        ht_nguoi_dung_id:
          current_MADVIQLY === "PA23" ||
          userLocal.ten_donvi === "CÔNG TY ĐIỆN LỰC HƯNG YÊN"
            ? ""
            : userLocal.id,
        ...(isPhongKinhDoanh ? {} : { userId: user.id }), // Nếu là phòng kinh doanh, không thêm userId
        ...(options.don_vi_giao ? { don_vi_giao: options.don_vi_giao } : {}),
        ...(options.don_vi_nhan ? { don_vi_nhan: options.don_vi_nhan } : {}),
        ...(options.loai ? { loai: options.loai } : {}),
        ...(options.trang_thai !== undefined
          ? { trang_thai: options.trang_thai }
          : {}),
      };

      console.log("Payload gửi lên API:", data);

      const items = await search_QLKC_C3_GIAONHAN_TEMCHI(data);
      console.log("Phản hồi từ API:", items);

      if (items && items.data) {
        const mappedData = await Promise.all(
          items.data.map(async (item) => {
            let nguoiGiao = {};
            let nguoiNhan = {};

            if (item.nguoi_giao) {
              try {
                const res = await HT_NGUOIDUNG_Service.getById(item.nguoi_giao);
                nguoiGiao = res;
              } catch (err) {
                console.error("Error fetching nguoI_GIAO:", err);
              }
            }

            if (item.nguoi_nhan) {
              try {
                const res = await HT_NGUOIDUNG_Service.getById(item.nguoi_nhan);
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

        setArrC3GiaoNhanTemChi(mappedData);
        console.log("mappedData", mappedData);
      } else {
        console.error("Không có dữ liệu trong phản hồi từ API");
      }

      setPageCount(Math.ceil((items?.totalItems || 0) / pageSize));
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err.message);
      setArrC3GiaoNhanTemChi([]);
      setPageCount(0);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  console.log("GiaoNhanTemChi", GiaoNhanTemChi);

  const onClinkSearchBtn = (e) => {
    console.log("Nút Tìm kiếm được bấm");
    loadData();
  };

  const handleCloseModalViewer = () => {
    setVisibleViewer(false);
    setBienBan({});
  };

  const handleOnClickKySoBtn = (giaoNhanTemChi) => {
    setVisibleViewer(true);
    setBienBan(giaoNhanTemChi);
  };

  const handleOnClickUpdateBtn = (giaoNhanTemChi) => {
    setIsUpdate(true);
    setVisible(true);
    setBienBan(giaoNhanTemChi);
  };

  const showToast = (type, message) => {
    toast.current.show({
      severity: type,
      summary: "Thông báo",
      detail: message,
    });
  };

  console.log();

  const loadDataDropdownDonVi = async () => {
    try {
      const results = await get_All_DM_DONVI();
      setDonViArr(results);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getAllD_PhongBan = async () => {
    console.log("call api get phong ban");
    try {
      const res = await getDM_PHONGBANByMA_DVIQLY("PA23");
      console.log("phong ban", res);
      setPhongBanArr(res);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleCloseModal = () => {
    setBienBan({});
  };

  useEffect(() => {
    loadDataDropdownDonVi();
    getAllD_PhongBan();
  }, []);

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        <div className="card">
          <Panel header={currentMenu} className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />

            <div className="flex flex-column lg:flex-row gap-3">
              {/* Đơn vị giao */}
              <div className="flex-auto">
                <label htmlFor="don_vi_giao" className="mb-2 block">
                  {" "}
                  Đơn vị giao{" "}
                </label>
                <Dropdown
                  id="don_vi_giao"
                  className="w-full"
                  placeholder="Chọn đơn vị giao"
                  value={options.don_vi_giao}
                  options={phongBanArr}
                  filter
                  onChange={(e) => {
                    console.log(e.value);
                    setOptions({
                      ...options,
                      don_vi_giao: e.target.value ?? "",
                    });
                  }}
                  optionLabel="ten"
                  optionValue="id"
                  showClear
                />
              </div>

              {/* Đơn vị nhận */}
              <div className="flex-auto">
                <label htmlFor="don_vi_nhan" className="mb-2 block">
                  {" "}
                  Đơn vị nhận{" "}
                </label>
                <Dropdown
                  id="don_vi_nhan"
                  className="w-full"
                  placeholder="Chọn đơn vị nhận"
                  value={options.don_vi_nhan}
                  filter
                  options={dsDonvi.map((dv) => ({
                    label: dv.ten,
                    value: dv.ma_dviqly,
                  }))}
                  onChange={(e) =>
                    setOptions({ ...options, don_vi_nhan: e.value })
                  }
                  showClear
                />
              </div>

              {/* Loại */}
              <div className="flex-auto">
                <label htmlFor="loai" className="mb-2 block">
                  {" "}
                  Loại{" "}
                </label>

                <Dropdown
                  id="loai"
                  className="w-full"
                  placeholder="Chọn loại"
                  value={options.loai}
                  filter
                  options={[
                    { label: "Tem", value: "Tem" },
                    { label: "Chì", value: "Chì" },
                  ]}
                  onChange={(e) => setOptions({ ...options, loai: e.value })}
                  showClear
                />
              </div>

              {/* Trạng thái */}
              <div className="flex-auto">
                <label htmlFor="trang_thai" className="mb-2 block">
                  {" "}
                  Trạng thái{" "}
                </label>

                <Dropdown
                  id="trang_thai"
                  className="w-full"
                  placeholder="Chọn trạng thái"
                  value={options.trang_thai}
                  filter
                  options={[
                    { label: "Không chọn", value: null },
                    { label: "Chờ xác nhận", value: 0 },
                    { label: "Đã ký giao", value: 1 },
                    { label: "Đã ký nhận", value: 2 },
                    { label: "Hủy", value: 3 },
                  ]}
                  onChange={(e) =>
                    setOptions({ ...options, trang_thai: e.value })
                  }
                  showClear
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

          <TableDM_C3
            setVisible={setVisible}
            setIsUpdate={setIsUpdate}
            setGiaoNhanTemChi={setGiaoNhanTemChi}
            data={arrC3GiaoNhanTemChi}
            pageCount={pageCount}
            setPage={setPage}
            setPageSize={setPageSize}
            page={page}
            pageSize={pageSize}
            loadData={loadData}
            toast={toast}
            handleOnClickKySoBtn={handleOnClickKySoBtn}
            handleOnClickUpdateBtn={handleOnClickUpdateBtn}
          />

          {visible && (
            <InputDM_C3Modal
              giaoNhanTemChi={GiaoNhanTemChi}
              isUpdate={isUpdate}
              visible={visible}
              setVisible={setVisible}
              handleCloseModal={handleCloseModal}
              toast={toast}
              loadData={loadData}
              donViArr={donViArr}
              bienBan={bienBan}
              setBienBan={setBienBan}
            />
          )}

          {visibleViewer && (
            <BienBanViewer
              giaoNhanTemChi={bienBan}
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

export default GiaoNhanTemChiC3;
