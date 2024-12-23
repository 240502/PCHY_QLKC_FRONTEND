import { apiClient } from "../../constants/api";

export const search_QLKC_C4_GIAONHAN_TEMCHI = async (data) => {
  console.log({
    ...data,
    ma_dviqly: JSON.parse(sessionStorage.getItem("current_MADVIQLY")),
  });
  const res = await apiClient.post(
    "/QLKC_C4_GIAONHAN_TEMCHI/search_QLKC_C4_GIAONHAN_TEMCHI",
    data
  );
  return res.data;
};
export const create_QLKC_C4_MUON_TEMCHI = async (data) => {
  const res = await apiClient.post(
    "/QLKC_C4_GIAONHAN_TEMCHI/create_QLKC_C4_MUON_TEMCHI",
    data
  );
  return res;
};
export const create_PM_QLKC_C4_MUON_TEMCHI = async (data) => {
  const res = await apiClient.post(
    "/QLKC_C4_GIAONHAN_TEMCHI/create_PM_QLKC_C4_MUON_TEMCHI",
    data
  );
  return res;
};
export const create_PQT_QLKC_C4_GIAONHAN_TEMCHI = async (data) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_TEMCHI/create_PQT_QLKC_C4_GIAONHAN_TEMCHI",
    data
  );
  return res;
};
export const create_QLKC_C4_GIAONHAN_TEMCHI = async (data) => {
  const res = await apiClient.post(
    "/QLKC_C4_GIAONHAN_TEMCHI/create_QLKC_C4_GIAONHAN_TEMCHI",
    data
  );
  return res;
}
export const update_QLKC_C4_GIAONHAN_TEMCHI = async (data) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_TEMCHI/update_QLKC_C4_GIAONHAN_TEMCHI",
    data
  );
  return res;
};
export const update_kyC1_QLKC_C4_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.put(
    `/QLKC_C4_GIAONHAN_TEMCHI/update_kyC1_QLKC_C4_GIAONHAN_TEMCHI?id=${id}`
  );
  return res;
};
export const update_kyC2_QLKC_C4_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.put(
    `/QLKC_C4_GIAONHAN_TEMCHI/update_kyC2_QLKC_C4_GIAONHAN_TEMCHI?id=${id}`,
  );
  return res;
};
export const update_CD_QLKC_C4_GIAONHAN_TEMCHI = async (data) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_TEMCHI/update_CD_QLKC_C4_GIAONHAN_TEMCHI",
    data
  );
  return res;
};
export const update_huyPM_QLKC_C4_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.put(
    `/QLKC_C4_GIAONHAN_TEMCHI/update_huyPM_QLKC_C4_GIAONHAN_TEMCHI?id=${id}`,
  );
  return res;
};
export const update_kyC1_PM_QLKC_C4_GIAONHAN_TEMCHI = async (data) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_TEMCHI/update_kyC1_PM_QLKC_C4_GIAONHAN_TEMCHI",
    data
  );
  return res;
};
export const update_kyC1_PQT_QLKC_C4_GIAONHAN_TEMCHI = async (data) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_TEMCHI/update_kyC1_PQT_QLKC_C4_GIAONHAN_TEMCHI",
    data
  );
  return res;
};
export const update_kyC2_PM_C4_GIAONHAN_TEMCHI = async (data) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_TEMCHI/update_kyC2_PM_C4_GIAONHAN_TEMCHI",
    data
  );
  return res;
};
export const update_kyC2_PQT_C4_GIAONHAN_TEMCHI = async (data) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_TEMCHI/update_kyC2_PQT_C4_GIAONHAN_TEMCHI",
    data
  );
  return res;
};
export const update_TL_PM_QLKC_C4_GIAONHAN_TEMCHI = async (data) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_TEMCHI/update_TL_PM_QLKC_C4_GIAONHAN_TEMCHI",
    data
  );
  return res;
};
export const update_TL_PQT_QLKC_C4_GIAONHAN_TEMCHI = async (data) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_TEMCHI/update_TL_PQT_QLKC_C4_GIAONHAN_TEMCHI",
    data
  );
  return res;
};

export const delete_QLKC_C4_GIAONHAN_TEMCHI = async (id) => {
  console.log(id);
  const res = await apiClient.delete(
    "/QLKC_C4_GIAONHAN_TEMCHI/delete_QLKC_C4_GIAONHAN_TEMCHI?id=" + id
  );
  return res;
};
export const get_QLKC_C4_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.get(
    "/QLKC_C4_GIAONHAN_TEMCHI/get_QLKC_C4_GIAONHAN_TEMCHI?id=" + id
  );
  return res.data;
};
export const get_PM_QLKC_C4_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.get(
    "/QLKC_C4_GIAONHAN_TEMCHI/get_PM_QLKC_C4_GIAONHAN_TEMCHI?id=" + id
  );
  return res.data;
};
export const get_PQT_QLKC_C4_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.get(
    "/QLKC_C4_GIAONHAN_TEMCHI/get_PQT_QLKC_C4_GIAONHAN_TEMCHI?id=" + id
  );
  return res.data;
};
export const getAll_QLKC_C4_GIAONHAN_TEMCHI = async () => {
  const res = await apiClient.get(
    "/QLKC_C4_GIAONHAN_TEMCHI/getAll_QLKC_C4_GIAONHAN_TEMCHI"
  );
  return res.data;
};
