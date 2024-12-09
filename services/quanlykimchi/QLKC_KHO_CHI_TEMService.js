import { apiClient } from "../../constants/api";

export const get_All_QLKC_KHO_CHI_TEM = async () => {
  
    const res = await apiClient.get("/QLKC_KHO_CHI_TEM/get_All_QLKC_KHO_CHI_TEM")
    return res.data;
}

export const get_QLKC_KHO_CHI_TEMByID_KHO = async (id) => {
  const res = await apiClient.get("/QLKC_KHO_CHI_TEM/get_QLKC_KHO_CHI_TEMByID_KHO?ID_KHO=" + id);
}

export const delete_QLKC_KHO_CHI_TEM = async (iD_KHO) => {
  const res = await apiClient.delete("/QLKC_KHO_CHI_TEM/delete_QLKC_KHO_CHI_TEM?ID_KHO=" + iD_KHO);
  return res;
}

export const update_QLKC_KHO_CHI_TEM = async (data) => {
  // console.log(res)
  const res = await apiClient.put("QLKC_KHO_CHI_TEM/update_QLKC_KHO_CHI_TEM",data);
  return res.data;
}

export const search_QLKC_KHO_CHI_TEM = async (data) => {
  const res = await apiClient.post(
    "/QLKC_KHO_CHI_TEM/search_QLKC_KHO_CHI_TEM",
    data
  );
  return res.data;
};