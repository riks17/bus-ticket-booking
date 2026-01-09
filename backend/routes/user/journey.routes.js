const express = require("express");
const router = express.Router();

const {
  getJourneys,
  getJourneyById,
} = require("../../controllers/user/journey.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("VIEW_JOURNEYS"),
  getJourneys
);

router.get(
  "/:journeyId",
  authMiddleware,
  roleMiddleware("VIEW_JOURNEYS"),
  getJourneyById
);

module.exports = router;
