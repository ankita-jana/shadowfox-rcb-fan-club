// server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { loadDB, saveDB, getDB } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ----------------- Allowed origins ----------------- */
// NO trailing slash here
const allowedOrigins = [
  "http://localhost:5173", // dev
  "https://shadowfox-rcb-fan-club.vercel.app", // prod
  /\.vercel\.app$/, // Vercel preview domains
];

// Use the cors package with dynamic origin check
app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server requests (no origin)
      if (!origin) return callback(null, true);
      const allowed = allowedOrigins.some((o) =>
        o instanceof RegExp ? o.test(origin) : o === origin
      );
      if (allowed) return callback(null, true);
      console.error("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
  })
);

// Extra: ensure preflight OPTIONS returns correct headers quickly
app.options("*", (req, res) => {
  // Explicitly allow the headers we use from the client
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, X-User-Id, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  // Echo origin for credentials
  if (req.headers.origin)
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  return res.sendStatus(204);
});

// Small middleware to add headers on every response (helps some clients)
app.use((req, res, next) => {
  if (req.headers.origin)
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,X-User-Id,Authorization"
  );
  next();
});

app.use(express.json());

/* ----------------- Cloudinary ----------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

await loadDB();

const upload = multer({ storage: multer.memoryStorage() });

/* ----------------- Upload image ----------------- */
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    console.log(
      "UPLOAD: incoming. file:",
      !!req.file,
      "body keys:",
      req.body && Object.keys(req.body)
    );

    if (!req.file) {
      return res
        .status(400)
        .json({
          message: "No file uploaded. Make sure form field name is 'image'.",
        });
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Missing Cloudinary env vars!");
      return res
        .status(500)
        .json({
          message: "Server misconfigured: missing Cloudinary credentials.",
        });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "rcb-fanhub" },
        (err, uploaded) => {
          if (err) {
            console.error("Cloudinary upload_stream error:", err);
            return reject(err);
          }
          resolve(uploaded);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    if (!result || !result.secure_url) {
      console.error("Cloudinary returned invalid result:", result);
      return res.status(500).json({ message: "Cloudinary upload failed." });
    }

    const db = getDB();
    const { caption, userId } = req.body;

    const newImage = {
      id: Date.now(),
      url: result.secure_url,
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

    console.log("✅ Upload success:", newImage.url);
    return res.json(newImage);
  } catch (err) {
    console.error("Upload handler unexpected err:", err);
    return res
      .status(500)
      .json({ message: "Upload failed", error: String(err) });
  }
});

/* ----------------- Get images ----------------- */
app.get("/images", (req, res) => {
  return res.json(getDB().images);
});

/* ----------------- React to image ----------------- */
app.post("/react/:id", async (req, res) => {
  try {
    const db = getDB();
    const { userId, type } = req.body;
    const image = db.images.find(
      (img) => String(img.id) === String(req.params.id)
    );

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
    return res.json(image);
  } catch (err) {
    console.error("React error:", err);
    return res
      .status(500)
      .json({ message: "Reaction failed", error: String(err) });
  }
});

/* ----------------- Comments ----------------- */
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
    return res.json(newComment);
  } catch (err) {
    console.error("Comment error:", err);
    return res
      .status(500)
      .json({ message: "Comment failed", error: String(err) });
  }
});

app.get("/comments", (req, res) => res.json(getDB().comments));

/* ----------------- Poll ----------------- */
app.post("/poll/:choice", async (req, res) => {
  try {
    const db = getDB();
    const { choice } = req.params;
    if (!["win", "lose"].includes(choice))
      return res.status(400).json({ message: "Invalid choice" });

    db.polls[choice] = (db.polls[choice] || 0) + 1;
    await saveDB();
    return res.json(db.polls);
  } catch (err) {
    console.error("Poll error:", err);
    return res
      .status(500)
      .json({ message: "Voting failed", error: String(err) });
  }
});

app.get("/poll", (req, res) => res.json(getDB().polls));

/* ----------------- Delete image ----------------- */
app.delete("/image/:id", async (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    // read userId from body or header (client sends body)
    const userId = req.body?.userId || req.headers["x-user-id"] || "unknown";

    const idx = db.images.findIndex((img) => String(img.id) === String(id));
    if (idx === -1) return res.status(404).json({ message: "Image not found" });

    const image = db.images[idx];
    if (String(image.userId) !== String(userId))
      return res
        .status(403)
        .json({ message: "Forbidden: only uploader can delete" });

    if (image.filename) {
      try {
        await cloudinary.uploader.destroy(image.filename);
      } catch (destroyErr) {
        console.error("Cloudinary destroy error:", destroyErr);
      }
    }

    db.images.splice(idx, 1);
    await saveDB();
    return res.json({ message: "Image deleted" });
  } catch (err) {
    console.error("Delete image error:", err);
    return res
      .status(500)
      .json({ message: "Delete failed", error: String(err) });
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
    if (String(comment.userId) !== String(userId))
      return res
        .status(403)
        .json({ message: "Forbidden: only author can delete" });

    db.comments.splice(idx, 1);
    await saveDB();
    return res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Delete comment error:", err);
    return res
      .status(500)
      .json({ message: "Delete failed", error: String(err) });
  }
});

/* ----------------- START ----------------- */
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
