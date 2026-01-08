import api from "./axiosInstance";

export const getBuses = () => api.get("/user/buses");
export const getBusDetails = (id) => api.get(`/user/buses/${id}`);
export const bookSeat = (data) => api.post("/user/bookings/book", data);
export const getMyBookings = () => api.get("/user/bookings/my");
export const cancelBooking = (bookingId) => api.patch(`/user/bookings/cancel/${bookingId}`);