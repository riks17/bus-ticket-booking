const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

const ROLE_PERMISSIONS = {
  admin: [
    "CREATE_BUS",
    "VIEW_ALL_BOOKINGS",
    "RESET_BUS",
    "VIEW_SALES_REPORT",
  ],
  user: [
    "VIEW_BUSES",
    "BOOK_SEAT",
    "VIEW_MY_TICKETS",
    "CANCEL_BOOKING",
  ],
};

module.exports = {
  ROLES,
  ROLE_PERMISSIONS,
};
