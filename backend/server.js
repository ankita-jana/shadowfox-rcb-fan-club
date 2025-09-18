import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { loadDB, saveDB, getDB } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://shadowfox-rcb-fan-club.vercel.app/fan-hub",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Load DB on startup
await loadDB();

// Multer with memory storage (no disk)
const upload = multer({ storage: multer.memoryStorage() });

/* ----------------- Upload image ----------------- */
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "rcb-fanhub" }, // optional folder name
        (err, uploaded) => {
          if (err) return reject(err);
          resolve(uploaded);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const db = getDB();
    const { caption, userId } = req.body;

    const newImage = {
      id: Date.now(),
      url: result.secure_url, // cloud URL
      filename: result.public_id, 
      caption: caption || "",
      reactions: {},
      likes: 0,
      loves: 0,
      userId: userId || "guest",
      createdAt: new Date().toISOString(),
    };

    db.images.unshift(newImage);
    await saveDB();

    res.json(newImage);
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

app.get("/images", (req, res) => {
  res.json(getDB().images);
});


app.post("/react/:id", async (req, res) => {
  try {
    const db = getDB();
    const { userId, type } = req.body;
    const image = db.images.find((img) => img.id == req.params.id);

    if (!image) return res.status(404).json({ message: "Image not found" });
    if (!["like", "love"].includes(type))
      return res.status(400).json({ message: "Invalid reaction type" });

    if (image.reactions[userId]) {
      const prev = image.reactions[userId];
      if (prev === "like") image.likes = Math.max(0, (image.likes || 0) - 1);
      if (prev === "love") image.loves = Math.max(0, (image.loves || 0) - 1);
    }

    image.reactions[userId] = type;
    if (type === "like") image.likes = (image.likes || 0) + 1;
    if (type === "love") image.loves = (image.loves || 0) + 1;

    await saveDB();
    res.json(image);
  } catch (err) {
    res.status(500).json({ message: "Reaction failed", error: err.message });
  }
});

app.post("/comment", async (req, res) => {
  try {
    const db = getDB();
    const { userId, text } = req.body;
    if (!text || !text.trim())
      return res.status(400).json({ message: "Comment cannot be empty" });

    const newComment = {
      id: Date.now(),
      userId: userId || "guest",
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    db.comments.unshift(newComment);
    await saveDB();
    res.json(newComment);
  } catch (err) {
    res.status(500).json({ message: "Comment failed", error: err.message });
  }
});

app.get("/comments", (req, res) => {
  res.json(getDB().comments);
});

app.post("/poll/:choice", async (req, res) => {
  try {
    const db = getDB();
    const { choice } = req.params;
    if (!["win", "lose"].includes(choice))
      return res.status(400).json({ message: "Invalid choice" });
    db.polls[choice] += 1;
    await saveDB();
    res.json(db.polls);
  } catch (err) {
    res.status(500).json({ message: "Voting failed", error: err.message });
  }
});

app.get("/poll", (req, res) => res.json(getDB().polls));

app.delete("/image/:id", async (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const userId = req.body?.userId || req.headers["x-user-id"] || "unknown";

    const idx = db.images.findIndex((img) => String(img.id) === String(id));
    if (idx === -1) return res.status(404).json({ message: "Image not found" });

    const image = db.images[idx];
    if (String(image.userId) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "Forbidden: only uploader can delete" });
    }

    // delete from Cloudinary
    if (image.filename) {
      await cloudinary.uploader.destroy(image.filename);
    }

    db.images.splice(idx, 1);
    await saveDB();
    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

/* ----------------- Delete comment ----------------- */
app.delete("/comment/:id", async (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const userId = req.body?.userId || req.headers["x-user-id"] || "unknown";

    const idx = db.comments.findIndex((c) => String(c.id) === String(id));
    if (idx === -1)
      return res.status(404).json({ message: "Comment not found" });

    const comment = db.comments[idx];
    if (String(comment.userId) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "Forbidden: only author can delete" });
    }

    db.comments.splice(idx, 1);
    await saveDB();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

/* ----------------- START ----------------- */
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
