const mongoose = require("mongoose");

let isDbConnected = false;

const connectDB = async () => {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/talentmatch";

    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 2000
        });

        isDbConnected = true;
        console.log("MongoDB connected successfully!");
        console.log(`Database Host: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);
        return true;
    } catch (error) {
        isDbConnected = false;
        console.warn("⚠️ MongoDB offline or unreachable (" + error.message + ").");
        console.log("ℹ️ TalentMatch Backend running in resilient operational mode.");
        return false;
    }
};

const getDbStatus = () => isDbConnected;

module.exports = connectDB;
module.exports.getDbStatus = getDbStatus;
