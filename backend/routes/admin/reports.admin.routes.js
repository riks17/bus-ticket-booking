const express = require("express");
const router = express.Router();

const {
  getAllBookings,
} = require("../../controllers/admin/reports.admin.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.get(
  "/bookings",
  authMiddleware,
  roleMiddleware("VIEW_ALL_BOOKINGS"),
  getAllBookings
);

module.exports = router;
