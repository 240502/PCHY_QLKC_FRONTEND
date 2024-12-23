import { apiClient } from "../../constants/api";

export const search_QLKC_NHAP_CHI_TEM = async (data) => {
  console.log({...data,ma_dviqly:JSON.parse(sessionStorage.getItem("current_MADVIQLY"))})
  const res = await apiClient.post("/QLKC_NHAP_CHI_TEM/search_QLKC_NHAP_CHI_TEM",data);
  return res.data;
};


export const update_QLKC_NHAP_CHI_TEM = async (data) => {
  const res = await apiClient.put("/QLKC_NHAP_CHI_TEM/update_QLKC_NHAP_CHI_TEM", data);
  return res;
};

export const insert_QLKC_NHAP_CHI_TEM = async (data) => {
  const res = await apiClient.post("/QLKC_NHAP_CHI_TEM/insert_QLKC_NHAP_CHI_TEM", data);
  return res;
};

export const delete_QLKC_NHAP_CHI_TEM = async (id) => {
  console.log(id);
  const res = await apiClient.delete(
    "/QLKC_NHAP_CHI_TEM/delete_QLKC_NHAP_CHI_TEM?id=" + id
  );
  return res;
};
export const get_BBan_NHAP_CHI_TEM = async (id) => {
  const res = await apiClient.get("/QLKC_NHAP_CHI_TEM/get_BBan_NHAP_CHI_TEM?id=" + id);
  return res.data;
};
export const getAll_QLKC_NHAP_CHI_TEM = async () => {
  const res = await apiClient.get("/QLKC_NHAP_CHI_TEM/getAll_QLKC_NHAP_CHI_TEM");
  return res.data;
};

