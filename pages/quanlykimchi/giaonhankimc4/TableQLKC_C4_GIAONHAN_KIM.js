import React, { useState, useRef } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog } from "primereact/confirmdialog";
import { propSortAndFilter } from "../../../constants/propGlobal";

import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { deleteDM_PHONGBAN } from "../../../services/quantrihethong/DM_PHONGBANService";
import {
  delete_QLKC_C4_GIAONHAN_KIM,
  update_kyC1_PM_QLKC_C4_GIAONHAN_KIM,
  update_kyC2_PM_C4_GIAONHAN_KIM,
  update_huyPM_QLKC_C4_GIAONHAN_KIM,
  update_loaiBBan_QLKC_C4_GIAONHAN_KIM,
} from "../../../services/quanlykimchi/QLKC_C4_GIAONHAN_KIMService";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";

const TableQLKC_C4_GIAONHAN_KIM = ({
  setVisible,
  setIsUpdate,
  setC4GIAONHANKIM,
  data,

  pageCount,
  setPage,
  setPageSize,
  page,
  pageSize,
  donvi,
  loadData,
  toast,
}) => {
  const rowsPerPageOptions = [5, 10, 25];
  const [isHide, setIsHide] = useState(false);
  const [id, setId] = useState();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isMultiDelete, setIsMultiDelete] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ten: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    trang_thai: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const trangThaiBodyTemplate = (rowData) => {
    if (!rowData || rowData.tranG_THAI === undefined) {
      return <span className="text-muted">Không xác định</span>;
    }

    switch (rowData.tranG_THAI) {
      case 0:
        return <span className="text-warning">Chờ xác nhận</span>;
      case 1:
        return <span className="text-info">Ký cấp 1</span>;
      case 2:
        return <span className="text-primary">Ký cấp 2</span>;
      case 3:
        return <span className="text-danger">Hủy</span>;
      default:
        return <span className="text-muted">Không xác định</span>;
    }
  };
  const LoaiBBChuyenDoi = (rowData) => {
    if (!rowData || rowData.loaI_BBAN === undefined) {
      return <span className="text-muted">Không xác định</span>;
    }

    switch (rowData.loaI_BBAN) {
      case 0:
        return <span className="text-warning">Mượn kìm</span>;
      case 1:
        return <span className="text-info">Trả kìm </span>;
    }
  };

  const getDonviName = (ma_dviqly) => {
    // Lấy dữ liệu từ sessionStorage
    const storedDonvi = JSON.parse(sessionStorage.getItem("ds_donvi"));

    if (storedDonvi) {
      const donvi = storedDonvi.find((item) => item.ma_dviqly === ma_dviqly);
      if (donvi) {
        return donvi.ten; // Trả về tên đơn vị
      } else {
        console.log(`Không tìm thấy đơn vị với mã: ${ma_dviqly}`);
        return "Không xác định";
      }
    } else {
      console.log("Không tìm thấy dữ liệu đơn vị trong sessionStorage.");
      return "Không xác định";
    }
  };

  const donviGiaoBodyTemplate = (rowData) => {
    return (
      <span>
        {rowData?.doN_VI_GIAO
          ? getDonviName(rowData.doN_VI_GIAO)
          : "Không có dữ liệu"}
      </span>
    );
  };

  // Body template cho cột Đơn vị nhận
  const donviNhanBodyTemplate = (rowData) => {
    // Kiểm tra rowData và gọi hàm getDonviName
    return (
      <span>
        {rowData?.doN_VI_NHAN
          ? getDonviName(rowData.doN_VI_NHAN)
          : "Không có dữ liệu"}
      </span>
    );
  };

  const confirm = async () => {
    setIsHide(false);
    console.log("id trước khi gọi API:", id);
    try {
      if (isMultiDelete) {
        await Promise.all(
          selectedRecords.map((record) =>
            delete_QLKC_C4_GIAONHAN_KIM(record.id)
          )
        );
        toast.current.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Xóa các bản ghi thành công",
          life: 3000,
        });
      } else {
        await delete_QLKC_C4_GIAONHAN_KIM(id);
        console.log("id before API call:", id);
        toast.current.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Xóa bản ghi thành công",
          life: 3000,
        });
      }
      loadData();
    } catch (err) {
      console.log(err);
      console.log("id before API call:", id);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Xóa bản ghi không thành công",
        life: 3000,
      });
    }
  };

  const cancel = () => {
    setIsHide(false);
  };
  // console.log("Bộ lọc DataTable:", filters);

  const buttonOption = (rowData) => {
    return (
      <div className="flex">
        <Button
          style={{ marginRight: "10px", backgroundColor: "#1445a7" }}
          icon="pi pi-pencil"
          tooltip="Sửa"
          tooltipOptions={{ position: "top" }}
          onClick={() => {
            setVisible(true); // Hiển thị modal
            setIsUpdate(true); // Đặt trạng thái cập nhật
            setC4GIAONHANKIM(rowData); // Cập nhật state
            console.log("Dữ liệu sửa:", rowData); // Kiểm tra dữ liệu
          }}
        />
        <Button
          icon="pi pi-trash"
          tooltip="Xóa"
          tooltipOptions={{ position: "top" }}
          style={{
            backgroundColor: "#1445a7",
            marginRight: "10px",
          }}
          onClick={() => {
            setIsHide(true);
            setId(rowData.id);
            setIsMultiDelete(false);
          }}
        />
        {rowData?.tranG_THAI === 0 && (
          <Button
            icon="pi pi-check"
            tooltip="Ký C1"
            tooltipOptions={{ position: "top" }}
            style={{
              marginRight: "10px",
              backgroundColor: "#28a745",
            }}
            onClick={() => {
              setActionType("Ký C1");
              setSelectedRecord(rowData);
              setIsConfirmVisible(true); // Hiển thị dialog xác nhận
            }}
          />
        )}

        {rowData?.tranG_THAI === 1 && (
          <Button
            icon="pi pi-check-circle"
            tooltip="Ký C2"
            tooltipOptions={{ position: "top" }}
            style={{
              marginRight: "10px",
              backgroundColor: "#ffc107",
              color: "#212529",
              border: "none",
            }}
            onClick={() => {
              setActionType("Ký C2");
              setSelectedRecord(rowData);
              setIsConfirmVisible(true); // Hiển thị dialog xác nhận
            }}
          />
        )}

        <Button
          icon="pi pi-ban"
          tooltip="Hủy"
          tooltipOptions={{ position: "top" }}
          style={{
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
          }}
          onClick={() => {
            setActionType("Hủy");
            setSelectedRecord(rowData);
            setIsConfirmVisible(true); // Hiển thị dialog xác nhận
          }}
        />

        <Button
          icon="pi pi-refresh"
          tooltip="Cập nhật loại biên bản"
          tooltipOptions={{ position: "top" }}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            marginLeft: "10px",
            border: "none",
          }}
          onClick={() => {
            setActionType("Cập nhật loại biên bản");
            setSelectedRecord(rowData);
            setIsConfirmVisible(true); // Hiển thị dialog xác nhận
          }}
        />
      </div>
    );
  };
  const headerTemplate = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`;
    return (
      <div className={className}>
        <span className="text-xl font-bold">Danh sách</span>
        <div className="flex flex-column sm:flex-row gap-3">
          {selectedRecords.length > 0 && (
            <Button
              label="Xóa nhiều"
              severity="danger"
              onClick={() => {
                setIsHide(true);
                setIsMultiDelete(true);
              }}
              disabled={!selectedRecords.length}
            />
          )}
          <Button
            label="Thêm mới"
            style={{ backgroundColor: "#1445a7" }}
            onClick={() => {
              setVisible(true);
              setIsUpdate(false);
            }}
          />
        </div>
      </div>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const showConfirm = (type, record) => {
    setActionType(type);
    setSelectedRecord(record);
    setIsConfirmVisible(true);
  };

  const confirmAction = async () => {
    setIsConfirmVisible(false);

    try {
      if (selectedRecord) {
        let response;
        switch (actionType) {
          case "Ký C1":
            response = await update_kyC1_PM_QLKC_C4_GIAONHAN_KIM(
              selectedRecord.id
            );
            console.log("API Response Ký C1:", response);
            if (response && response.data === "Ký thành công") {
              toast.current.show({
                severity: "success",
                summary: "Thông báo",
                detail: "Ký C1 thành công",
                life: 3000,
              });
              loadData();
            } else {
              toast.current.show({
                severity: "error",
                summary: "Thông báo",
                detail: "Ký C1 không thành công",
                life: 3000,
              });
            }
            break;
          case "Ký C2":
            response = await update_kyC2_PM_C4_GIAONHAN_KIM(selectedRecord.id);
            console.log("API Response Ký C2:", response);
            console.log(
              "Toàn bộ phản hồi Ký C2:",
              JSON.stringify(response, null, 2)
            );
            if (response && response.data.message === "Update successful") {
              toast.current.show({
                severity: "success",
                summary: "Thông báo",
                detail: "Ký C2 thành công",
                life: 3000,
              });
              loadData();
            } else {
              toast.current.show({
                severity: "error",
                summary: "Thông báo",
                detail: "Ký C2 không thành công",
                life: 3000,
              });
            }
            break;
          case "Hủy":
            response = await update_huyPM_QLKC_C4_GIAONHAN_KIM(
              selectedRecord.id
            );
            console.log("API Response Hủy:", response);
            if (response && response.data.message === "Update successful") {
              toast.current.show({
                severity: "success",
                summary: "Thông báo",
                detail: "Hủy thành công",
                life: 3000,
              });
              loadData();
            } else {
              toast.current.show({
                severity: "error",
                summary: "Thông báo",
                detail: "Hủy thất bại",
                life: 3000,
              });
            }
            break;
          case "Cập nhật loại biên bản":
            response = await update_loaiBBan_QLKC_C4_GIAONHAN_KIM(
              selectedRecord.id
            );
            console.log("API Response Cập nhật loại biên bản:", response);
            if (response && response.data.message === "Update successful") {
              toast.current.show({
                severity: "success",
                summary: "Thông báo",
                detail: "Cập nhật loại biên bản thành công",
                life: 3000,
              });
              loadData();
            } else {
              toast.current.show({
                severity: "error",
                summary: "Thông báo",
                detail: "Cập nhật loại biên bản không thành công",
                life: 3000,
              });
            }
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error("Error during action:", error);
      toast.current.show({
        severity: "error",
        summary: "Thông báo",
        detail: "Có lỗi xảy ra",
        life: 3000,
      });
    }
  };

  return (
    <>
      <Panel headerTemplate={headerTemplate}>
        <div className="flex justify-content-end mb-3">
          <span className="p-input-icon-left w-full md:w-auto">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Tìm kiếm"
              className="w-full md:w-auto"
            />
          </span>
        </div>
        <DataTable
          value={data}
          showGridlines
          stripedRows
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          rowkey="id"
          rows={pageSize}
          rowsPerPageOptions={[5, 10]}
          className="datatable-responsive"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          selection={selectedRecords}
          onSelectionChange={(e) => setSelectedRecords(e.value)}
          responsiveLayout="scroll"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{
              width: "3em",
              backgroundColor: "#1445a7",
              color: "#fff",
            }}
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="sO_LUONG_GIAO"
            header="Số lượng giao"
            className="min-w-10rem"
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="sO_LUONG_TRA"
            header="Số lượng trả"
            className="min-w-8rem"
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="sO_LUONG_THUHOI"
            header="Số lượng thu hồi"
            className="min-w-8rem"
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="loai"
            header="Loại"
            className="min-w-8rem"
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="donvI_TINH"
            header="Đơn vị tính"
            className="min-w-8rem"
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="doN_VI_GIAO"
            header="Đơn vị giao"
            body={donviGiaoBodyTemplate}
            className="min-w-8rem"
          />
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="doN_VI_NHAN"
            header="Đơn vị nhận"
            body={donviNhanBodyTemplate}
            className="min-w-8rem"
          />
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="nguoI_NHAN"
            header="Người nhận"
            className="min-w-8rem"
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="nguoI_GIAO"
            header="Người giao"
            className="min-w-8rem"
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ngaY_GIAO"
            header="Ngày giao"
            className="min-w-8rem"
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ngaY_NHAN"
            header="Ngày nhận"
            className="min-w-8rem"
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="tranG_THAI"
            header="Trạng thái"
            body={trangThaiBodyTemplate}
            className="min-w-8rem"
          />
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="loaI_BBAN"
            header="Loại biên bản "
            body={LoaiBBChuyenDoi}
            className="min-w-8rem"
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="noI_DUNG"
            header="Nội dung"
            className="min-w-8rem"
          ></Column>
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            body={buttonOption}
            header="Thao tác"
            className="min-w-8rem"
          ></Column>
        </DataTable>

        <div className="flex flex-column md:flex-row justify-content-between align-items-center gap-3 mt-4">
          <div className="flex align-items-center">
            <Button
              outlined
              text
              icon={PrimeIcons.ANGLE_DOUBLE_LEFT}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              severity="secondary"
            />
            <p className="mx-4 mb-0">
              Trang {page} trong tổng số {pageCount} trang
            </p>
            <Button
              outlined
              text
              severity="secondary"
              icon={PrimeIcons.ANGLE_DOUBLE_RIGHT}
              onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={page === pageCount}
            />
          </div>
          <Dropdown
            value={pageSize}
            options={rowsPerPageOptions}
            onChange={(e) => {
              setPageSize(e.value);
              setPage(1);
            }}
            placeholder="Select rows per page"
            className="w-full md:w-auto"
          />
        </div>
      </Panel>

      <Toast ref={toast} />
      <ConfirmDialog
        visible={isHide}
        onHide={() => setIsHide(false)}
        header="Xác nhận"
        message={
          isMultiDelete
            ? "Bạn có chắc chắn xóa các bản ghi này không?"
            : "Bạn có chắc chắn xóa bản ghi này không?"
        }
        icon="pi pi-info-circle"
        footer={
          <div>
            <Button
              severity="secondary"
              outlined
              label="Hủy"
              icon="pi pi-times"
              onClick={cancel}
            />
            <Button
              severity="danger"
              label="Đồng ý"
              icon="pi pi-check"
              onClick={confirm}
              autoFocus
            />
          </div>
        }
      >
        <div className="card flex flex-wrap gap-2 justify-content-center"></div>
      </ConfirmDialog>
      <ConfirmDialog
        visible={isConfirmVisible}
        onHide={() => setIsConfirmVisible(false)}
        header="Xác nhận"
        message={`Bạn có chắc chắn muốn ${actionType} không?`}
        icon="pi pi-info-circle"
        footer={
          <div>
            <Button
              label="Hủy"
              icon="pi pi-times"
              onClick={() => setIsConfirmVisible(false)}
            />
            <Button
              label="Đồng ý"
              icon="pi pi-check"
              onClick={confirmAction}
              autoFocus
            />
          </div>
        }
      />
    </>
  );
};

export default TableQLKC_C4_GIAONHAN_KIM;
