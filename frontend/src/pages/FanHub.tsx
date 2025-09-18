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


const API_URL = import.meta.env.VITE_API_URL;

function FanHub() {
  const [pollVotes, setPollVotes] = useState({ win: 0, lose: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const currentUser = "guest"; // assume logged-in

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/poll`).then((r) => r.json()),
      fetch(`${API_URL}/images`).then((r) => r.json()),
      fetch(`${API_URL}/comments`).then((r) => r.json()),
    ]).then(([poll, imgs, cmts]) => {
      setPollVotes(poll);
      setGallery(imgs);
      setComments(cmts);
    });
  }, []);

  const handleVote = async (choice: "win" | "lose") => {
    if (hasVoted) return;
    const res = await fetch(`${API_URL}/poll/${choice}`, { method: "POST" });
    setPollVotes(await res.json());
    setHasVoted(true);
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    const res = await fetch(`${API_URL}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser, text: comment }),
    });
    setComments([await res.json(), ...comments]);
    setComment("");
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("caption", caption);
    formData.append("userId", currentUser);

    const res = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
    setGallery([await res.json(), ...gallery]);
    setCaption("");
    setSelectedFile(null);
  };

  const handleReaction = async (id: number, type: "like" | "love") => {
    const res = await fetch(`${API_URL}/react/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser, type }),
    });
    const updated = await res.json();
    setGallery((prev) => prev.map((img) => (img.id === id ? updated : img)));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this image?")) return;
    const res = await fetch(`${API_URL}/image/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser }),
    });
    if (res.ok) setGallery((prev) => prev.filter((img) => img.id !== id));
    else alert((await res.json()).message);
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