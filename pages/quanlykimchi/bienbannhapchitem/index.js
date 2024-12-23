import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import React, { useRef, useState, useEffect, useCallback } from "react";
import "primeicons/primeicons.css";
import { Dropdown } from "primereact/dropdown";
import { QLKC_NHAP_CHI_TEM } from "../../../models/QLKC_NHAP_CHI_TEM";
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
  delete_QLKC_NHAP_CHI_TEM,
  get_BBan_NHAP_CHI_TEM,
  insert_QLKC_NHAP_CHI_TEM,
  search_QLKC_NHAP_CHI_TEM,
  update_QLKC_NHAP_CHI_TEM,
} from "../../../services/quanlykimchi/QLKC_NHAP_CHI_TEMService";
import { useTableSort } from "../../../hooks/useTableSort";
import { propSortAndFilter } from "../../../constants/propGlobal";

const NHAP_CHI_TEM = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [arr_NHAP_CHI_TEM, setArr_NHAP_CHI_TEM] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [arr_NHAP_CHI_TEM_QLY, setArr_NHAP_CHI_TEM_QLY] = useState([]);
  const [formData, setFormData] = useState(QLKC_NHAP_CHI_TEM);
  const [formFilter, setFormFilter] = useState({ loai: "", doN_VI_TINH: "" });
  const [keyFilter, setKeyFilter] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedNHAP_CHI_TEMs, setSelectedNHAP_CHI_TEMs] = useState([]);
  const toast = useRef(null);

  const { sortField, sortOrder, handleSort } = useTableSort();

  const loadNhapChiTem = useCallback(async () => {
    try {
      const items = await search_QLKC_NHAP_CHI_TEM({
        pageIndex: page,
        pageSize,
        ...keyFilter,
      });
      setArr_NHAP_CHI_TEM(items.data);

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
    loadNhapChiTem();
  }, [page, pageSize, keyFilter, loadNhapChiTem]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredData(arr_NHAP_CHI_TEM);
    } else {
      const filtered = arr_NHAP_CHI_TEM.filter(
        (item) =>
          item.loai.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.doN_VI_TINH.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, arr_NHAP_CHI_TEM]);

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

  const handleEdit = async (NHAP_CHI_TEM) => {
    try {
      const fetchedData = await get_BBan_NHAP_CHI_TEM(NHAP_CHI_TEM.iD_BIENBAN);
      // console.log(fetchedData); // Kiểm tra dữ liệu trả về
      //setFormData({ ...fetchedData });
   
      setFormData(NHAP_CHI_TEM);
      console.log(formData);
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

  const confirmDelete = async (NHAP_CHI_TEM) => {
    try {
      await delete_QLKC_NHAP_CHI_TEM(NHAP_CHI_TEM.iD_BIENBAN);
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: "Biên bản đã được xóa",
        life: 3000,
      });
      loadNhapChiTem();
    } catch (err) {
      // toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa biên bản', life: 3000 });
      throw err;
    }
  };

  const confirmDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedNHAP_CHI_TEMs.map((NHAP_CHI_TEM) =>
          delete_QLKC_NHAP_CHI_TEM(NHAP_CHI_TEM.iD_BIENBAN)
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
      setSelectedNHAP_CHI_TEMs([]);

      loadNhapChiTem();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể xóa các đơn vị",
        life: 3000,
      });
    }
  };

  const onDeleteConfirm = (NHAP_CHI_TEM) => {
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa unknown này?",
      header: "Xác nhận xóa",
      icon: "pi pi-exclamation-triangle",
      accept: () => confirmDelete(NHAP_CHI_TEM),
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
    if (!formData.doN_VI_TINH) newErrors.doN_VI_TINH = "Trường này là bắt buộc";
    if (!formData.loai) newErrors.loai = "Trường này là bắt buộc";
    if (!formData.sO_LUONG) newErrors.sO_LUONG = "Trường này là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveNHAP_CHI_TEM = async () => {
    if (!validateForm()) {
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Vui lòng điền đầy đủ thông tin',
        life: 3000
      });
      return;
    }

    try {
      if (isAdd) {
        console.log(formData);
        await insert_QLKC_NHAP_CHI_TEM(formData);
        toast.current.show({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Thêm mới biển bản nhập chì tem thành công',
          life: 3000
        });
      } else {
        console.log(formData);
        await update_QLKC_NHAP_CHI_TEM(formData);
        toast.current.show({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Cập nhật biên bản nhập chì tem thành công',
          life: 3000
        });
      }
      setShowDialog(false);
      loadNhapChiTem();
    } catch (error) {
      console.error("Không thể lưu hoặc cập nhật biên bản nhập chì tem:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'thể lưu hoặc cập nhật biên bản nhập chì tem',
        life: 3000
      });
    }
  };
  const openNewNHAP_CHI_TEM = () => {
    setFormData(QLKC_NHAP_CHI_TEM);
    setIsAdd(true);
    setShowDialog(true);
  };

  const hideDialog = () => {
    setShowDialog(false);
  };

  const NHAP_CHI_TEMDialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="Lưu"
        style={{ backgroundColor: "#1445a7", color: "#fff" }}
        className="border-transparent mr-2"
        onClick={saveNHAP_CHI_TEM}
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
          {selectedNHAP_CHI_TEMs.length > 0 && (
            <Button
              label="Xóa nhiều"
              severity="danger"
              className="mr-2"
              onClick={onDeleteSelectedConfirm}
              disabled={!selectedNHAP_CHI_TEMs.length}
            ></Button>
          )}
          <Button
            label="Thêm mới"
            style={{ backgroundColor: "#1445a7" }}
            onClick={openNewNHAP_CHI_TEM}
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
        <Link href="/quanlykimchi/bienbannhapchitem">
          Biên bản nhập chì tem
        </Link>
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
                selection={selectedNHAP_CHI_TEMs}
                onSelectionChange={(e) => setSelectedNHAP_CHI_TEMs(e.value)}
                responsiveLayout="scroll"
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{
                    width: "4rem",
                    backgroundColor: "#1445a7",
                    color: "#fff",
                  }}
                />
                <Column
                  {...propSortAndFilter}
                  field="iD_BIENBAN"
                  style={{ cursor: "pointer" }}
                  header="ID biên bản"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  field="loai"
                  header="Loại"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  {...propSortAndFilter}
                  field="sO_LUONG"
                  header="Số lượng"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  {...propSortAndFilter}
                  field="doN_VI_TINH"
                  header="Đơn vị tính"
                  headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
                />
                <Column
                  header="Thao tác"
                  headerStyle={{
                    backgroundColor: "#1445a7",
                    color: "#fff",
                    width: "6rem",
                  }}
                  body={(rowData) => (
                    <div className="flex justify-content-between gap-3">
                      <Button
                        icon="pi pi-pencil"
                        tooltip="Sửa"
                        onClick={() => handleEdit(rowData)}
                        style={{ backgroundColor: "#1445a7" }}
                      />
                      <Button
                        icon="pi pi-trash"
                        tooltip="Xóa"
                        onClick={() => onDeleteConfirm(rowData)}
                        style={{ backgroundColor: "#1445a7", border: "none" }}
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
              style={{ width: "90%", maxWidth: "40rem" }}
              header="Thông tin đơn vị"
              className="p-fluid"
              onHide={hideDialog}
              footer={NHAP_CHI_TEMDialogFooter}
            >
              <div className="field">
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

              <div className="field">
                <label>
                  <span className="text-red-400">(*) </span>
                  Số lượng
                </label>
                <InputText
                  placeholder="Nhập số lượng"
                  type="number"
                  required
                  id="sO_LUONG"
                  value={formData.sO_LUONG}
                  onChange={(e) => handleChange("sO_LUONG", e.target.value)}
                  className={errors.sO_LUONG ? "p-invalid" : ""}
                />
                {errors.sO_LUONG && (
                  <small className="p-error">{errors.sO_LUONG}</small>
                )}
              </div>

              <div className="field">
                <label>
                  <span className="text-red-400">(*) </span>
                  Đơn vị tính
                </label>
                <InputText
                  placeholder="Nhập đơn vị tính"
                  required
                  id="doN_VI_TINH"
                  value={formData.doN_VI_TINH}
                  onChange={(e) => handleChange("doN_VI_TINH", e.target.value)}
                  className={errors.doN_VI_TINH ? "p-invalid" : ""}
                />
                {errors.doN_VI_TINH && (
                  <small className="p-error">{errors.doN_VI_TINH}</small>
                )}
              </div>
            </Dialog>
          </div>
        </div>
      </div>
      <ConfirmDialog />
    </React.Fragment>
  );
};

export default NHAP_CHI_TEM;
