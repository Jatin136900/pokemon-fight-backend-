import { useEffect, useState } from "react";
import instance from "../axiosConfig.js";
import BattleIntro from "./BattleIntro";
import { useNavigate } from "react-router-dom";

function PokemonFetch() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [selected, setSelected] = useState([]);
  const [stage, setStage] = useState("select");

  // 🔍 Search & Type
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [allTypes, setAllTypes] = useState([]);

  // 🔥 Modal
  const [showModal, setShowModal] = useState(false);
  const [activePokemon, setActivePokemon] = useState(null);

  // 🔥 Pagination
  const [offset, setOffset] = useState(0);
  const LIMIT = 20;

  const navigate = useNavigate();

  /* ================= FETCH ================= */
  useEffect(() => {
    setPokemons([]);
    setOffset(0);
    fetchPokemon(false);
  }, [type]);

  async function fetchPokemon(loadMore = false) {
    try {
      loadMore ? setLoadingMore(true) : setLoading(true);

      const res = await instance.get(
        `/pokemon?limit=${LIMIT}&offset=${loadMore ? offset : 0}${type ? `&type=${type}` : ""
        }`,
        { withCredentials: true }
      );

      setPokemons((prev) =>
        loadMore ? [...prev, ...res.data] : res.data
      );

      if (loadMore) {
        setOffset((prev) => prev + LIMIT);
      } else {
        setOffset(LIMIT);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  /* ================= ALL TYPES (GLOBAL) ================= */
  useEffect(() => {
    async function fetchAllTypes() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/type");
        const data = await res.json();
        setAllTypes(data.results.map((t) => t.name));
      } catch (err) {
        console.error(err);
      }
    }
    fetchAllTypes();
  }, []);

  /* ================= SELECT ================= */
  function selectPokemon(pokemon) {
    if (selected.length >= 2) return;
    if (selected.some((p) => p.id === pokemon.id)) return;
    setSelected((prev) => [...prev, pokemon]);
  }

  /* ================= FILTER (SEARCH ONLY) ================= */
  const filteredPokemons = pokemons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= INTRO ================= */
  if (stage === "intro") {
    return (
      <BattleIntro
        pokemons={selected}
        onFinish={() => navigate("/battle", { state: selected })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-red-500">
        🔥 Pokémon Battle Arena 🔥
      </h1>

      {/* Search + Type */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3 p-3 rounded-xl bg-gray-800 border border-gray-600"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full sm:w-1/4 p-3 rounded-xl bg-gray-800 border border-gray-600"
        >
          <option value="">All Types</option>
          {allTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="text-center mt-10 text-gray-400">Loading...</p>
      )}

      {!loading && filteredPokemons.length === 0 && (
        <p className="text-center mt-20 text-xl text-gray-400">
          ❌ No Pokémon Found
        </p>
      )}

      {/* Selected Pokémon */}
      {selected.length > 0 && (
        <div className="flex justify-center gap-6 mt-10 flex-wrap">
          {selected.map((p) => (
            <div
              key={p.id}
              className="bg-gray-900 rounded-xl p-4 w-36 text-center"
            >
              <img
                src={
                  p.sprites.other?.["official-artwork"]?.front_default ||
                  p.sprites.front_default
                }
                alt={p.name}
                className="w-24 mx-auto"
              />
              <h3 className="capitalize font-bold mt-2">{p.name}</h3>
            </div>
          ))}
        </div>
      )}

      {selected.length < 2 && (
        <p className="text-center mt-6 text-gray-400">
          Select {2 - selected.length} Pokémon to fight
        </p>
      )}

      {selected.length === 2 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setStage("intro")}
            className="px-12 py-4 text-xl font-bold rounded-full bg-red-600 hover:bg-red-700"
          >
            ⚔️ FIGHT
          </button>
        </div>
      )}

      {/* Pokémon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-20">
        {filteredPokemons.map((pokemon) => {
          const image =
            pokemon.sprites.other?.dream_world?.front_default ||
            pokemon.sprites.other?.["official-artwork"]?.front_default ||
            pokemon.sprites.front_default;

          const isSelected = selected.some((p) => p.id === pokemon.id);

          return (
            <div
              key={pokemon.id}
              onClick={() => selectPokemon(pokemon)}
              className={`cursor-pointer bg-gray-900 rounded-2xl p-4 text-center transition ${isSelected ? "ring-4 ring-red-500" : "hover:scale-105"
                }`}
            >
              <img src={image} alt={pokemon.name} className="w-20 mx-auto" />
              <h3 className="capitalize mt-3 font-bold">
                {pokemon.name}
              </h3>
              <p className="mt-2 text-sm text-gray-400 capitalize">
                {pokemon.types.map((t) => t.type.name).join(", ")}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePokemon(pokemon);
                  setShowModal(true);
                }}
                className="mt-3 px-4 py-1 text-sm rounded-full bg-cyan-500 hover:bg-cyan-600"
              >
                Know More
              </button>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      <button
        onClick={() => fetchPokemon(true)}
        disabled={loadingMore}
        className="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 font-bold shadow-xl"
      >
        {loadingMore ? "Loading..." : "Load More +20"}
      </button>

      {/* MODAL */}
      {showModal && activePokemon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-full max-w-md rounded-2xl bg-gray-900 p-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-2xl"
            >
              ✕
            </button>

            <img
              src={
                activePokemon.sprites.other?.["official-artwork"]?.front_default ||
                activePokemon.sprites.front_default
              }
              alt={activePokemon.name}
              className="w-32 mx-auto"
            />

            <h2 className="text-center text-2xl font-bold capitalize mt-4">
              {activePokemon.name}
            </h2>

            <div className="mt-4 text-sm space-y-1">
              {activePokemon.stats.map((s) => (
                <p key={s.stat.name}>
                  {s.stat.name.toUpperCase()}: {s.base_stat}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PokemonFetch;
