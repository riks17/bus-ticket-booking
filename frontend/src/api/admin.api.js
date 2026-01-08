import api from "./axiosInstance";

export const createBus = (data) => {
  return api.post("/admin/buses", data);
};

export const getSales = () => {
  return api.get("/admin/reports/bookings");
};

export const resetBus = (busId) => {
  return api.patch(`/admin/buses/reset/${busId}`);
};
