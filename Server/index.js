const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const diaryRoutes = require("./routes/diary"); // ✅ import this


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/diary", diaryRoutes); // ✅ mount it here


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Server working ✅");
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
