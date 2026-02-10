import { Router } from "express";
import { fetchPokemon, fightPokemon, getHistory } from "../Controllers/Pokemon.js";
import { protect } from "../middlewares/auth.js"; // ✅ NAMED IMPORT

const pokemonRouter = Router();

pokemonRouter.get("/", fetchPokemon);

// 🔐 protected routes
pokemonRouter.post("/fight", protect, fightPokemon);
pokemonRouter.get("/history", protect, getHistory);

export default pokemonRouter;
