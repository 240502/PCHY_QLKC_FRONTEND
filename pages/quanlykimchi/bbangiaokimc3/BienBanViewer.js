import React, { useEffect, useRef } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Timeline } from "primereact/timeline";
const BienBanViewer = ({ bienBan, visible, handleCloseModalViewer }) => {
  useEffect(() => console.log("bienBan", bienBan), []);
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
            <label style={{ width: "20%" }}>Đơn vị giao</label>
            <InputText style={{ width: "80%" }} value={bienBan.nguoI_GIAO} />
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "20%" }}>Đơn vị nhận</label>
            <InputText style={{ width: "80%" }} value={bienBan.nguoI_NHAN} />
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "20%" }}>Số lượng</label>
            <InputText style={{ width: "80%" }} value={bienBan?.sO_LUONG} />
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "20%" }}>Ngày giao</label>
            <InputText
              style={{ width: "80%" }}
              value={bienBan?.ngaY_GIAO?.toString().slice(0, 10)}
            />
          </div>
          <div className="flex justify-content-between align-items-center">
            <label style={{ width: "20%" }}>Ngày giao</label>
            <InputText
              style={{ width: "80%" }}
              value={bienBan?.ngaY_NHAN?.toString().slice(0, 10)}
            />
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
    </Dialog>
  );
};

export default BienBanViewer;
