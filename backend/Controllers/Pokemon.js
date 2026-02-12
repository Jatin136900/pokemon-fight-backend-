// import axios from "axios";
// import { importDataFromURL } from "../utils/importDataFromURL.js";
// import History from "../Models/history.js";
// import { io } from "../index.js";

// const POKE_BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// export async function fetchPokemon(req, res) {
//   try {
//     const offset = Number(req.query.offset) || 0;
//     const limit = offset + 20;

//     const temp = await importDataFromURL(
//       `${POKE_BASE_URL}/?limit=${limit}&offset=0`
//     );

//     const promises = temp.results.map((pokemon) =>
//       importDataFromURL(pokemon.url, true)
//     );

//     const pokemons = await Promise.all(promises);
//     return res.status(200).json(pokemons);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// }

// /* ================= FIGHT ================= */
// export async function fightPokemon(req, res) {
//   try {
//     const { pokemon1, pokemon2 } = req.body;

//     const [p1Res, p2Res] = await Promise.all([
//       axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon1.id}`),
//       axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon2.id}`),
//     ]);

//     const calcPower = (pokemon) => {
//       const stats = {};
//       pokemon.stats.forEach((s) => {
//         stats[s.stat.name] = s.base_stat;
//       });

//       return (
//         (stats.attack || 0) +
//         (stats.defense || 0) +
//         (stats.speed || 0)
//       );
//     };

//     const power1 = calcPower(p1Res.data);
//     const power2 = calcPower(p2Res.data);

//     let winner = "draw";
//     if (power1 > power2) winner = pokemon1.name;
//     if (power2 > power1) winner = pokemon2.name;

//     const history = await History.create({
//       user: req.userId,
//       pokemon1: pokemon1.name,
//       pokemon2: pokemon2.name,
//       winner,
//       power1,
//       power2,
//     });

//     // 🔥 REAL-TIME EMIT
//     io.emit("newHistory", history);

//     res.json({
//       pokemon1: { name: pokemon1.name, power: power1 },
//       pokemon2: { name: pokemon2.name, power: power2 },
//       winner,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }

// export async function getHistory(req, res) {
//   try {
//     const history = await History.find({ user: req.userId }).sort({
//       createdAt: -1,
//     });
//     res.json(history);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }


import axios from "axios";
import { importDataFromURL } from "../utils/importDataFromURL.js";
import History from "../Models/history.js";
import { io } from "../index.js";

const POKE_BASE_URL = "https://pokeapi.co/api/v2/pokemon";

export async function fetchPokemon(req, res) {
  try {
    const offset = Number(req.query.offset) || 0;
    const limit = offset + 20;

    const temp = await importDataFromURL(
      `${POKE_BASE_URL}/?limit=${limit}&offset=0`
    );

    const promises = temp.results.map((pokemon) =>
      importDataFromURL(pokemon.url, true)
    );

    const pokemons = await Promise.all(promises);
    return res.status(200).json(pokemons);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/* ================= FIGHT ================= */
export async function fightPokemon(req, res) {
  try {
    const { pokemon1, pokemon2 } = req.body;

    // 🔐 Safety check (important)
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [p1Res, p2Res] = await Promise.all([
      axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon1.id}`),
      axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon2.id}`),
    ]);

    const calcPower = (pokemon) => {
      const stats = {};
      pokemon.stats.forEach((s) => {
        stats[s.stat.name] = s.base_stat;
      });

      return (
        (stats.attack || 0) +
        (stats.defense || 0) +
        (stats.speed || 0)
      );
    };

    const power1 = calcPower(p1Res.data);
    const power2 = calcPower(p2Res.data);

    let winner = "draw";
    if (power1 > power2) winner = pokemon1.name;
    if (power2 > power1) winner = pokemon2.name;

    // ✅ SAVE HISTORY WITH USER ID
    const history = await History.create({
      user: req.userId, // important
      pokemon1: pokemon1.name,
      pokemon2: pokemon2.name,
      winner,
      power1,
      power2,
    });

    // 🔥 Emit only to connected clients
    io.emit("newHistory", history);

    res.json({
      pokemon1: { name: pokemon1.name, power: power1 },
      pokemon2: { name: pokemon2.name, power: power2 },
      winner,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* ================= GET USER HISTORY ================= */
export async function getHistory(req, res) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const history = await History.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

