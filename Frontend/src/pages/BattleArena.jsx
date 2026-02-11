import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { play, sounds } from "../utils/sound.js";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../axiosConfig";
// import bg from "../../public/img/img1.jpg";
import bgVideo from "../../public/img/video3.mp4";

function BattleArena() {
  const location = useLocation();
  const navigate = useNavigate();

  const pokemons = location.state;

  if (!pokemons || pokemons.length < 2) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white px-4">
        <h1 className="text-lg sm:text-2xl font-bold mb-4 text-center">
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
  const historySaved = useRef(false);

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

  function collidePokemons() {
    if (!p1Ref.current || !p2Ref.current) return;

    const tl = gsap.timeline();
    tl.to(p1Ref.current, { x: 120, duration: 0.25, ease: "power2.in" })
      .to(p2Ref.current, { x: -120, duration: 0.25, ease: "power2.in" }, "<")
      .to([p1Ref.current, p2Ref.current], {
        x: 0,
        duration: 0.35,
        ease: "elastic.out(1, 0.4)",
      });
  }

  function attack(attacker, defender) {
    collidePokemons();

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
      defender === "p1" ? animateHp(hp1Ref, newHp.p1) : animateHp(hp2Ref, newHp.p2);
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
    hp.p2 === 0 ? pokemons[0].name :
    null;

  useEffect(() => {
    if (winner && !winPlayed.current) {
      play(sounds.win);
      winPlayed.current = true;
    }
  }, [winner]);

  // Save fight result to backend only after the arena fight is finished
  useEffect(() => {
    if (!winner || historySaved.current) return;
    if (!pokemons || pokemons.length < 2) return;

    const payload = {
      pokemon1: { id: pokemons[0].id, name: pokemons[0].name },
      pokemon2: { id: pokemons[1].id, name: pokemons[1].name },
    };

    instance
      .post("/pokemon/fight", payload, { withCredentials: true })
      .then(() => {
        historySaved.current = true;
      })
      .catch((err) => console.error("Error saving fight result:", err));
  }, [winner, pokemons]);

  return (
    <div
      ref={arena}
      className="fixed inset-0 z-50 text-white px-4 sm:px-6 py-6 sm:py-10 overflow-hidden"
    >
      {/* 🎥 Background */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-10">
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40 -z-10" />

      <button
        onClick={() => navigate("/")}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 px-4 sm:px-5 py-2 bg-black/60 rounded-full font-bold hover:bg-black"
      >
        ⬅ Back
      </button>

      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-red-500 drop-shadow-lg">
        Battle Arena 🔥
      </h1>

      {/* 🐉 Fighters */}
      <div className="flex flex-col sm:flex-row justify-center gap-10 sm:gap-24 md:gap-32 mt-10 sm:mt-16">
        {pokemons.map((p, i) => (
          <div key={p.id} className="text-center">
            <img
              ref={i === 0 ? p1Ref : p2Ref}
              src={
                p?.sprites?.other?.["official-artwork"]?.front_default ||
                p?.sprites?.front_default
              }
              className="w-28 sm:w-36 md:w-44 mx-auto drop-shadow-[0_0_25px_rgba(255,0,0,0.5)]"
              alt={p.name}
            />

            <p className="capitalize font-bold text-base sm:text-lg mt-2">
              {p.name}
            </p>

            <div className="w-40 sm:w-44 md:w-48 bg-black/60 h-3 mt-2 rounded overflow-hidden mx-auto">
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
        <div className="flex justify-center mt-10 sm:mt-12">
          <button
            disabled={turn !== "p1"}
            onClick={() => attack("p1", "p2")}
            className="px-8 sm:px-10 py-3 sm:py-4 bg-red-600 rounded-full font-bold text-base sm:text-lg hover:scale-105 transition"
          >
            ⚔️ ATTACK
          </button>
        </div>
      )}

      {winner && (
        <div className="text-center mt-12 sm:mt-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-green-400 font-bold">
            🏆 Winner: {winner}
          </h2>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 sm:px-8 py-3 bg-green-400 text-black rounded-full font-bold"
          >
            🔄 New Battle
          </button>
        </div>
      )}
    </div>
  );
}

export default BattleArena;
