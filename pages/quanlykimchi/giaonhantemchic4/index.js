import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import React, { useRef, useState, useEffect, useCallback } from "react";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { QLKC_C4_GIAONHAN_TEMCHI } from "../../../models/QLKC_C4_GIAONHAN_TEMCHI";
import { QLKC_C4_CHITIET_QUYETTOANCHI } from "../../../models/QLKC_C4_CHITIET_QUYETTOANCHI";
import Link from "next/link";
import { Paginator } from "primereact/paginator";
import { BreadCrumb } from "primereact/breadcrumb";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { DialogForm } from "./DialogForm";
import { DialogFormQuyetToan } from "./DialogFormQuyetToan";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";
import {
  delete_QLKC_C4_GIAONHAN_TEMCHI,
  search_QLKC_C4_GIAONHAN_TEMCHI,
  get_QLKC_C4_GIAONHAN_TEMCHI,
  update_QLKC_C4_GIAONHAN_TEMCHI,
  create_QLKC_C4_GIAONHAN_TEMCHI,
  update_huyPM_QLKC_C4_GIAONHAN_TEMCHI,
  update_kyC1_QLKC_C4_GIAONHAN_TEMCHI,
  update_kyC2_QLKC_C4_GIAONHAN_TEMCHI,
  getAll_HT_NGUOIDUNG,
} from "../../../services/quanlykimchi/QLKC_C4_GIAONHAN_TEMCHIService";
import { useTableSort } from "../../../hooks/useTableSort";
import { propSortAndFilter } from "../../../constants/propGlobal";
import { get_All_DM_DONVI } from "../../../services/quantrihethong/DM_DONVIService";
import { searchDM_PHONGBAN } from "../../../services/quantrihethong/DM_PHONGBANService";
import { useRouter } from 'next/router';
import BienBanViewer from "./BienBanViewer";

export const GIAONHAN_TEMCHI = () => {
  const currentMenu = sessionStorage.getItem("currentMenu");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [arr_GIAONHAN_TEMCHI, setArr_GIAONHAN_TEMCHI] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [arr_GIAONHAN_TEMCHI_QLY, setArr_GIAONHAN_TEMCHI_QLY] = useState([]);
  const [formData, setFormData] = useState(QLKC_C4_GIAONHAN_TEMCHI);
  const [formDataQuyetToan, setFormDataQuyetToan] = useState(QLKC_C4_CHITIET_QUYETTOANCHI);
  const [formFilter, setFormFilter] = useState({ loai: "", doN_VI_TINH: "" });
  const [keyFilter, setKeyFilter] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [trangThai, setTrangThai] = useState();
  const [errors, setErrors] = useState({});
  const [selectedGIAONHAN_TEMCHIs, setSelectedGIAONHAN_TEMCHIs] = useState([]);
  const [visibleForm, setVisibleForm] = useState(false);
  const [visibleFormQuyetToan, setVisibleFormQuyetToan] = useState(false);
  const toast = useRef(null);
  const [DM_DONVI, setDM_DONVI] = useState([]);
  const [arrDonVi, setArrDonVi] = useState([]);
  const [DM_PHONGBAN, setDM_PHONGBAN] = useState([]);
  const [bienBan, setBienBan] = useState({});
  const [bienBanArr, setBienBanArr] = useState([]);
  const [visibleViewer, setVisibleViewer] = useState(false);
  const [options, setOptions] = useState({
    donViNhan: "",
    donViGiao: "",
    trangThai: "",
    loaiBienBan: "",
  });
  // const [HT_NGUOIDUNG, setHT_NGUOIDUNG] = useState([]);
  const arrTrangThai = [
    { label: "Biên bản mượn", value: 1 },
    { label: "Biên bản trả", value: 2 },
    { label: "Biên bản quyết toán", value: 3 },
  ];
  const initSearch = {
    hO_TEN: "",
    teN_DANG_NHAP: "",
    tranG_THAI: -1,
    dM_DONVI_ID: null,
    dM_PHONGBAN_ID: null,
    dM_CHUCVU_ID: null,
    pageIndex: 1,
    pageSize: 10,
  };

  const { sortField, sortOrder, handleSort } = useTableSort();

  const loadGiaoNhanTemChi = useCallback(async () => {
    try {
      const data = {
        pageIndex: page,
        pageSize,
        loai_bban: options.loaiBienBan ,
        trang_thai: options.trangThai,
        don_vi_giao: options.donViGiao,
        don_vi_nhan: options.donViNhan,
       
      };
      const items = await search_QLKC_C4_GIAONHAN_TEMCHI(data);
      setArr_GIAONHAN_TEMCHI(items.data);
      setTotalRecords(items.totalItems);
      let newBienBanArr = [];
      items?.data.forEach(async (bb, index) => {
        let nguoiNhan = {};
        let nguoiGiao = {};
        if (bb?.nguoi_nhan) {
          try {
            const res = await HT_NGUOIDUNG_Service.getById(bb.nguoi_nhan);
            nguoiNhan = res;
          } catch (err) {
            console.log(err);
          }
        }
        if (bb?.nguoi_giao) {
          try {
            const res = await HT_NGUOIDUNG_Service.getById(bb.nguoi_giao);
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
        // console.log("bien ban bel",bienBanArr)
      });

      setPageCount(Math.ceil(items.totalItems / pageSize));
    } catch (err) {
      console.log(err.message);
      setBienBanArr([]);
    }
  });

  useEffect(() => {
    loadGiaoNhanTemChi();
  }, [page, pageSize, keyFilter, loadGiaoNhanTemChi]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredData(arr_GIAONHAN_TEMCHI);
    } else {
      const filtered = arr_GIAONHAN_TEMCHI.filter(
        (item) =>
          item.loai.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.doN_VI_TINH.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, arr_GIAONHAN_TEMCHI]);
  useEffect(() => {
    // loadHT_NGUOIDUNG({...searchTerm, pageIndex: page, pageSize})
    loadDM_DONVI()
    loadDM_PHONGBAN()
}, [])
// const loadHT_NGUOIDUNG = async (searchTerm) => {
//   let res = await HT_NGUOIDUNG_Service.search(searchTerm);
//   console.log(res.data)
//   if (res) {
//       setHT_NGUOIDUNG([{ id: "", name: '-- Tất cả --' }, ...res.data.map(item => ({
//         id: item.id,
//         name: item.ho_ten,
//         dm_donvi_id: item.dm_donvi_id
//       }))]);  // Dữ liệu của người dùng từ API
//   }
// };
const loadDM_DONVI = async () => {
  let res = await get_All_DM_DONVI()
  console.log(res)
  if (res) {
      setDM_DONVI([{ id: "", name: '-- Tất cả --' }, ...res.map(item => ({
          id: item.ma_dviqly,
          name: item.ten,
        })),
      ]);
      setArrDonVi(res)
    }
  };

  const loadDM_PHONGBAN = async () => {
    let res = await searchDM_PHONGBAN({});
    console.log(res);
    if (res) {
      setDM_PHONGBAN(
        res.data.map((item) => ({
          id: item.id,
          name: item.ten,
          dm_donvi_id: item.dm_donvi_id,
        }))
      );
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: !value ? "Trường này là bắt buộc" : "",
    }));
  };

  const handleChangeFilter = (field, value) => {
    setFormFilter((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleKyC1 = async (GIAONHAN_TEMCHI) => {
    try {
      if (!GIAONHAN_TEMCHI.id) {
        throw new Error("ID không hợp lệ");
      }

      const response = await update_kyC1_QLKC_C4_GIAONHAN_TEMCHI(
        GIAONHAN_TEMCHI.id
      );

      if (response && response.status === 200) {
      toast.current.show({
        severity: "success",
        summary: "Thành công",
          detail: "Biên bản đã được ký cấp 1",
          life: 3000,
        });
        await loadGiaoNhanTemChi();
      } else {
        throw new Error("Không nhận được phản hồi hợp lệ từ API.");
      }
    } catch (err) {
      console.error("Lỗi khi ký cấp 1:", err.message);
      toast.current.show({
        severity: "error", 
        summary: "Lỗi",
        detail: "Không thể ký cấp 1. Vui lòng thử lại.",
        life: 3000,
      });
    }
  };

  const handleKyC2 = async (GIAONHAN_TEMCHI) => {
    try {
      if (!GIAONHAN_TEMCHI.id) {
        throw new Error("ID không hợp lệ");
      }

      const response = await update_kyC2_QLKC_C4_GIAONHAN_TEMCHI(
        GIAONHAN_TEMCHI.id
      );

      if (response) {
      toast.current.show({
        severity: "success",
        summary: "Thành công",
          detail: "Biên bản đã được ký cấp 2",
          life: 3000,
        });
        await loadGiaoNhanTemChi();
      }
    } catch (err) {
      console.error("Lỗi khi ký cấp 2:", err);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể ký cấp 2. Vui lòng thử lại",
        life: 3000,
      });
    }
  };

  const handleHuyKy = async (GIAONHAN_TEMCHI) => {
    try {
      if (!GIAONHAN_TEMCHI.id) {
        throw new Error("ID không hợp lệ");
      }

      const response = await update_huyPM_QLKC_C4_GIAONHAN_TEMCHI(
        GIAONHAN_TEMCHI.id
      );

      if (response) {
      toast.current.show({
        severity: "success",
        summary: "Thành công",
          detail: "Biên bản đã được hủy",
          life: 3000,
        });
        await loadGiaoNhanTemChi();
      }
    } catch (err) {
      console.error("Lỗi khi hủy ký:", err);
      toast.current.show({
        severity: "error",
        summary: "Lỗi", 
        detail: "Không thể hủy ký. Vui lòng thử lại",
        life: 3000,
      });
    }
  };

  const onPageChange = (event) => {
    setPage(event.page + 1);
    setPageSize(event.rows);
  };

  const confirmDelete = async (GIAONHAN_TEMCHI) => {
    try {
      const r = await delete_QLKC_C4_GIAONHAN_TEMCHI(GIAONHAN_TEMCHI.id);
      console.log(r);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Biên bản đã được xóa",
        life: 3000,
      });
      loadGiaoNhanTemChi();
    } catch (err) {
      // toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa biên bản', life: 3000 });
      throw err;
    }
  };

  const confirmDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedGIAONHAN_TEMCHIs.map((GIAONHAN_TEMCHI) =>
          delete_QLKC_C4_GIAONHAN_TEMCHI(GIAONHAN_TEMCHI.id)
        )
      );
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Các biên bản đã được xóa",
        life: 3000,
      });
      setPage(
        selectedMenus.length === pageSize ? (page > 1 ? page - 1 : 1) : page
      );
      setSelectedGIAONHAN_TEMCHIs([]);

      loadGiaoNhanTemChi();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể xóa các biên bản",
        life: 3000,
      });
    }
  };

  const onDeleteConfirm = (GIAONHAN_TEMCHI) => {
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa unknown này?",
      header: "Xác nhận xóa",
      icon: "pi pi-exclamation-triangle",
      accept: () => confirmDelete(GIAONHAN_TEMCHI),
      reject: () => {
        toast.current.show({
          severity: "info",
          summary: "Đã hủy",
          detail: "Hành động xóa đã bị hủy",
          life: 3000,
        });
      },
    });
  };

  const onDeleteSelectedConfirm = () => {
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa các biên bản đã chọn?",
      header: "Xác nhận xóa",
      icon: "pi pi-exclamation-triangle",
      accept: confirmDeleteSelected,
      reject: () => {
        toast.current.show({
          severity: "info",
          summary: "Đã hủy",
          detail: "Hành động xóa đã bị hủy",
          life: 3000,
        });
      },
    });
  };

  const saveGIAONHAN_TEMCHI = async () => {
    try {
      if (isAdd) {
        console.log(formData);
        await create_QLKC_C4_GIAONHAN_TEMCHI(formData, null);
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Thêm mới biển bản nhập chì tem thành công",
          life: 3000,
        });
      } else {
        console.log(formData);
        await update_QLKC_C4_GIAONHAN_TEMCHI(formData);
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Cập nhật biên bản nhập chì tem thành công",
          life: 3000,
        });
      }

      setShowDialog(false);
      loadGiaoNhanTemChi();
    } catch (error) {
      console.error(
        "Không thể lưu hoặc cập nhật biên bản nhập chì tem:",
        error
      );
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "không thể lưu hoặc cập nhật biên bản nhập chì tem",
        life: 3000,
      });
    }
  };

  const openNewGIAONHAN_TEMCHI = () => {
    setFormData(QLKC_C4_GIAONHAN_TEMCHI);
    setIsAdd(true);
    setShowDialog(true);
  };

  const hideDialog = () => {
    setShowDialog(false);
  };

  const GIAONHAN_TEMCHIDialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="Lưu"
        style={{ backgroundColor: "#1445a7", color: "#fff" }}
        className="border-transparent mr-2"
        onClick={saveGIAONHAN_TEMCHI}
      />
      <Button
        label="Đóng"
        style={{ backgroundColor: "#666666", color: "#fff" }}
        className="border-transparent"
        onClick={hideDialog}
      />
    </div>
  );

  const headerList = (options) => {
    const className = `${options.className} flex align-items-center justify-content-between`;

    return (
      <div className={className}>
        <span className="font-bold text-2xl">Danh sách</span>
        <div className="flex">
          {selectedGIAONHAN_TEMCHIs.length > 0 && (
            <Button
              label="Xóa nhiều"
              severity="danger"
              className="mr-2"
              onClick={onDeleteSelectedConfirm}
              disabled={!selectedGIAONHAN_TEMCHIs.length}
            ></Button>
          )}
          <Button
            label="Thêm mới"
            style={{ backgroundColor: "#1445a7" }}
            onClick={() => {
              setIsAdd(true);
              setFormData(QLKC_C4_GIAONHAN_TEMCHI);
              setVisibleForm(true);
            }}
          ></Button>
        </div>
      </div>
    );
  };

  const breadcrumb_router = [
    { label: "Quản lý kìm chì" },
    {
      label: "Biển bản nhập chì kem",
      template: () => (
        <Link href="/quanlykimchi/giaonhantemchic4">Biên bản nhập chì tem</Link>
      ),
    },
  ];
  const home = { icon: "pi pi-home", url: "/" };

  const handleNavigateToQuyetToan = (rowData) => {
    try {
      if (!rowData.id) {
        throw new Error("ID không hợp lệ");
      }
      
      // Chuyển trang và truyền id qua query params
      router.push({
        pathname: '/quanlykimchi/chitietquyettoanchi',
        query: { id_giaonhan_temchi: rowData.id }
      });
    } catch (err) {
      console.error("Lỗi khi chuyển trang:", err);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể chuyển trang quyết toán. Vui lòng thử lại",
        life: 3000,
      });
    }
  };
  const showToast = (type, message) => {
    toast.current.show({
      severity: type,
      summary: "Thông báo",
      detail: message,
    });
  };
  const handleCloseModalViewer = () => {
    setVisibleViewer(false);
    setBienBan({});
  };
  const handleOnClickKySoBtn = (bienBan) => {
    setVisibleViewer(true);
    setBienBan(bienBan);
  };
  return (
    <React.Fragment>
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <Toast ref={toast} />
              <Panel header={currentMenu} className="mb-4">
            <Divider style={{ marginTop: "0", marginBottom: "10px" }} />
            <div className="flex flex-column lg:flex-row gap-3">
              <div className="flex-auto">
                <label htmlFor="MA" className="mb-2 block">
                  Đơn vị giao
                </label>
                <Dropdown
                  value={options.donViGiao}
                  options={arrDonVi}
                  filter
                  onChange={(e) => {
                    console.log(e.value);
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
                  options={arrDonVi}
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
                  loadGiaoNhanTemChi();
                }}
              />
            </div>
          </Panel>

            <Panel headerTemplate={headerList} className="mt-4">
              <div className="flex justify-content-end">
                <InputText
                  className="w-full md:w-20rem"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Tìm kiếm"
                />
              </div>

              <DataTable
                value={filteredData}
                className="datatable-responsive mt-5"
                showGridlines
                selection={selectedGIAONHAN_TEMCHIs}
                onSelectionChange={(e) => setSelectedGIAONHAN_TEMCHIs(e.value)}
                responsiveLayout="scroll"
                style={{ fontSize: 10, fontWeight: "" }}
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{
                    width: "4rem",
                    backgroundColor: "#1445a7",
                    color: "#fff",
                  }}
                />
                {/* <Column
                  {...propSortAndFilter}
                  field="id"
                  style={{ cursor: "pointer" }}
                  header="ID biên bản"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                /> */}
                <Column
                  field="teN_DONVI_GIAO"
                  header="Đơn vị giao"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  field="teN_DONVI_NHAN"
                  header="Đơn vị nhận"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />  
                <Column
                  {...propSortAndFilter}
                  field="ngaY_GIAO"
                  header="Ngày giao"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  {...propSortAndFilter}
                  field="ngaY_NHAN"
                  header="Ngày nhận"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  field="loai"
                  header="Loại"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  {...propSortAndFilter}
                  field="sO_LUONG_GIAO"
                  header="Số lượng giao"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  {...propSortAndFilter}
                  field="sO_LUONG_TRA"
                  header="Số lượng trả"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  {...propSortAndFilter}
                  field="sO_LUONG_THUHOI"
                  header="Số lượng thu hồi"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  field="donvI_TINH"
                  header="Đơn vị tính"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  field="loaI_BBAN"
                  header="Loại biên bản"
                  body={(rowData) => { 
                    return rowData.loaI_BBAN === 1
                      ? "Biên bản mượn"
                      : rowData.loaI_BBAN === 2
                      ? "Biên bản trả"
                      : rowData.loaI_BBAN === 3
                      ? "Biên bản quyết toán"
                      : "Loại biên bản không xác định";
                  }}
                  
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  field="noI_DUNG"
                  header="Nội dung"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  field="tranG_THAI"
                  header="Trạng thái"
                  body={(rowData) => {
                    return rowData.tranG_THAI === 0
                      ? "Đang chờ duyệt"
                      : rowData.tranG_THAI === 1
                      ? "C1 đã ký"
                      : rowData.tranG_THAI === 2
                      ? "C2 đã ký"
                      : rowData.tranG_THAI === 3
                      ? "Bị hủy"
                      : "Trạng thái không xác định";
                  }}
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  header="Thao tác"
                  headerStyle={{
                    backgroundColor: "#1445a7",
                    color: "#fff",
                    width: "3rem",
                  }}
                  body={(rowData) => (
                    <div className="flex justify-content-between gap-1">
                       {/* <Button
                        size="small"
                        icon="pi pi-minus"
                        tooltip="Ký cấp 1"
                        onClick={() => handleKyC1(rowData)}
                        style={{ backgroundColor: "#1445a7", border: "none" }}
                        className="w-1rem h-2rem p-3 mr-1"
                      />
                      <Button
                        size="small"
                        icon="pi pi-equals"
                        tooltip="ký cấp 2"
                        onClick={() => handleKyC2(rowData)}
                        style={{ backgroundColor: "#1445a7", border: "none" }}
                        className="w-1rem h-2rem p-3 mr-1"
                      /> */}
                      <Button
                        size="small"
                        icon="pi pi-times"
                        tooltip="Hủy"
                        onClick={() => handleHuyKy(rowData)}
                        style={{ backgroundColor: "#1445a7", border: "none" }}
                        className="w-1rem h-2rem p-3 mr-1"
                      />
                      <Button
                        size="small"
                        icon="pi pi-file"
                        tooltip="Quyết toán"
                        onClick={() => handleNavigateToQuyetToan(rowData)}
                        style={{ backgroundColor: "#1445a7" }}
                        className="w-1rem h-2rem p-3 mr-1"
                      />
                       <Button
                        size="small"
                        icon="pi pi-eye"
                        tooltip="Biên bản"
                        onClick={() => handleOnClickKySoBtn(rowData)}
                        style={{ backgroundColor: "#1445a7" }}
                        className="w-1rem h-2rem p-3 mr-1"
                      />
                      <Button
                        size="small"
                        icon="pi pi-pencil"
                        tooltip="Sửa"
                        onClick={() => {
                          setFormData(rowData);
                          setVisibleForm(true);
                          setIsAdd(false);
                        }}
                        style={{ backgroundColor: "#1445a7" }}
                        className="w-1rem h-2rem p-3 mr-1"
                      />
                      <Button
                        size="small"
                        icon="pi pi-trash"
                        tooltip="Xóa"
                        onClick={() => onDeleteConfirm(rowData)}
                        style={{ backgroundColor: "#1445a7", border: "none" }}
                        className="w-1rem h-2rem p-3 mr-1"
                      />
                    </div>
                  )}
                />
              </DataTable>
              {totalRecords > 0 && (
                <Paginator
                  first={(page - 1) * pageSize}
                  rows={pageSize}
                  totalRecords={totalRecords}
                  onPageChange={onPageChange}
                  rowsPerPageOptions={[5, 10, 20, 50]}
                />
              )}
            </Panel>

            {visibleForm && (
              <DialogForm
                isAdd={isAdd}
                search={searchTerm}
                toast={toast}
                DM_DONVI={DM_DONVI}      
                DM_PHONGBAN={DM_PHONGBAN}
                // HT_NGUOIDUNG={HT_NGUOIDUNG}
                formData={formData}
                setFormData={setFormData}
                loadData={loadGiaoNhanTemChi}
                visible={visibleForm}
                setVisible={setVisibleForm}
              />
            )}
            {visibleViewer && (
              <BienBanViewer
                bienBan={bienBan}
                visible={visibleViewer}
                handleCloseModalViewer={handleCloseModalViewer}
                showToast={showToast}
                setBienBan={setBienBan}
                loadData={loadGiaoNhanTemChi}
              />
            )}
            {visibleFormQuyetToan && (
              <DialogFormQuyetToan
                isAdd={isAdd}
                search={searchTerm}
                toast={toast}
                DM_DONVI={DM_DONVI}
                DM_PHONGBAN={DM_PHONGBAN}
                formDataQuyetToan={formDataQuyetToan}
                setFormDataQuyetToan={setFormDataQuyetToan}
                loadData={loadGiaoNhanTemChi}
                visible={visibleFormQuyetToan}
                setVisible={setVisibleFormQuyetToan}
              />
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog />
    </React.Fragment>
  );
};

export default GIAONHAN_TEMCHI;
