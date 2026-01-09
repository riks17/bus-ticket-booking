import api from "./axiosInstance";

export const createBus = (data) => {
  return api.post("/admin/buses", data);
};

export const getBuses = () => {
  return api.get("/admin/buses");
};

export const createLocation = (data) => {
  return api.post("/admin/locations", data);
};

export const getLocations = () => {
  return api.get("/admin/locations");
};

export const createJourney = (data) => {
  return api.post("/admin/journeys", data);
};

export const getJourneys = () => {
  return api.get("/admin/journeys");
};

export const getSales = () => {
  return api.get("/admin/reports/bookings");
};

export const resetBus = (busId) => {
  return api.patch(`/admin/buses/reset/${busId}`);
};
