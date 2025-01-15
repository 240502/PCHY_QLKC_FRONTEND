import React, { useState, useRef } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog } from "primereact/confirmdialog";
import { propSortAndFilter } from "../../../constants/propGlobal";

import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import {
  delete_QLKC_C3_GIAONHAN_TEMCHI,
  update_kyC1_PM_C3_GIAONHAN_TEMCHI,
  update_kyC2_PM_C3_GIAONHAN_TEMCHI,
  update_huyPM_C3_GIAONHAN_TEMCHI,
} from "../../../services/quanlykimchi/QLKC_C3_GIAONHAN_TEMCHIService";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";

import { HT_NGUOIDUNG } from "../../../models/HT_NGUOIDUNG";

export const TableDM_C3 = ({
  setVisible,
  setIsUpdate,
  setGiaoNhanTemChi,
  data,
  pageCount,
  setPage,
  setPageSize,
  page,
  pageSize,
  loadData,
  toast,
  handleOnClickKySoBtn,
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

  const [user, setUser] = useState(HT_NGUOIDUNG);

  const current_MADVIQLY = JSON.parse(
    sessionStorage.getItem("current_MADVIQLY")
  );

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ten: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    trang_thai: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const trangThaiBodyTemplate = (rowData) => {
    if (!rowData || rowData.trang_thai === undefined) {
      return <span className="text-muted">Không xác định</span>;
    }

    switch (rowData.trang_thai) {
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

  // const LoaiBBChuyenDoi = (rowData) => {
  //   if (!rowData || rowData.loai_bban === undefined) {
  //     return <span className="text-muted">Không xác định</span>;
  //   }

  //   switch (rowData.loai_bban) {
  //     case 0:
  //       return <span className="text-warning">Mượn kìm</span>;
  //     case 1:
  //       return <span className="text-info">Trả kìm </span>;
  //   }
  // };

  // const getDonviName = (ma_dviqly) => {
  //   // Lấy dữ liệu từ sessionStorage
  //   const storedDonvi = JSON.parse(sessionStorage.getItem("ds_donvi"));

  //   if (storedDonvi) {
  //     const donvi = storedDonvi.find((item) => item.ma_dviqly === ma_dviqly);
  //     if (donvi) {
  //       return donvi.ten; // Trả về tên đơn vị
  //     } else {
  //       console.log(`Không tìm thấy đơn vị với mã: ${ma_dviqly}`);
  //       return "Không xác định";
  //     }
  //   } else {
  //     console.log("Không tìm thấy dữ liệu đơn vị trong sessionStorage.");
  //     return "Không xác định";
  //   }
  // };

  // const donviGiaoBodyTemplate = (rowData) => {
  //   return (
  //     <span>
  //       {rowData?.don_vi_giao
  //         ? getDonviName(rowData.don_vi_giao)
  //         : "Không có dữ liệu"}
  //     </span>
  //   );
  // };

  // Body template cho cột Đơn vị nhận
  // const donviNhanBodyTemplate = (rowData) => {
  //   // Kiểm tra rowData và gọi hàm getDonviName
  //   return (
  //     <span>
  //       {rowData?.don_vi_nhan
  //         ? getDonviName(rowData.don_vi_nhan)
  //         : "Không có dữ liệu"}
  //     </span>
  //   );
  // };

  const confirm = async () => {
    setIsHide(false);
    console.log("id trước khi gọi API:", id);
    try {
      if (isMultiDelete) {
        await Promise.all(
          selectedRecords.map((record) =>
            delete_QLKC_C3_GIAONHAN_TEMCHI(record.id)
          )
        );
        toast.current.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Xóa các bản ghi thành công",
          life: 3000,
        });
      } else {
        await delete_QLKC_C3_GIAONHAN_TEMCHI(id);
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

  const buttonOption = (rowData) => {
    return (
      <div className="flex">
        <Button
          style={{
            marginRight: "10px",
            backgroundColor: "#1445a7",
            padding: "5px",
            fontSize: "3px",
            height: "37px",
            width: "37px",
          }}
          icon="pi pi-pencil"
          tooltip="Sửa"
          tooltipOptions={{ position: "top" }}
          onClick={() => {
            setVisible(true); // Hiển thị modal
            setIsUpdate(true); // Đặt trạng thái cập nhật
            setGiaoNhanTemChi(rowData); // Cập nhật state
            console.log("Dữ liệu sửa:", rowData);
          }}
        />

        <Button
          icon="pi pi-trash"
          tooltip="Xóa"
          tooltipOptions={{ position: "top" }}
          style={{
            backgroundColor: "#1445a7",
            borderColor: "#1445a7",
            marginRight: "10px",
            fontSize: "3px",
            height: "37px",
            width: "37px",
          }}
          onClick={() => {
            setIsHide(true);
            setId(rowData.id);
            setIsMultiDelete(false);
          }}
        />

        {/* {rowData?.trang_thai === 0 && (
          <Button
            icon="pi pi-check"
            tooltip="Ký giao"
            tooltipOptions={{ position: "top" }}
            style={{ backgroundColor: "#28a745",  borderColor: "#28a745", marginRight: "10px", fontSize: "3px", height: "37px", width: "37px" }}
            onClick={() => {
              setActionType("Ký giao");
              setSelectedRecord(rowData);
              setIsConfirmVisible(true); // Hiển thị dialog xác nhận
            }}
          />
        )}

        {rowData?.trang_thai === 1 && (
          <Button
            icon="pi pi-check-circle"
            tooltip="Ký nhận"
            tooltipOptions={{ position: "top" }}
            style={{ backgroundColor: "#ffc107", borderColor: "#ffc107", marginRight: "10px", fontSize: "3px", height: "37px", width: "37px" }}
            onClick={() => {
              setActionType("Ký nhận");
              setSelectedRecord(rowData);
              setIsConfirmVisible(true); // Hiển thị dialog xác nhận
            }}
          />
        )}

        <Button
          icon="pi pi-ban"
          tooltip="Hủy"
          tooltipOptions={{ position: "top" }}
          style={{ backgroundColor: "#dc3545", borderColor: "#dc3545",color: "#fff", marginRight: "10px", fontSize: "3px", height: "37px", width: "37px" }}
          onClick={() => {
            setActionType("Hủy");
            setSelectedRecord(rowData);
            setIsConfirmVisible(true);
          }}
        /> */}

        <Button
          icon={`pi ${
            (rowData.trang_thai === 0 && current_MADVIQLY === "PA23") ||
            (current_MADVIQLY !== "PA23" && rowData.trang_thai === 1)
              ? "pi-user-edit"
              : "pi-eye"
          } `}
          tooltip={
            (rowData.trang_thai === 0 && current_MADVIQLY === "PA23") ||
            (current_MADVIQLY !== "PA23" && rowData.trang_thai === 1)
              ? "Ký số"
              : "Xem chi tiết"
          }
          tooltipOptions={{ position: "top" }}
          style={{
            backgroundColor: "#485479",
            color: "#fff",
            marginRight: "10px",
            fontSize: "3px",
            height: "37px",
            width: "37px",
          }}
          onClick={() => {
            console.log("on click");
            handleOnClickKySoBtn(rowData);
          }}
        ></Button>
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
          case "Ký giao":
            response = await update_kyC1_PM_C3_GIAONHAN_TEMCHI(
              selectedRecord.id
            );
            console.log("API Response Ký giao:", response);
            if (response && response.data === "Ký thành công") {
              toast.current.show({
                severity: "success",
                summary: "Thông báo",
                detail: "Ký giao thành công",
                life: 3000,
              });
              loadData();
            } else {
              toast.current.show({
                severity: "error",
                summary: "Thông báo",
                detail: "Ký giao không thành công",
                life: 3000,
              });
            }
            break;
          case "Ký nhận":
            response = await update_kyC2_PM_C3_GIAONHAN_TEMCHI(
              selectedRecord.id
            );
            console.log("API Response Ký nhận:", response);
            console.log(
              "Toàn bộ phản hồi Ký nhận:",
              JSON.stringify(response, null, 2)
            );
            if (response && response.data.message === "Update successful") {
              toast.current.show({
                severity: "success",
                summary: "Thông báo",
                detail: "Ký nhận thành công",
                life: 3000,
              });
              loadData();
            } else {
              toast.current.show({
                severity: "error",
                summary: "Thông báo",
                detail: "Ký nhận không thành công",
                life: 3000,
              });
            }
            break;
          case "Hủy":
            response = await update_huyPM_C3_GIAONHAN_TEMCHI(selectedRecord.id);
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

  // Thêm hàm format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Thêm 7 tiếng để điều chỉnh múi giờ
    date.setHours(date.getHours() + 7);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Cập nhật template cho cột ngày giao
  const ngayGiaoTemplate = (rowData) => {
    return formatDate(rowData.ngay_giao);
  };

  // Cập nhật template cho cột ngày nhận
  const ngayNhanTemplate = (rowData) => {
    return formatDate(rowData.ngay_nhan);
  };

  const tenNguoiGiaoBodyTemplate = (rowData) => {
    if (!rowData || rowData.trang_thai === undefined) {
      return `${rowData?.ten_nguoi_giao || "Không xác định"} (Chưa ký)`;
    }
    if (rowData.trang_thai === 1 || rowData.trang_thai === 2) {
      return `${rowData.ten_nguoi_giao} (Đã ký)`;
    } else if (rowData.trang_thai === 0) {
      return `${rowData.ten_nguoi_giao} (Chưa ký)`;
    } else if (rowData.trang_thai === 3) {
      return `${rowData.ten_nguoi_giao} (Đã hủy)`;
    }
    return rowData.ten_nguoi_giao; // Default case
  };

  const tenNguoiNhanBodyTemplate = (rowData) => {
    if (!rowData || rowData.trang_thai === undefined) {
      return `${rowData?.ten_nguoi_nhan || "Không xác định"} (Chưa ký)`;
    }
    if (rowData.trang_thai === 2) {
      return `${rowData.ten_nguoi_nhan} (Đã ký)`;
    } else if (rowData.trang_thai === 0 || rowData.trang_thai === 1) {
      return `${rowData.ten_nguoi_nhan} (Chưa ký)`;
    } else if (rowData.trang_thai === 3) {
      return `${rowData.ten_nguoi_nhan} (Đã hủy)`;
    }
    return rowData.ten_nguoi_nhan; // Default case
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
          sortField="ngay_giao"
          sortOrder={-1}
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
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            body={buttonOption}
            header="Thao tác"
            className="min-w-8rem"
          ></Column>

          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_pb"
            header="Đơn vị giao"
            className="min-w-8rem"
          />

          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_dv"
            header="Đơn vị nhận"
            className="min-w-8rem"
          />

          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_nguoi_giao"
            header="Người giao"
            className="min-w-10rem"
            body={(rowData) => {
              if (rowData.trang_thai === 0) {
                return (
                  <>
                    <p style={{ fontSize: "15px" }}>{rowData.ten_nguoi_giao}</p>
                    <p style={{ color: "red", fontSize: "12px" }}>Chưa ký</p>
                  </>
                );
              } else {
                return (
                  <div>
                    <p style={{ fontSize: "15px" }}>{rowData.ten_nguoi_giao}</p>
                    <p style={{ color: "green", fontSize: "12px" }}>
                      Đã ký {new Date(rowData.ngay_giao).getDate()}-
                      {new Date(rowData.ngay_giao).getMonth() + 1}-
                      {new Date(rowData.ngay_giao).getFullYear()}{" "}
                      {new Date(rowData.ngay_giao).getHours()}:
                      {new Date(rowData.ngay_giao).getMinutes()}:
                      {new Date(rowData.ngay_giao).getSeconds()}
                    </p>
                  </div>
                );
              }
            }}
          ></Column>

          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_nguoi_nhan"
            header="Người nhận"
            className="min-w-10rem"
            body={(rowData) => {
              if (rowData.trang_thai !== 2) {
                return (
                  <>
                    <p style={{ fontSize: "15px" }}>{rowData.ten_nguoi_nhan}</p>
                    <p style={{ color: "red", fontSize: "12px" }}>Chưa ký</p>
                  </>
                );
              } else {
                return (
                  <div>
                    <p style={{ fontSize: "15px" }}>{rowData.ten_nguoi_nhan}</p>
                    <p style={{ color: "green", fontSize: "12px" }}>
                      Đã ký {new Date(rowData.ngay_nhan).getDate()}-
                      {new Date(rowData.ngay_nhan).getMonth() + 1}-
                      {new Date(rowData.ngay_nhan).getFullYear()}{" "}
                      {new Date(rowData.ngay_nhan).getHours()}:
                      {new Date(rowData.ngay_nhan).getMinutes()}:
                      {new Date(rowData.ngay_nhan).getSeconds()}
                    </p>
                  </div>
                );
              }
            }}
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
            field="soluong"
            header="Số lượng"
            className="min-w-8rem"
          ></Column>

          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="donvi_tinh"
            header="Đơn vị tính"
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
              {" "}
              Trang {page} trong tổng số {pageCount} trang{" "}
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
