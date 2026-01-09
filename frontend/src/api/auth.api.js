import api from "./axiosInstance";

export const userLogin = (data) => {
  return api.post("/auth/user/login", data);
};

export const userSignup = (data) => {
  return api.post("/auth/user/signup", data);
};

export const adminLogin = (data) => {
  return api.post("/auth/admin/login", data);
};

export const adminSignup = (data) => {
  return api.post("/auth/admin/signup", data);
};