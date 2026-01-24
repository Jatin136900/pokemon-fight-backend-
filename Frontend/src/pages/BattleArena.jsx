import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { play, sounds } from "../utils/sound.js";
import { useLocation, useNavigate } from "react-router-dom";

function BattleArena() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 FIX: correct state reading
  const pokemons = location.state;

  if (!pokemons || pokemons.length < 2) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-2xl font-bold mb-4">
          ⚠️ Please start battle from Home page
        </h1>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-red-500 rounded-full font-bold"
        >
          🔙 Go Back
        </button>
      </div>
    );
  }

  const [hp, setHp] = useState({ p1: 100, p2: 100 });
  const [turn, setTurn] = useState("p1");
  const arena = useRef(null);
  const winPlayed = useRef(false);

  const p1Ref = useRef(null);
  const p2Ref = useRef(null);
  const hp1Ref = useRef(null);
  const hp2Ref = useRef(null);

  useEffect(() => {
    play(sounds.attack);
  }, []);

  useEffect(() => {
    if (!arena.current) return;
    gsap.fromTo(arena.current, { opacity: 0 }, { opacity: 1, duration: 0.8 });
  }, []);

  function getStats(p) {
    const s = { attack: 50, defense: 40, speed: 40 };
    if (!p?.stats) return s;
    p.stats.forEach(x => (s[x.stat.name] = x.base_stat));
    return s;
  }

  function shake(ref) {
    if (!ref?.current) return;
    gsap.fromTo(ref.current, { x: -10 }, { x: 10, duration: 0.08, repeat: 5, yoyo: true });
  }

  function flash(ref) {
    if (!ref?.current) return;
    gsap.fromTo(ref.current, { filter: "brightness(2)" }, { filter: "brightness(1)", duration: 0.25 });
  }

  function animateHp(ref, value) {
    if (!ref?.current) return;
    gsap.to(ref.current, { width: `${value}%`, duration: 0.6 });
  }

  function attack(attacker, defender) {
    const a = getStats(attacker === "p1" ? pokemons[0] : pokemons[1]);
    const d = getStats(defender === "p1" ? pokemons[0] : pokemons[1]);

    const dmg = Math.max(
      Math.floor(a.attack * 0.4 + a.speed * 0.2 - d.defense * 0.3),
      6
    );

    attacker === "p1" ? shake(p1Ref) : shake(p2Ref);
    defender === "p1" ? flash(p1Ref) : flash(p2Ref);

    setHp(prev => {
      const newHp = { ...prev, [defender]: Math.max(prev[defender] - dmg, 0) };
      defender === "p1"
        ? animateHp(hp1Ref, newHp.p1)
        : animateHp(hp2Ref, newHp.p2);
      return newHp;
    });

    if (attacker === "p1") {
      setTurn("p2");
      setTimeout(() => {
        if (hp.p2 > 0 && hp.p1 > 0) {
          attack("p2", "p1");
          setTurn("p1");
        }
      }, 700);
    }
  }

  const winner =
    hp.p1 === 0 ? pokemons[1].name :
      hp.p2 === 0 ? pokemons[0].name : null;

  useEffect(() => {
    if (winner && !winPlayed.current) {
      play(sounds.win);
      winPlayed.current = true;
    }
  }, [winner]);

  return (
    <div
      ref={arena}
      className="fixed inset-0 z-50 bg-black text-white px-6 py-10"
    >
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 px-5 py-2 bg-gray-800 rounded-full font-bold hover:bg-gray-700"
      >
        ⬅ Back
      </button>

      <h1 className="text-center text-4xl font-bold text-red-500">
        🔥 Battle Arena 🔥
      </h1>

      <div className="flex justify-center gap-24 mt-14">
        {pokemons.map((p, i) => (
          <div key={p.id} className="text-center">
            <img
              ref={i === 0 ? p1Ref : p2Ref}
              src={p?.sprites?.other?.["official-artwork"]?.front_default || p?.sprites?.front_default}
              className="w-40"
              alt={p.name}
            />
            <p className="capitalize font-bold">{p.name}</p>

            <div className="w-48 bg-gray-700 h-3 mt-2 rounded overflow-hidden">
              <div
                ref={i === 0 ? hp1Ref : hp2Ref}
                className={`h-3 ${i === 0 ? "bg-green-500" : "bg-blue-500"}`}
                style={{ width: `${i === 0 ? hp.p1 : hp.p2}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {!winner && (
        <div className="flex justify-center mt-10">
          <button
            disabled={turn !== "p1"}
            onClick={() => attack("p1", "p2")}
            className="px-8 py-4 bg-red-600 rounded-full font-bold"
          >
            ⚔️ ATTACK
          </button>
        </div>
      )}

      {winner && (
        <div className="text-center mt-16">
          <h2 className="text-4xl text-green-400 font-bold">
            🏆 Winner: {winner}
          </h2>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-8 py-3 bg-green-400 text-black rounded-full font-bold"
          >
            🔄 New Battle
          </button>
        </div>
      )}
    </div>
  );
}

export default BattleArena;
