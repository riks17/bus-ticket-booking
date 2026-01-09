const express = require("express");
const router = express.Router();

const {
  createJourney,
  getJourneys,
} = require("../../controllers/admin/journey.admin.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("MANAGE_JOURNEYS"),
  createJourney
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("MANAGE_JOURNEYS"),
  getJourneys
);

module.exports = router;
