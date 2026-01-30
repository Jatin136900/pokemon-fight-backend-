import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../axiosConfig";
import bgVideo from "../../public/img/video1.mp4";
import pokeball from "../../public/img/ball2.png";
import Details from "./Details.jsx";

function PokemonFetch() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const [fighters, setFighters] = useState([]);
  const [offset, setOffset] = useState(0);     // ✅ pagination
  const [search, setSearch] = useState("");    // ✅ search

  const navigate = useNavigate();

  // ✅ INITIAL FETCH
  useEffect(() => {
    fetchPokemon(false, 0);
  }, []);

  // ✅ FETCH FUNCTION (OFFSET SAFE)
  async function fetchPokemon(loadMore = false, customOffset = 0) {
    const res = await instance.get(
      `/pokemon?offset=${customOffset}`,
      { withCredentials: true }
    );

    setPokemon(prev =>
      loadMore ? [...prev, ...res.data] : res.data
    );

    setLoading(false);
  }

  // ✅ LOAD 20 MORE (NO DUPLICATES)
  function loadMorePokemon() {
    const newOffset = offset + 20;
    setOffset(newOffset);
    fetchPokemon(true, newOffset);
  }

  // ✅ SELECT / DESELECT / SWAP
  function selectForFight(p) {
    setFighters(prev => {
      if (prev.find(f => f.id === p.id)) {
        return prev.filter(f => f.id !== p.id);
      }

      if (prev.length < 2) {
        return [...prev, p];
      }

      return [prev[0], p];
    });
  }

  function startBattle() {
    navigate("intro", { state: { fighters } });
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

      {/* DETAILS MODAL */}
      {selectedPokemon && (
        <Details
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}

      {/* SEARCH INPUT */}
      <div className="relative z-10 max-w-md mx-auto mb-12">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 outline-none"
        />
      </div>

      {/* SELECTED FIGHTERS */}
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

      {/* POKEMON GRID */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto py-25">

          {pokemon
            .filter(p =>
              p.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((p) => {
              const img =
                p.sprites?.other?.dream_world?.front_default;
              const isSelected =
                fighters.some(f => f.id === p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => selectForFight(p)}
                  className={`
                    relative h-[360px] mb-8 cursor-pointer rounded-3xl
                    bg-gradient-to-b from-[#101935] to-[#0b1220]
                    shadow-xl flex flex-col items-center
                    pt-16 pb-6 transition-all duration-500
                    hover:-translate-y-3 hover:shadow-2xl
                    ${isSelected ? "neon-red-border" : ""}
                  `}
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
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 capitalize"
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPokemon(p);
                    }}
                    className="mt-6 px-6 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition"
                  >
                    ⚡ More details
                  </button>
                </div>
              );
            })}
        </div>

        {/* LOAD MORE */}
        <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50">
          <button
            onClick={loadMorePokemon}
            className="glitter-new flex items-center gap-2 px-6 py-2.5 font-semibold rounded-lg
    bg-[#fdc700] text-white
    backdrop-blur-md shadow-lg border border-none
    transition-all hover:scale-105"
          >
            More Pokémon
          </button>
        </div>



      </div>
    </div>
  );
}

export default PokemonFetch;
