const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  industry: { type: String, default: "" },
  logoUrl: { type: String, default: "" },
  settings: { currency: { type: String, default: "USD" } },
  isDemo: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
