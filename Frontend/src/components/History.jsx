// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import instance from "../axiosConfig";

// export default function History() {
//   const [history, setHistory] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     instance
//       .get("/pokemon/history", { withCredentials: true })
//       .then((res) => setHistory(res.data))
//       .catch(console.error);
//   }, []);

//   // 🔥 Pokémon image (name based)
//   const getPokemonImg = (name) =>
//     `https://img.pokemondb.net/artwork/large/${name}.jpg`;

//   // 🔥 Date formatter
//   const formatDate = (date) => {
//     return new Date(date).toLocaleString("en-US", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="relative min-h-screen pt-32 px-6 text-white overflow-hidden py-12">

//       {/* BACKGROUND IMAGE */}
//       <img
//         src="/img/img2.jpg"
//         alt="background"
//         className="absolute inset-0 w-full h-full object-cover -z-20"
//       />

//       {/* DARK OVERLAY */}
//       <div className="absolute inset-0 bg-black/65 -z-10"></div>

//       {/* CONTENT */}
//       <div className="max-w-6xl mx-auto">

//         {/* HEADER WITH BACK BUTTON */}
//         <div className="flex items-center justify-between mb-12">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 px-4 py-2
//             rounded-xl bg-white/10 backdrop-blur-md
//             hover:bg-white/20 transition-all
//             text-sm font-semibold cursor-pointer"
//           >
//             ⬅ Back
//           </button>

//           <h1 className="text-4xl font-bold text-center flex-1">
//             ⚔️ Battle History
//           </h1>

//           {/* spacer for center alignment */}
//           <div className="w-[80px]"></div>
//         </div>

//         {history.length === 0 && (
//           <p className="text-center text-gray-300">
//             No battles fought yet.
//           </p>
//         )}

//         <div className="space-y-8">
//           {history.map((h) => {
//             const isWinner1 = h.winner === h.pokemon1;
//             const isWinner2 = h.winner === h.pokemon2;

//             return (
//               <div
//                 key={h._id}
//                 className="bg-white/10 backdrop-blur-xl
//                 rounded-3xl p-6 shadow-2xl"
//               >
//                 {/* TIME */}
//                 <p className="text-right text-xs text-gray-300 mb-4">
//                   {formatDate(h.createdAt)}
//                 </p>

//                 <div className="flex items-center justify-between gap-6">

//                   {/* POKEMON 1 */}
//                   <div
//                     className={`flex flex-col items-center w-1/3
//                     ${isWinner1 ? "scale-110" : "opacity-70"}`}
//                   >
//                     <img
//                       src={getPokemonImg(h.pokemon1)}
//                       alt={h.pokemon1}
//                       className={`w-36 h-36 object-contain
//                       mix-blend-multiply
//                       ${isWinner1 ? "drop-shadow-[0_0_30px_gold]" : ""}`}
//                     />
//                     <p className="capitalize font-semibold mt-2">
//                       {h.pokemon1}
//                     </p>
//                   </div>

//                   {/* VS */}
//                   <div className="text-4xl font-extrabold text-red-500">
//                     VS
//                   </div>

//                   {/* POKEMON 2 */}
//                   <div
//                     className={`flex flex-col items-center w-1/3
//                     ${isWinner2 ? "scale-110" : "opacity-70"}`}
//                   >
//                     <img
//                       src={getPokemonImg(h.pokemon2)}
//                       alt={h.pokemon2}
//                       className={`w-36 h-36 object-contain
//                       mix-blend-multiply
//                       ${isWinner2 ? "drop-shadow-[0_0_30px_gold]" : ""}`}
//                     />
//                     <p className="capitalize font-semibold mt-2">
//                       {h.pokemon2}
//                     </p>
//                   </div>
//                 </div>

//                 {/* WINNER */}
//                 <p className="mt-6 text-center text-xl font-bold text-yellow-400">
//                   🏆 Winner: {h.winner}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../axiosConfig";
import socket from "../utils/socket"; // ✅ 1️⃣ NEW LINE (ADD)

export default function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Initial load (API – jaise pehle tha)
    instance
      .get("/pokemon/history", { withCredentials: true })
      .then((res) => setHistory(res.data))
      .catch(console.error);

    // 🔥 2️⃣ SOCKET LISTENER (NEW – bina refresh)
    socket.on("newHistory", (newFight) => {
      setHistory((prev) => [newFight, ...prev]);
    });

    return () => {
      socket.off("newHistory");
    };
  }, []);

  // 🔥 Pokémon image (name based)
  const getPokemonImg = (name) =>
    `https://img.pokemondb.net/artwork/large/${name}.jpg`;

  // 🔥 Date formatter
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative min-h-screen pt-32 px-6 text-white overflow-hidden py-12">
      {/* BACKGROUND IMAGE */}
      <img
        src="/img/img2.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover -z-20"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/65 -z-10"></div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto">
        {/* HEADER WITH BACK BUTTON */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2
            rounded-xl bg-white/10 backdrop-blur-md
            hover:bg-white/20 transition-all
            text-sm font-semibold cursor-pointer"
          >
            ⬅ Back
          </button>

          <h1 className="text-4xl font-bold text-center flex-1">
            ⚔️ Battle History
          </h1>

          <div className="w-[80px]"></div>
        </div>

        {history.length === 0 && (
          <p className="text-center text-gray-300">
            No battles fought yet.
          </p>
        )}

        <div className="space-y-8">
          {history.map((h) => {
            const isWinner1 = h.winner === h.pokemon1;
            const isWinner2 = h.winner === h.pokemon2;

            return (
              <div
                key={h._id}
                className="bg-white/10 backdrop-blur-xl
                rounded-3xl p-6 shadow-2xl"
              >
                <p className="text-right text-xs text-gray-300 mb-4">
                  {formatDate(h.createdAt)}
                </p>

                <div className="flex items-center justify-between gap-6">
                  <div
                    className={`flex flex-col items-center w-1/3
                    ${isWinner1 ? "scale-110" : "opacity-70"}`}
                  >
                    <img
                      src={getPokemonImg(h.pokemon1)}
                      alt={h.pokemon1}
                      className={`w-36 h-36 object-contain
                      mix-blend-multiply
                      ${isWinner1 ? "drop-shadow-[0_0_30px_gold]" : ""}`}
                    />
                    <p className="capitalize font-semibold mt-2">
                      {h.pokemon1}
                    </p>
                  </div>

                  <div className="text-4xl font-extrabold text-red-500">
                    VS
                  </div>

                  <div
                    className={`flex flex-col items-center w-1/3
                    ${isWinner2 ? "scale-110" : "opacity-70"}`}
                  >
                    <img
                      src={getPokemonImg(h.pokemon2)}
                      alt={h.pokemon2}
                      className={`w-36 h-36 object-contain
                      mix-blend-multiply
                      ${isWinner2 ? "drop-shadow-[0_0_30px_gold]" : ""}`}
                    />
                    <p className="capitalize font-semibold mt-2">
                      {h.pokemon2}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-center text-xl font-bold text-yellow-400">
                  🏆 Winner: {h.winner}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

