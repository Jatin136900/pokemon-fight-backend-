function Details({ pokemon, onClose }) {
  const img =
    pokemon.sprites?.other?.dream_world?.front_default;

  return (
    // Glass overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-white/5">
      
      {/* Glass Card */}
      <div className="relative w-[900px] flex gap-10 p-10 rounded-3xl
        bg-white/20 backdrop-blur-2xl
        border border-white/30
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

        {/* Back */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 text-white/80 hover:text-white cursor-pointer"
        >
          ← Back
        </button>

        {/* Left Image */}
        <div className="w-1/2 flex items-center justify-center">
          <img src={img} className="w-80 drop-shadow-2xl" />
        </div>

        {/* Right Content */}
        <div className="w-1/2 text-white">
          <h1 className="text-4xl font-bold capitalize mb-4">
            {pokemon.name}
          </h1>

          {/* Types */}
          <div className="flex gap-3 mb-6">
            {pokemon.types.map((t, i) => (
              <span
                key={i}
                className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-md capitalize"
              >
                {t.type.name}
              </span>
            ))}
          </div>

          {/* Abilities */}
          <h3 className="font-semibold mb-2">Abilities</h3>
          <div className="flex gap-4 mb-6">
            {pokemon.abilities.map((a, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-white/20 rounded-lg capitalize"
              >
                {a.ability.name}
              </span>
            ))}
          </div>

          {/* Stats */}
          <h3 className="font-semibold mb-2">Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            {pokemon.stats.map((s, i) => (
              <div
                key={i}
                className="p-4 bg-white/20 rounded-xl"
              >
                <p className="text-sm opacity-70 capitalize">
                  {s.stat.name}
                </p>
                <p className="font-bold">{s.base_stat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
