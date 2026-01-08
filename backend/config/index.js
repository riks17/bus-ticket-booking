const connectDB = require("./db");
const jwtConfig = require("./jwt");
const roleConfig = require("./roles");

module.exports = {
  connectDB,
  jwtConfig,
  roleConfig,
};
