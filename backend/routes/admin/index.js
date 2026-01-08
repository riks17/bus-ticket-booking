const express = require("express");
const router = express.Router();

const busAdminRoutes = require("./bus.admin.routes");
const reportAdminRoutes = require("./reports.admin.routes");

router.use("/buses", busAdminRoutes);
router.use("/reports", reportAdminRoutes);

module.exports = router;
