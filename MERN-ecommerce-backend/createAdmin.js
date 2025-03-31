const crypto = require("crypto");
const mongoose = require("mongoose");
const { User } = require("./model/User"); // Adjust path as needed

async function createAdmin() {
  await mongoose.connect("mongodb+srv://hastigundraniya:yashvi123@yashvi.vck78.mongodb.net/?retryWrites=true&w=majority&appName=yashvi"); // Change to your DB URL

  const salt = crypto.randomBytes(16);
  const hashedPassword = crypto.pbkdf2Sync("Admin123", salt, 310000, 32, "sha256");

  const adminUser = new User({
    email: "admin@gmail.com",
    password: hashedPassword,
    salt: salt,
    role: "admin",
    name: "Admin User",
  });

  await adminUser.save();
  console.log("Admin user created successfully!");
  mongoose.connection.close();
}

createAdmin();
