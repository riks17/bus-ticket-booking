const express = require("express");
const router = express.Router();

const busAdminRoutes = require("./bus.admin.routes");
const reportAdminRoutes = require("./reports.admin.routes");
const locationAdminRoutes = require("./location.admin.routes");
const journeyAdminRoutes = require("./journey.admin.routes");

router.use("/buses", busAdminRoutes);
router.use("/reports", reportAdminRoutes);
router.use("/locations", locationAdminRoutes);
router.use("/journeys", journeyAdminRoutes);

module.exports = router;
