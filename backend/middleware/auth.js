const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      "SELECT id, phone, role FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Token is not valid." });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid." });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

module.exports = { auth, authorize };
