const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// --- Middleware ---
app.use(cors({ origin: "*" }));
app.use(express.json());

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// --- Schema ---
const PackageSchema = new mongoose.Schema({
  PKG: String,
  Decision: String,
  Type: String,
  TRC_Approval: String,
  Available_New_Activation: String,
  ACF: Number,
  BUCD: Number,
  Rental: Number,
  Voice_Rate_M2M: String,
  Voice_Rate_M2O: String,
  SMS_Rate_M2O: String,
  MMS_Rate: String,
  Data_Rate: String,
  Free_Voice_Bundle: String,
  Free_SMS_Bundle: String,
  Free_Dta_Bundle: String,
  PCRF: String,
  Deposit: String,
}, { timestamps: true });

// --- Model ---
const Packages = mongoose.model("Package", PackageSchema);

// --- GET: Fetch All Packages ---
app.get("/api/packages", async (req, res) => {
  try {
    const data = await Packages.find().sort({ PKG: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch packages", details: err });
  }
});

// --- POST: Insert New Package ---
app.post("/api/packages", async (req, res) => {
  try {
    const newPackage = new Packages(req.body);
    await newPackage.save();
    res.json({ message: "Package saved successfully", data: newPackage });
  } catch (err) {
    res.status(400).json({ error: "Failed to save package", details: err });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

