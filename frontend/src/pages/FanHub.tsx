import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type GalleryImage = {
  id: number;
  url: string;
  likes: number;
  loves: number;
  caption: string;
  userId: string;
};

type Comment = {
  id: number;
  userId: string;
  text: string;
  createdAt: string;
};
const RAW_API_URL = import.meta.env.VITE_API_URL;
const API_URL = RAW_API_URL ?? "";

function FanHub() {
  const [pollVotes, setPollVotes] = useState({ win: 0, lose: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [, setLoading] = useState(false);

  const currentUser = "guest";

  useEffect(() => {
    console.log("VITE_API_URL raw:", RAW_API_URL);
    console.log("Using API_URL:", API_URL);
    if (!API_URL) {
      alert("API URL not configured.");
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const [pollRes, imgsRes, cmtsRes] = await Promise.all([
          fetch(`${API_URL}/poll`),
          fetch(`${API_URL}/images`),
          fetch(`${API_URL}/comments`),
        ]);

        if (!pollRes.ok || !imgsRes.ok || !cmtsRes.ok) {
          console.error("Initial load failed", { pollRes, imgsRes, cmtsRes });
          alert("Failed to load initial data. Check backend & CORS.");
          return;
        }

        const [poll, imgs, cmts] = await Promise.all([pollRes.json(), imgsRes.json(), cmtsRes.json()]);
        setPollVotes(poll);
        setGallery(imgs);
        setComments(cmts);
      } catch (err) {
        console.error("Initial load error:", err);
        alert("Error loading data. See console.");
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshImages = async () => {
    if (!API_URL) return;
    try {
      const r = await fetch(`${API_URL}/images`);
      if (!r.ok) throw new Error("Failed to fetch images");
      const imgs = await r.json();
      setGallery(imgs);
    } catch (err) {
      console.error("Refresh images error:", err);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;
    if (!API_URL) {
      alert("API URL not configured (VITE_API_URL).");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile); // this must match backend multer field name
    formData.append("caption", caption);
    formData.append("userId", currentUser);

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        console.error("Upload failed:", err);
        alert("Upload failed: " + (err.message || res.statusText));
        return;
      }

      // on success, re-fetch images to ensure consistent shape
      await refreshImages();
      setCaption("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload handler error:", err);
      alert("Upload error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // keep your other handlers but add error checks like above
  const handleVote = async (choice: "win" | "lose") => {
    if (hasVoted || !API_URL) return;
    try {
      const res = await fetch(`${API_URL}/poll/${choice}`, { method: "POST" });
      if (!res.ok) throw new Error("Vote failed");
      setPollVotes(await res.json());
      setHasVoted(true);
    } catch (err) {
      console.error("Vote error:", err);
      alert("Could not submit vote.");
    }
  };

  const handleComment = async () => {
    if (!comment.trim() || !API_URL) return;
    try {
      const res = await fetch(`${API_URL}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser, text: comment }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || "Comment failed");
      }
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setComment("");
    } catch (err) {
      console.error("Comment error:", err);
      alert("Could not post comment.");
    }
  };

  const handleReaction = async (id: number, type: "like" | "love") => {
    if (!API_URL) return;
    try {
      const res = await fetch(`${API_URL}/react/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser, type }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || "Reaction failed");
      }
      const updated = await res.json();
      setGallery((prev) => prev.map((img) => (img.id === id ? updated : img)));
    } catch (err) {
      console.error("Reaction error:", err);
      alert("Could not react to image.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this image?") || !API_URL) return;
    try {
      const res = await fetch(`${API_URL}/image/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || "Delete failed");
      }
      setGallery((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Could not delete image.");
    }
  };

  const handleShare = (url: string) => {
    navigator.share
      ? navigator.share({ title: "RCB Fan Moment", url })
      : navigator.clipboard.writeText(url).then(() => alert("Link copied 📋"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-900 text-white flex flex-col items-center py-12 px-6">
      <h1 className="text-5xl font-extrabold mb-6">🙌 RCB Fan Zone</h1>
      <p className="text-gray-300 text-lg mb-10 text-center max-w-2xl">
        Share your thoughts, vote in polls, upload your favorite moments, and connect with fans. 💖🔥
      </p>

      {/* Poll */}
      <motion.div whileHover={{ scale: 1.02 }} className="bg-red-800 bg-opacity-50 p-6 rounded-2xl shadow-xl mb-10 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">🗳️ Fan Poll</h2>
        <p className="mb-4 text-gray-300">Will RCB win their next IPL match?</p>
        <div className="flex gap-4">
          <button
            onClick={() => handleVote("win")}
            disabled={hasVoted}
            className={`flex-1 py-2 rounded-xl font-semibold ${hasVoted ? "bg-gray-500" : "bg-green-600 hover:bg-green-500"}`}
          >
            ✅ Yes ({pollVotes.win})
          </button>
          <button
            onClick={() => handleVote("lose")}
            disabled={hasVoted}
            className={`flex-1 py-2 rounded-xl font-semibold ${hasVoted ? "bg-gray-500" : "bg-red-600 hover:bg-red-500"}`}
          >
            ❌ No ({pollVotes.lose})
          </button>
        </div>
      </motion.div>

      {/* Comments */}
      <motion.div whileHover={{ scale: 1.01 }} className="bg-red-800 bg-opacity-50 p-6 rounded-2xl shadow-xl w-full max-w-3xl mb-10">
        <h2 className="text-2xl font-bold mb-4">💬 Fan Comments</h2>
        <div className="flex gap-2 mb-4">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-grow p-2 rounded-xl text-black"
          />
          <button onClick={handleComment} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl font-semibold">
            Post
          </button>
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {comments.length ? (
            comments.map((c) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-black bg-opacity-40 p-3 rounded-lg">
                <p className="font-semibold text-red-400">{c.userId}:</p>
                <p>{c.text}</p>
                <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400">No comments yet. Be the first! 🎉</p>
          )}
        </div>
      </motion.div>

      {/* Fan Gallery */}
      <motion.div whileHover={{ scale: 1.01 }} className="bg-red-800 bg-opacity-50 p-6 rounded-2xl shadow-xl w-full max-w-5xl mb-10">
        <h2 className="text-2xl font-bold mb-4">📸 Fan Gallery</h2>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          className="p-2 mb-3 w-full rounded-xl text-black"
        />
        <input type="file" accept="image/*" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} className="mb-3" />
        <button
          onClick={handleImageUpload}
          disabled={!selectedFile}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold disabled:opacity-50 mb-6"
        >
          📤 Send
        </button>
        {gallery.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((img) => (
              <motion.div key={img.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl overflow-hidden shadow-lg bg-black bg-opacity-40 flex flex-col">
                <img src={img.url} alt="" className="w-full h-60 object-cover" />
                <div className="p-3 text-gray-200 text-sm italic">{img.caption}</div>
                <div className="flex justify-between items-center p-3 border-t border-red-700 gap-2">
                  <button onClick={() => handleReaction(img.id, "like")} className="text-red-400 hover:text-red-300 font-semibold">
                    👍 {img.likes}
                  </button>
                  <button onClick={() => handleReaction(img.id, "love")} className="text-pink-400 hover:text-pink-300 font-semibold">
                    ❤️ {img.loves}
                  </button>
                  <button onClick={() => handleShare(img.url)} className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold">
                    📤 Share
                  </button>
                  {img.userId === currentUser && (
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No fan images yet. Share your RCB vibes! ❤️💛</p>
        )}
      </motion.div>
    </div>
  );
}

export default FanHub;