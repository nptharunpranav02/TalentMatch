
const mongoose = require("mongoose");
const dns = require("dns");

if (process.env.DNS_SERVERS) {
    dns.setServers(process.env.DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean));
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected successfully!");
        console.log(`Database Host: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
