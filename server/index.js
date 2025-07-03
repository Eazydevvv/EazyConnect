import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";



dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseUrl =  process.env.DATABASE_URL;

const allowedOrigins = process.env.ORIGIN?.split(",") || [];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

  

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/contacts",contactsRoutes);
app.use("/api/messages",messagesRoutes);

const server = app.listen(port, () => {
    console.log(`Server is runnning on port ${port}`);
});

setupSocket(server)

mongoose.connect(databaseUrl ).then(() =>console.log("Database  connected")).catch((err) => console.log(err.message));