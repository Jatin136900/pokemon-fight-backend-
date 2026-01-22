import { Router } from "express";
import { fetchPokemon, fightPokemon } from "../Controllers/Pokemon.js";

const pokemonRouter = Router();



pokemonRouter.get("/", fetchPokemon);
pokemonRouter.post("/fight", fightPokemon)


export default pokemonRouter;