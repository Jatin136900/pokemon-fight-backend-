import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 🔥 ADDED
import instance from "../axiosConfig";
import bgVideo from "../../public/img/video1.mp4";
import pokeball from "../../public/img/ball2.png";
import Details from "./Details.jsx";

function PokemonFetch() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const [fighters, setFighters] = useState([]); // 🔥 ADDED
  const navigate = useNavigate(); // 🔥 ADDED

  useEffect(() => {
    fetchPokemon();
  }, []);

  async function fetchPokemon() {
    const res = await instance.get("/pokemon", {
      withCredentials: true,
    });
    setPokemon(res.data);
    setLoading(false);
  }

  // 🔥 ADDED: select pokemon for fight
  function selectForFight(p) {
    if (fighters.find(f => f.id === p.id)) return;
    if (fighters.length < 2) {
      setFighters(prev => [...prev, p]);
    }
  }

  // 🔥 ADDED: start battle
  function startBattle() {
    navigate("intro", {
      state: { fighters },
    });
  }

  return (
    <div className="min-h-screen pt-24 px-6 relative overflow-hidden">

      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <img
            src={pokeball}
            alt="Loading"
            className="w-28 h-28 animate-spin"
          />
        </div>
      )}

      {/* 🔥 DETAILS MODAL */}
      {selectedPokemon && (
        <Details
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}

      {/* 🔥 ADDED: Selected Fighters Section */}
      {fighters.length > 0 && (
        <div className="relative z-10 max-w-7xl mx-auto pt-10">
          <h2 className="text-white text-2xl font-bold mb-4 text-center">
            Selected Fighters
          </h2>

          <div className="flex justify-center gap-10">
            {fighters.map(f => (
              <div
                key={f.id}
                className="w-48 h-56 rounded-2xl bg-white/10 backdrop-blur-lg flex flex-col items-center justify-center"
              >
                <img
                  src={f.sprites.other.dream_world.front_default}
                  className="w-28"
                />
                <p className="text-white font-semibold capitalize mt-2">
                  {f.name}
                </p>
              </div>
            ))}
          </div>

          {fighters.length === 2 && (
            <div className="text-center mt-6">
              <button
                onClick={startBattle}
                className="px-10 py-3 bg-red-600 text-white rounded-xl text-lg font-bold hover:bg-red-700 transition"
              >
                ⚔️ Fight
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto pt-20">
          {pokemon.map((p) => {
            const img =
              p.sprites?.other?.dream_world?.front_default;

            return (
              <div
                key={p.id}
                className="
                  relative h-[360px]
                  rounded-3xl
                  bg-gradient-to-b from-[#101935] to-[#0b1220]
                  shadow-xl
                  flex flex-col items-center
                  pt-16 pb-6
                  transition-all duration-500
                  hover:-translate-y-3 hover:shadow-2xl
                "
              >
                <img
                  src={img}
                  alt={p.name}
                  className="absolute -top-12 w-36 h-36 drop-shadow-2xl transition-all duration-500 hover:-translate-y-3 "
                />

                <h3 className="text-white text-2xl font-bold capitalize mt-16">
                  {p.name}
                </h3>

                <div className="flex gap-3 mt-3">
                  {p.types.map((t, i) => (
                    <span
                      key={i}
                      className="
                        px-3 py-1 text-xs font-semibold
                        rounded-full
                        bg-green-500/20 text-green-400
                        capitalize
                      "
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between w-full px-10 mt-6 text-gray-300 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-white">
                      {p.height / 10} M
                    </p>
                    <span className="opacity-70">Altura</span>
                  </div>

                  <div className="text-center">
                    <p className="font-semibold text-white">
                      {p.weight / 10} KG
                    </p>
                    <span className="opacity-70">Weight</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPokemon(p)}
                  className="
                    cursor-pointer
                    mt-6 px-6 py-2 rounded-xl
                    bg-white/10 text-white text-sm
                    hover:bg-white/20 transition
                  "
                >
                  ⚡ More details
                </button>

                {/* 🔥 ADDED: Select for Fight */}
                <button
                  onClick={() => selectForFight(p)}
                  className="mt-2 px-6 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition"
                >
                  Select for Fight
                </button>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PokemonFetch;
