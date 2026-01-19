const { AppError } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" });
  }

  if (err.code === "23505") {
    return res.status(400).json({ error: "Data already exists" });
  }

  if (err.code === "23503") {
    return res.status(400).json({ error: "Referenced record does not exist" });
  }

  res.status(500).json({ error: "Something went wrong!" });
};

module.exports = errorHandler;
