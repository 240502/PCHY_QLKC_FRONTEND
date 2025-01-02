import { apiClient } from "../../constants/api";

export const D_KIMService = {
  async search_D_KIM(data) {
    const res = await apiClient.post("/D_KIM/search_D_KIM", data);
    return res?.data;
  },
  async get_All_D_KIMByMA_DVIQLY(data) {
    const res = await apiClient.post("/D_KIM/get_D_KIMByMA_DVIQLY", data);
    return res?.data;
  },
  async update_MA_DVIQLY(data) {
    const res = await apiClient.post("/D_KIM/update_MA_DVIQLY", data);
    return res;
  },
  async get_ALL_D_KIMTTByMA_DVIQLY1(ma_dviqly) {
    const res = await apiClient.get(
      "/D_KIM/get_ALL_D_KIMTTByMA_DVIQLY1?ma_dviqly=" + ma_dviqly
    );
    return res?.data;
  },

  async get_ALL_D_KIMTTByMA_DVIQLY(requestData) {
    const res = await apiClient.post(
      `D_KIM/get_ALL_D_KIMTTByMA_DVIQLY`,
      requestData
    );

    return res?.data;
  },
  async getD_KimInTable() {
    const res = await apiClient.get("/D_KIM/getD_KimInTable");
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
  try {
    const res = await apiClient.get("/D_KIM/get_D_KIM_ByID?id_kim=" + id);
    return res.data;
  } catch (err) {
    console.log(err.message);
  }
};

export const getAll_D_KIM = async () => {
  const res = await apiClient.get("/D_KIM/getAll_D_KIM");
  return res.data;
};
