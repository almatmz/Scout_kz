const authService = require("../services/auth.service");
const { UnauthorizedError, ForbiddenError } = require("../utils/errors");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new UnauthorizedError("Access denied. No token provided.");
    }

    const user = await authService.verifyToken(token);
    req.user = { id: user.id, role: user.role, phone: user.phone };
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError("Access denied. Insufficient permissions."),
      );
    }
    next();
  };
};

module.exports = { auth, authorize };
