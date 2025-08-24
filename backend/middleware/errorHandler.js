const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === "23505") {
    // PostgreSQL unique violation
    return res.status(400).json({ error: "Data already exists" });
  }

  res.status(500).json({ error: "Something went wrong!" });
};

module.exports = errorHandler;
