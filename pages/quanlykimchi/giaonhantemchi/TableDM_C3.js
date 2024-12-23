import React, { useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog } from "primereact/confirmdialog";
import { propSortAndFilter } from "../../../constants/propGlobal";

import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { delete_C3_GIAONHAN_TEMCHI, update_kyC1_PM_QLKC_C3_GIAONHAN_TEMCHI, update_kyC2_PM_C3_GIAONHAN_TEMCHI, update_huyPM_QLKC_C3_GIAONHAN_TEMCHI, update_LoaiBBan_QLKC_C3_GIAONHAN_TEMCHI} from "../../../services/quanlykimchi/QLKC_C3_GIAONHAN_TEMCHIService";

const TableDM_C3 = ({
    setVisible,
    setIsUpdate,
    setDanhMucC3,
    data,
    pageCount,
    setPage,
    setPageSize,
    page,
    pageSize,
    loadData,
    toast,
}) => {
    const rowsPerPageOptions = [5, 10, 25];
    const [isHide, setIsHide] = useState(false);
    const [id, setId] = useState();
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [isMultiDelete, setIsMultiDelete] = useState(false);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        don_vi_giao: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        nguoi_nhan: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        loai_bban: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        trang_thai: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    const confirm = async () => {
        setIsHide(false);
        try {
            if (isMultiDelete) {
                await Promise.all(selectedRecords.map(record => delete_C3_GIAONHAN_TEMCHI(record.id)));
                toast.current.show({
                    severity: "success",
                    summary: "Thông báo",
                    detail: "Xóa các bản ghi thành công",
                    life: 3000,
                });

            } else {
                await delete_C3_GIAONHAN_TEMCHI(id);
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
    const LoaiBBChuyenDoi = (rowData) => {
        if (!rowData || rowData.loai_bban=== undefined) {
            return <span className="text-muted">Không xác định</span>;
        }

        switch (rowData.loai_bban) {
            case 0:
                return <span className="text-warning">Mượn tem chì</span>;
            case 1:
                return <span className="text-info">Trả tem chì </span>
        }
    }

    const buttonOption = (rowData) => {
        return (
            <div className="flex">
                <Button
                    style={{ marginRight: "10px", backgroundColor: "#1445a7" }}
                    icon="pi pi-pencil"
                    tooltip="Sửa"
                    tooltipOptions={{ position: "top" }}
                    onClick={() => {
                        setVisible(true);
                        setIsUpdate(true);
                        setDanhMucC3(rowData);
                        console.log(rowData);
                    }}
                />

                <Button
                    icon="pi pi-trash"
                    tooltip="Xóa"
                    tooltipOptions={{ position: "top" }}
                    style={{
                        backgroundColor: "#1445a7",
                    }}
                    onClick={() => {
                        setIsHide(true);
                        setId(rowData.id);
                        setIsMultiDelete(false);
                    }}
                />

                {rowData?.trang_thai === 0 && (
                    <Button
                        icon="pi pi-check"
                        tooltip="Ký C1"
                        tooltipOptions={{ position: "top" }}
                        style={{
                            marginLeft: "10px",
                            backgroundColor: "#28a745",
                        }}
                        onClick={async () => {
                            try {
                                await update_kyC1_PM_QLKC_C3_GIAONHAN_TEMCHI(rowData.id);
                                toast.current.show({
                                    severity: "success",
                                    summary: "Thông báo",
                                    detail: "Ký C1 thành công",
                                    life: 3000,
                                });
                                loadData(); // Tải lại dữ liệu sau khi thành công
                            } catch (error) {
                                toast.current.show({
                                    severity: "error",
                                    summary: "Thông báo",
                                    detail: "Ký C1 thất bại",
                                    life: 3000,
                                });
                                console.error(error);
                            }
                        }}
                    />
                )}

                {rowData?.trang_thai === 1 && (
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
                        onClick={async () => {
                            try {
                                await update_kyC2_PM_C3_GIAONHAN_TEMCHI(rowData.id);
                                toast.current.show({
                                    severity: "success",
                                    summary: "Thông báo",
                                    detail: "Ký C2 thành công",
                                    life: 3000,
                                });
                                loadData();
                            } catch (error) {
                                toast.current.show({
                                    severity: "error",
                                    summary: "Thông báo",
                                    detail: "Ký C2 thất bại",
                                    life: 3000,
                                });
                                console.error(error);
                            }
                        }}
                    />
                )}

                <Button
                    icon="pi pi-ban"
                    tooltip="Hủy"
                    tooltipOptions={{ position: "top" }}
                    style={{
                        marginLeft: "10px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                    }}
                    onClick={async () => {
                        try {
                            await update_huyPM_QLKC_C3_GIAONHAN_TEMCHI(rowData.id);
                            toast.current.show({
                                severity: "success",
                                summary: "Thông báo",
                                detail: "Hủy thành công",
                                life: 3000,
                            });
                            loadData();
                        } catch (error) {
                            toast.current.show({
                                severity: "error",
                                summary: "Thông báo",
                                detail: "Hủy thất bại",
                                life: 3000,
                            });
                            console.error(error);
                        }
                    }}
                />

                <Button
                    icon="pi pi-refresh"
                    tooltip="Cập nhật loại biên bản "

                    tooltipOptions={{ position: "top" }}

                    style={{
                        backgroundColor: "#007bff",
                        color: "#fff",
                        marginLeft: "10px",
                        border: "none",
                    }}
                    onClick={async () => {
                        try {
                            await update_LoaiBBan_QLKC_C3_GIAONHAN_TEMCHI(rowData.id);
                            toast.current.show({
                                severity: "success",
                                summary: "Thông báo",
                                detail: "Trả kìm thành công",
                                life: 3000,
                            });
                            loadData();
                        } catch (error) {
                            toast.current.show({
                                severity: "error",
                                summary: "Thông báo",
                                detail: "Hủy thất bại",
                                life: 3000,
                            });
                            console.error(error);
                        }
                    }}

                />
            </div>
        );
    };

    const getDonviName = (ma_dviqly) => {
        // Lấy dữ liệu từ sessionStorage
        const storedDonvi = JSON.parse(sessionStorage.getItem("ds_donvi"));

        if (storedDonvi) {
            const donvi = storedDonvi.find(item => item.ma_dviqly === ma_dviqly);
            if (donvi) {
                return donvi.ten;  
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
        return <span>{rowData?.don_vi_giao? getDonviName(rowData.don_vi_giao) : "Không có dữ liệu"}</span>;
    };

    // Body template cho cột Đơn vị nhận
    const donviNhanBodyTemplate = (rowData) => {
    // Kiểm tra rowData và gọi hàm getDonviName
        return <span>{rowData?.don_vi_nhan? getDonviName(rowData.don_vi_nhan) : "Không có dữ liệu"}</span>;
    };


    const headerTemplate = (options) => {
        const className = `${options.className} flex flex-wrap justify-content-between align-items-center gap-2`
        return (
            <div className={className} >
                <span className='text-xl font-bold'>Danh sách</span>
                <div className="flex flex-column sm:flex-row gap-3">
                    {selectedRecords.length > 0 &&
                        <Button
                            label="Xóa nhiều"
                            severity="danger"
                            onClick={() => {
                                setIsHide(true);
                                setIsMultiDelete(true);
                            }}
                            disabled={!selectedRecords.length}
                        />
                    }
                    <Button
                        label="Thêm mới"
                        style={{ backgroundColor: '#1445a7' }}
                        onClick={() => {
                            setVisible(true);
                            setIsUpdate(false);
                        }}
                    />
                </div>
            </div>
        )
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters["global"].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
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
                    rowKey="id"
                    rows={pageSize}
                    rowsPerPageOptions={[5, 10]}
                    className="datatable-responsive"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    selection={selectedRecords}
                    onSelectionChange={(e) => setSelectedRecords(e.value)}
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3em', backgroundColor: '#1445a7', color: '#fff' }}></Column>

                    <Column
                        {...propSortAndFilter}
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="id"
                        header="ID"
                        className="min-w-8rem"
                    ></Column>

                    <Column
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="soluong"
                        header="Số lượng"
                        className="min-w-8rem"
                    ></Column>

                    <Column
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="loai"
                        header="Loại"
                        className="min-w-8rem"
                    ></Column>

                    <Column
                        {...propSortAndFilter}
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="donvi_tinh"
                        header="Đơn vị tính"
                        className="min-w-8rem"
                    ></Column>
                    
                    <Column
                        {...propSortAndFilter}
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="don_vi_giao"
                        header="Đơn vị giao"
                        body={donviGiaoBodyTemplate}
                        className="min-w-10rem"
                    ></Column>

                    <Column
                        {...propSortAndFilter}
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="don_vi_nhan"
                        header="Đơn vị nhận"
                        body={donviNhanBodyTemplate}
                        className="min-w-10rem"
                    ></Column>

                    <Column
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="nguoi_nhan" 
                        header="Người nhận"
                        className="min-w-8rem"
                    ></Column>

                    <Column
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="nguoi_giao" 
                        header="Người giao"
                        className="min-w-8rem"
                    ></Column>

                    <Column
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="loai_bban"
                        header="Loại biên bản"
                        body={LoaiBBChuyenDoi}
                        className="min-w-8rem"
                    ></Column>

                    <Column
                        {...propSortAndFilter}
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="ngay_giao"
                        header="Ngày giao"
                        className="min-w-8rem"
                    ></Column>

                    <Column
                        {...propSortAndFilter}
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="ngay_nhan"
                        header="Ngày nhận"
                        className="min-w-8rem"
                    ></Column>

                    <Column
                        {...propSortAndFilter}
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="trang_thai"
                        header="Trạng thái"
                        body={trangThaiBodyTemplate}
                        className="min-w-8rem"
                    />

                    <Column
                        {...propSortAndFilter}
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
                        field="loai_bban"
                        header="Loại biên bản"
                        body={trangThaiBodyTemplate}
                        className="min-w-8rem"
                    />

                    <Column
                        headerStyle={{ backgroundColor: '#1445a7', color: '#fff' }}
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
                message={isMultiDelete ? "Bạn có chắc chắn xóa các bản ghi này không?" : "Bạn có chắc chắn xóa bản ghi này không?"}
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
        </>
    );
};

export default TableDM_C3;
