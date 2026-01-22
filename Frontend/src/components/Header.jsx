import { Link } from "react-router-dom";
import axios from "../axiosConfig";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

function logoutUser() {
  axios.post("/api/auth/logout")
    .then(() => {
      alert("Logged out")
      window.location.href = "/login";
    });
}
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-orange-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          Pokemon
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-8 text-white font-medium items-center">
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <button className="hidden md:inline-block text-white font-medium cursor-pointer ml-4" onClick={logoutUser}>
          Logout
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`md:hidden ${open ? "block" : "hidden"} bg-orange-800`}>
        <nav>
          <ul className="flex flex-col gap-4 text-white font-medium px-6 py-4">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <button className="text-left w-full text-white font-medium" onClick={() => { logoutUser(); setOpen(false); }}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
