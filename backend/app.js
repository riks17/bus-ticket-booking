const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

/* Routes */
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

/* Middlewares */
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

/* ---------------- GLOBAL MIDDLEWARES ---------------- */
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* ---------------- HEALTH CHECK ---------------- */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* ---------------- ROUTES ---------------- */
/*
  AUTH
  /api/auth/admin/login
  /api/auth/user/login
*/
app.use("/api/auth", authRoutes);

/*
  USER
  /api/user/buses
  /api/user/bookings
*/
app.use("/api/user", userRoutes);

/*
  ADMIN
  /api/admin/buses
  /api/admin/reports
*/
app.use("/api/admin", adminRoutes);

/* ---------------- ERROR HANDLER (LAST) ---------------- */
app.use(errorMiddleware);

module.exports = app;
