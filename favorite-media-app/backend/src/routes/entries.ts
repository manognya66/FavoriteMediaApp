import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createEntry,
  getEntries,
  deleteEntry,
  getEntryById,
  updateEntry,
} from "../controllers/entryController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer configuration
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ Routes (all protected)
router.post("/", protect, upload.single("image"), createEntry);
router.get("/", protect, getEntries);
router.get("/:id", protect, getEntryById);
router.put("/:id", protect, upload.single("image"), updateEntry);
router.delete("/:id", protect, deleteEntry);

export default router;