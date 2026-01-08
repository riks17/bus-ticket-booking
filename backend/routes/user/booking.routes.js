const express = require("express");
const router = express.Router();

const {
  bookSeat,
  getMyBookings,
  cancelBooking,
} = require("../../controllers/user/booking.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.post(
  "/book",
  authMiddleware,
  roleMiddleware("BOOK_SEAT"),
  bookSeat
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("VIEW_MY_TICKETS"),
  getMyBookings
);

router.patch(
  "/cancel/:bookingId",
  authMiddleware,
  roleMiddleware("CANCEL_BOOKING"),
  cancelBooking
);

module.exports = router;
