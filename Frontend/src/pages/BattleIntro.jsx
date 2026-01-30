import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { sounds, play } from "../utils/sound";
import { useLocation, useNavigate } from "react-router-dom";

function BattleIntro() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 ADAPTER (NO LOGIC CHANGE)
  const pokemons = location.state?.fighters;

  const onFinish = () => {
    navigate("/battle-arena", {
      state: pokemons,
    });
  };

  // ❌ SAFETY
  if (!pokemons || pokemons.length < 2) {
    navigate("/");
    return null;
  }

  const [count, setCount] = useState(3);

  const container = useRef(null);
  const leftPoke = useRef(null);
  const rightPoke = useRef(null);
  const vsRef = useRef(null);
  const countRef = useRef(null);

  const played = useRef(false);

  // 🎬 ENTRY ANIMATION (Tekken style)
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      container.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 }
    )
      .from(leftPoke.current, {
        x: -300,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
      .from(
        rightPoke.current,
        {
          x: 300,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "<"
      )
      .from(vsRef.current, {
        scale: 3,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
  }, []);

  // 🔊 Countdown sound
  useEffect(() => {
    if (!played.current) {
      play(sounds.countdown);
      played.current = true;
    }
  }, []);

  // ⏱ Countdown logic (unchanged)
  useEffect(() => {
    if (count === 0) {
      const t = setTimeout(onFinish, 700);
      return () => clearTimeout(t);
    }

    gsap.fromTo(
      countRef.current,
      { scale: 0.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }
    );

    const timer = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div
      ref={container}
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* 🔴 RED GLOW BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/30 to-black -z-10" />

      <h1 className="text-5xl font-extrabold text-red-500 tracking-widest mb-12">
        READY FOR BATTLE
      </h1>

      {/* 🆚 Fighters */}
      <div className="flex items-center gap-24 mb-12">
        <img
          ref={leftPoke}
          src={
            pokemons[0]?.sprites?.other?.["official-artwork"]?.front_default ||
            pokemons[0]?.sprites?.front_default
          }
          className="w-52 drop-shadow-[0_0_40px_rgba(255,0,0,0.7)]"
          alt={pokemons[0].name}
        />

        <div
          ref={vsRef}
          className="text-7xl font-extrabold text-yellow-400 drop-shadow-[0_0_25px_rgba(255,255,0,0.8)]"
        >
          VS
        </div>

        <img
          ref={rightPoke}
          src={
            pokemons[1]?.sprites?.other?.["official-artwork"]?.front_default ||
            pokemons[1]?.sprites?.front_default
          }
          className="w-52 drop-shadow-[0_0_40px_rgba(0,150,255,0.7)]"
          alt={pokemons[1].name}
        />
      </div>

      {/* 🔢 Countdown */}
      <div
        ref={countRef}
        className="text-9xl font-black text-white tracking-widest"
      >
        {count === 0 ? "FIGHT!" : count}
      </div>
    </div>
  );
}

export default BattleIntro;
