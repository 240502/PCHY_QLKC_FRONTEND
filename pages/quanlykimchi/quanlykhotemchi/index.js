import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState, useRef } from "react";
import "primeicons/primeicons.css";
import { useRouter } from "next/router";
import TableQLKC_KHO_CHI_TEM from "./TableQLKC_KHO_CHI_TEM";
import { InputDM_PHONGBANModal, InputQLKC_KHO_CHI_TEMModal } from "./InputQLKC_KHO_CHI_TEMModal";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";

import { QLKC_KHO_CHI_TEM } from "../../../models/QLKC_KHO_CHI_TEM"
import { get_QLKC_NHAP_CHI_TEMGroup } from "../../../services/quanlykimchi/QLKC_KHO_CHI_TEMService";

const KhoChiTem = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const [options, setOptions] = useState({
    loai: "",
    thang: "",
    nam:""
  });
  const [arrKhoChiTem, setArrKhoChiTem] = useState([QLKC_KHO_CHI_TEM]);
  const [KHOCHITEM, setKHOCHITEM] = useState(QLKC_KHO_CHI_TEM);
  const [visible, setVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const toast = useRef(null);



const loadData = async () => {
  try {
    const data = {
      pageIndex: page,
      pageSize: pageSize,
      loai: options.loai || '',
      thang:options.thang ,
      nam: options.nam ,  
    };
    console.log(data)

    const items = await get_QLKC_NHAP_CHI_TEMGroup(data);
    console.log("items:", items);
console.log("items.data:", items?.data);
    console.log('Kết quả tìm kiếm:', items); // Kiểm tra kết quả trả về
    setArrKhoChiTem(Array.isArray(items) ? items : []);

    setPageCount(Math.ceil(items?.totalItems / pageSize));
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
    setArrKhoChiTem([]);
    setPageCount(0);
  }
};


useEffect(() => {
  loadData();
}, [page, pageSize]);


  const onClinkSearchBtn = (e) => {
    console.log("Nút Tìm kiếm được bấm");
    loadData();
  };
console.log("arrKhoChiTem",arrKhoChiTem)
  
  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          {/* <Panel header="Tìm kiếm" className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />

            <div className="flex flex-column lg:flex-row gap-3">
              <div className="flex-auto">
                <label htmlFor="LOAI" className="mb-2 block">
                  Loại
                </label>
                <InputText
                  id="LOAI"
                  className="w-full"
                  placeholder="Nhập loại"
                  onChange={(e) => {
                    setOptions({ ...options, loai: e.target.value });
                  }}
                  type="text"
                  value={options.loai}
                />
              </div>

              <div className="flex-auto">
                <label htmlFor="THANG" className="mb-2 block">
                  Tháng
                </label>
                <InputText
                  id="THANG"
                  className="w-full"
                  placeholder="Nhập tháng"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setOptions({ ...options, thang: e.target.value });
                  }}
                  type="text"
                  value={options.thang}
                />
              </div>

              <div className="flex-auto">
                <label htmlFor="NAM" className="mb-2 block">
                  Năm
                </label>
                <InputText
                  id="NAM"
                  className="w-full"
                  placeholder="Nhập năm"
                  onChange={(e) => {
                    console.log(e.target.value);
                    setOptions({ ...options, nam: e.target.value });
                  }}
                  type="text"
                  value={options.nam}
                />
              </div>
            </div>

            <div className="flex justify-content-center mt-4">
              <Button
                style={{ backgroundColor: '#1445a7', color: '#fff' }}
                label="Tìm kiếm"
                onClick={onClinkSearchBtn}
                severity="info"
              />
            </div>
          </Panel> */}

          <TableQLKC_KHO_CHI_TEM
           
            setVisible={setVisible}
            setIsUpdate={setIsUpdate}
            setKHOCHITEM={setKHOCHITEM}
            data={arrKhoChiTem}
                  
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
              KHOCHITEM={KHOCHITEM}
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

export default KhoChiTem;
