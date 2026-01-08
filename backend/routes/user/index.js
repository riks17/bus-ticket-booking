const express = require("express");
const router = express.Router();

const busRoutes = require("./bus.routes");
const bookingRoutes = require("./booking.routes");

router.use("/buses", busRoutes);
router.use("/bookings", bookingRoutes);

module.exports = router;
