import api from "./axiosInstance";

export const getJourneys = () => api.get("/user/journeys");
export const getJourneyDetails = (id) => api.get(`/user/journeys/${id}`);
export const bookSeat = (data) => api.post("/user/bookings/book", data);
export const getMyBookings = () => api.get("/user/bookings/my");
export const cancelBooking = (bookingId) => api.patch(`/user/bookings/cancel/${bookingId}`);