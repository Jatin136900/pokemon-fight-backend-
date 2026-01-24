import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import instance from "../axiosConfig";
import pokemonTop from "../../public/img/logo.png";
import pokemonBottom from "../../public/img/pic.png";
import bgPic from "../../public/img/img4.jpg";


export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { name, username, email, password } = formData;

    // 🔐 Validations
    if (!name || !username || !email || !password) {
      return toast.error("All fields are required");
    }

    if (!email.includes("@")) {
      return toast.error("Invalid email address");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      const res = await instance.post("/api/auth/register", formData);

      toast.success(res.data.message || "Registered successfully 🎉");

      // ✅ Register ke baad Login page
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* 🖼️ CLEAR IMAGE BACKGROUND */}
      <div
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
        style={{
          backgroundImage: `url(${bgPic})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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

            w-[200px]
            sm:w-[180px]
            md:w-[200px]
            lg:w-[250px]

            z-20
          "
          />

          {/* 🔵 REGISTER BOX (BLUR ONLY HERE) */}
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
            <h2 className="text-lg font-bold text-center mb-4">
              Pokémon Register
            </h2>

            <input
              name="name"
              onChange={handleChange}
              placeholder="Name"
              className="w-full mb-3 px-4 py-2 rounded bg-white text-black outline-none"
            />

            <input
              name="username"
              onChange={handleChange}
              placeholder="Username"
              className="w-full mb-3 px-4 py-2 rounded bg-white text-black outline-none"
            />

            <input
              name="email"
              type="email"
              onChange={handleChange}
              placeholder="Email"
              className="w-full mb-3 px-4 py-2 rounded bg-white text-black outline-none"
            />

            {/* 🔑 PASSWORD */}
            <div className="relative mb-4">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                placeholder="Password"
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
              w-full py-2 rounded font-bold
              ${loading ? "bg-gray-400" : "bg-yellow-400 hover:bg-yellow-500"}
              text-black
            `}
            >
              {loading ? "Registering..." : "REGISTER"}
            </button>

            <p className="text-center mt-3 text-sm">
              Already have an account?
              <span
                className="text-yellow-300 ml-1 font-semibold cursor-pointer pokemon-text-glitter"
                onClick={() => navigate("/login")}
              >
                Login
              </span>

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

            w-[260px]
            sm:w-[300px]
            md:w-[340px]
            lg:w-[310px]

            z-10
          "
          />
        </div>
      </div>
    </>
  );

}
