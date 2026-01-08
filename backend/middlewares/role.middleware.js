const { ROLE_PERMISSIONS } = require("../config/roles");

const roleMiddleware = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({
        message: "Role not found in request context",
      });
    }

    const permissions = ROLE_PERMISSIONS[userRole];

    if (!permissions || !permissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
