import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Player = { name: string; runs?: number; wickets?: number };
type YearStats = {
  year: number;
  matches: number;
  wins: number;
  losses: number;
  winPercent: number;
  finalPosition: string;
};

const rcbStatsByYear: YearStats[] = [
  { year: 2008, matches: 14, wins: 6, losses: 7, winPercent: 42.86, finalPosition: "6th" },
  { year: 2009, matches: 14, wins: 7, losses: 7, winPercent: 50.0, finalPosition: "2nd (Finalist)" },
  { year: 2010, matches: 14, wins: 7, losses: 7, winPercent: 50.0, finalPosition: "4th" },
  { year: 2011, matches: 16, wins: 8, losses: 8, winPercent: 50.0, finalPosition: "4th (Finalist)" },
  { year: 2012, matches: 16, wins: 11, losses: 5, winPercent: 68.75, finalPosition: "2nd" },
  { year: 2013, matches: 16, wins: 6, losses: 10, winPercent: 37.5, finalPosition: "7th" },
  { year: 2014, matches: 14, wins: 7, losses: 7, winPercent: 50.0, finalPosition: "5th" },
  { year: 2015, matches: 14, wins: 6, losses: 8, winPercent: 42.86, finalPosition: "6th" },
  { year: 2016, matches: 16, wins: 8, losses: 8, winPercent: 50.0, finalPosition: "4th (Finalist)" },
  { year: 2017, matches: 14, wins: 6, losses: 8, winPercent: 42.86, finalPosition: "7th" },
  { year: 2018, matches: 14, wins: 6, losses: 8, winPercent: 42.86, finalPosition: "7th" },
  { year: 2019, matches: 14, wins: 5, losses: 9, winPercent: 35.71, finalPosition: "8th" },
  { year: 2020, matches: 14, wins: 7, losses: 7, winPercent: 50.0, finalPosition: "4th" },
  { year: 2021, matches: 14, wins: 6, losses: 8, winPercent: 42.86, finalPosition: "6th" },
  { year: 2022, matches: 14, wins: 8, losses: 6, winPercent: 57.14, finalPosition: "3rd" },
  { year: 2023, matches: 14, wins: 6, losses: 8, winPercent: 42.86, finalPosition: "7th" },
  { year: 2024, matches: 16, wins: 11, losses: 3, winPercent: 78.57, finalPosition: "1st" },
  { year: 2025, matches: 16, wins: 11, losses: 5, winPercent: 68.75, finalPosition: "1st (Champions)" },
];

// Overall Top Players
const topBatsmenOverall: Player[] = [
  { name: "Virat Kohli", runs: 8618 },
  { name: "AB de Villiers", runs: 5162 },
  { name: "Chris Gayle", runs: 4965 },
  { name: "KL Rahul", runs: 5222 },
  { name: "Devdutt Padikkal", runs: 1512 },
];

const topBowlersOverall: Player[] = [
  { name: "Mohammed Siraj", wickets: 87 },
  { name: "R Vinay Kumar", wickets: 70 },
  { name: "Anil Kumble", wickets: 51 },
  { name: "S Aravind", wickets: 50 },
  { name: "Josh Hazlewood", wickets: 18 },
];

const Stats: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const yearStats = rcbStatsByYear.find((s) => s.year === selectedYear);

  const chartData = {
    labels: ["Wins", "Losses"],
    datasets: [
      {
        label: `Matches ${selectedYear}`,
        data: yearStats ? [yearStats.wins, yearStats.losses] : [0, 0],
        backgroundColor: ["#FFD700", "#B91C1C"], // Gold for Wins, Dark Red for Losses
      },
    ],
  };

  // Cumulative Stats
  const totalMatches = 264;
  const totalWins = 132;
  const totalLosses = 129;
  const winPercentage = 50.0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950 to-black text-white py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 drop-shadow-lg">
        🏆 RCB IPL Performance Overview (2008–2025)
      </h1>

      {/* Year Selector */}
      <div className="mb-8 flex justify-center gap-3 flex-wrap">
        {rcbStatsByYear.map((s) => (
          <button
            key={s.year}
            className={`px-4 py-2 rounded-lg font-semibold shadow-md transition-all ${
              selectedYear === s.year
                ? "bg-gradient-to-r from-yellow-500 to-yellow-300 text-black"
                : "bg-red-800 bg-opacity-60 hover:bg-red-700"
            }`}
            onClick={() => setSelectedYear(s.year)}
          >
            {s.year}
          </button>
        ))}
      </div>

      {/* Cumulative Stats */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-10">
        {[totalMatches, totalWins, totalLosses, winPercentage].map((stat, idx) => {
          const label = ["Total Matches", "Total Wins", "Total Losses", "Win Percentage"][idx];
          return (
            <motion.div
              key={idx}
              className="bg-gradient-to-b from-red-900/80 to-black rounded-2xl p-6 shadow-lg text-center w-40 border border-yellow-400/40"
              whileHover={{ scale: 1.05 }}
            >
              <h2 className="text-3xl font-bold text-yellow-400">{stat}</h2>
              <p className="text-gray-300 mt-2">{label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Centered Chart */}
      <div className="flex justify-center mb-10">
        <div className="bg-gradient-to-b from-red-900/80 to-black rounded-2xl p-6 shadow-lg w-full max-w-2xl border border-yellow-400/40">
          <Bar
            data={chartData}
            options={{ responsive: true, plugins: { legend: { position: "top" } } }}
          />
        </div>
      </div>

      {/* Year-wise Table */}
      <div className="overflow-x-auto mb-10">
        <table className="min-w-full bg-gradient-to-b from-red-900/70 to-black rounded-2xl overflow-hidden text-white border border-yellow-400/40">
          <thead className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black">
            <tr>
              <th className="px-4 py-2 text-left">Year</th>
              <th className="px-4 py-2">Matches</th>
              <th className="px-4 py-2">Wins</th>
              <th className="px-4 py-2">Losses</th>
              <th className="px-4 py-2">Win %</th>
              <th className="px-4 py-2">Final Position</th>
            </tr>
          </thead>
          <tbody>
            {rcbStatsByYear.map((s) => (
              <tr
                key={s.year}
                className="border-b border-red-700 hover:bg-red-700/30 transition"
              >
                <td className="px-4 py-2">{s.year}</td>
                <td className="px-4 py-2 text-center">{s.matches}</td>
                <td className="px-4 py-2 text-center text-yellow-400 font-semibold">{s.wins}</td>
                <td className="px-4 py-2 text-center">{s.losses}</td>
                <td className="px-4 py-2 text-center">{s.winPercent}%</td>
                <td className="px-4 py-2 text-center">{s.finalPosition}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Batsmen Table */}
      <div className="overflow-x-auto mb-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-yellow-400">
          Top 5 Batsmen (2008–2025)
        </h2>
        <table className="min-w-full bg-gradient-to-b from-red-900/70 to-black rounded-2xl overflow-hidden text-white border border-yellow-400/40">
          <thead className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black">
            <tr>
              <th className="px-4 py-2 text-left">Player</th>
              <th className="px-4 py-2 text-center">Runs</th>
            </tr>
          </thead>
          <tbody>
            {topBatsmenOverall.map((player, idx) => (
              <tr
                key={idx}
                className="border-b border-red-700 hover:bg-red-700/30 transition"
              >
                <td className="px-4 py-2">{player.name}</td>
                <td className="px-4 py-2 text-center text-yellow-400 font-semibold">
                  {player.runs}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Bowlers Table */}
      <div className="overflow-x-auto mb-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-yellow-400">
          Top 5 Bowlers (2008–2025)
        </h2>
        <table className="min-w-full bg-gradient-to-b from-red-900/70 to-black rounded-2xl overflow-hidden text-white border border-yellow-400/40">
          <thead className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black">
            <tr>
              <th className="px-4 py-2 text-left">Player</th>
              <th className="px-4 py-2 text-center">Wickets</th>
            </tr>
          </thead>
          <tbody>
            {topBowlersOverall.map((player, idx) => (
              <tr
                key={idx}
                className="border-b border-red-700 hover:bg-red-700/30 transition"
              >
                <td className="px-4 py-2">{player.name}</td>
                <td className="px-4 py-2 text-center text-yellow-400 font-semibold">
                  {player.wickets}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stats;
