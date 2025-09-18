type PlayerProps = {
  player: {
    id: number;
    name: string;
    nationality: string;
    battingStyle: string;
    bowlingStyle: string;
    role: string;
    yearSigned: number;
    experience: number;
    image: string;
  };
};

function PlayerCard({ player }: PlayerProps) {
  return (
    <div className="relative bg-gradient-to-b from-gray-500/40 to-gray-900/90 rounded-2xl shadow-xl overflow-hidden hover:shadow-yellow-300/40 hover:scale-105 transform transition-all duration-300">
      {/* Player Image */}
      <div className="relative">
        <img
          src={player.image}
          alt={player.name}
          className="w-full h-64 object-cover object-top rounded-t-2xl"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

        {/* Role Badge */}
        <span className="absolute top-3 left-3 bg-blue-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {player.role}
        </span>

        {/* Experience Badge */}
        <span className="absolute top-3 right-3 bg-yellow-500/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {player.experience} yrs
        </span>
      </div>

      {/* Player Info */}
      <div className="p-5 text-gray-200">
        <h2 className="text-2xl font-extrabold text-red-400 drop-shadow-sm mb-1">
          {player.name}
        </h2>
        <p className="text-sm text-gray-400 italic mb-3">
          Nationality: {player.nationality}
        </p>

        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <p className="text-gray-300">
            <span className="font-semibold text-gray-100">Batting:</span>{" "}
            {player.battingStyle}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-gray-100">Bowling:</span>{" "}
            {player.bowlingStyle}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-gray-100">Joined:</span>{" "}
            {player.yearSigned}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-gray-100">Exp:</span>{" "}
            {player.experience} years
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;
