const express = require("express");
const router = express.Router();

const {
  createBus,
  resetBus,
  listBuses,
} = require("../../controllers/admin/bus.admin.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("MANAGE_BUSES"),
  createBus
);

router.patch(
  "/reset/:busId",
  authMiddleware,
  roleMiddleware("RESET_BUS"),
  resetBus
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("MANAGE_BUSES"),
  listBuses
);

module.exports = router;
