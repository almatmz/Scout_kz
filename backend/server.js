const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const playerRoutes = require("./routes/players");
const videoRoutes = require("./routes/videos");
const ratingRoutes = require("./routes/ratings");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// ✅ Allowed frontend origins
const allowedOrigins = ["http://localhost:3000", "https://scout-kz.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow mobile apps / curl
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy: Not allowed by CORS"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/ratings", ratingRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
