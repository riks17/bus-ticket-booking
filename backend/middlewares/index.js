const authMiddleware = require("./auth.middleware");
const roleMiddleware = require("./role.middleware");
const errorMiddleware = require("./error.middleware");

module.exports = {
  authMiddleware,
  roleMiddleware,
  errorMiddleware,
};
