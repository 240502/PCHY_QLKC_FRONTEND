import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import { TableDM_C3 } from "./TableDM_C3";
import { InputDM_C3Modal } from "./InputDM_C3Modal";
import { QLKC_C3_GIAONHAN_TEMCHI} from "../../../models/QLKC_C3_GIAONHAN_TEMCHI";
import { search_QLKC_C3_GIAONHAN_TEMCHI } from "../../../services/quanlykimchi/QLKC_C3_GIAONHAN_TEMCHIService";
// import BienBanViewer from "./BienBanViewer";

const GiaoNhanTemChiC3 = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [dsDonvi, setDsDonvi] = useState([]);
  const [options, setOptions] = useState({
    loai: "",
    trang_thai: "",
    don_vi_giao: "",
    don_vi_nhan: "",
  });
  const [arrC3GiaoNhanTemChi, setArrC3GiaoNhanTemChi] = useState([QLKC_C3_GIAONHAN_TEMCHI]);
  const [GiaoNhanTemChi, setGiaoNhanTemChi] = useState(QLKC_C3_GIAONHAN_TEMCHI);
  const [bienBan, setBienBan] = useState({});
  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [visibleViewer, setVisibleViewer] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    const storedDsDonvi = sessionStorage.getItem("ds_donvi");
    if (storedDsDonvi) {
      setDsDonvi(JSON.parse(storedDsDonvi));
    }
  }, []);

  const loadData = async () => {
    try {
      const data = {
        pageIndex: page,
        pageSize: pageSize,
        ...(options.don_vi_giao ? { don_vi_giao: options.don_vi_giao} : {}),
        ...(options.don_vi_nhan ? { don_vi_nhan: options.don_vi_nhan } : {}),
        ...(options.loai ? { loai: options.loai } : {}),
        ...(options.trang_thai !== undefined
          ? { trang_thai: options.trang_thai }: {}),
      };

      console.log("Payload gửi lên API:", data);

      const items = await search_QLKC_C3_GIAONHAN_TEMCHI(data);
      console.log("Phản hồi từ API:", items);

      if (items && items.data) {
        setArrC3GiaoNhanTemChi(items.data || []);
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

  console.log();

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <Panel header="Giao nhận Tem Chì (C3)" className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />

            <div className="flex flex-column lg:flex-row gap-3">
              {/* Đơn vị giao */}
              <div className="flex-auto">
                <label htmlFor="don_vi_giao" className="mb-2 block"> Đơn vị giao </label>
                <Dropdown
                  id="don_vi_giao"
                  className="w-full"
                  placeholder="Chọn đơn vị giao"
                  value={options.don_vi_giao}
                  options={dsDonvi.map((dv) => ({
                    label: dv.ten,
                    value: dv.ma_dviqly,
                  }))}
                  onChange={(e) =>
                    setOptions({ ...options, don_vi_giao: e.value })
                  }
                  showClear
                />
              </div>

              {/* Đơn vị nhận */}
              <div className="flex-auto">
                <label htmlFor="don_vi_nhan" className="mb-2 block"> Đơn vị nhận </label>
                <Dropdown
                  id="don_vi_nhan"
                  className="w-full"
                  placeholder="Chọn đơn vị nhận"
                  value={options.don_vi_nhan}
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
                <label htmlFor="loai" className="mb-2 block"> Loại </label>
                <InputText
                  id="loai"
                  className="w-full"
                  placeholder="Nhập loại"
                  onChange={(e) =>
                    setOptions({ ...options, loai: e.target.value })
                  }
                  value={options.loai}
                />
              </div>

              {/* Trạng thái */}
              <div className="flex-auto">
                <label htmlFor="trang_thai" className="mb-2 block"> Trạng thái </label>
                
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
          />

          {visible && (
            <InputDM_C3Modal
              giaoNhanTemChi={GiaoNhanTemChi}
              isUpdate={isUpdate}
              visible={visible}
              setVisible={setVisible}
              toast={toast}
              loadData={loadData}
            />
          )}

          {visibleViewer && (
          <BienBanViewer
            bienBan={bienBan}
            visible={visibleViewer}
            handleCloseModalViewer={handleCloseModalViewer}
          />
          )}
        </div>
      </div>
    </div>
  );
};

export default GiaoNhanTemChiC3;
