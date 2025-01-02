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
import { D_KIMService } from "../../../services/quanlykimchi/D_KIMService";
import moment from 'moment';
import {
  update_kyC1_PM_QLKC_C4_GIAONHAN_KIM,
  update_kyC2_PM_C4_GIAONHAN_KIM,
  // get_BBAN_ById,
} from "../../../services/quanlykimchi/QLKC_C4_GIAONHAN_KIMService";
import { QLKC_C4_GIAONHAN_KIM } from "../../../models/QLKC_C4_GIAONHAN_KIM";
const BienBanViewer = ({
  giaoNhanKim,
  visible,
  handleCloseModalViewer,
  showToast,
  setBienBan,
  loadData,
}) => {
  const [users, setUsers] = useState([HT_NGUOIDUNG]);
  console.log("Dữ liệu nhận được:", giaoNhanKim); // Kiểm tra dữ liệu nhận được

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

  const [GIAONHANKIM, setC4GIAONHANKIM] = useState({ ...QLKC_C4_GIAONHAN_KIM });
  const getBienBanById = async (id) => {
    try {
      const res = await get_BBAN_ById(id);
      setNewBienBan(res);
      console.log("res", res);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    console.log("GIAONHANKIMtest", giaoNhanKim);

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.status === "Ký cấp 1"
          ? {
            ...event,
            user: giaoNhanKim.ten_nguoi_giao,
            date: moment(giaoNhanKim.ngaY_GIAO).isValid()
              ? moment(giaoNhanKim.ngaY_GIAO).format('MM/DD/YYYY h:mm:ss A')
              : "Thời gian không hợp lệ", // Xử lý trường hợp không hợp lệ
          }
          : event
      )
    );
    console.log("Parsed date:", moment(giaoNhanKim.ngaY_GIAO));


    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.status === "Ký cấp 2"
          ? {
            ...event,
            user: giaoNhanKim.ten_nguoi_nhan,
            date: moment(giaoNhanKim.ngaY_NHAN).isValid()
              ? moment(giaoNhanKim.ngaY_NHAN).format('MM/DD/YYYY h:mm:ss A')
              : "Thời gian không hợp lệ", // Xử lý trường hợp không hợp lệ
          }
          : event
      )
    );

  }, [giaoNhanKim]);

  console.log("Trạng thái giaoNhanKim trước khi gọi handleKyC1 hoặc handleKyC2:", giaoNhanKim.tranG_THAI);
  const handleKyC1 = async () => {
    try {
      // Gọi API để ký C1 và nhận phản hồi từ server
      const response = await update_kyC1_PM_QLKC_C4_GIAONHAN_KIM(giaoNhanKim.id);
      console.log("API Response Ký C1:", response);

      if (response && response.data === "Ký thành công") {
        showToast("Ký C1 thành công", "success");

        let ngayGiao = response?.ngaY_GIAO || new Date().toISOString();

        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.status === "Ký cấp 1"
              ? {
                ...event,
                user: giaoNhanKim.ten_nguoi_giao,
                date: ngayGiao,
              }
              : event
          )
        );

        loadData(); // Tải lại dữ liệu sau khi cập nhật
        handleCloseModalViewer(); // Đóng modal sau khi ký thành công
      } else {
        showToast("Ký C1 không thành công", "error");
      }

    } catch (error) {
      console.error("Error during Ký C1:", error);
      showToast("Có lỗi xảy ra khi ký C1", "error");
    }
  };
  console.log("events", events)

  const handleKyC2 = async () => {
    try {
      const response = await update_kyC2_PM_C4_GIAONHAN_KIM(giaoNhanKim.id);
      console.log("API Response Ký C2:", response);

      if (response && response.data.message) {
        showToast("Ký C2 thành công", "success");

        const ngayNhan = response?.ngaY_NHAN || new Date().toISOString();

        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.status === "Ký cấp 2"
              ? {
                ...event,
                user: giaoNhanKim.ten_nguoi_nhan,
                date: ngayNhan,
              }
              : event
          )
        );

        loadData(); // Tải lại dữ liệu
        handleCloseModalViewer(); // Đóng modal sau khi ký thành công
      } else {
        showToast("Ký C2 không thành công", "error");
      }

    } catch (error) {
      console.error("Error during Ký C2:", error);
      showToast("Có lỗi xảy ra khi ký C2", "error");
    }
  };



  useEffect(() => {
    const getHT_NGUOIDUNGByMA_DVIQLY = async () => {
      try {
        const res = await HT_NGUOIDUNG_Service.getHT_NGUOIDUNGByMADVIQLY(
          bienBan.don_vi_nhan
        );
        setUsers(res);
      } catch (e) {
        console.log(e);
      }
    };

    getHT_NGUOIDUNGByMA_DVIQLY();
  }, []);

  useEffect(() => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.status === "Ký cấp 2" && giaoNhanKim?.tranG_THAI === 1) {
          return {
            ...e,
            user: giaoNhanKim?.ten_nguoi_nhan,
            date: giaoNhanKim?.ngaY_NHAN,
          };
        }
        if (e.status === "Ký cấp 1" && giaoNhanKim?.tranG_THAI === 0) {
          return {
            ...e,
            user: giaoNhanKim?.ten_nguoi_giao,
            date: giaoNhanKim?.ngaY_GIAO,
          };
        }
        return e;
      })
    );
  }, [giaoNhanKim]);


  useEffect(() => {
    console.log("Cập nhật giaoNhanKim:", giaoNhanKim);
  }, [giaoNhanKim]);

  const update_NguoiNhan = async (userId) => {
    try {
      const data = {
        ht_nguoidung_id: userId,
        giaoNhanKim_id: giaoNhanKim.id_giaoNhanKim,
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
        className={`p-timeline-event-marker border-5 ${hasTime ? "border-green-800" : ""
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
              <>Người giao:</>{" "}
            </label>
            <label style={{ width: "75%" }}>
              <strong>{giaoNhanKim.ten_nguoi_giao}</strong>{" "}
            </label>
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "25%" }}>Người nhận:</label>
            <label style={{ width: "75%" }}>
              <strong>{giaoNhanKim.ten_nguoi_nhan}</strong>{" "}
            </label>
          </div>
          <div className="flex justify-content-between align-items-center mb-3">
            <label style={{ width: "25%" }}>Số lượng:</label>
            <label style={{ width: "75%" }}>
              <strong>{giaoNhanKim.sO_LUONG_GIAO}</strong>{" "}
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
                        ? new Date(item.date).toLocaleString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false // Nếu bạn muốn định dạng 24 giờ
                        })
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
            console.log("Trạng thái hiện tại:", giaoNhanKim?.tranG_THAI);
            if (giaoNhanKim?.tranG_THAI === 0) {
              handleKyC1();
            } else if (giaoNhanKim?.tranG_THAI === 1) {
              handleKyC2();
            } else {
              console.error("Trạng thái không hợp lệ:", giaoNhanKim?.tranG_THAI);
            }
          }}
        />

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
