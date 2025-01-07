import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import TableDM_DanhMucKim from "./TableDM_DanhMucKim";
import { InputDM_DANHMUCKIMModal } from "./InputDM_DANHMUCKIModal";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";

import { QLKC_D_KIM } from "../../../models/QLKC_D_KIM";
import { D_KIMService } from "../../../services/quanlykimchi/D_KIMService";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
import { HT_NGUOIDUNG } from "../../../models/HT_NGUOIDUNG";

const DanhMucKim = () => {
  const currentMenu = sessionStorage.getItem("currentMenu");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const [options, setOptions] = useState({
    loaiMaKim: "",
    nguoiTao: "",
    trangThai: "",
    maDviqly: "",
  });

  const [arrDanhMucKim, setArrDanhMucKim] = useState([]);
  const [danhMucKim, setDanhMucKim] = useState(QLKC_D_KIM);
  const [donViQuanLy, setDonViQuanLy] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const toast = useRef(null);
  const currentMA_DVIQLY = JSON.parse(
    sessionStorage.getItem("current_MADVIQLY")
  );
  const arrTrangThai = [
    { label: "Có hiệu lực", value: 0 },
    { label: "Hết hiệu lực", value: 1 },
  ];
  const [users, setUsers] = useState([HT_NGUOIDUNG]);

  useEffect(() => {
    const getDSDonViQuanLy = async () => {
      const results = await get_All_DM_DONVI();
      setDonViQuanLy(results);
    };
    getDSDonViQuanLy();
  }, []);

  const loadData = async () => {
    try {
      const data = {
        pageIndex: page,
        nguoiTao: options.nguoiTao,
        pageSize: pageSize,
        maDviqly: options.maDviqly !== "" ? options.maDviqly : currentMA_DVIQLY,
        loaiMaKim: options.loaiMaKim,
        trangThai: options.trangThai,
      };
      console.log("data", data);
      const res = await D_KIMService.search_D_KIM(data);
      setArrDanhMucKim(res.data);
      console.log("danh muc kim", res);
      setPageCount(Math.ceil(res.totalRecord / pageSize));
    } catch (err) {
      console.log(err);
      setArrDanhMucKim([]);
      setPageCount(0);
    }
  };

  const onClinkSearchBtn = (e) => {
    loadData();
  };
  useEffect(() => {
    const getHT_NGUOIDUNGByMA_DVIQLY = async () => {
      try {
        const data = { ma_dviqly: currentMA_DVIQLY, db_maphongban: "P6" };
        const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY(data);
        setUsers(res);
      } catch (e) {
        console.log(e);
      }
    };

    getHT_NGUOIDUNGByMA_DVIQLY();
  }, []);
  useEffect(() => {
    loadData();
  }, [page, pageSize, options]);

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <Panel header={currentMenu} className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />

            <div className="flex flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="MA" className="mb-2 block">
                  Đơn vị quản lý
                </label>
                <Dropdown
                  value={options.donViQuanLy}
                  options={donViQuanLy}
                  filter
                  onChange={(e) => {
                    console.log(e.value);
                    setOptions({ ...options, maDviqly: e.value ?? "" });
                  }}
                  optionLabel="ten"
                  id="donViNhan"
                  optionValue="ma_dviqly"
                  placeholder="Chọn đơn vị"
                  className="w-full"
                  showClear
                />
              </div>
              <div className="flex-1">
                <label htmlFor="NGUOI_TAO" className="mb-2 block">
                  Người tạo
                </label>
                <Dropdown
                  filter
                  id="NGUOI_TAO"
                  className="w-full"
                  placeholder="Nhập người tạo"
                  onChange={(e) => {
                    console.log(e.value);
                    setOptions({ ...options, nguoiTao: e.value });
                  }}
                  optionValue="id"
                  options={users}
                  optionLabel="hO_TEN"
                  type="text"
                  value={options.nguoiTao}
                />
              </div>

              <div className="flex-1">
                <label htmlFor="TRANG_THAI" className="mb-2 block">
                  Trạng thái
                </label>
                <Dropdown
                  onChange={(e) => {
                    setOptions({
                      ...options,
                      trangThai: e.value,
                    });
                  }}
                  optionLabel="label"
                  id="TRANG_THAI"
                  className="w-full"
                  options={arrTrangThai}
                  placeholder="Chọn trạng thái"
                  value={options.trangThai}
                />
              </div>
            </div>

            <div className="flex justify-content-center mt-4">
              <Button
                style={{ backgroundColor: "#1445a7", color: "#fff" }}
                label="Tìm kiếm"
                onClick={() => onClinkSearchBtn()}
                severity="info"
              />
            </div>
          </Panel>

          <TableDM_DanhMucKim
            donvi={donViQuanLy}
            setVisible={setVisible}
            setIsUpdate={setIsUpdate}
            setDanhMucKim={setDanhMucKim}
            data={arrDanhMucKim}
            pageCount={pageCount}
            setPage={setPage}
            setPageSize={setPageSize}
            page={page}
            pageSize={pageSize}
            loadData={loadData}
            toast={toast}
            setOptions={setOptions}
            options={options}
          />

          {visible && (
            <InputDM_DANHMUCKIMModal
              currentMA_DVIQLY={currentMA_DVIQLY}
              danhmuckim={danhMucKim}
              isUpdate={isUpdate}
              visible={visible}
              setVisible={setVisible}
              toast={toast}
              loadData={loadData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DanhMucKim;
