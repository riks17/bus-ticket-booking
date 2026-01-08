const express = require("express");
const router = express.Router();

const { getAllBuses, getBusById } = require("../../controllers/user/bus.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("VIEW_BUSES"),
  getAllBuses
);

router.get(
  "/:busId",
  authMiddleware,
  roleMiddleware("VIEW_BUSES"),
  getBusById
);

module.exports = router;
