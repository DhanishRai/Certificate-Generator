require("dotenv").config();

const path = require("path");
const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const authRoutes = require("./routes/authRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();

const configuredOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isConfiguredOrigin = configuredOrigins.includes(origin);
      const isLocalDevOrigin =
        process.env.NODE_ENV !== "production" &&
        /^http:\/\/localhost:\d+$/.test(origin);

      if (isConfiguredOrigin || isLocalDevOrigin) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed."));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/certificates", express.static(path.join(__dirname, "certificates")));
app.use("/api/auth", authRoutes);
app.use("/api/certificates", certificateRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function createDefaultAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await Admin.findOne({ email: normalizedEmail });
  if (!existing) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ email: normalizedEmail, password: hashedPassword });
    console.log(`Default admin created: ${normalizedEmail}`);
  }
}

async function startServer() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required in environment variables.");
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required in environment variables.");

    await mongoose.connect(process.env.MONGO_URI);
    await createDefaultAdmin();

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
    process.exit(1);
  }
}

startServer();
