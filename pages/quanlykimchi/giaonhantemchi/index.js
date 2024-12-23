import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import TableDM_C3 from "./TableDM_C3";
import InputDM_C3Modal from "./InputDM_C3Modal";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";

import { QLKC_C3_GIAONHAN_TEMCHI } from "../../../models/QLKC_C3_GIAONHAN_TEMCHI";
import { getAll_QLKC_C3_GIAONHAN_TEMCHI, search_QLKC_C3_GIAONHAN_TEMCHI } from "../../../services/quanlykimchi/QLKC_C3_GIAONHAN_TEMCHIService";

const GiaoNhanTemChi = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [dsDonvi, setDsDonvi] = useState([]);

  const [options, setOptions] = useState({
    don_vi_giao: "",
    nguoi_nhan: "",
    loai_bban: "",
    trang_thai: ""
  });

  const [arrDanhMucC3, setArrDanhMucC3] = useState([]);
  const [danhMucC3, setDanhMucC3] = useState(QLKC_C3_GIAONHAN_TEMCHI);
  const [donViQuanLy, setDonViQuanLy] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const toast = useRef(null);

  const arrTrangThai = [
    { label: "Có hiệu lực", value: 1 },
    { label: "Hết hiệu lực", value: 0 },
  ];

  useEffect(() => {
    const storedDsDonvi = sessionStorage.getItem("ds_donvi");
    if (storedDsDonvi) {
      setDsDonvi(JSON.parse(storedDsDonvi));
    }
  }, []);

  const loadData = async () => {
    try 
    {
        const items = await getAll_QLKC_C3_GIAONHAN_TEMCHI();
        setArrDanhMucC3(items);
        console.log(items);
        setPageCount(Math.ceil(items.totalRecord / pageSize));
    } 

    catch (err) 
    {
        console.log(err);
        setArrDanhMucC3([]);
        setPageCount(0);
    }
  };

  const handleSearch = async () => {
    try 
    {
      const data = {
        page: page,
        pageSize: pageSize,
        don_vi_giao: options.don_vi_giao,
        nguoi_nhan: options.nguoi_nhan,
        loai_bban: options.loai_bban,
      };

        const items = await search_QLKC_C3_GIAONHAN_TEMCHI(data);
        console.log(items);
        setArrDanhMucC3(items.data);
        setPageCount(Math.ceil(items.totalRecord / pageSize));
        console.log(data);
    } 

    catch (err) 
    {
        console.log(err);
        setArrDanhMucC3([]);
        setPageCount(0);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  const onClinkSearchBtn = (e) => {
    handleSearch();
  };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <Panel header="Tìm kiếm" className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />

            <div className="flex flex-column lg:flex-row gap-3">
              <div className="flex-auto">
                <label htmlFor="NGUOI_NHAN" className="mb-2 block">
                  Người nhận
                </label>
                <InputText
                  id="NGUOI_NHAN"
                  className="w-full"
                  placeholder="Nhập người nhận"
                  onChange={(e) => {
                    setOptions({ ...options, nguoi_nhan: e.target.value });
                  }}
                  type="text"
                  value={options.nguoi_nhan}
                />
              </div>

              <div className="flex-auto">
                <label htmlFor="DON_VI_GIAO" className="mb-2 block">
                  Đơn vị giao
                </label>
                <InputText
                  id="DON_VI_GIAO"
                  className="w-full"
                  placeholder="Nhập đơn vị giao"
                  onChange={(e) => {
                    setOptions({ ...options, don_vi_giao: e.target.value });
                  }}
                  type="text"
                  value={options.don_vi_giao}
                />
              </div>

              <div className="flex-auto">
                <label htmlFor="LOAI_BBAN" className="mb-2 block">
                  Loại biên bản
                </label>
                <InputText
                  id="LOAI_BBAN"
                  className="w-full"
                  placeholder="Nhập loại biên bản"
                  onChange={(e) => {
                    setOptions({ ...options, loai_bban: e.target.value });
                  }}
                  type="text"
                  value={options.loai_bban}
                />
              </div>

              <div className="flex-auto">
                <label htmlFor="trang_thai" className="mb-2 block">
                  Trạng thái
                </label>
                <Dropdown
                  id="trang_thai"
                  className="w-full"
                  placeholder="Chọn trạng thái"
                  value={options.trang_thai}
                  options={[
                    { label: "Không chọn", value: null },
                    { label: "Chờ xác nhận", value: 0 },
                    { label: "Ký cấp 1", value: 1 },
                    { label: "Ký cấp 2", value: 2 },
                    { label: "Hủy", value: 3 },
                  ]}
                  onChange={(e) => setOptions({ ...options, trang_thai: e.value })}
                  showClear
                />
              </div>
            </div>

              <div className="flex justify-content-center mt-4">
                <Button
                  style={{backgroundColor: '#1445a7', color: '#fff'}}
                  label="Tìm kiếm"
                  onClick={onClinkSearchBtn}
                  severity="info"
                />
              </div>
          </Panel>

          <TableDM_C3
            donvi={donViQuanLy}
            setVisible={setVisible}
            setIsUpdate={setIsUpdate}
            setDanhMucC3={setDanhMucC3}
            data={arrDanhMucC3}
            pageCount={pageCount}
            setPage={setPage}
            setPageSize={setPageSize}
            page={page}
            pageSize={pageSize}
            loadData={loadData}
            toast={toast}
          />

          {visible && (
            <InputDM_C3Modal
                danhmucc3={danhMucC3}
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

export default GiaoNhanTemChi;
