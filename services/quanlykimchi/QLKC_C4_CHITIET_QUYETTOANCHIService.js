import { apiClient } from "../../constants/api";

export const search_QLKC_C4_CHITIET_QUYETTOANCHI = async (data) => {
  const res = await apiClient.post(
    "/QLKC_C4_CHITIET_QUYETTOANCHI/search_QLKC_C4_CHITIET_QUYETTOANCHI",
    data
  );
  return res.data;
};

export const create_QLKC_C4_CHITIET_QUYETTOANCHI = async (data) => {
  const res = await apiClient.post(
    "/QLKC_C4_CHITIET_QUYETTOANCHI/create_QLKC_C4_CHITIET_QUYETTOANCHI",
    data
  );
  return res;
}
export const update_QLKC_C4_CHITIET_QUYETTOANCHI = async (data) => {
  const res = await apiClient.put(
    "/QLKC_C4_CHITIET_QUYETTOANCHI/update_QLKC_C4_CHITIET_QUYETTOANCHI",
    data
  );
  return res;
};
export const delete_QLKC_C4_CHITIET_QUYETTOANCHI = async (id) => {
  console.log(id);
  const res = await apiClient.delete(
    "/QLKC_C4_CHITIET_QUYETTOANCHI/delete_QLKC_C4_CHITIET_QUYETTOANCHI?id=" + id
  );
  return res;
};
export const get_QLKC_C4_CHITIET_QUYETTOANCHI = async (id) => {
  const res = await apiClient.get(
    "/QLKC_C4_CHITIET_QUYETTOANCHI/get_QLKC_C4_CHITIET_QUYETTOANCHI?id=" + id
  );
  return res.data;
};
