import axios from "axios";
import { apiClient } from "../../constants/api";

export const search_BBAN_BANGIAO_KIM = async (data) => {
  const res = await apiClient.post(
    "/BBAN_BANGIAO_KIM/search_BBAN_BANGIAO_KIM",
    data
  );
  return res.data;
};

export const insert_BBAN_BANGIAO_KIM = async (data) => {
  const res = await apiClient.post(
    "/BBAN_BANGIAO_KIM/insert_BBAN_BANGIAO_KIM",
    data
  );
  return res.data;
};

export const update_QLKC_BBAN_BANGIAO_KIMChoDuyet = async (data) => {
  const res = await apiClient.put(
    "/BBAN_BANGIAO_KIM/update_QLKC_BBAN_BANGIAO_KIMChoDuyet",
    data
  );
  return res.data;
};

export const delete_QLKC_BBAN_BANGIAO_KIM = async (id) => {
  const res = await apiClient.delete(
    "/BBAN_BANGIAO_KIM/delete_QLKC_BBAN_BANGIAO_KIM?id_bban=" + id
  );
  return res.data;
};

export const update_QLKC_BBAN_BANGIAO_KIMKyC1 = async (id) => {
  console.log(id);
  const res = await apiClient.put(
    "/BBAN_BANGIAO_KIM/update_QLKC_BBAN_BANGIAO_KIMKyC1?id_bban=" + id
  );
  return res;
};
export const update_QLKC_BBAN_BANGIAO_KIMKyC2 = async (id) => {
  console.log(id);
  const res = await apiClient.put(
    "/BBAN_BANGIAO_KIM/update_QLKC_BBAN_BANGIAO_KIMKyC2?id_bban=" + id
  );
  return res;
};

export const update_QLKC_BBAN_BANGIAO_KIMTraLai = async (id) => {
  console.log(id);
  const res = await apiClient.put(
    "/BBAN_BANGIAO_KIM/update_QLKC_BBAN_BANGIAO_KIMTraLai?id_bban=" + id
  );
  return res;
};

export const cancel_QLKC_BBAN_BANGIAO_KIM = async (id) => {
  console.log(id);
  const res = await apiClient.put(
    "/BBAN_BANGIAO_KIM/cancel_QLKC_BBAN_BANGIAO_KIM?id_bban=" + id
  );
  return res;
};
