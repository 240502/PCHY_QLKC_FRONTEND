import React, { useEffect, useRef } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";

const BienBanViewer = ({ bienBan, visible, handleCloseModal }) => {
  useEffect(() => console.log("bienBan", bienBan), []);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <Dialog
      style={{ width: "80%" }}
      header="Chi tiết văn bản ký số"
      visible={visible}
      onHide={handleCloseModal}
    >
      <h5>Chi tiết văn bản ký số</h5>
      <div className="flex justify-content-between">
        <div style={{ height: "100vh", width: "70%" }}>
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
          >
            <Viewer
              defaultScale={1.0} // Đặt mức zoom mặc định là 100%
              fileUrl="/files/cdfc347e-b41d-4cb4-8940-2d8abcf1a0c1.pdf" // Thay bằng đường dẫn đến file PDF
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
          <div class="progress"></div>
        </div>
      </div>
    </Dialog>
  );
};

export default BienBanViewer;
