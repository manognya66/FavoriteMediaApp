import express from "express";
import cors from "cors";
import path from "path";
import entriesRouter from "./routes/entries";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/media", entriesRouter);
app.use("/api/auth", authRoutes);

export default app;
