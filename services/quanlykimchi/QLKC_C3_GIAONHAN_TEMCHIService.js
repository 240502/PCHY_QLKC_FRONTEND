import { apiClient } from "../../constants/api";

export const search_QLKC_C3_GIAONHAN_TEMCHI = async (data) => {
  const res = await apiClient.post(
    "/C3_GIAONHAN_TEMCHI/search_QLKC_C3_GIAONHAN_TEMCHI",
    data
  );
  return res.data;
};

export const insert_QLKC_C3_GIAONHAN_TEMCHI = async (data) => {
  const res = await apiClient.post(
    "/C3_GIAONHAN_TEMCHI/insert_QLKC_C3_GIAONHAN_TEMCHI",
    data
  );
  return res;
};

export const update_QLKC_C3_GIAONHAN_TEMCHI = async (data) => {
  const res = await apiClient.put(
    "/C3_GIAONHAN_TEMCHI/update_QLKC_C3_GIAONHAN_TEMCHI",
    data
  );
  return res;
};

export const delete_QLKC_C3_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.delete(
    "/C3_GIAONHAN_TEMCHI/delete_QLKC_C3_GIAONHAN_TEMCHI?ID=" + id
  );
  return res;
};

export const get_QLKC_C3_GIAONHAN_TEMCHI_ById = async (id) => {
  const res = await apiClient.get(
    "/C3_GIAONHAN_TEMCHI/get_QLKC_C3_GIAONHAN_TEMCHI_ByID?ID=" + id
  );
  return res.data;
};

export const getAll_QLKC_C3_GIAONHAN_TEMCHI = async () => {
  const res = await apiClient.get(
    "/C3_GIAONHAN_TEMCHI/getAll_QLKC_C3_GIAONHAN_TEMCHI"
  );
  return res.data;
};

export const update_kyC1_PM_C3_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.put(
    "/C3_GIAONHAN_TEMCHI/update_kyC1_PM_QLKC_C3_GIAONHAN_TEMCHI?id=" + id
  );
  return res;
};

export const update_kyC1_PQT_C3_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.put(
    "/C3_GIAONHAN_TEMCHI/update_kyC1_PQT_QLKC_C3_GIAONHAN_TEMCHI?id=" + id
  );
  return res;
};

export const update_kyC2_PQT_C3_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.put(
    "/C3_GIAONHAN_TEMCHI/update_kyC2_PQT_C3_GIAONHAN_TEMCHI?id=" + id
  );
  return res;
};

export const update_kyC2_PM_C3_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.put(
    "/C3_GIAONHAN_TEMCHI/update_kyC2_PM_QLKC_C3_GIAONHAN_TEMCHI?id=" + id
  );
  return res;
};

export const update_TL_PM_C3_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.put(
    "/C3_GIAONHAN_TEMCHI/update_TL_PM_QLKC_C3_GIAONHAN_TEMCHI=" + id
  );
  return res;
};

export const update_TL_PQT_C3_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.put(
    "/C3_GIAONHAN_TEMCHI/update_TL_PQT_QLKC_C3_GIAONHAN_TEMCHI?id=" + id
  );
  return res;
};

export const update_huyPM_C3_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.put(
    "/C3_GIAONHAN_TEMCHI/update_huyPM_QLKC_C3_GIAONHAN_TEMCHI?id=" + id
  );
  return res;
};

export const update_loaiBBan_C3_GIAONHAN_TEMCHI = async (id) => {
  const res = await apiClient.put(
    "/C3_GIAONHAN_TEMCHI/update_LoaiBBan_QLKC_C3_GIAONHAN_TEMCHI?id=" + id
  );
  return res;
};
