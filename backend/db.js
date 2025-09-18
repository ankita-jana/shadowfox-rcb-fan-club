import fs from "fs-extra";

const DB_FILE = "db.json";

// Default structure
let db = {
  images: [],
  comments: [],
  polls: { win: 0, lose: 0 },
};

// Load data from file at startup
export async function loadDB() {
  try {
    const data = await fs.readJson(DB_FILE);
    db = data;
    console.log("✅ DB loaded");
  } catch {
    console.log("⚠️ No DB found, starting fresh");
    await saveDB();
  }
}

// Save data to file
export async function saveDB() {
  await fs.writeJson(DB_FILE, db, { spaces: 2 });
}

// Get DB
export function getDB() {
  return db;
}
