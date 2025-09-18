import { motion } from "framer-motion";
import matches from "../data/matches.json";

function Matches() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-900 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-5xl font-extrabold mb-8 drop-shadow-lg">
        🏆 IPL 2025 — RCB Fixtures & Results
      </h1>
      <p className="text-gray-300 mb-10 text-center max-w-2xl">
        Official IPL 2025 schedule & results for Royal Challengers Bengaluru.
        Times are in IST.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {matches.map((match, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
            className={`relative rounded-2xl p-6 shadow-2xl transition-transform duration-300 hover:scale-105 ${
              match.result.toLowerCase().includes("rcb won")
                ? "bg-green-700 bg-opacity-70"
                : match.result.toLowerCase().includes("won by")
                ? "bg-red-800 bg-opacity-60"
                : "bg-yellow-700 bg-opacity-60"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={match.rcbLogo}
                  alt="RCB"
                  className="w-12 h-12 rounded-full object-contain"
                />
                <span className="text-xl font-bold">vs</span>
                <img
                  src={match.opponentLogo}
                  alt={match.match}
                  className="w-12 h-12 rounded-full object-contain"
                />
              </div>
              <div className="text-xl">
                {match.result.toLowerCase().includes("rcb won") ? (
                  <span className="text-green-300">✅</span>
                ) : match.result.toLowerCase().includes("won by") ? (
                  <span className="text-red-300">❌</span>
                ) : (
                  <span className="text-yellow-300">⚖️</span>
                )}
              </div>
            </div>

            <h2 className="text-2xl font-semibold">{match.match}</h2>
            <p className="text-sm italic text-gray-300">{match.venue}</p>
            <p className="text-lg mt-2">{match.date}</p>
            <p className="text-gray-200 mt-2">{match.result}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Matches;
