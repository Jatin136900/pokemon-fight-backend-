import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { sounds, play } from "../utils/sound";

function BattleIntro({ pokemons, onFinish }) {
  const [count, setCount] = useState(3);
  const box = useRef(null);
  const played = useRef(false);

  useEffect(() => {
    if (!box.current) return;
    gsap.fromTo(
      box.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1 }
    );
  }, []);

  useEffect(() => {
    if (!played.current) {
      play(sounds.countdown);
      played.current = true;
    }
  }, []);

  useEffect(() => {
    if (count === 0) {
      const t = setTimeout(onFinish, 700);
      return () => clearTimeout(t);
    }
    const timer = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onFinish]);

  return (
    <div
      ref={box}
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white"
    >
      <h1 className="text-4xl font-bold text-red-500 mb-10">
        ⚔️ Your Pokémons are Ready!
      </h1>

      <div className="flex gap-14 mb-10">
        {pokemons.map(p => (
          <img
            key={p.id}
            src={
              p?.sprites?.other?.["official-artwork"]?.front_default ||
              p?.sprites?.front_default
            }
            className="w-44"
            alt={p.name}
          />
        ))}
      </div>

      <div className="text-8xl font-extrabold text-yellow-400">
        {count === 0 ? "START!" : count}
      </div>
    </div>
  );
}

export default BattleIntro;
