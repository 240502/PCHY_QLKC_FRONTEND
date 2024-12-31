import { Panel } from "primereact/panel";
import { PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { propSortAndFilter } from "../../../constants/propGlobal";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog } from "primereact/confirmdialog";
import {
  cancel_QLKC_BBAN_BANGIAO_KIM,
  delete_QLKC_BBAN_BANGIAO_KIM,
  update_QLKC_BBAN_BANGIAO_KIMKyC1,
  update_QLKC_BBAN_BANGIAO_KIMKyC2,
} from "../../../services/quanlykimchi/BBAN_GIAO_KIMService";
import {
  D_KIMService,
  get_D_KIM_ById,
} from "../../../services/quanlykimchi/D_KIMService";
import { HT_NGUOIDUNG } from "../../../models/HT_NGUOIDUNG";
import { QLKC_BBAN_BANGIAO_KIM } from "../../../models/QLKC_BBAN_BANGIAO_KIM";
const arrLoaiBienBan = [
  { label: "Bàn giao", value: 0 },
  { label: "Nhận lại", value: 1 },
  { label: "Tất cả", value: 2 },
];
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
  handleOnClickKySoBtn,
  setOptions,
  options,
}) => {
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isMultiDelete, setIsMultiDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showConfirmCancelDialog, setShowConfirmCancelDialog] = useState(false);

  const [bienBan, setBienBan] = useState(QLKC_BBAN_BANGIAO_KIM);
  const rowPerPageOptions = [5, 10, 15];
  const [user, setUser] = useState(HT_NGUOIDUNG);
  const current_MADVIQLY = JSON.parse(
    sessionStorage.getItem("current_MADVIQLY")
  );
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  //Xử lý xóa bản ghi
  const acceptDelete = async () => {
    if (isMultiDelete) {
      selectedRecords.forEach(async (record, index) => {
        try {
          const res = await delete_QLKC_BBAN_BANGIAO_KIM(record.id_bienban);
          const kimId =
            record.id_kim.length === 1
              ? [Number(record.id_kim)]
              : record.id_kim.split(",").map((item) => Number(item));
          if (kimId.length > 1) {
            const dataUpdate = {
              ht_nguoidung_id: user.id,
              ma_dvigiao: "PA23",
              id_kim: null,
            };
            kimId.forEach((id) => {
              update_MA_DVIQLY_D_KIM({ ...dataUpdate, id_kim: id });
            });
          } else {
            update_MA_DVIQLY_D_KIM({ ...dataUpdate, id_kim: kimId });
          }
          setShowConfirmDialog(false);
          showToast("success", "Xóa thành công!");
        } catch (err) {
          setShowConfirmDialog(false);
          showToast("error", "Xóa không thành công!");
          console.log(err.message);
        }
        console.log(index + 1);
        console.log(selectedRecords.length);
        if (index + 1 === selectedRecords.length) {
          console.log("oke");
          loadData();
          setSelectedRecords([]);
        }
      });
    } else {
      try {
        const res = await delete_QLKC_BBAN_BANGIAO_KIM(bienBan?.id_bienban);
        const kimId =
          bienBan.id_kim.length === 1
            ? [Number(bienBan.id_kim)]
            : bienBan.id_kim.split(",").map((item) => Number(item));
        if (kimId.length > 1) {
          const dataUpdate = {
            ht_nguoidung_id: user.id,
            ma_dvigiao: "PA23",
            id_kim: null,
          };
          kimId.forEach((id) => {
            update_MA_DVIQLY_D_KIM({ ...dataUpdate, id_kim: id });
          });
        } else {
          update_MA_DVIQLY_D_KIM({ ...dataUpdate, id_kim: kimId });
        }
        setShowConfirmDialog(false);
        showToast("success", "Xóa thành công!");
        loadData();
      } catch (err) {
        setShowConfirmDialog(false);
        showToast("error", "Xóa không thành công!");
        console.log(err.message);
      }
    }
  };

  const rejectDelete = () => {
    setShowConfirmDialog(false);
  };

  // Gọi api hủy biên bản
  const rejectBienBan = async () => {
    try {
      console.log("bien ban", bienBan);
      const kimId =
        bienBan.id_kim.length === 1
          ? [Number(bienBan.id_kim)]
          : bienBan.id_kim.split(",").map((item) => Number(item));
      if (kimId.length > 1) {
        const dataUpdate = {
          ht_nguoidung_id: user.id,
          ma_dvigiao: "PA23",
          id_kim: null,
        };
        kimId.forEach((id) => {
          update_MA_DVIQLY_D_KIM({ ...dataUpdate, id_kim: id });
        });
      } else {
        update_MA_DVIQLY_D_KIM({ ...dataUpdate, id_kim: kimId });
      }
      const res = await cancel_QLKC_BBAN_BANGIAO_KIM(bienBan.id_bienban);
      showToast("success", "Cập nhập thành công!");
      loadData();
      setShowConfirmCancelDialog(false);
    } catch (err) {
      showToast("error", "Cập nhập không thành công!");
      setShowConfirmCancelDialog(false);

      console.log(err.message);
    }
  };
  const update_MA_DVIQLY_D_KIM = async (id_kim) => {
    try {
      const res = await D_KIMService.update_MA_DVIQLY(id_kim);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  //Render button in table
  const buttonOption = (rowData) => {
    return rowData.trang_thai !== 3 ? (
      <div className="flex">
        {rowData.trang_thai === 0 && current_MADVIQLY === "PA23" && (
          <>
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
                setBienBan(rowData);
                setIsMultiDelete(false);
              }}
            />
          </>
        )}

        {rowData.trang_thai === 1 && current_MADVIQLY === "PA23" && (
          <Button
            icon="pi pi-times"
            tooltip={"Hủy biên bản"}
            tooltipOptions={{ position: "top" }}
            style={{ marginRight: "10px", backgroundColor: "#1445a7" }}
            onClick={() => {
              setShowConfirmCancelDialog(true);
              setBienBan(rowData);
            }}
          />
        )}
        {console.log(
          rowData.trang_thai !== 0 &&
            (current_MADVIQLY !== "PA23" || current_MADVIQLY === "PA23")
        )}

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
            backgroundColor: "#1445a7",
          }}
          onClick={() => {
            console.log("on click");
            handleOnClickKySoBtn(rowData);
          }}
        ></Button>
      </div>
    ) : (
      <></>
    );
  };

  // Render title table
  const headerTemplate = (options) => {
    const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`;
    return (
      <>
        {current_MADVIQLY === "PA23" && (
          <div className={className}>
            <span className="text-xl font-bold">Danh sách</span>
            <div className="flex flex-column sm:flex-row gap-3">
              {selectedRecords.length > 0 && (
                <Button
                  label="Xóa nhiều"
                  severity="danger"
                  onClick={() => {
                    setShowConfirmDialog(true);
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
        )}
      </>
    );
  };
  useEffect(() => {
    handleFilterData(searchTerm);
  }, [searchTerm, data]);
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    setUser(user);
  }, []);
  const [kimArr, setKimArr] = useState([]);

  const getKimById = async (id_kim) => {
    console.log(id_kim);
    if (id_kim.length > 0) {
      const idKimArr = id_kim.split(",").map((item) => Number(item));
      const fetchData = async () => {
        const results = await Promise.all(
          idKimArr.map((item) => get_D_KIM_ById(item))
        );
        setKimArr(results);
      };
      fetchData();
    }
  };
  return (
    <>
      <Panel headerTemplate={headerTemplate}>
        <div className="flex justify-content-between mb-3">
          <div>
            <Dropdown
              value={options.loaiBienBan}
              options={arrLoaiBienBan}
              placeholder="Chọn loại biên bản"
              onChange={(e) => {
                setOptions({ ...options, loaiBienBan: e.value });
                setOptions({ ...options, loaiBienBan: e.value });
              }}
            />
          </div>
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
          rowkey="id_bienban"
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
            field="ten_pb"
            header="Đơn vị giao"
            className="min-w-10rem"
            body={(rowData) => rowData.ten_pb.toUpperCase()}
          ></Column>
          <Column
            {...propSortAndFilter}
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="ten_dv"
            header="Đơn vị nhận"
            className="min-w-10rem"
            body={(rowData) => rowData.ten_dv.toUpperCase()}
          ></Column>
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
                    <p>{rowData.ten_nguoi_giao}</p>
                    <p>Chưa ký</p>
                  </>
                );
              } else {
                return (
                  <div>
                    <p>{rowData.ten_nguoi_giao}</p>
                    <p>
                      Đã ký {new Date(rowData.ngay_giao).getDate()}-
                      {new Date(rowData.ngay_giao).getMonth()}-
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
            className="min-w-8rem"
            body={(rowData) => {
              if (rowData.trang_thai !== 2) {
                return (
                  <>
                    <p>{rowData.ten_nguoi_nhan}</p>
                    <p>Chưa ký</p>
                  </>
                );
              } else {
                return (
                  <div>
                    <p>{rowData.ten_nguoi_nhan}</p>
                    <p>
                      Đã ký {new Date(rowData.ngay_nhan).getDate()}-
                      {new Date(rowData.ngay_nhan).getMonth()}-
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
            sortable
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="so_luong"
            header="Số lượng"
            className="min-w-10rem"
          ></Column>
          <Column
            headerStyle={{ backgroundColor: "#1445a7", color: "#fff" }}
            field="id_kim"
            header="Mã kìm"
            className="min-w-10rem"
            body={(rowData) => {
              return rowData.id_kim;
            }}
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
      {/*  Confirm delete dialog */}
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

      <ConfirmDialog
        visible={showConfirmCancelDialog}
        onHide={() => setShowConfirmCancelDialog(false)}
        header="Xác nhận"
        message={"Bạn có chắc chắn hủy bản ghi này không?"}
        icon="pi pi-info-circle"
        footer={
          <div>
            <Button
              severity="secondary"
              outlined
              label="Hủy"
              icon="pi pi-times"
              onClick={() => setShowConfirmCancelDialog(false)}
            />
            <Button
              severity="danger"
              label="Đồng ý"
              icon="pi pi-check"
              onClick={rejectBienBan}
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
