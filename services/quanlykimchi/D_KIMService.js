import { apiClient } from "../../constants/api";

export const D_KIMService = {
  async search_D_KIM(data) {
    const res = await apiClient.post("/D_KIM/search_D_KIM", data);
    return res?.data;
  },
};
