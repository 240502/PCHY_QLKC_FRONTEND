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
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { DialogForm } from "../giaonhantemchic4/DialogForm";
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
import { search_QLKC_C4_CHITIET_QUYETTOANCHI } from "../../../services/quanlykimchi/QLKC_C4_CHITIET_QUYETTOANCHIService";
import { useRouter } from "next/router";

const CHITIET_QUYETTOANCHI = () => {
  const router = useRouter();
  const { id_giaonhan_temchi } = router.query;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [arr_CHITIET_QUYETTOANCHI, setArr_CHITIET_QUYETTOANCHI] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [arr_GIAONHAN_TEMCHI_QLY, setArr_GIAONHAN_TEMCHI_QLY] = useState([]);
  const [formDataQuyetToan, setFormDataQuyetToan] = useState(
    QLKC_C4_CHITIET_QUYETTOANCHI
  );
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
  const [DM_PHONGBAN, setDM_PHONGBAN] = useState([]);
  const [optionsTrangThai, setOptionsTrangThai] = useState({
    ma: undefined,
    ten: "",
    tranG_THAI: {
      label: "",
      value: "",
    },
  });
  const arrTrangThai = [
    { label: "Đang chờ duyệt", value: 0 },
    { label: "C1 đã ký", value: 1 },
    { label: "C2 đã ký", value: 2 },
    { label: "Bị hủy", value: 3 },
  ];

  const { sortField, sortOrder, handleSort } = useTableSort();

  useEffect(() => {
    if (id_giaonhan_temchi) {
      // Load dữ liệu quyết toán dựa trên id_giaonhan_temchi
      loadChiTietQuyetToanChi();
    }
  }, [id_giaonhan_temchi]);

  const loadChiTietQuyetToanChi = useCallback(async () => {
    try {
      const items = await search_QLKC_C4_CHITIET_QUYETTOANCHI({
        pageIndex: page,
        pageSize,
        // id_giaonhan_temchi, // Thêm id vào params
        ...keyFilter,
      });
      setArr_CHITIET_QUYETTOANCHI(items.data);
      setTotalRecords(items.totalItems);
      setPageCount(Math.ceil(items.totalItems / pageSize));
    } catch (err) {
      console.error("Không thể tải dữ liệu:", err);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể tải dữ liệu",
        life: 3000,
      });
    }
  }, [page, pageSize, keyFilter, id_giaonhan_temchi]);

  useEffect(() => {
    loadChiTietQuyetToanChi();
  }, [page, pageSize, keyFilter, loadChiTietQuyetToanChi]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredData(arr_CHITIET_QUYETTOANCHI);
    } else {
      const filtered = arr_CHITIET_QUYETTOANCHI.filter(
        (item) =>
          item.loai.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.doN_VI_TINH.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, arr_CHITIET_QUYETTOANCHI]);
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        // loadHT_NGUOIDUNG(),
        loadDM_DONVI(),
        loadDM_PHONGBAN(),
      ]);
    };

    loadInitialData();
  }, []);

  const loadDM_DONVI = async () => {
    let res = await get_All_DM_DONVI();
    console.log(res);
    if (res) {
      setDM_DONVI([
        { id: "", name: "-- Tất cả --" },
        ...res.map((item) => ({
          id: item.dm_donvi_id,
          name: item.ten,
          dm_donvi_id: item.dm_donvi_id,
        })),
      ]);
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

  const handleChangeFilter = (field, value) => {
    setFormFilter((prevData) => ({
      ...prevData,
      [field]: value,
    }));
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
        detail: "Không thể xóa các đơn vị",
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
      message: "Bạn có chắc chắn muốn xóa các đơn vị đã chọn?",
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

  const validateForm = () => {
    const newErrors = {};
    if (!formDataQuyetToan.mA_KHACH_HANG)
      newErrors.mA_KHACH_HANG = "Trường này là bắt buộc";
    if (!formDataQuyetToan.teN_KHACH_HANG)
      newErrors.loai = "Trường này là bắt buộc";
    if (!formDataQuyetToan.hop) newErrors.hop = "Trường này là bắt buộc";
    if (!formDataQuyetToan.cot) newErrors.cot = "Trường này là bắt buộc";
    if (!formDataQuyetToan.chup_buzi_ti_tu)
      newErrors.chup_buzi_ti_tu = "Trường này là bắt buộc";
    if (!formDataQuyetToan.tong_so_chi_niem_phong)
      newErrors.tong_so_chi_niem_phong = "Trường này là bắt buộc";
    if (!formDataQuyetToan.tong_so_chi_thu_hoi)
      newErrors.tong_so_chi_thu_hoi = "Trường này là bắt buộc";
    if (!formDataQuyetToan.ly_do) newErrors.ly_do = "Trường này là bắt buộc";
    if (!formDataQuyetToan.cuA_TU) newErrors.cuA_TU = "Trường này là bắt buộc";
    if (!formDataQuyetToan.iD_GIAONHAN_TEMCHI)
      newErrors.iD_GIAONHAN_TEMCHI = "Trường này là bắt buộc";
    if (!formDataQuyetToan.teN_TBA)
      newErrors.teN_TBA = "Trường này là bắt buộc";
    if (!formDataQuyetToan.ngaY_NIEM_PHONG)
      newErrors.ngaY_NIEM_PHONG = "Trường này là bắt buộc";
    if (!formDataQuyetToan.booC_CONGQUANG)
      newErrors.booC_CONGQUANG = "Trường này là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  return (
    <React.Fragment>
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <Toast ref={toast} />
            <Panel header="Tìm kiếm">
              <div className="flex flex-column md:flex-row gap-3">
                <div className="flex-1">
                  <label className="block mb-2">Loại</label>
                  <InputText
                    placeholder="Nhập loại "
                    value={formFilter.loai}
                    onChange={(e) => handleChangeFilter("loai", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2">Đơn vị tính</label>
                  <InputText
                    placeholder="Nhập đơn vị tính "
                    value={formFilter.doN_VI_TINH}
                    onChange={(e) =>
                      handleChangeFilter("doN_VI_TINH", e.target.value)
                    }
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex justify-content-center mt-3">
                <Button
                  label="Tìm kiếm"
                  style={{ backgroundColor: "#1445a7" }}
                  onClick={() => {
                    console.log(formFilter);
                    setPage(1);
                    setPageSize(5);
                    setKeyFilter(formFilter);
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
                  field="teN_KHACH_HANG"
                  header="Tên khách hàng"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  field="mA_KHACH_HANG"
                  header="Mã khách hàng"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  {...propSortAndFilter}
                  field="hop"
                  header="Hộp"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  {...propSortAndFilter}
                  field="cot"
                  header="Cột"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  field="teN_TBA"
                  header="Tên TBA"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  {...propSortAndFilter}
                  field="booC_CONGQUANG"
                  header="Booc, Cổng quang"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  {...propSortAndFilter}
                  field="cuA_TU"
                  header="Của tủ"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  {...propSortAndFilter}
                  field="chuP_BUZI_TI_TU"
                  header="Chủ búzi, ti tu"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  field="lY_DO"
                  header="Lý do"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  field="ngaY_NIEM_PHONG"
                  header="Ngày niêm phòng"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  field="tong_so_chi_niem_phong"
                  header="Tổng số chì niêm phong"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  field="tong_so_chi_thu_hoi"
                  header="Tổng số chì thu hồi"
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
                      <Button
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
                      />
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
                        icon="pi pi-pencil"
                        tooltip="Quyết toán"
                        onClick={() => {
                          setFormDataQuyetToan(rowData);
                          setVisibleFormQuyetToan(true);
                          setIsAdd(false);
                        }}
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

export default CHITIET_QUYETTOANCHI;
