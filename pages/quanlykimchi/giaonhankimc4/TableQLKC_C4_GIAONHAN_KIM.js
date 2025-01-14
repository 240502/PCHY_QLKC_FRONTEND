import React, { useState, useEffect, useRef } from "react";
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
  update_KIM_TRANGTHAI,
} from "../../../services/quanlykimchi/QLKC_C4_GIAONHAN_KIMService";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { D_KIMService } from "../../../services/quanlykimchi/D_KIMService";

const TableQLKC_C4_GIAONHAN_KIM = ({
  setVisible,
  setIsUpdate,
  setC4GIAONHANKIM,
  data,
  handleOnClickUpdateBtn,
  handleOpenModal,
  showToast,
  handleOnClickKySoBtn,
  pageCount,
  setPage,
  setPageSize,
  page,
  pageSize,
  donvi,
  loadData,
  toast,
  fetchD_KIMData,
  idToMaHieuMap,
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
  const [filterType, setFilterType] = useState("all");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ten: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    trang_thai: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const formatVietnameseDateTime = (dateString) => {
    if (!dateString) return "Chưa trả"; // Trả về chuỗi rỗng nếu không có giá trị
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };
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
    console.log("selectedRecord trước khi gọi API:", selectedRecord);

    try {
      if (isMultiDelete) {
        // Xử lý xóa nhiều
        if (!selectedRecords || selectedRecords.length === 0) {
          throw new Error("Không có bản ghi nào được chọn để xóa");
        }

        await Promise.all(
          selectedRecords.map((record) => {
            if (!record.id) {
              throw new Error("Bản ghi thiếu ID");
            }
            return delete_QLKC_C4_GIAONHAN_KIM(record.id);
          })
        );

        await Promise.all(
          selectedRecords.map((record) => {
            if (!record.iD_KIM) {
              console.warn("Bản ghi thiếu iD_KIM:", record);
              return;
            }
            return update_KIM_TRANGTHAI(record.iD_KIM, 0);
          })
        );

        toast.current.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Xóa các bản ghi thành công",
          life: 3000,
        });
      } else {
        // Xử lý xóa một bản ghi
        if (!selectedRecord || !selectedRecord.id) {
          throw new Error("Bản ghi không hợp lệ để xóa");
        }

        await delete_QLKC_C4_GIAONHAN_KIM(selectedRecord.id);

        if (selectedRecord.iD_KIM) {
          await update_KIM_TRANGTHAI(selectedRecord.iD_KIM, 0);
        }

        toast.current.show({
          severity: "success",
          summary: "Thông báo",
          detail: "Xóa bản ghi thành công",
          life: 3000,
        });
      }

      // Tải lại dữ liệu sau khi xóa
      loadData();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
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

  // const cancel = () => {
  //   setIsHide(false);
  // };
  // console.log("Bộ lọc DataTable:", filters);

  const buttonOption = (rowData) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const isPhongKinhDoanh = user && user.ten_phongban === "Phòng kinh doanh";
    const hasGiaoKiem = data.some(
      (record) => record && (record.tranG_THAI === 0 || record.tranG_THAI === 1)
    );
    return (
      <div className="flex">
        {isPhongKinhDoanh && rowData?.tranG_THAI !== 2 && (
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
        )}
        {rowData?.tranG_THAI !== 2 && isPhongKinhDoanh && (
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
              setSelectedRecord(rowData);

              setIsMultiDelete(false);
            }}
          />
        )}

        <Button
          icon={`pi ${rowData?.tranG_THAI !== 2 ? "pi-user-edit" : "pi-eye"} `}
          tooltip={rowData?.tranG_THAI !== 2 ? "Ký số" : "Xem chi tiết"}
          tooltipOptions={{ position: "top" }}
          style={{
            backgroundColor: "#1445a7",
            marginRight: 10,
          }}
          onClick={() => {
            handleOnClickKySoBtn(rowData);
            console.log("rowData", rowData);
          }}
        ></Button>

        {isPhongKinhDoanh && rowData?.tranG_THAI !== 2 && (
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
        )}

        {!isPhongKinhDoanh && rowData?.loaI_BBAN !== 1 &&  rowData?.tranG_THAI === 2  &&(
          <Button
            icon="pi pi-refresh"
            tooltip="Trả kìm"
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
        )}
      </div>
    );
  };
  const headerTemplate = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`;

    // Kiểm tra xem có bản ghi nào với trạng thái 0 hoặc 1 cho người giao không
    const hasGiaoKiem = data.some(
      (record) => record && (record.tranG_THAI === 0 || record.tranG_THAI === 1)
    );

    // Lấy thông tin người dùng từ session
    const user = JSON.parse(sessionStorage.getItem("user"));
    const isPhongKinhDoanh = user && user.ten_phongban === "Phòng kinh doanh";

    return (
      <div className={className}>
        <span className="text-xl font-bold">Danh sách</span>
        <div className="flex flex-column sm:flex-row gap-3">
          {isPhongKinhDoanh && selectedRecords.length > 0 && (
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
          {/* Hiển thị nút "Thêm mới" chỉ khi người dùng thuộc phòng "Phòng kinh doanh" */}
          {isPhongKinhDoanh && (
            <Button
              label="Thêm mới"
              style={{ backgroundColor: "#1445a7" }}
              onClick={() => {
                setVisible(true);
                setIsUpdate(false);
              }}
            />
          )}
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
            try {
              // Gọi API để hủy PM
              const response = await update_huyPM_QLKC_C4_GIAONHAN_KIM(
                selectedRecord.id
              );
              console.log("API Response Hủy:", response);

              if (response && response.data.message === "Update successful") {
                // Thông báo thành công
                toast.current.show({
                  severity: "success",
                  summary: "Thông báo",
                  detail: "Hủy thành công",
                  life: 3000,
                });

                // Gọi API để cập nhật trạng thái KIM
                const kimResponse = await update_KIM_TRANGTHAI(
                  selectedRecord.iD_KIM,
                  0
                );
                console.log("API Response KIM:", kimResponse);

                // Tải lại dữ liệu
                loadData();
              } else {
                toast.current.show({
                  severity: "error",
                  summary: "Thông báo",
                  detail: "Hủy thất bại",
                  life: 3000,
                });
              }
            } catch (error) {
              console.error("Error:", error);
              toast.current.show({
                severity: "error",
                summary: "Thông báo",
                detail: "Đã xảy ra lỗi trong quá trình xử lý",
                life: 3000,
              });
            }
            break;

          case "Cập nhật loại biên bản":
            response = await update_loaiBBan_QLKC_C4_GIAONHAN_KIM(
              selectedRecord.id
            );
            const kimResponse = await update_KIM_TRANGTHAI(
              selectedRecord.iD_KIM,
              0
            );
            console.log("API Response Cập nhật loại biên bản:", response);
            if (response && response.data.message === "Update successful") {
              toast.current.show({
                severity: "success",
                summary: "Thông báo",
                detail: "Trả kìm thành công",
                life: 3000,
              });
              loadData();
            } else {
              toast.current.show({
                severity: "error",
                summary: "Thông báo",
                detail: "Trả kìm không thành công",
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

  useEffect(() => {
    fetchD_KIMData();
  }, []);

  // Function to get ma_hieu from id_kim
  const getMaHieuFromId = (id) => idToMaHieuMap[id] || "Unknown";
  const maKimBodyTemplate = (rowData) => {
    if (!rowData || !rowData.iD_KIM) {
      return <span className="text-muted">Không xác định</span>;
    }
    if (rowData.iD_KIM.length > 2) {
      const maHieuList = rowData.iD_KIM.split(",").map((id) => {
        const idNumer = Number(id);
        return getMaHieuFromId(idNumer);
      });
      console.log("maHieuList", maHieuList.join(", "));
      return maHieuList.join(", ");
    } else {
      console.log("idToMaHieuMap", idToMaHieuMap);
      console.log(
        "getMaHieuFromId(rowData.iD_KIM)",
        getMaHieuFromId(rowData.iD_KIM)
      );
      return getMaHieuFromId(rowData.iD_KIM);
    }
    // Convert iD_KIM (comma-separated string) to ma_hieu
  };

  const tenNguoiGiaoBodyTemplate = (rowData) => {
    if (!rowData || rowData.tranG_THAI === undefined) {
      return (
        <>
          {rowData?.ten_nguoi_giao || "Không xác định"}{" "}
          <p style={{ color: "red",fontWeight:700 }}>Chưa ký</p>
        </>
      );
    }
    if (rowData.tranG_THAI === 1 || rowData.tranG_THAI === 2) {
      return (
        <>
          {rowData.ten_nguoi_giao}{" "}
          <p style={{ color: "green",fontWeight:700 }}>Đã ký</p>
        </>
      );
    } else if (rowData.tranG_THAI === 0) {
      return (
        <>
          {rowData.ten_nguoi_giao}{" "}
          <p style={{ color: "red",fontWeight:700 }}>Chưa ký</p>
        </>
      );
    } else if (rowData.tranG_THAI === 3) {
      return (
        <>
          {rowData.ten_nguoi_giao}{" "}
          <p style={{ color: "gray",fontWeight:700 }}>Đã hủy</p>
        </>
      );
    }
    return rowData.ten_nguoi_giao; // Default case
  };
  
  const tenNguoiNhanBodyTemplate = (rowData) => {
    if (!rowData || rowData.tranG_THAI === undefined) {
      return (
        <>
          {rowData?.ten_nguoi_nhan || "Không xác định"}{" "}
          <p style={{ color: "red",fontWeight:700 }}>Chưa ký</p>
        </>
      );
    }
    if (rowData.tranG_THAI === 2) {
      return (
        <>
          {rowData.ten_nguoi_nhan}{" "}
          <p style={{ color: "green",fontWeight:700 }}>Đã ký</p>
        </>
      );
    } else if (rowData.tranG_THAI === 0 || rowData.tranG_THAI === 1) {
      return (
        <>
          {rowData.ten_nguoi_nhan}{" "}
          <p style={{ color: "red",fontWeight:700 }}>Chưa ký</p>
        </>
      );
    } else if (rowData.tranG_THAI === 3) {
      return (
        <>
          {rowData.ten_nguoi_nhan}{" "}
          <p style={{ color: "gray",fontWeight:700 }}>Đã hủy</p>
        </>
      );
    }
    return rowData.ten_nguoi_nhan; // Default case
  };
  
  // Hàm lọc dữ liệu dựa trên loại biên bản
  const filteredData = data.filter((record) => {
    if (filterType === "0") return record.loaI_BBAN === 0; // Mượn kìm
    if (filterType === "1") return record.loaI_BBAN === 1; // Trả kìm
    return true; // Tất cả
  });
  const filterOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Mượn kìm", value: "0" },
    { label: "Trả kìm", value: "1" },
  ];

  return (
    <>
      <Panel headerTemplate={headerTemplate}>
        <div className="flex justify-between items-center mb-3">
          {/* Bên trái: Dropdown và các thành phần khác */}
          <div className="flex items-center">
            <Dropdown
              value={filterType}
              options={filterOptions}
              onChange={(e) => setFilterType(e.value)}
              placeholder="Chọn loại biên bản"
              className="mr-2"
            />
            {/* Các thành phần khác có thể thêm ở đây */}
          </div>

          {/* Bên phải: Nút tìm kiếm */}
          <div className="p-input-icon-left" style={{ marginLeft: "727px" }}>
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Tìm kiếm"
              className="w-full md:w-auto"
            />
          </div>
        </div>

        <DataTable
  value={filteredData}
  showGridlines
  stripedRows
  filters={filters}
  onFilter={(e) => setFilters(e.filters)}
  rowKey="id"
  rows={pageSize}
  rowsPerPageOptions={[5, 10]}
  className="datatable-responsive"
  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
  selection={selectedRecords}
  onSelectionChange={(e) => setSelectedRecords(e.value)}
  responsiveLayout="scroll"
  rowClassName={(rowData) => {

const ngayTra = new Date(rowData?.ngaY_TRA);
const ngayGiao = new Date(rowData?.ngaY_GIAO);
const diffHours = (ngayTra - ngayGiao) / (1000 * 60 * 60);

console.log("Ngày giao:", ngayGiao, "Ngày trả:", ngayTra, "diffHours:", diffHours);

// Log chi tiết để kiểm tra điều kiện
if (diffHours > 24) {
  console.log("Class applied: p-row-danger");
  return "bg-red-200 ";
} else {
  console.log("Class applied: p-row-success");
  return "";
}
}}

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
            field="iD_KIM"
            header="Mã kìm"
            body={maKimBodyTemplate}
            className="min-w-10rem"
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_nguoi_giao"
            header="Người giao"
            body={tenNguoiGiaoBodyTemplate}
            className="min-w-8rem"
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_nguoi_nhan"
            header="Người nhận"
            body={tenNguoiNhanBodyTemplate}
            className="min-w-8rem"
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
            field="ngaY_TRA"
            header="Ngày trả"
            className="min-w-8rem"
            body={(rowData) =>
              formatVietnameseDateTime(rowData?.ngaY_TRA || "")
            }
          ></Column>
          {/* check trạng thái  */}
          {/* <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="tranG_THAI"
            header="Trạng thái"
            body={trangThaiBodyTemplate}
            className="min-w-8rem"
          /> */}
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
        message={
        <>
            <div>Bạn có chắc chắn muốn {actionType} với các mã kìm:</div>
            {selectedRecord && selectedRecord.iD_KIM && selectedRecord.iD_KIM.split(",").map((id) => (
                <div key={id}>
                    <input
                        type="checkbox"
                        value={id}
                        // onChange={handleCheckboxChange}
                        checked={selectedRecords.includes(id)}
                    />
                    {getMaHieuFromId(Number(id))} {/* Giả sử bạn có hàm này để lấy mã hiệu từ ID */}
                </div>
            ))}
        </>
    }
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
