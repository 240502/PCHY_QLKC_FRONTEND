import React, { useEffect, useRef, useState } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Timeline } from "primereact/timeline";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";
import { HT_NGUOIDUNG } from "../../../models/HT_NGUOIDUNG";
import { updateNguoiNhan } from "../../../services/quanlykimchi/BBAN_GIAO_KIMService";
import { Button } from "primereact/button";
import { D_KIMService } from "../../../services/quanlykimchi/D_KIMService";

import {
  update_kyC1_PM_C3_GIAONHAN_TEMCHI,
  update_kyC2_PM_C3_GIAONHAN_TEMCHI,
} from "../../../services/quanlykimchi/QLKC_C3_GIAONHAN_TEMCHIService";
const BienBanViewer = ({
  giaoNhanTemChi,
  visible,
  handleCloseModalViewer,
  showToast,
  setBienBan,
  loadData,
}) => {
  const [users, setUsers] = useState([HT_NGUOIDUNG]);
  const [events, setEvents] = useState([
    {
      status: "Ký cấp 1",
      user: "Nguyễn Khánh Huyền",
    },
    {
      status: "Ký cấp 2",
      user: "Nguyễn Khánh Huyền",
    },
  ]);

  const current_MADVIQLY = JSON.parse(
    sessionStorage.getItem("current_MADVIQLY")
  );
  const signC1 = async (id) => {
    try {
      const res = await update_kyC1_PM_C3_GIAONHAN_TEMCHI(giaoNhanTemChi.id);
      showToast("success", "Ký thành công!");
      // getBienBanById(id);
      loadData();
      handleCloseModalViewer();
    } catch (err) {
      showToast("error", "Ký không thành công!");
      console.log(err.message);
    }
  };

  const signC2 = async (id) => {
    try {
      const res = await update_kyC2_PM_C3_GIAONHAN_TEMCHI(giaoNhanTemChi.id);
      console.log(res);
      showToast("success", "Ký thành công!");
      // getBienBanById(id);
      loadData();
      handleCloseModalViewer();
    } catch (err) {
      showToast("error", "Ký không thành công!");
      console.log(err.message);
    }
  };

  useEffect(() => {
    const getHT_NGUOIDUNGByMA_DVIQLY = async () => {
      try {
        const data = { ma_dviqly: giaoNhanTemChi.don_vi_nhan };
        const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY(data);
        setUsers(res);
      } catch (e) {
        console.log(e);
      }
    };

    getHT_NGUOIDUNGByMA_DVIQLY();
  }, []);

  useEffect(() => {
    console.log("giaoNhanTemChi", giaoNhanTemChi.ngay_giao);
    setEvents((prv) =>
      prv.map((e) => {
        if (
          e.status === "Ký cấp 2" &&
          (giaoNhanTemChi?.trang_thai === 1 || giaoNhanTemChi?.trang_thai === 2)
        ) {
          return {
            ...e,
            user: giaoNhanTemChi?.ten_nguoi_nhan,
            date: giaoNhanTemChi?.ngay_nhan,
          };
        }
        if (e.status === "Ký cấp 2" && giaoNhanTemChi?.trang_thai === 0) {
          return {
            ...e,
            user: giaoNhanTemChi?.ten_nguoi_nhan,
          };
        }

        if (
          e.status === "Ký cấp 1" &&
          (giaoNhanTemChi?.trang_thai === 1 || giaoNhanTemChi?.trang_thai === 2)
        ) {
          return {
            ...e,
            user: giaoNhanTemChi?.ten_nguoi_giao,
            date: giaoNhanTemChi?.ngay_giao,
          };
        } else {
          return {
            ...e,
            user: giaoNhanTemChi?.ten_nguoi_giao,
          };
        }
      })
    );
    console.log(
      "giao nhan",
      giaoNhanTemChi.trang_thai === 0 && current_MADVIQLY === "PA23"
    );
  }, [giaoNhanTemChi]);
  const update_NguoiNhan = async (userId) => {
    try {
      const data = {
        ht_nguoidung_id: userId,
        bienban_id: giaoNhanTemChi.id_bienban,
      };
      const res = await updateNguoiNhan(data);
      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  const customizedMarker = (event) => {
    const hasTime = !!event.date;
    return (
      <span
        className={`p-timeline-event-marker border-5 ${
          hasTime ? "border-green-800" : ""
        }`}
        style={{
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></span>
    );
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  console.log(giaoNhanTemChi.ten_nguoi_nhan);

  return (
    <Dialog
      style={{ width: "80%" }}
      header="Chi tiết văn bản ký số"
      visible={visible}
      onHide={handleCloseModalViewer}
    >
      <div className="flex justify-content-between">
        <div style={{ height: "100vh", width: "70%" }}>
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
          >
            <Viewer
              defaultScale={1.0}
              fileUrl="/files/cdfc347e-b41d-4cb4-8940-2d8abcf1a0c1.pdf"
              plugins={[defaultLayoutPluginInstance]}
            />
          </Worker>
        </div>
        <div className="block-info" style={{ width: "28%" }}>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "25%" }}>
              <>Đơn vị giao:</>{" "}
            </label>
            <label style={{ width: "75%" }}>
              <strong>{giaoNhanTemChi.ten_pb.toUpperCase()}</strong>{" "}
            </label>
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "25%" }}>
              <>Đơn vị nhận:</>{" "}
            </label>
            <label style={{ width: "75%" }}>
              <strong>{giaoNhanTemChi.ten_dv.toUpperCase()}</strong>{" "}
            </label>
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "25%" }}>
              <>Người giao:</>{" "}
            </label>
            <label style={{ width: "75%" }}>
              <strong>{giaoNhanTemChi.ten_nguoi_giao}</strong>{" "}
            </label>
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "25%" }}>Người nhận:</label>
            {/* <label style={{ width: "75%" }}>
              <Dropdown
                value={giaoNhanTemChi?.nguoi_nhan}
                className="w-full"
                options={users}
                placeholder="Chọn"
                filter
                required
                disabled={
                  giaoNhanTemChi?.trang_thai !== 0 || current_MADVIQLY !== "PA23"
                    ? true
                    : false
                }
                optionValue="id"
                optionLabel="hO_TEN"
                onChange={(e) => {
                  const user = users.find((u) => u.id === e.value);
                  console.log("user", user);
                  setBienBan({
                    ...giaoNhanTemChi,
                    nguoi_nhan: e.value,
                    ten_nguoi_nhan: user.hO_TEN,
                  });
                  update_NguoiNhan(e.value);
                }}
              />
            </label> */}
            <label style={{ width: "75%" }}>
              <strong>{giaoNhanTemChi.ten_nguoi_nhan}</strong>{" "}
            </label>
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "25%" }}>Số lượng:</label>
            <label style={{ width: "75%" }}>
              <strong>{giaoNhanTemChi.soluong}</strong>{" "}
            </label>
          </div>

          <div class="progress mt-4">
            <h5> Tiến trình ký số</h5>
            <div className="time-line">
              <Timeline
                marker={customizedMarker}
                value={events}
                opposite={(item) => item.status}
                content={(item) => (
                  <>
                    <small className="text-color-secondary">{item.user}</small>
                    <br></br>
                    <small className="text-color-secondary">
                      {item.date
                        ? `${new Date(item.date).getDate()}-${
                            new Date(item.date).getMonth() + 1
                          }-${new Date(item.date).getFullYear()} ${new Date(
                            item.date
                          ).getHours()}:${new Date(
                            item.date
                          ).getMinutes()}:${new Date(item.date).getSeconds()}`
                        : "Chưa ký"}
                    </small>
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-content-end" style={{ marginTop: "20px" }}>
        {((giaoNhanTemChi.trang_thai === 0 && current_MADVIQLY === "PA23") ||
          (giaoNhanTemChi.trang_thai === 1 && current_MADVIQLY !== "PA23")) && (
          <Button
            label="Ký số"
            severity="success"
            className="me-3"
            style={{ marginRight: "10px" }}
            onClick={() => {
              if (giaoNhanTemChi.nguoi_nhan) {
                if (
                  giaoNhanTemChi.trang_thai === 0 &&
                  current_MADVIQLY == "PA23"
                ) {
                  signC1(giaoNhanTemChi.id_bienban);
                } else {
                  signC2(giaoNhanTemChi.id_bienban);
                }
              } else {
                showToast("error", "Vui lòng chọn người nhận!");
              }
            }}
          />
        )}
        <Button
          label="Đóng"
          severity="secondary"
          onClick={handleCloseModalViewer}
        />
      </div>
    </Dialog>
  );
};

export default BienBanViewer;
