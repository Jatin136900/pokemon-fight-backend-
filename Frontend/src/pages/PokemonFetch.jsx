import { useEffect } from 'react'
import instance from '../axiosConfig';
import { useState } from 'react';

function HeroSection() {

  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    fetchPokemon();
  }, []);



  async function fetchPokemon() {
    const response = await instance.get("/pokemon", { withCredentials: true });
    console.log(response.data);
    setPokemon(response.data)
  }


  return (
    <>
      <div className='pt-24'>
        <h1>Pokemon List</h1>
        <div>
          {pokemon.map((pokemons) => {
            const img = pokemons.sprites.other.dream_world.front_default
            return (
              <div key={pokemon.id}>
                <img src={img} alt="" className='' />
                <h3>{pokemons.name}</h3>
              </div>
            )
          })}
        </div>
      </div>

    </>
  )
}
export default HeroSection;