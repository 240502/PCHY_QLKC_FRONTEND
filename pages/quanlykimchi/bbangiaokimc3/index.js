import React, { useEffect, useState, useRef } from "react";
import BBAN_GIAO_KIMTable from "./BBAN_GIAO_KIMTable";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { search_BBAN_BANGIAO_KIM } from "../../../services/quanlykimchi/BBAN_GIAO_KIMService";
import BBAN_GIAO_KIMModal from "./BBAN_GIAO_KIMModal";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
import BienBanViewer from "./BienBanViewer";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";
import { getDM_PHONGBANByMA_DVIQLY } from "../../../services/quantrihethong/DM_PHONGBANService";
import { D_KIMService } from "../../../services/quanlykimchi/D_KIMService";
const arrTrangThai = [
  { label: "Soạn thảo", value: 0 },
  { label: "Đã ký cấp 1", value: 1 },
  { label: "Đã ký cấp 2", value: 2 },
];
export const BBanGiaoKimC3 = () => {
  const currentMenu = sessionStorage.getItem("currentMenu");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [donViArr, setDonViArr] = useState([]);
  const [bienBan, setBienBan] = useState({});
  const [bienBanArr, setBienBanArr] = useState([]);
  const [filteredArr, setFilteredArr] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [visibleViewer, setVisibleViewer] = useState(false);
  const [phongBanArr, setPhongBanArr] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [options, setOptions] = useState({
    donViNhan: "",
    donViGiao: "",
    trangThai: "",
    loaiBienBan: 2,
  });
  const toast = useRef(null);
  const current_MADVIQLY = JSON.parse(
    sessionStorage.getItem("current_MADVIQLY")
  );
  const userLocal = JSON.parse(sessionStorage.getItem("user"));
  // show toast function
  const showToast = (type, message) => {
    toast.current.show({
      severity: type,
      summary: "Thông báo",
      detail: message,
    });
  };

  // call api get all dm_donvi function
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
  // call api get bban_bangiao_kim
  const loadDataTable = async () => {
    try {
      const data = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        don_vi_nhan: options.donViNhan,
        don_vi_giao: options.donViGiao,
        trang_thai: options.trangThai,
        loai_bban: options.loaiBienBan !== 2 ? options.loaiBienBan : "",
        don_vi: current_MADVIQLY === "PA23" ? "" : current_MADVIQLY,
        userId:
          current_MADVIQLY === "PA23" ||
          userLocal.ten_donvi === "CÔNG TY ĐIỆN LỰC HƯNG YÊN"
            ? ""
            : userLocal.id,
      };
      const res = await search_BBAN_BANGIAO_KIM(data);
      let newBienBanArr = [];
      const enrichedData = await Promise.all(
        res?.data.map(async (item) => {
          let nguoiNhan;
          let nguoiGiao;

          try {
            nguoiNhan = await HT_NGUOIDUNG_Service.getById(item.nguoi_nhan);
          } catch (err) {
            console.error(err);
          }
          try {
            nguoiGiao = await HT_NGUOIDUNG_Service.getById(item.nguoi_giao);
          } catch (err) {
            console.error(err);
          }

          return {
            ...item,
            ten_nguoi_nhan: nguoiNhan ? nguoiNhan.ho_ten : "Không xác định",
            ten_nguoi_giao: nguoiGiao ? nguoiGiao.ho_ten : "Không xác định",
          };
        })
      );
      setBienBanArr(enrichedData);
      setPageCount(Math.ceil(res.totalItems / pageSize));
    } catch (err) {
      console.log(err.message);
      setBienBanArr([]);
    }
  };
  const handleCloseModal = () => {
    setVisible(false);
    setIsUpdate(false);
    setBienBan({});
  };
  const handleOpenModal = () => {
    setVisible(true);
  };
  const handleCloseModalViewer = () => {
    setVisibleViewer(false);
    setBienBan({});
  };
  const handleOnClickUpdateBtn = (bienBan) => {
    setIsUpdate(true);
    setVisible(true);
    setBienBan(bienBan);
  };
  const handleOnClickKySoBtn = (bienBan) => {
    setVisibleViewer(true);
    setBienBan(bienBan);
  };

  // filter data function. function will activate when client input content search at input button
  const handleFilterData = (content) => {
    if (content === "") {
      setFilteredArr(bienBanArr);
    } else {
      const filtered = bienBanArr.filter(
        (item) =>
          item.ten_nguoi_giao.toLowerCase().includes(content.toLowerCase()) ||
          item.ten_nguoi_nhan.toLowerCase().includes(content.toLowerCase())
      );
      setFilteredArr(filtered);
    }
  };
  useEffect(() => {
    loadDataDropdownDonVi();
    getAllD_PhongBan();
  }, []);
  useEffect(() => {
    setFilteredArr(bienBanArr);
  }, [bienBanArr]);
  useEffect(() => {
    loadDataTable();
  }, [pageIndex, pageSize, options.loaiBienBan]);
  const [kimArr, setKimArr] = useState([]);
  const getD_KimInTable = async () => {
    try {
      const res = await D_KIMService.getD_KimInTable();
      setKimArr(res);
      console.log("res kim", res);
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        <div className="card">
          <Panel header={currentMenu} className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />
            <div className="flex flex-column lg:flex-row gap-3">
              <div className="flex-auto">
                <label htmlFor="MA" className="mb-2 block">
                  Đơn vị giao
                </label>
                <Dropdown
                  value={options.donViGiao}
                  options={phongBanArr}
                  filter
                  onChange={(e) => {
                    console.log(e.value);
                    setOptions({ ...options, donViGiao: e.target.value ?? "" });
                  }}
                  optionLabel="ten"
                  id="donViGiao"
                  optionValue="id"
                  placeholder="Chọn đơn vị"
                  className="w-full"
                  showClear
                />
              </div>
              <div className="flex-auto">
                <label htmlFor="MA" className="mb-2 block">
                  Đơn vị nhận
                </label>
                <Dropdown
                  value={options.donViNhan}
                  options={donViArr}
                  filter
                  onChange={(e) => {
                    setOptions({ ...options, donViNhan: e.target.value ?? "" });
                  }}
                  optionLabel="ten"
                  id="donViNhan"
                  optionValue="ma_dviqly"
                  placeholder="Chọn đơn vị"
                  className="w-full"
                  showClear
                />
              </div>

              <div className="flex-auto">
                <label htmlFor="TRANG_THAI" className="mb-2 block">
                  Trạng thái
                </label>
                <Dropdown
                  onChange={(e) => {
                    setOptions({
                      ...options,
                      trangThai: e.target.value,
                    });
                  }}
                  optionLabel="label"
                  id="TRANG_THAI"
                  optionValue="value"
                  className="w-full"
                  options={arrTrangThai}
                  placeholder="Chọn trạng thái"
                  value={options.trangThai}
                  showClear
                />
              </div>
            </div>
            <div className="flex justify-content-center mt-4">
              <Button
                style={{ backgroundColor: "#1445a7", color: "#fff" }}
                label="Tìm kiếm"
                severity="info"
                onClick={() => {
                  loadDataTable();
                }}
              />
            </div>
          </Panel>

          <BBAN_GIAO_KIMTable
            data={bienBanArr}
            pageCount={pageCount}
            pageSize={pageSize}
            pageIndex={pageIndex}
            setPageSize={setPageSize}
            setPageIndex={setPageIndex}
            handleFilterData={handleFilterData}
            filteredArr={filteredArr}
            handleOnClickUpdateBtn={handleOnClickUpdateBtn}
            handleOpenModal={handleOpenModal}
            showToast={showToast}
            loadData={loadDataTable}
            handleOnClickKySoBtn={handleOnClickKySoBtn}
            setOptions={setOptions}
            options={options}
            getD_KimInTable={getD_KimInTable}
            kimArr={kimArr}
          />
        </div>
        {visible && (
          <BBAN_GIAO_KIMModal
            isUpdate={isUpdate}
            visible={visible}
            handleCloseModal={handleCloseModal}
            loadData={loadDataTable}
            donViArr={donViArr}
            bienBan={bienBan}
            setBienBan={setBienBan}
            showToast={showToast}
            getD_KimInTable={getD_KimInTable}
          />
        )}
        {visibleViewer && (
          <BienBanViewer
            bienBan={bienBan}
            visible={visibleViewer}
            handleCloseModalViewer={handleCloseModalViewer}
            showToast={showToast}
            setBienBan={setBienBan}
            loadData={loadDataTable}
          />
        )}
      </div>
    </div>
  );
};
export default BBanGiaoKimC3;
