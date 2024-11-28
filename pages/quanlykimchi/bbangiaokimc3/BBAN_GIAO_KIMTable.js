import { Panel } from "primereact/panel";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { propSortAndFilter } from "../../../constants/propGlobal";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  delete_QLKC_BBAN_BANGIAO_KIM,
  update_QLKC_BBAN_BANGIAO_KIMKyC1,
  update_QLKC_BBAN_BANGIAO_KIMKyC2,
  update_QLKC_BBAN_BANGIAO_KIMTraLai,
} from "../../../services/quanlykimchi/BBAN_GIAO_KIMService";
const BBAN_GIAO_KIMTable = ({
  data,
  pageCount,
  pageSize,
  pageIndex,
  setPageSize,
  setPageIndex,
  handleFilterData,
  filteredArr,
  handleOnClickUpdateBtn,
  handleOpenModal,
  showToast,
  loadData,
}) => {
  useEffect(() => {
    console.log(data);
  }, []);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isMultiDelete, setIsMultiDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [id, setId] = useState();
  const rowPerPageOptions = [5, 10, 15];
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const acceptDelete = async () => {
    try {
      const res = await delete_QLKC_BBAN_BANGIAO_KIM(id);
      setShowConfirmDialog(false);
      showToast("success", "Xóa thành công!");
      loadData();
    } catch (err) {
      setShowConfirmDialog(false);
      showToast("error", "Xóa không thành công!");
      console.log(err.message);
    }
  };

  const rejectDelete = () => {
    setShowConfirmDialog(false);
  };
  const signBienBan = async (id, signType) => {
    if (signType === "C1") {
      signC1(id);
    } else {
      signC2(id);
    }
  };
  const signC1 = async (id) => {
    try {
      const res = await update_QLKC_BBAN_BANGIAO_KIMKyC1(id);
      console.log(res);
      showToast("success", "Ký thành công!");
      loadData();
    } catch (err) {
      showToast("error", "Ký không thành công!");
      console.log(err.message);
    }
  };
  const signC2 = async (id) => {
    try {
      const res = await update_QLKC_BBAN_BANGIAO_KIMKyC2(id);
      console.log(res);
      showToast("success", "Ký thành công!");
      loadData();
    } catch (err) {
      showToast("error", "Ký không thành công!");
      console.log(err.message);
    }
  };
  const rejectBienBan = async (id) => {
    try {
      const res = await update_QLKC_BBAN_BANGIAO_KIMTraLai(id);
      showToast("success", "Cập nhập thành công!");
      loadData();
    } catch (err) {
      showToast("error", "Cập nhập không thành công!");
      console.log(err.message);
    }
  };
  const buttonOption = (rowData) => {
    return (
      <div className="flex">
        {/* <Button
          style={{ marginRight: "10px", backgroundColor: "#1445a7" }}
          icon={PrimeIcons.EYE}
          tooltip="Xem chi tiết"
          tooltipOptions={{ position: "top" }}
          onClick={() => {
            handleOnClickViewBtn(rowData);
          }}
        /> */}
        <Button
          style={{ marginRight: "10px", backgroundColor: "#1445a7" }}
          icon="pi pi-pencil"
          tooltip="Sửa"
          tooltipOptions={{ position: "top" }}
          onClick={() => {
            console.log("rowData", rowData);
            handleOnClickUpdateBtn(rowData);
          }}
        />
        <Button
          icon="pi pi-trash"
          tooltip="Xóa"
          tooltipOptions={{ position: "top" }}
          style={{ marginRight: "10px", backgroundColor: "#1445a7" }}
          onClick={() => {
            setShowConfirmDialog(true);
            setId(rowData.iD_BIENBAN);
            setIsMultiDelete(false);
          }}
        />
        <Button
          icon="pi pi-user-edit"
          tooltip="Ký cấp 1"
          tooltipOptions={{ position: "top" }}
          style={{ marginRight: "10px", backgroundColor: "#1445a7" }}
          onClick={() => {
            signBienBan(rowData.iD_BIENBAN, "C1");
          }}
        />
        <Button
          icon="pi pi-user-edit"
          tooltip="Ký cấp 2"
          tooltipOptions={{ position: "top" }}
          style={{ marginRight: "10px", backgroundColor: "#1445a7" }}
          onClick={() => {
            signBienBan(rowData.iD_BIENBAN, "C2");
          }}
        />
        <Button
          icon="pi pi-user-edit"
          tooltip="Trả lại"
          tooltipOptions={{ position: "top" }}
          style={{
            backgroundColor: "#1445a7",
          }}
          onClick={() => {
            rejectBienBan(rowData.iD_BIENBAN);
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
              handleOpenModal();
              // setIsUpdate(false);
            }}
          />
        </div>
      </div>
    );
  };
  useEffect(() => {
    handleFilterData(searchTerm);
  }, [searchTerm, data]);
  return (
    <>
      <Panel headerTemplate={headerTemplate}>
        <div className="flex justify-content-end mb-3">
          <span className="p-input-icon-left w-full md:w-auto">
            <i className="pi pi-search" />
            <InputText
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm"
              className="w-full md:w-auto"
            />
          </span>
        </div>
        <DataTable
          value={filteredArr}
          showGridlines
          stripedRows
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
            field="nguoI_GIAO"
            header="Người giao"
            className="min-w-10rem"
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="nguoI_NHAN"
            header="Người nhận"
            className="min-w-8rem"
          ></Column>
          <Column
            sortable
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="sO_LUONG"
            header="Số lượng"
            className="min-w-10rem"
          ></Column>
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="trang_thai"
            header="Trạng thái"
            body={(rowData) => {
              if (rowData.tranG_THAI === 0) {
                return "Soạn thảo";
              }
              if (rowData.tranG_THAI === 1) {
                return "Ký cấp 1";
              }
              if (rowData.tranG_THAI === 2) {
                return "Ký cấp 2";
              }
              if (rowData.tranG_THAI === 3) {
                return "Bị hủy";
              }
            }}
            className="min-w-8rem"
          ></Column>
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            body={buttonOption}
            header="Thao tác"
            className="min-w-8rem"
          ></Column>
        </DataTable>

        <div className="flex flex-column md:flex-row justify-content-center align-items-center gap-3 mt-4">
          <div className="flex align-items-center">
            <Button
              outlined
              text
              icon={PrimeIcons.ANGLE_DOUBLE_LEFT}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={pageIndex === 1}
              severity="secondary"
            />
            <p className="mx-4 mb-0">
              Trang {pageIndex} trong tổng số {pageCount} trang
            </p>
            <Button
              outlined
              text
              severity="secondary"
              icon={PrimeIcons.ANGLE_DOUBLE_RIGHT}
              onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={pageIndex === pageCount}
            />
          </div>
          <Dropdown
            value={pageSize}
            options={rowPerPageOptions}
            onChange={(e) => {
              setPageSize(e.value);
              setPageIndex(1);
            }}
            placeholder="Select rows per page"
            className="w-full md:w-auto"
          />
        </div>
      </Panel>

      {/* <Toast ref={toast} /> */}
      <ConfirmDialog
        visible={showConfirmDialog}
        onHide={() => setShowConfirmDialog(false)}
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
              onClick={rejectDelete}
            />
            <Button
              severity="danger"
              label="Đồng ý"
              icon="pi pi-check"
              onClick={acceptDelete}
              autoFocus
            />
          </div>
        }
      >
        <div className="card flex flex-wrap gap-2 justify-content-center"></div>
      </ConfirmDialog>
    </>
  );
};

export default BBAN_GIAO_KIMTable;
