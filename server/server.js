// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// require("dotenv").config();

// const connectDB = require("./config/db");

// const projectRoutes = require("./routes/projectRoutes");
// const authRoutes = require("./routes/authRoutes");

// const app = express();

// // DB Connection
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// app.use("/api/admin", require("./routes/authRoutes"));

// //app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// // Routes
// app.use("/api/projects", projectRoutes);
// app.use("/api/auth", authRoutes);

// app.use("/api/admin", require("./routes/adminRoute"));

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// // Test route
// //app.use("/uploads", express.static("uploads"));

// // contact us routes 

// app.use("/api", require("./routes/contactRoutes"));

// app.get("/", (req, res) => {
//   res.send(" Portfolio Backend Running");
// });



// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () =>
//   console.log(` Server running on port ${PORT}`)
// );




const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoute");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect DB lazily (VERY IMPORTANT)
let isConnected = false;

async function ensureDB() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

// Ensure DB before every request
app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", contactRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Portfolio Backend Running ");
});

//  NO app.listen()
//  Export app for Vercel
module.exports = app;
