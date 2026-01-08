const express = require("express");
const router = express.Router();

const {
  userSignup,
  userLogin,
} = require("../../controllers/auth/userAuth.controller");

router.post("/signup", userSignup);
router.post("/login", userLogin);

module.exports = router;
