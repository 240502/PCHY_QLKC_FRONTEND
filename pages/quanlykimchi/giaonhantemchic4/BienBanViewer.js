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
import {
  get_QLKC_C4_GIAONHAN_TEMCHI,
  update_kyC1_QLKC_C4_GIAONHAN_TEMCHI,
  update_kyC2_QLKC_C4_GIAONHAN_TEMCHI,
  getAll_HT_NGUOIDUNG,
  update_NguoiNhan_QLKC_C4_GIAONHAN_TEMCHI,
} from "../../../services/quanlykimchi/QLKC_C4_GIAONHAN_TEMCHIService";
import { QLKC_BBAN_BANGIAO_KIM } from "../../../models/QLKC_BBAN_BANGIAO_KIM";
const BienBanViewer = ({
  bienBan,
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
      user: "Nguyễn Văn Sang",
    },
    {
      status: "Ký cấp 2",
      user: "Nguyễn Văn Sang",
    },
  ]);

  const current_MADVIQLY = JSON.parse(
    sessionStorage.getItem("current_MADVIQLY")
  );
  const signC1 = async (id) => {
    try {
      const res = await update_kyC1_QLKC_C4_GIAONHAN_TEMCHI(id);
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
      const res = await update_kyC2_QLKC_C4_GIAONHAN_TEMCHI(id);
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
        const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY(
          bienBan.doN_VI_NHAN
        );
        setUsers(res);
      } catch (e) {
        console.log(e);
      }
    };

    getHT_NGUOIDUNGByMA_DVIQLY();
  }, []);

  useEffect(() => {
    console.log("bien ban",bienBan)
    setEvents((prv) =>
      prv.map((e) => {
        if (
          e.status === "Ký cấp 2" &&
          (bienBan?.tranG_THAI === 1 || bienBan?.tranG_THAI === 2)
        ) {
          return {
            ...e,
            user: bienBan?.teN_NGUOI_NHAN,

            date: bienBan?.ngaY_NHAN,
          };
        }
        if (e.status === "Ký cấp 2" && bienBan?.tranG_THAI === 0) {
          return {
            ...e,
            user: bienBan?.teN_NGUOI_NHAN,
          };
        }

        if (
          e.status === "Ký cấp 1" &&
          (bienBan?.tranG_THAI === 1 || bienBan?.tranG_THAI === 2)
        ) {
          return {
            ...e,
            user: bienBan?.teN_NGUOI_GIAO,

            date: bienBan?.ngaY_GIAO,
          };
        } else {
          return {
            ...e,
            user: bienBan?.teN_NGUOI_GIAO,
          };
        }
      })
    );
    console.log(
      "bien ban",
      bienBan.tranG_THAI === 0 && current_MADVIQLY === "PA23"
    );
  }, [bienBan]);
  const update_NguoiNhan = async (userId) => {
    try {
      const data = {
        ht_nguoidung_id: userId,
        bienban_id: bienBan.id,
      };
      const res = await update_NguoiNhan_QLKC_C4_GIAONHAN_TEMCHI(data);
      console.log("update nguoi nhan",res);
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
              <strong>{bienBan.teN_DONVI_GIAO}</strong>{" "}
            </label>
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "25%" }}>
              <>Đơn vị nhận:</>{" "}
            </label>
            <label style={{ width: "75%" }}>
              <strong>{bienBan.teN_DONVI_NHAN}</strong>{" "}
            </label>
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "25%" }}>
              <>Người giao:</>{" "}
            </label>
            <label style={{ width: "75%" }}>
              <strong>{bienBan.teN_NGUOI_GIAO}</strong>{" "}
            </label>
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "25%" }}>Người nhận:</label>
            <label style={{ width: "75%" }}>
              <Dropdown
                value={bienBan?.nguoI_NHAN}
                className="w-full"
                options={users}
                placeholder="Chọn"
                filter
                disabled={
                  bienBan?.tranG_THAI !== 0 || current_MADVIQLY !== "PA23"
                    ? true
                    : false
                }
                optionValue="id"
                optionLabel="hO_TEN"
                onChange={(e) => {
                  const user = users.find((u) => u.id === e.value);
                  console.log("user", user);
                  setBienBan({
                    ...bienBan,
                    nguoI_NHAN: e.value,
                    teN_NGUOI_NHAN: user.hO_TEN,
                  });
                  update_NguoiNhan(e.value);
                }}
              />
            </label>
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "25%" }}>Số lượng:</label>
            <label style={{ width: "75%" }}>
              <strong>{bienBan.sO_LUONG_GIAO}</strong>{" "}
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
                        ? `${new Date(item.date).getDate()}-${new Date(
                            item.date
                          ).getMonth()}-${new Date(
                            item.date
                          ).getFullYear()} ${new Date(
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
        {((bienBan.tranG_THAI === 0 && current_MADVIQLY === "PA23") ||
          (bienBan.tranG_THAI === 1 && current_MADVIQLY !== "PA23")) && (
          <Button
            label="Ký số"
            severity="success"
            className="me-3"
            style={{ marginRight: "10px" }}
            onClick={() => {
              if (bienBan.tranG_THAI === 0 && current_MADVIQLY == "PA23") {
                signC1(bienBan.id);
              } else {
                signC2(bienBan.id);
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
