import React, { useEffect, useState, useRef } from "react";
import BBAN_GIAO_KIMTable from "./BBAN_GIAO_KIMTable";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { search_BBAN_BANGIAO_KIM } from "../../../services/quanlykimchi/BBAN_GIAO_KIMService";
import BBAN_GIAO_KIMModal from "./BBAN_GIAO_KIMModal";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
import BienBanViewer from "./BienBanViewer";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";
const arrTrangThai = [
  { label: "Soạn thảo", value: 0 },
  { label: "Ký cấp 1", value: 1 },
  { label: "Ký cấp 2", value: 2 },
];
export const BBanGiaoKimC3 = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [donViArr, setDonViArr] = useState([]);
  const [bienBan, setBienBan] = useState({});
  const [bienBanArr, setBienBanArr] = useState([]);
  const [filteredArr, setFilteredArr] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [visibleViewer, setVisibleViewer] = useState(false);

  const [isUpdate, setIsUpdate] = useState(false);
  const [options, setOptions] = useState({
    donViNhan: "",
    donViGiao: "",
    trangThai: "",
    loaiBienBan: 2,
  });
  const toast = useRef(null);

  const showToast = (type, message) => {
    toast.current.show({
      severity: type,
      summary: "Thông báo",
      detail: message,
    });
  };
  const loadDataDropdownDonVi = async () => {
    try {
      const results = await get_All_DM_DONVI();
      setDonViArr(results);
    } catch (err) {
      console.log(err.message);
    }
  };

  const loadDataTable = async () => {
    try {
      const current_MADVIQLY = JSON.parse(
        sessionStorage.getItem("current_MADVIQLY")
      );
      const data = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        don_vi_nhan: options.donViNhan,
        don_vi_giao: options.donViGiao,
        trang_thai: options.trangThai,
        loai_bban: options.loaiBienBan !== 2 ? options.loaiBienBan : "",
        don_vi:
          options.donViNhan !== "" || options.donViGiao !== ""
            ? ""
            : current_MADVIQLY,
      };
      const res = await search_BBAN_BANGIAO_KIM(data);
      let newBienBanArr = [];
      let nguoiNhan = {};
      let nguoiGiao = {};
      res?.data.forEach(async (bb, index) => {
        if (bb?.nguoI_NHAN) {
          try {
            const res = await HT_NGUOIDUNG_Service.getById(bb.nguoI_NHAN);
            console.log("nguoi nhan", res);
            nguoiNhan = res;
          } catch (err) {
            console.log(err);
          }
        }
        if (bb?.nguoI_GIAO) {
          try {
            const res = await HT_NGUOIDUNG_Service.getById(bb.nguoI_GIAO);
            nguoiGiao = res;
          } catch (err) {
            console.log(err);
          }
        }

        newBienBanArr.push({
          ...bb,
          ten_nguoi_giao: nguoiGiao.ho_ten,
          ten_nguoi_nhan: nguoiNhan.ho_ten,
        });

        setBienBanArr(newBienBanArr);
      });

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
  const handleOpenModalViewer = () => {
    setVisible(true);
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
  const handleFilterData = (content) => {
    if (content === "") {
      setFilteredArr(bienBanArr);
    } else {
      const filtered = bienBanArr.filter(
        (item) =>
          item.nguoI_GIAO.toLowerCase().includes(content.toLowerCase()) ||
          item.nguoI_NHAN.toLowerCase().includes(content.toLowerCase())
      );
      setFilteredArr(filtered);
    }
  };
  useEffect(() => {
    loadDataDropdownDonVi();
  }, []);
  useEffect(() => {
    loadDataTable();
  }, [pageIndex, pageSize, options.loaiBienBan]);

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12">
        <div className="card">
          <Panel header="Tìm kiếm" className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />

            <div className="flex flex-column lg:flex-row gap-3">
              <div className="flex-auto">
                <label htmlFor="MA" className="mb-2 block">
                  Đơn vị giao
                </label>
                <Dropdown
                  value={options.donViGiao}
                  options={donViArr}
                  onChange={(e) => {
                    setOptions({ ...options, donViGiao: e.target.value ?? "" });
                  }}
                  optionLabel="ten"
                  id="donViGiao"
                  optionValue="ma_dviqly"
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
          />
        )}
        {visibleViewer && (
          <BienBanViewer
            bienBan={bienBan}
            visible={visibleViewer}
            handleCloseModalViewer={handleCloseModalViewer}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  );
};
export default BBanGiaoKimC3;
