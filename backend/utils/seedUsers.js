import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";

export const seedDefaultUsers = async () => {
  const defaultUsers = [
    {
      username: "adminUser",
      email: "admin@example.com",
      password: "adminpassword123",
      phoneNumber: "0000000001",
      isAdmin: true,
      isVendor: false,
      isUser: false,
    },
    {
      username: "vendorUser",
      email: "vendor@example.com",
      password: "vendorpassword123",
      phoneNumber: "0000000002",
      isAdmin: false,
      isVendor: true,
      isUser: false,
    },
    {
      username: "normalUser",
      email: "user@example.com",
      password: "userpassword123",
      phoneNumber: "0000000003",
      isAdmin: false,
      isVendor: false,
      isUser: true,
    },
  ];

  try {
    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const hashedPassword = bcryptjs.hashSync(userData.password, 10);
        const newUser = new User({
          ...userData,
          password: hashedPassword,
        });
        await newUser.save();
        console.log(`\n=================================================`);
        console.log(`✅ Default ${userData.isAdmin ? 'Admin' : userData.isVendor ? 'Vendor' : 'User'} created successfully!`);
        console.log(`Email: ${userData.email}`);
        console.log(`Password: ${userData.password}`);
        console.log(`=================================================\n`);
      }
    }
    console.table(defaultUsers);
  } catch (error) {
    console.error("Error seeding default users:", error);
  }
};
