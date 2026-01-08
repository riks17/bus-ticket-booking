const express = require("express");
const router = express.Router();

const adminAuthRoutes = require("./adminAuth.routes");
const userAuthRoutes = require("./userAuth.routes");

router.use("/admin", adminAuthRoutes);
router.use("/user", userAuthRoutes);

module.exports = router;
