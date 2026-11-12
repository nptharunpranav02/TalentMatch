require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Company = require("../models/Company");
const User = require("../models/User");

async function createAdmin() {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error("ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required");
    if (ADMIN_PASSWORD.length < 8) throw new Error("Admin password must contain at least 8 characters");
    await connectDB();

    const companyName = process.env.COMPANY_NAME || "My TalentMatch Company";
    const slug = (process.env.COMPANY_SLUG || companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    const company = await Company.findOneAndUpdate(
      { slug }, { $setOnInsert: { name: companyName, slug } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    const email = ADMIN_EMAIL.trim().toLowerCase();
    if (await User.exists({ email })) throw new Error("An account with this email already exists");
    const admin = await User.create({ name: ADMIN_NAME, email, password: ADMIN_PASSWORD, role: "admin", companyId: company._id });
    console.log(`Admin created for ${company.name}: ${admin.email}`);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
createAdmin();
