const express = require("express");
const router = express.Router();

const {
  createBus,
  resetBus,
} = require("../../controllers/admin/bus.admin.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("CREATE_BUS"),
  createBus
);

router.patch(
  "/reset/:busId",
  authMiddleware,
  roleMiddleware("RESET_BUS"),
  resetBus
);

module.exports = router;
