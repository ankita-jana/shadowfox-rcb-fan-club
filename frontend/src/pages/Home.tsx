import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
  {/* Background Image */}
  <img
    src="/logos/rcb-match.png"
    alt="RCB Match"
    className="absolute inset-0 w-full h-full object-cover"
  />
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/60"></div>

  {/* Content */}
  <motion.div
    className="relative z-10 max-w-3xl px-6"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    <h1 className="text-5xl md:text-6xl font-extrabold text-red-500 drop-shadow-lg">
      🔥 Welcome to RCB Fan Hub
    </h1>
    <p className="mt-6 text-lg md:text-xl text-gray-200 leading-relaxed">
      Your one-stop destination for everything{" "}
      <span className="text-yellow-400 font-semibold">
        Royal Challengers Bangalore 💪
      </span>
    </p>
  </motion.div>
</div>


      {/* RCB Legends Section */}
      <section className="py-16 px-6 text-center bg-gradient-to-r from-red-900 to-black">
        <h2 className="text-3xl font-bold mb-8 text-yellow-400">🏏 RCB Legends</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Virat Kohli",
              img: "/players/virat.png",
              fact: "Most runs in IPL history",
            },
            {
              name: "AB de Villiers",
              img: "/players/ab de.png",
              fact: "Mr. 360° of cricket",
            },
            {
              name: "Chris Gayle",
              img: "/players/chris-gayle.png",
              fact: "Fastest IPL century (30 balls)",
            },
          ].map((legend, i) => (
            <motion.div
              key={i}
              className="bg-black/70 rounded-xl p-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-40 h-40 mx-auto rounded-full border-4 border-red-600 overflow-hidden bg-black">
            <img
             src={legend.img}
             alt={legend.name}
             className="w-full h-full object-contain object-center"
            />
          </div>

              <h3 className="mt-4 text-xl font-bold text-red-400">
                {legend.name}
              </h3>
              <p className="text-gray-300 mt-2">{legend.fact}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Records / Milestones */}
      <section className="py-16 px-6 bg-red-800/30">
        <h2 className="text-3xl font-bold text-center mb-10">
          📊 Iconic RCB Records
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { label: "Highest Team Score", value: "263/5" },
            { label: "Fastest Century", value: "30 balls (Gayle)" },
            { label: "Most Runs", value: "Virat Kohli – 7000+" },
            { label: "Biggest Win", value: "138 runs" },
          ].map((record, i) => (
            <motion.div
              key={i}
              className="bg-black/60 rounded-xl p-6 text-center shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <p className="text-2xl font-bold text-yellow-400">{record.value}</p>
              <p className="text-gray-300 mt-2">{record.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
