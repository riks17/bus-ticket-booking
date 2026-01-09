const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

const ROLE_PERMISSIONS = {
  admin: [
    "MANAGE_LOCATIONS",
    "MANAGE_BUSES",
    "MANAGE_JOURNEYS",
    "VIEW_ALL_BOOKINGS",
    "RESET_BUS",
  ],
  user: [
    "VIEW_JOURNEYS",
    "BOOK_SEAT",
    "VIEW_MY_TICKETS",
    "CANCEL_BOOKING",
  ],
};

module.exports = {
  ROLES,
  ROLE_PERMISSIONS,
};
