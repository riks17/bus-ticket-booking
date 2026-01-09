const express = require("express");
const router = express.Router();

const journeyRoutes = require("./journey.routes");
const bookingRoutes = require("./booking.routes");

router.use("/journeys", journeyRoutes);
router.use("/bookings", bookingRoutes);

module.exports = router;
