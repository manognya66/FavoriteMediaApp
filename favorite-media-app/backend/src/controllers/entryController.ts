import { Response } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

// CREATE MEDIA ENTRY
export const createEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { title, type, director, budget, location, duration, year } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized user." });
    }

    const entry = await prisma.media.create({
      data: {
        title,
        type,
        director,
        budget,
        location,
        duration,
        year,
        image: imagePath,
        userId: req.user.id,
      },
    });

    res.status(201).json(entry);
  } catch (error: any) {
    console.error("❌ Error saving entry:", error);
    res.status(500).json({ error: "Failed to save entry." });
  }
};

// GET ALL MEDIA
export const getEntries = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const entries = await prisma.media.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(entries);
  } catch (error) {
    console.error("❌ Error fetching media:", error);
    res.status(500).json({ message: "Error fetching media." });
  }
};

// GET MEDIA BY ID
export const getEntryById = async (req: AuthRequest, res: Response) => {
  try {
    const idParam = req.params.id;
    if (!idParam) return res.status(400).json({ message: "ID parameter missing." });

    const id = parseInt(idParam, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format." });

    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const entry = await prisma.media.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!entry) return res.status(404).json({ message: "Media not found." });

    res.json(entry);
  } catch (error) {
    console.error("❌ Error fetching media by ID:", error);
    res.status(500).json({ message: "Error fetching media by ID." });
  }
};

// UPDATE MEDIA
export const updateEntry = async (req: AuthRequest, res: Response) => {
  try {
    const idParam = req.params.id;
    if (!idParam) return res.status(400).json({ message: "ID parameter missing." });

    const id = parseInt(idParam, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format." });

    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const existing = await prisma.media.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Media not found or not yours." });
    }

    const { title, type, director, budget, location, duration, year } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : existing.image;

    const updated = await prisma.media.update({
      where: { id },
      data: {
        title,
        type,
        director,
        budget,
        location,
        duration,
        year,
        image: imagePath,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("❌ Error updating media:", error);
    res.status(500).json({ error: "Failed to update media." });
  }
};

// DELETE MEDIA
export const deleteEntry = async (req: AuthRequest, res: Response) => {
  try {
    const idParam = req.params.id;
    if (!idParam) return res.status(400).json({ message: "ID parameter missing." });

    const id = parseInt(idParam, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format." });

    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const existing = await prisma.media.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Media not found or not yours." });
    }

    await prisma.media.delete({ where: { id } });
    res.json({ message: "🗑️ Media deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting media:", error);
    res.status(500).json({ message: "Error deleting media." });
  }
};