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
import dayjs from "dayjs";
import {
  update_QLKC_BBAN_BANGIAO_KIMKyC1,
  update_QLKC_BBAN_BANGIAO_KIMKyC2,
  get_BBAN_ById,
} from "../../../services/quanlykimchi/BBAN_GIAO_KIMService";
import { QLKC_BBAN_BANGIAO_KIM } from "../../../models/QLKC_BBAN_BANGIAO_KIM";
const BienBanViewer = ({
  bienBan,
  visible,
  handleCloseModalViewer,

  showToast,
}) => {
  const [users, setUsers] = useState([HT_NGUOIDUNG]);
  const [events, setEvents] = useState([
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
  ]);
  const [nguoiGiao, setNguoiGiao] = useState(HT_NGUOIDUNG);
  const [nguoiNhan, setNguoiNhan] = useState(HT_NGUOIDUNG);
  const [newBienBan, setNewBienBan] = useState(QLKC_BBAN_BANGIAO_KIM);
  const getBienBanById = async (id) => {
    try {
      const res = await get_BBAN_ById(id);
      console.log(res);
      setNewBienBan(res);
    } catch (err) {
      console.log(err);
    }
  };
  const signC1 = async (id) => {
    try {
      const res = await update_QLKC_BBAN_BANGIAO_KIMKyC1(id);
      showToast("success", "Ký thành công!");
      getBienBanById(id);
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
      getBienBanById(id);
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

    console.log("bienban", bienBan);
  }, []);
  useEffect(() => {
    console.log("nguoi nhan", nguoiNhan);
    setEvents((prv) =>
      prv.map((e) =>
        e.status === "Soạn thảo"
          ? {
              ...e,
              user: bienBan?.ten_nguoi_giao,
              date: bienBan?.ngaY_GIAO,
            }
          : e.status === "Ký cấp 1" && bienBan?.tranG_THAI === 1
          ? {
              ...e,
              user: bienBan?.ten_nguoi_giao,

              date: bienBan?.ngaY_GIAO,
            }
          : {
              ...e,
              user: bienBan?.ten_nguoi_nhan,

              date: bienBan?.ngaY_NHAN,
            }
      )
    );
  }, [nguoiNhan]);
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
                      {item.date
                        ? dayjs(new Date(item.date)).format(
                            "DD-MM-YYYY HH:MM:ss"
                          )
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
        <Button
          label="Ký số"
          severity="success"
          className="me-3"
          style={{ marginRight: "10px" }}
          onClick={() => {
            console.log("Ký");
            if (bienBan?.tranG_THAI === 0) {
              signC1(bienBan?.iD_BIENBAN);
            } else {
              signC2(bienBan?.iD_BIENBAN);
            }
          }}
        />
        <Button label="Đóng" severity="secondary" />
      </div>
    </Dialog>
  );
};

export default BienBanViewer;
