import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import React, { useRef, useState, useEffect, useCallback } from "react";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { QLKC_C4_GIAONHAN_TEMCHI } from "../../../models/QLKC_C4_GIAONHAN_TEMCHI";
import Link from "next/link";
import { Paginator } from "primereact/paginator";
import { BreadCrumb } from "primereact/breadcrumb";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import Head from "next/head";
import provinceData from "../../../public/demo/data/data_province.json";
import {
  delete_QLKC_C4_GIAONHAN_TEMCHI,
  search_QLKC_C4_GIAONHAN_TEMCHI,
  get_QLKC_C4_GIAONHAN_TEMCHI,
  update_QLKC_C4_GIAONHAN_TEMCHI,
  create_QLKC_C4_GIAONHAN_TEMCHI,
  update_huyPM_QLKC_C4_GIAONHAN_TEMCHI,
  update_kyC1_QLKC_C4_GIAONHAN_TEMCHI,
  update_kyC2_QLKC_C4_GIAONHAN_TEMCHI,
} from "../../../services/quanlykimchi/QLKC_C4_GIAONHAN_TEMCHIService";
import { useTableSort } from "../../../hooks/useTableSort";
import { propSortAndFilter } from "../../../constants/propGlobal";

const GIAONHAN_TEMCHI = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [arr_GIAONHAN_TEMCHI, setArr_GIAONHAN_TEMCHI] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [arr_GIAONHAN_TEMCHI_QLY, setArr_GIAONHAN_TEMCHI_QLY] = useState([]);
  const [formData, setFormData] = useState(QLKC_C4_GIAONHAN_TEMCHI);
  const [formFilter, setFormFilter] = useState({ loai: "", doN_VI_TINH: "" });
  const [keyFilter, setKeyFilter] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [trangThai, setTrangThai] = useState();
  const [errors, setErrors] = useState({});
  const [selectedGIAONHAN_TEMCHIs, setSelectedGIAONHAN_TEMCHIs] = useState([]);
  const toast = useRef(null);
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
  const arrLoaiBienBan = [
    { label: "Phiếu mượn", value: 0 },
    { label: "Phiếu trả", value: 1 },
  ];

  const { sortField, sortOrder, handleSort } = useTableSort();

  const loadGiaoNhanTemChi = useCallback(async () => {
    try {
      const items = await search_QLKC_C4_GIAONHAN_TEMCHI({
        pageIndex: page,
        pageSize,
        ...keyFilter,
      });
      setArr_GIAONHAN_TEMCHI(items.data);

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
  }, [page, pageSize, keyFilter]);

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

  const handleEdit = async (GIAONHAN_TEMCHI) => {
    try {
      const fetchedData = await get_QLKC_C4_GIAONHAN_TEMCHI(GIAONHAN_TEMCHI.id);

      setFormData(GIAONHAN_TEMCHI);
      setIsAdd(false);
      setShowDialog(true);
    } catch (error) {
      console.error("Error fetching unit data:", error);
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể tải dữ liệu đơn vị để chỉnh sửa.",
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
    if (!formData.loai) newErrors.loai = "Trường này là bắt buộc";
    if (!formData.sO_LUONG_GIAO) newErrors.sO_LUONG = "Trường này là bắt buộc";
    if (!formData.sO_LUONG_TRA)
      newErrors.sO_LUONG_TRA = "Trường này là bắt buộc";
    if (!formData.sO_LUONG_THUHOI)
      newErrors.sO_LUONG_THUHOI = "Trường này là bắt buộc";
    if (!formData.doN_VI_TINH) newErrors.doN_VI_TINH = "Trường này là bắt buộc";
    if (!formData.doN_VI_GIAO) newErrors.doN_VI_GIAO = "Trường này là bắt buộc";
    if (!formData.doN_VI_NHAN) newErrors.doN_VI_NHAN = "Trường này là bắt buộc";
    if (!formData.nguoI_GIAO) newErrors.nguoI_GIAO = "Trường này là bắt buộc";
    if (!formData.nguoI_NHAN) newErrors.nguoI_NHAN = "Trường này là bắt buộc";
    // if (!formData.tranG_THAI) newErrors.tranG_THAI = "Trường này là bắt buộc";
    if (!formData.noI_DUNG) newErrors.noI_DUNG = "Trường này là bắt buộc";
    if (!formData.loaI_BBAN) newErrors.loaI_BBAN = "Trường này là bắt buộc";
    // if (!formData.ngaY_GIAO) newErrors.ngaY_GIAO = "Trường này là bắt buộc";
    // if (!formData.ngaY_NHAN) newErrors.ngaY_NHAN = "Trường này là bắt buộc";

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
            onClick={openNewGIAONHAN_TEMCHI}
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
                  field="doN_VI_GIAO"
                  header="Đơn vị giao"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  field="doN_VI_NHAN"
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
                  field="loaI_BBAN"
                  header="Loại biên bản"
                  body={(rowData) => {
                    return rowData.loaI_BBAN === 0
                      ? "Biên bản mượn"
                      : "Biên bản quyết toán";
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
                        tooltip="Sửa"
                        onClick={() => handleEdit(rowData)}
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

            <Dialog
              visible={showDialog}
              style={{ width: "90%" }}
              header="Thông tin giao nhân tem chì c4"
              className="p-fluid w-11 md:w-8"
              onHide={hideDialog}
              footer={GIAONHAN_TEMCHIDialogFooter}
            >
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-column flex-grow-1">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Nội dung
                  </label>
                  <InputText
                    placeholder="Nhập nội dung"
                    required
                    id="noI_DUNG"
                    value={formData.noI_DUNG}
                    onChange={(e) => handleChange("noI_DUNG", e.target.value)}
                    className={errors.noI_DUNG ? "p-invalid" : ""}
                  />
                  {errors.noI_DUNG && (
                    <small className="p-error">{errors.noI_DUNG}</small>
                  )}
                </div>
                <div className="flex flex-column flex-grow-1">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Đơn vị tính
                  </label>
                  <InputText
                    placeholder="Nhập đơn vị tính"
                    required
                    id="donvI_TINH"
                    value={formData.donvI_TINH}
                    onChange={(e) => handleChange("donvI_TINH", e.target.value)}
                    className={errors.donvI_TINH ? "p-invalid" : ""}
                  />
                  {errors.donvI_TINH && (
                    <small className="p-error">{errors.donvI_TINH}</small>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex flex-column flex-grow-1">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Số lượng giao
                  </label>
                  <InputText
                    placeholder="Nhập số lượng giao"
                    required
                    type="number"
                    id="sO_LUONG_GIAO"
                    value={formData.sO_LUONG_GIAO}
                    onChange={(e) =>
                      handleChange("sO_LUONG_GIAO", e.target.value)
                    }
                    className={errors.sO_LUONG_GIAO ? "p-invalid" : ""}
                  />
                  {errors.sO_LUONG_GIAO && (
                    <small className="p-error">{errors.sO_LUONG_GIAO}</small>
                  )}
                </div>

                <div className="flex flex-column flex-grow-1">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Số lượng trả
                  </label>
                  <InputText
                    placeholder="Nhập số lượng trả"
                    type="number"
                    required
                    id="sO_LUONG_TRA"
                    value={formData.sO_LUONG_TRA}
                    onChange={(e) =>
                      handleChange("sO_LUONG_TRA", e.target.value)
                    }
                    className={errors.sO_LUONG_TRA ? "p-invalid" : ""}
                  />
                  {errors.sO_LUONG && (
                    <small className="p-error">{errors.sO_LUONG}</small>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-column flex-grow-1">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Loại
                  </label>
                  <InputText
                    placeholder="Nhập tên loại"
                    required
                    id="loai"
                    value={formData.loai}
                    onChange={(e) => handleChange("loai", e.target.value)}
                    className={errors.loai ? "p-invalid" : ""}
                  />
                  {errors.loai && (
                    <small className="p-error">{errors.loai}</small>
                  )}
                </div>

                <div className="flex flex-column flex-grow-1">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Số lượng thu hồi
                  </label>
                  <InputText
                    placeholder="Nhập số lượng thu hồi"
                    type="number"
                    required
                    id="sO_LUONG_THUHOI"
                    value={formData.sO_LUONG_THUHOI}
                    onChange={(e) =>
                      handleChange("sO_LUONG_THUHOI", e.target.value)
                    }
                    className={errors.sO_LUONG_THUHOI ? "p-invalid" : ""}
                  />
                  {errors.sO_LUONG_THUHOI && (
                    <small className="p-error">{errors.sO_LUONG_THUHOI}</small>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-column flex-grow-1">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Đơn vị nhận
                  </label>
                  <InputText
                    placeholder="Nhập dơn vị nhận"
                    type="text"
                    required
                    id="doN_VI_NHAN"
                    value={formData.doN_VI_NHAN}
                    onChange={(e) =>
                      handleChange("doN_VI_NHAN", e.target.value)
                    }
                    className={errors.doN_VI_NHAN ? "p-invalid" : ""}
                  />
                  {errors.doN_VI_NHAN && (
                    <small className="p-error">{errors.doN_VI_NHAN}</small>
                  )}
                </div>

                <div className="flex flex-column flex-grow-1">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Đơn vị giao
                  </label>
                  <InputText
                    placeholder="Nhập đơn vị giao"
                    type="text"
                    required
                    id="doN_VI_GIAO"
                    value={formData.doN_VI_GIAO}
                    onChange={(e) =>
                      handleChange("doN_VI_GIAO", e.target.value)
                    }
                    className={errors.doN_VI_GIAO ? "p-invalid" : ""}
                  />
                  {errors.doN_VI_GIAO && (
                    <small className="p-error">{errors.doN_VI_GIAO}</small>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex flex-column flex-grow-1">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Người giao
                  </label>
                  <InputText
                    placeholder="Nhập Người giao"
                    required
                    id="nguoI_GIAO"
                    value={formData.nguoI_GIAO}
                    onChange={(e) => handleChange("nguoI_GIAO", e.target.value)}
                    className={errors.nguoI_GIAO ? "p-invalid" : ""}
                  />
                  {errors.nguoI_GIAO && (
                    <small className="p-error">{errors.nguoI_GIAO}</small>
                  )}
                </div>

                <div className="flex flex-column flex-grow-1">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Người nhận
                  </label>
                  <InputText
                    placeholder="Nhập người nhận"
                    type="text"
                    required
                    id="nguoI_NHAN"
                    value={formData.nguoI_NHAN}
                    onChange={(e) => handleChange("nguoI_NHAN", e.target.value)}
                    className={errors.nguoI_NHAN ? "p-invalid" : ""}
                  />
                  {errors.nguoI_NHAN && (
                    <small className="p-error">{errors.nguoI_NHAN}</small>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-column flex-grow-1">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Ngày giao
                  </label>
                  <InputText
                    placeholder="Ngày giao"
                    required
                    type="datetime-local"
                    id="ngaY_GIAO"
                    value={formData.ngaY_GIAO}
                    onChange={(e) => handleChange("ngaY_GIAO", e.target.value)}
                    className={errors.ngaY_GIAO ? "p-invalid" : ""}
                  />
                  {errors.ngaY_GIAO && (
                    <small className="p-error">{errors.ngaY_GIAO}</small>
                  )}
                </div>

                <div className="flex flex-column flex-grow-1">
                  <label>
                    <span className="text-red-400">(*) </span>
                    Ngày nhận
                  </label>
                  <InputText
                    placeholder="Ngày nhận"
                    type="datetime-local"
                    required
                    id="ngaY_NHAN"
                    value={formData.ngaY_NHAN}
                    onChange={(e) => handleChange("ngaY_NHAN", e.target.value)}
                    className={errors.ngaY_NHAN ? "p-invalid" : ""}
                  />
                  {errors.ngaY_NHAN && (
                    <small className="p-error">{errors.ngaY_NHAN}</small>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-column flex-grow-1">
                  <label htmlFor="TRANG_THAI">Trạng thái</label>
                  <Dropdown
                    onChange={(e) => {
                      //setTrangThai(e.value);
                      handleChange("tranG_THAI", e.value);
                    }}
                    optionLabel="label"
                    id="tranG_THAI"
                    className="w-full flex-grow-1"
                    options={arrTrangThai}
                    placeholder="Chọn một trạng thái"
                    value={formData.tranG_THAI}
                    disabled={!isAdd}
                  />
                </div>

                <div className="flex flex-column flex-grow-1">
                  <label htmlFor="loaI_BBAN">Loại biên bản</label>
                  <Dropdown
                    onChange={(e) => {
                      //setTrangThai(e.value);
                      handleChange("loaI_BBAN", e.value);
                    }}
                    optionLabel="label"
                    id="loaI_BBAN"
                    className="w-full"
                    options={arrLoaiBienBan}
                    placeholder="Chọn một trạng thái"
                    value={formData.loaI_BBAN}
                  />
                </div>
              </div>
            </Dialog>
          </div>
        </div>
      </div>
      <ConfirmDialog />
    </React.Fragment>
  );
};

export default GIAONHAN_TEMCHI;
