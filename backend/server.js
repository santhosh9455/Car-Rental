import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from './routes/adminRoute.js'
import vendorRoute from './routes/venderRoute.js'
import cors from 'cors'
import cookieParser from "cookie-parser";
import { cloudinaryConfig } from "./utils/cloudinaryConfig.js";


const App = express();


App.use(express.json());
App.use(cookieParser())


import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

process.env.ACCESS_TOKEN = process.env.ACCESS_TOKEN || "secret_access_token_key_12345";
process.env.REFRESH_TOKEN = process.env.REFRESH_TOKEN || "secret_refresh_token_key_67890";

const port = 3000;

const mongoURI = process.env.mongo_uri || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rent-a-ride";

import { seedDefaultUsers } from "./utils/seedUsers.js";
import { seedMockVehicles } from "./utils/seedVehicles.js";
import { seedMockMasterData } from "./utils/seedMasterData.js";

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("Connected to MongoDB successfully!");
    await seedDefaultUsers();
    await seedMockVehicles();
    await seedMockMasterData();
  })
  .catch((error) => console.error("MongoDB connection error:", error));

  

App.listen(port, () => {
  console.log("server listening !");
});

const allowedOrigins = ['https://rent-a-ride-two.vercel.app', 'http://localhost:5173']; // Add allowed origins here

App.use(
  cors({
    origin: allowedOrigins,
    methods:['GET', 'PUT', 'POST' ,'PATCH','DELETE'],
    credentials: true, // Enables the Access-Control-Allow-Credentials header
  })
);


App.use('*', cloudinaryConfig);

// App.get('/*', (req, res) => res.sendFile(resolve(__dirname, '../public/index.html')));


App.use("/api/user", userRoute);
App.use("/api/auth", authRoute);
App.use("/api/admin",adminRoute);
App.use("/api/vendor",vendorRoute)



App.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    succes: false,
    message,
    statusCode,
  });
});
