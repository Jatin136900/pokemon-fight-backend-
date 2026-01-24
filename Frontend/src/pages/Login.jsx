import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import instance from "../axiosConfig";

import bgVideo from "../../public/img/video1.mp4";
import pokemonTop from "../../public/img/logo.png";
import pokemonBottom from "../../public/img/pic.png";
import { useAuth } from "../components/ContextApi.jsx";


export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn } = useAuth();


  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);
      await instance.post("/api/auth/login", formData, {
        withCredentials: true,
      });

      toast.success("Login successful 🚀");


      setIsLoggedIn(true);
      
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* 🎥 CLEAR VIDEO */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-110"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>

        {/* 🧊 WRAPPER */}
        <div className="relative z-10 w-full max-w-md">

          {/* 🟡 TOP LOGO (HALF IN / HALF OUT) */}
          <img
            src={pokemonTop}
            alt="Pokemon Logo"
            className="
    absolute
    left-1/2 -translate-x-1/2
    -top-[75px]

    w-[200px]       /* 📱 Mobile */
    sm:w-[180px]    /* 💻 Small screens */
    md:w-[200px]    /* 💻 Laptop */
    lg:w-[250px]    /* 🖥️ Desktop */

    z-20
  "
          />


          {/* 🔵 LOGIN BOX */}
          <form
            onSubmit={handleSubmit}
            className="
            relative
            bg-blue-900/60
            backdrop-blur-lg
            border border-white/40
            rounded-2xl
            shadow-2xl
            px-6
            pt-14
            pb-14
            text-white
          "
          >
            <h1 className="text-lg font-bold text-center mb-4">
              Pokémon Login
            </h1>

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full mb-3 px-4 py-2 rounded bg-white text-black outline-none"
            />

            {/* 🔐 PASSWORD */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white text-black outline-none"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button
              disabled={loading}
              className={`
    glitter-new
    relative overflow-hidden
    w-full py-2 rounded font-bold
    ${loading ? "bg-gray-400" : "bg-yellow-400"}
    text-black
  `}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            <p className="text-center mt-3 text-sm">
              New here?
              <Link
                to="/register"
                className="text-yellow-300 ml-1 font-semibold pokemon-text-glitter"
              >
                Register
              </Link>

            </p>
          </form>

          {/* 🧡 BOTTOM IMAGE (HALF IN / HALF OUT) */}



          <img
            src={pokemonBottom}
            alt="Pokemon Characters"
            className="
    absolute
    left-1/2 -translate-x-1/2
    -bottom-[100px]

    w-[260px]        /* 📱 Mobile */
    sm:w-[300px]     /* 💻 Small screens */
    md:w-[340px]     /* 💻 Laptop */
    lg:w-[310px]     /* 🖥️ Desktop */

    z-10
  "
          />

        </div>
      </div>
    </>
  );



}
