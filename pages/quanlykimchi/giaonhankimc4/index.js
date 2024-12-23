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
import {
  InputDM_PHONGBANModal,
  InputQLKC_KHO_CHI_TEMModal,
} from "./InputQLKC_C4_GIAONHAN_KIMModal";
import { QLKC_C4_GIAONHAN_KIM } from "../../../models/QLKC_C4_GIAONHAN_KIM";
import { search_C4_GIAONHAN_KIM } from "../../../services/quanlykimchi/QLKC_C4_GIAONHAN_KIMService";
import { Calendar } from "primereact/calendar";
import { formatISO } from "date-fns";
import { clamp } from "date-fns";

const GiaonhankimC4 = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [dsDonvi, setDsDonvi] = useState([]);
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
        setArrC4GiaoNhanKim(items.data || []);
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

  console.log();

  // Hàm để định dạng ngày theo định dạng ngày tháng năm
  const formatDateToDMY = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("vi-VN"); // Định dạng theo kiểu Việt Nam
  };

  // Hàm để định dạng ngày theo định dạng ISO
  const formatDateToISO = (date) => {
    if (!date) return null;
    return new Date(date).toISOString(); // Định dạng ISO
  };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <Panel header="Tìm kiếm" className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />

            <div className="flex flex-column lg:flex-row gap-3">
              {/* Đơn vị giao */}
              <div className="flex-auto">
                <label htmlFor="doN_VI_GIAO" className="mb-2 block">
                  Đơn vị giao
                </label>
                <Dropdown
                  id="doN_VI_GIAO"
                  className="w-full"
                  placeholder="Chọn đơn vị giao"
                  value={options.doN_VI_GIAO}
                  options={dsDonvi.map((dv) => ({
                    label: dv.ten,
                    value: dv.ma_dviqly,
                  }))}
                  onChange={(e) =>
                    setOptions({ ...options, doN_VI_GIAO: e.value })
                  }
                  showClear
                />
              </div>

              {/* Đơn vị nhận */}
              <div className="flex-auto">
                <label htmlFor="doN_VI_NHAN" className="mb-2 block">
                  Đơn vị nhận
                </label>
                <Dropdown
                  id="doN_VI_NHAN"
                  className="w-full"
                  placeholder="Chọn đơn vị nhận"
                  value={options.doN_VI_NHAN}
                  options={dsDonvi.map((dv) => ({
                    label: dv.ten,
                    value: dv.ma_dviqly,
                  }))}
                  onChange={(e) =>
                    setOptions({ ...options, doN_VI_NHAN: e.value })
                  }
                  showClear
                />
              </div>

              {/* Loại */}
              <div className="flex-auto">
                <label htmlFor="loai" className="mb-2 block">
                  Loại
                </label>
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
                <label htmlFor="tranG_THAI" className="mb-2 block">
                  Trạng thái
                </label>
                <Dropdown
                  id="tranG_THAI"
                  className="w-full"
                  placeholder="Chọn trạng thái"
                  value={options.tranG_THAI}
                  options={[
                    { label: "Không chọn", value: null },
                    { label: "Chờ xác nhận", value: 0 },
                    { label: "Ký cấp 1", value: 1 },
                    { label: "Ký cấp 2", value: 2 },
                    { label: "Hủy", value: 3 },
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
                  value={options.ngaY_GIAO ? new Date(options.ngaY_GIAO) : null} // Chuyển đổi về đối tượng Date
                  onChange={(e) => {
                    const isoDate = formatDateToISO(e.value); // Định dạng ngày thành ISO
                    setOptions({ ...options, ngaY_GIAO: isoDate }); // Lưu ngày đã định dạng ISO vào trạng thái
                  }}
                  dateFormat="mm/dd/yy" // Định dạng hiển thị
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
                  value={options.ngaY_NHAN}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      ngaY_NHAN: e.value ? formatISO(e.value) : null,
                    })
                  }
                  dateFormat="mm/dd/yy"
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
            pageSize={pageSize}
            loadData={loadData}
            toast={toast}
          />

          {visible && (
            <InputQLKC_KHO_CHI_TEMModal
              giaoNhanKim={GIAONHANKIM}
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

export default GiaonhankimC4;
