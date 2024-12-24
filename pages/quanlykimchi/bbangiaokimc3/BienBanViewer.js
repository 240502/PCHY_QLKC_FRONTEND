import React, { useEffect, useRef, useState } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Timeline } from "primereact/timeline";
import { HT_NGUOIDUNG_Service } from "../../../services/quantrihethong/HT_NGUOIDUNGService";
import { HT_NGUOIDUNG } from "../../../models/HT_NGUOIDUNG";
import { updateNguoiNhan } from "../../../services/quanlykimchi/BBAN_GIAO_KIMService";
import { Button } from "primereact/button";
const BienBanViewer = ({ bienBan, visible, handleCloseModalViewer }) => {
  const [users, setUsers] = useState([HT_NGUOIDUNG]);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const getHT_NGUOIDUNGByMA_DVIQLY = async () => {
      try {
        const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY(
          bienBan.doN_VI_NHAN
        );
        setUsers(res);
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    };
    getHT_NGUOIDUNGByMA_DVIQLY();
    console.log("bienBan", bienBan);
  }, []);
  const update_NguoiNhan = async (userId) => {
    try {
      const data = {
        ht_nguoidung_id: userId,
        bienban_id: bienBan.iD_BIENBAN,
      };
      const res = await updateNguoiNhan(data);
    } catch (err) {
      console.log(err);
    }
  };
  const events = [
    {
      status: "Soạn thảo",
      date: "02/12/2024 10:30",
      user: "Nguyễn Văn Sang",
    },
    {
      status: "Ký cấp 1",
      user: "Nguyễn Văn Sang",
    },
    {
      status: "Ký cấp 2",
      user: "Nguyễn Văn Sang",
    },
  ];
  const customizedMarker = (event) => {
    const hasTime = !!event.date;
    console.log(hasTime);
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
  useEffect(() => {
    console.log("users", users);
  }, [bienBan]);
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
              <strong>{bienBan.doN_VI_GIAO}</strong>{" "}
            </label>
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "25%" }}>
              <>Đơn vị nhận:</>{" "}
            </label>
            <label style={{ width: "75%" }}>
              <strong>{bienBan.doN_VI_NHAN}</strong>{" "}
            </label>
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "25%" }}>Số lượng:</label>
            <label style={{ width: "75%" }}>
              <strong>{bienBan.sO_LUONG}</strong>{" "}
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
                showClear
                filter
                optionValue="id"
                optionLabel="hO_TEN"
                onChange={(e) => {
                  // setBienBan({ ...bienBan, loaI_BBAN: e.value });
                  //  setUserId(e.value);
                  update_NguoiNhan(e.value);
                }}
              />
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
                      {item.date ?? "Chưa ký"}
                    </small>
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-content-end">
        <Button
          label="Ký số"
          severity="success"
          className="me-3"
          style={{ marginRight: "10px" }}
        />
        <Button label="Đóng" severity="secondary" />
      </div>
    </Dialog>
  );
};

export default BienBanViewer;
