import axios from "axios";

import { importDataFromURL } from "../utils/importDataFromURL.js"


const POKE_BASE_URL = "https://pokeapi.co/api/v2/pokemon";



export async function fetchPokemon(req, res) {
    try {
        const temp = await importDataFromURL(POKE_BASE_URL + "/?limit=20&offset=0");

        const promises = temp.results.map((pokemon) =>
            importDataFromURL(pokemon.url, true)
        );

        const pokemons = await Promise.all(promises);
        return res.status(200).json(pokemons);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


export async function fightPokemon(req, res) {
    try {
        const { pokemon1, pokemon2 } = req.body;

        const [p1Res, p2Res] = await Promise.all([
            axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon1.id}`),
            axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon2.id}`),
        ]);

        function calcPower(pokemon) {
            const stats = {};
            pokemon.stats.forEach((s) => {
                stats[s.stat.name] = s.base_stat;
            });

            return (
                (stats.attack || 0) +
                (stats.defense || 0) +
                (stats.speed || 0)
            );
        }

        const power1 = calcPower(p1Res.data);
        const power2 = calcPower(p2Res.data);

        console.log(power1, power2);

        let winner = "draw";
        if (power1 > power2) winner = pokemon1.name;
        if (power2 > power1) winner = pokemon2.name;

        res.json({
            pokemon1: { name: pokemon1.name, power: power1 },
            pokemon2: { name: pokemon2.name, power: power2 },
            winner,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

