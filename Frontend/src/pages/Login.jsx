import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import instance from "../axiosConfig";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { email, password } = formData;

    // 🔐 Validation
    if (!email || !password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);
      await instance.post("/api/auth/login", formData, {
        withCredentials: true, // 🔥 JWT cookies ke liye important
      });

      toast.success("Login successful 🚀");

      setTimeout(() => {
        navigate("/"); 
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded w-full max-w-md shadow"
        >
          <h1 className="text-2xl font-bold text-center mb-6">
            Login
          </h1>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="border p-2 w-full mb-4"
          />

          {/* 🔑 Password with Eye */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="border p-2 w-full pr-10"
            />

            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button
            disabled={loading}
            className={`${loading ? "bg-gray-400" : "bg-blue-500"
              } text-white w-full py-2`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center mt-3">
            New here?
            <Link to="/register" className="text-blue-500 ml-1">
              Register
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
