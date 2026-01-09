const express = require("express");
const router = express.Router();

const {
  createLocation,
  getLocations,
} = require("../../controllers/admin/location.admin.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("MANAGE_LOCATIONS"),
  createLocation
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("MANAGE_LOCATIONS"),
  getLocations
);

module.exports = router;
