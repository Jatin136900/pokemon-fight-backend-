import React, { useEffect, useState } from "react";
import instance from "../axiosConfig.js";
import BattleIntro from "./BattleIntro";
import BattleArena from "./BattleArena";

// 🔴 CHANGE HERE: navigation import
import { useNavigate } from "react-router-dom";

function PokemonFetch() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState([]);
  const [stage, setStage] = useState("select");

  // 🔴 CHANGE HERE: init navigate
  const navigate = useNavigate();

  useEffect(() => {
    fetchPokemon();
  }, []);

  async function fetchPokemon() {
    try {
      const res = await instance.get("/pokemon", {
        withCredentials: true,
      });
      setPokemons(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function selectPokemon(pokemon) {
    if (selected.length >= 2) return;
    if (selected.some((p) => p.id === pokemon.id)) return;
    setSelected((prev) => [...prev, pokemon]);
  }

  /* ================= STAGE RENDER ================= */
  if (stage === "intro") {
    return (
      <BattleIntro
        pokemons={selected}
        // 🔴 CHANGE HERE: intro ke baad navigate
        onFinish={() => navigate("/battle", { state: selected })}
      />
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-red-500">
        🔥 Pokémon Battle Arena 🔥
      </h1>

      {loading && (
        <p className="text-center mt-10 text-gray-400">Loading...</p>
      )}

      {selected.length > 0 && (
        <div className="flex justify-center gap-16 mt-10">
          {selected.map((p) => (
            <div
              key={p.id}
              className="bg-gray-900 rounded-2xl p-4 w-48 text-center"
            >
              <img
                src={
                  p.sprites.other?.["official-artwork"]?.front_default ||
                  p.sprites.front_default
                }
                alt={p.name}
                className="w-32 mx-auto"
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
            className="px-12 py-4 text-xl font-bold rounded-full bg-red-600"
          >
            ⚔️ FIGHT
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-20">
        {pokemons.map((pokemon) => {
          const image =
            pokemon.sprites.other?.dream_world?.front_default ||
            pokemon.sprites.other?.["official-artwork"]?.front_default ||
            pokemon.sprites.front_default;

          const isSelected = selected.some((p) => p.id === pokemon.id);

          return (
            <div
              key={pokemon.id}
              onClick={() => selectPokemon(pokemon)}
              className={`cursor-pointer bg-gray-900 rounded-2xl p-4 text-center ${
                isSelected ? "ring-4 ring-red-500" : ""
              }`}
            >
              <img src={image} alt={pokemon.name} className="w-24 mx-auto" />
              <h3 className="capitalize mt-3 font-bold">{pokemon.name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PokemonFetch;
