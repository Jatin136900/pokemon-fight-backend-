function Details({ pokemon, onClose }) {
  const img =
    pokemon.sprites?.other?.dream_world?.front_default;

  return (
    // Glass overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-white/5 px-4">
      
      {/* Glass Card */}
      <div
        className="
        relative 
        w-full max-w-[900px]
        flex flex-col md:flex-row gap-6 md:gap-10
        p-6 md:p-10
        rounded-3xl
        bg-white/20 backdrop-blur-2xl
        border border-white/30
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        "
      >

        {/* Back */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 md:top-6 md:left-6 text-white/80 hover:text-white cursor-pointer"
        >
          ← Back
        </button>

        {/* Left Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            src={img}
            className="w-48 sm:w-64 md:w-80 drop-shadow-2xl"
          />
        </div>

        {/* Right Content */}
        <div className="w-full md:w-1/2 text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold capitalize mb-4">
            {pokemon.name}
          </h1>

          {/* Types */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            {pokemon.types.map((t, i) => (
              <span
                key={i}
                className="px-3 sm:px-4 py-1 rounded-full bg-white/20 backdrop-blur-md capitalize text-sm sm:text-base"
              >
                {t.type.name}
              </span>
            ))}
          </div>

          {/* Abilities */}
          <h3 className="font-semibold mb-2">Abilities</h3>
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
            {pokemon.abilities.map((a, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-white/20 rounded-lg capitalize text-sm"
              >
                {a.ability.name}
              </span>
            ))}
          </div>

          {/* Stats */}
          <h3 className="font-semibold mb-2">Stats</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {pokemon.stats.map((s, i) => (
              <div
                key={i}
                className="p-3 sm:p-4 bg-white/20 rounded-xl"
              >
                <p className="text-xs sm:text-sm opacity-70 capitalize">
                  {s.stat.name}
                </p>
                <p className="font-bold text-sm sm:text-base">
                  {s.base_stat}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Details;
