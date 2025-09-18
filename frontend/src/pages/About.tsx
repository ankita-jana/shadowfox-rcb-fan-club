import { Link } from "react-router-dom";
function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-900 text-white flex flex-col items-center py-16 px-6">
      {/* Hero Section */}
      <h1 className="text-5xl font-extrabold mb-6 text-center">
        🙋‍♂️ About RCB Fan Hub
      </h1>
      <p className="text-gray-300 max-w-2xl text-center text-lg mb-12">
        RCB Fan Hub is a community-driven platform dedicated to all
        <span className="text-red-400 font-semibold">
          {" "}
          Royal Challengers Bangalore{" "}
        </span>{" "}
        fans. Dive into players, stats, match updates, and the latest RCB news —
        all in one place.
      </p>

      {/* Journey Section */}
      <div className="max-w-6xl text-center mb-12 mx-auto">
        <img
          src="/logos/rcb-team.png"
          alt="Royal Challengers Bangalore Team"
          className="rounded-2xl shadow-xl mx-auto mb-6 w-full max-w-4xl object-contain"
        />
        <p className="text-gray-300 text-lg">
          Founded in 2008,{" "}
          <span className="text-red-400 font-semibold">
            Royal Challengers Bangalore{" "}
          </span>
          has been one of the most popular teams in the IPL. Known for its star
          players, thrilling matches, and an ever-passionate fanbase, RCB has
          seen unforgettable highs and challenging lows. With legends like{" "}
          <span className="text-yellow-400 font-bold">Virat Kohli</span> and
          <span className="text-yellow-400 font-bold"> AB de Villiers</span>,
          the journey has been nothing short of iconic. The dream of lifting the
          IPL trophy continues to inspire millions of fans worldwide. 💪🔥
        </p>

        {/* News Link */}
        <a
          href="https://www.espncricinfo.com/team/royal-challengers-bangalore-335974" // 👈 replace with latest RCB news link
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 text-red-400 hover:text-red-300 font-semibold underline"
        >
          📖 Read more about RCB →
        </a>
      </div>

      {/* Info Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        <div className="bg-yellow-800 bg-opacity-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-2xl font-bold mb-2">🎯 Our Mission</h2>
          <p className="text-gray-300">
            To unite RCB fans worldwide with a single hub for news, stats, and
            memories.
          </p>
        </div>

        <div className="bg-yellow-800 bg-opacity-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-2xl font-bold mb-2">📊 Player Stats</h2>
          <p className="text-gray-300">
            Explore detailed player profiles, performance history, and
            milestones.
          </p>
        </div>

        <div className="bg-yellow-800 bg-opacity-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-2xl font-bold mb-2">📰 Latest News</h2>
          <p className="text-gray-300">
            Stay updated with curated RCB-related articles, updates, and
            announcements.
          </p>
        </div>

        <div className="bg-yellow-800 bg-opacity-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h2 className="text-2xl font-bold mb-2">🙌 Fan Community</h2>
          <p className="text-gray-300">
            Connect with fellow fans, share your passion, and celebrate RCB
            together.
          </p>
        </div>
      </div>
      <Link to="/players">
        <button className="mt-12 px-6 py-3 bg-red-600 hover:bg-yellow-500 text-white font-semibold rounded-full shadow-lg transition">
          Explore Players →
        </button>
      </Link>
    </div>
  );
}

export default About;
