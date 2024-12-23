import { apiClient } from "../../constants/api";

export const D_KIMService = {
  async search_D_KIM(data) {
    console.log("call api");
    const res = await apiClient.post("/D_KIM/search_D_KIM", data);
    return res?.data;
  },
};
export const insert_D_KIM = async (data) => {
  const res = await apiClient.post("/D_KIM/insert_D_KIM", data);
  return res;
};

export const update_D_KIM = async (data) => {
  const res = await apiClient.put("/D_KIM/update_D_KIM", data);
  return res;
};

export const delete_D_KIM = async (id) => {
  console.log(id);
  const res = await apiClient.delete("/D_KIM/delete_D_KIM?ID=" + id);
  return res;
};

export const get_D_KIM_ById = async (id) => {
  const res = await apiClient.get("/D_KIM/get_D_KIM_ByID?ID=" + id);
  return res.data;
};

export const getAll_D_KIM = async () => {
  const res = await apiClient.get("/D_KIM/getAll_D_KIM");
  return res.data;
};
