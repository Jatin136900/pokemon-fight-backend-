import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import instance from "../axiosConfig";


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

      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded w-full max-w-md shadow"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            Register
          </h2>

          <input
            name="name"
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 w-full mb-3"
          />

          <input
            name="username"
            onChange={handleChange}
            placeholder="Username"
            className="border p-2 w-full mb-3"
          />

          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 w-full mb-3"
          />

          {/* 🔑 Password with Eye */}
          <div className="relative mb-3">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              placeholder="Password"
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
            className={`${
              loading ? "bg-gray-400" : "bg-blue-500"
            } text-white w-full py-2`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-sm mt-3 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </>
  );
}
