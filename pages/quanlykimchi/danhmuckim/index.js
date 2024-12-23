import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import TableDM_DanhMucKim from "./TableDM_DanhMucKim";
import { InputDM_DANHMUCKIMModal } from "./InputDM_DANHMUCKIModal";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";

import { QLKC_D_KIM } from "../../../models/QLKC_D_KIM";
// import { getAll_D_KIM, search_D_KIM } from "../../../services/quanlykimchi/QLKC_D_KIMService";
import { D_KIMService } from "../../../services/quanlykimchi/D_KIMService";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
import { getAll_D_KIM } from "../../../services/quanlykimchi/D_KIMService";

const DanhMucKim = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const [options, setOptions] = useState({
    loai_ma_kim: "",
    nguoi_tao: "",
    trang_thai: {
      label: "",
      value: "",
    },
  });

  const [arrDanhMucKim, setArrDanhMucKim] = useState([]);
  const [danhMucKim, setDanhMucKim] = useState(QLKC_D_KIM);
  const [donViQuanLy, setDonViQuanLy] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const toast = useRef(null);

  const arrTrangThai = [
    { label: "Có hiệu lực", value: 1 },
    { label: "Hết hiệu lực", value: 0 },
  ];

  useEffect(() => {
    const getDSDonViQuanLy = async () => {
      const results = await get_All_DM_DONVI();
      console.log(results);
      setDonViQuanLy(results);
    };
    getDSDonViQuanLy();
  }, []);

  const loadData = async () => {
    try {
      const items = await getAll_D_KIM();
      setArrDanhMucKim(items);
      console.log(items);
      setPageCount(Math.ceil(items.totalRecord / pageSize));
    } catch (err) {
      console.log(err);
      setArrDanhMucKim([]);
      setPageCount(0);
    }
  };

  const handleSearch = async () => {
    try {
      const data = {
        page: page,
        pageSize: pageSize,
        loai_ma_kim: options.loai_ma_kim,
        nguoi_tao: options.nguoi_tao,
        trang_thai: options.trang_thai.value,
      };

      const items = await D_KIMService.search_D_KIM(data);
      console.log(items);
      setArrDanhMucKim(items.data);
      setPageCount(Math.ceil(items.totalItems / pageSize));
      console.log(data);
    } catch (err) {
      console.log(err);
      setArrDanhMucKim([]);
      setPageCount(0);
    }
  };

  const onClinkSearchBtn = (e) => {
    handleSearch();
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <Panel header="Tìm kiếm" className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />

            <div className="flex flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="LOAI_MA_KIM" className="mb-2 block">
                  Loại mã kim
                </label>
                <InputText
                  id="LOAI_MA_KIM"
                  className="w-full"
                  placeholder="Nhập loại mã kim"
                  onChange={(e) => {
                    setOptions({ ...options, loai_ma_kim: e.target.value });
                  }}
                  type="text"
                  value={options.loai_ma_kim}
                />
              </div>

              <div className="flex-1">
                <label htmlFor="NGUOI_TAO" className="mb-2 block">
                  Người tạo
                </label>
                <InputText
                  id="NGUOI_TAO"
                  className="w-full"
                  placeholder="Nhập người tạo"
                  onChange={(e) => {
                    setOptions({ ...options, nguoi_tao: e.target.value });
                  }}
                  type="text"
                  value={options.nguoi_tao}
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
                      trang_thai: arrTrangThai.find(
                        (tt) => tt.value === e.value
                      ),
                    });
                  }}
                  optionLabel="label"
                  id="TRANG_THAI"
                  className="w-full"
                  options={arrTrangThai}
                  placeholder="Chọn trạng thái"
                  value={options.trang_thai.value}
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
          />

          {visible && (
            <InputDM_DANHMUCKIMModal
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
