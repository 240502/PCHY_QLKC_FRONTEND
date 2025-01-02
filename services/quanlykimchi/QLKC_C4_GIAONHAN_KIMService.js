import { apiClient } from "../../constants/api";

export const search_C4_GIAONHAN_KIM = async (data) => {
  const res = await apiClient.post(
    "/QLKC_C4_GIAONHAN_KIM/search_C4_GIAONHAN_KIM",
    data
  );
  return res.data;
};
export const create_PM_QLKC_C4_GIAONHAN_KIM = async (data) => {
  return await apiClient.post(
    "/QLKC_C4_GIAONHAN_KIM/create_PM_QLKC_C4_GIAONHAN_KIM",
    data
  );
};

export const update_CD_QLKC_C4_GIAONHAN_KIM = async (data) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_KIM/update_CD_QLKC_C4_GIAONHAN_KIM",
    data
  );
  return res.data;
};

export const delete_QLKC_C4_GIAONHAN_KIM = async (id) => {
  const res = await apiClient.delete(
    "/QLKC_C4_GIAONHAN_KIM/delete_QLKC_C4_GIAONHAN_KIM?id=" + id
  );
  return res;
};

export const get_PQT_QLKC_C4_GIAONHAN_KIM = async (id) => {
  const res = await apiClient.get(
    "/QLKC_C4_GIAONHAN_KIM/get_PQT_QLKC_C4_GIAONHAN_KIM?ID=" + id
  );
  return res;
};

export const get_PM_QLKC_C4_GIAONHAN_KIM = async (id) => {
  const res = await apiClient.get(
    "/QLKC_C4_GIAONHAN_KIM/get_PM_QLKC_C4_GIAONHAN_KIM?ID=" + id
  );
  return res;
};

export const update_kyC1_PM_QLKC_C4_GIAONHAN_KIM = async (id) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_KIM/update_kyC1_PM_QLKC_C4_GIAONHAN_KIM?id=" + id
  );
  return res;
};

export const update_kyC1_PQT_QLKC_C4_GIAONHAN_KIM = async (id) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_KIM/update_kyC1_PQT_QLKC_C4_GIAONHAN_KIM?id=" + id
  );
  return res;
};

export const update_kyC2_PQT_C4_GIAONHAN_KIM = async (id) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_KIM/update_kyC2_PQT_C4_GIAONHAN_KIM?id=" + id
  );
  return res;
};

export const update_kyC2_PM_C4_GIAONHAN_KIM = async (id) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_KIM/update_kyC2_PM_C4_GIAONHAN_KIM?id=" + id
  );
  return res;
};

export const update_TL_PM_QLKC_C4_GIAONHAN_KIM = async (id) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_KIM/update_TL_PM_QLKC_C4_GIAONHAN_KIM=" + id
  );
  return res;
};

export const update_TL_PQT_QLKC_C4_GIAONHAN_KIM = async (id) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_KIM/update_TL_PQT_QLKC_C4_GIAONHAN_KIM?id=" + id
  );
  return res;
};

export const update_huyPM_QLKC_C4_GIAONHAN_KIM = async (id) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_KIM/update_huyPM_QLKC_C4_GIAONHAN_KIM?id=" + id
  );
  return res;
};

export const update_loaiBBan_QLKC_C4_GIAONHAN_KIM = async (id) => {
  const res = await apiClient.put(
    "/QLKC_C4_GIAONHAN_KIM/update_loaiBBan_QLKC_C4_GIAONHAN_KIM?id=" + id
  );
  return res;
};

export const update_KIM_TRANGTHAI = async (iD_KIM, trangThai) => {
  const res = await apiClient.put(
    `/QLKC_C4_GIAONHAN_KIM/update_KIM_TRANGTHAI?iD_KIM=${encodeURIComponent(
      iD_KIM
    )}&trangThai=${trangThai}`
  );
  return res;
};
