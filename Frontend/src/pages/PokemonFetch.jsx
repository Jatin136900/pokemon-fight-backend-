import { useEffect, useState } from "react";
import instance from "../axiosConfig";
import bgVideo from "../../public/img/video1.mp4";
import pokeball from "../../public/img/ball2.png";
import Details from "./Details.jsx";

function PokemonFetch() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

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

      {/* Content */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto pt-15">
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
                  className="absolute -top-12 w-36 h-36 drop-shadow-2xl"
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
                    <span className="opacity-70">Peso</span>
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PokemonFetch;
