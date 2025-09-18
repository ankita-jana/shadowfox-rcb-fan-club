import players from "../data/players.json";
import PlayerCard from "../components/PlayerCard";
import { motion } from "framer-motion";

function Players() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950 to-black text-white">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold text-center py-8"
      >
        🏏 RCB 2025 Squad
      </motion.h1>

      {/* Player Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-16 pb-16">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}

export default Players;
