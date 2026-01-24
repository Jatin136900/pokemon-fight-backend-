import { Link, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import React, { useState } from "react";
import { Menu, X, LogOut, LogIn } from "lucide-react";
import { useAuth } from "../components/ContextApi.jsx";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  

  async function logoutUser() {
    try {
      await axios.post("/api/auth/logout", { withCredentials: true });
      setIsLoggedIn(false);          // 🔥 context update
      navigate("/login");            // 🔥 soft redirect
    } catch (err) {
      console.error(err);
    }
  }

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
        <nav className="hidden md:flex items-center gap-6 text-white font-medium">
          {!isLoggedIn ? (
            <Link to="/login" className="flex items-center gap-2">
              <LogIn size={18} />
              Login
            </Link>
          ) : (
            <button
              onClick={logoutUser}
              className="flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </nav>
      </div>

      {/* Mobile dropdown */}
      <div className={`md:hidden ${open ? "block" : "hidden"} bg-orange-800`}>
        <nav>
          <ul className="flex flex-col gap-4 text-white font-medium px-6 py-4">
            <li>
              <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            </li>

            {!isLoggedIn ? (
              <li>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2"
                >
                  <LogIn size={18} />
                  Login
                </Link>
              </li>
            ) : (
              <li>
                <button
                  onClick={() => {
                    logoutUser();
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
