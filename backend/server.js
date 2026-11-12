require("dotenv").config();
const dns = require("dns");
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean));
}
const express = require("express");
const cors = require("cors");


const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const projectRoutes = require("./routes/projectRoutes");
const allocationRoutes = require("./routes/allocationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
app.use(cors({
  origin: "https://talentmatch-t9xl.onrender.com",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",").map((value) => value.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => res.json({ success: true, message: "TalentMatch API is online" }));
app.get("/api/health", (_req, res) => res.json({ success: true, backend: "online", database: require("mongoose").connection.readyState === 1 ? "connected" : "disconnected" }));
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    const port = Number(process.env.PORT) || 5000;
    app.listen(port, () => console.log(`TalentMatch API running at http://localhost:${port}`));
  } catch (error) {
    console.error("Unable to start API:", error.message);
    process.exit(1);
  }
};
if (require.main === module) startServer();
module.exports = app;
