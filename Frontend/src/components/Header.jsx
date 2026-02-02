import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import axios from "../axiosConfig";
import { useAuth } from "../components/ContextApi.jsx";
import logo from "../../public/img/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function logoutUser() {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <header
      className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-blue-900/10 backdrop-blur-md shadow-md"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between relative">

          {/* LOGO — SAME POSITION */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="
                  h-[48px] w-[160px]
                  md:h-[120px] md:w-[250px]
                  object-contain
                  hover:scale-110
                  transition-transform
                "
              />
            </Link>
          </div>

          {/* DESKTOP AUTH */}
          <div className="hidden md:flex ml-auto">
            {!isLoggedIn ? (
              <Link
                to="/login"
                className="glitter-new flex items-center gap-2 px-6 py-2.5 font-semibold rounded-lg
                bg-[#fdc700] text-white shadow transition-all hover:scale-105"
              >
                <LogIn size={18} />
                Login
              </Link>
            ) : (
              <button
                onClick={logoutUser}
                className="glitter-new flex items-center gap-2 px-6 py-2.5 font-semibold rounded-lg
                bg-[#fdc700] text-white shadow transition-all hover:scale-105"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>

          {/* DESKTOP HISTORY (UNCHANGED, JUST RESPONSIVE) */}
          {isLoggedIn && (
            <Link
              to="/history"
              className="hidden md:flex ml-4 glitter-new items-center gap-2 px-6 py-2.5 font-semibold rounded-lg
              bg-[#fdc700] text-white shadow transition-all hover:scale-105"
            >
              History
            </Link>
          )}

          {/* MOBILE AUTH + HISTORY */}
          {/* Mobile Auth + History */}
          <div className="flex md:hidden items-center justify-between w-full">

            {/* LEFT — History */}
            <div className="w-20 flex justify-start">
              {isLoggedIn && (
                <Link
                  to="/history"
                  className="glitter-new px-3 py-2 text-sm font-semibold
        bg-[#fdc700] text-white rounded-lg shadow"
                >
                  History
                </Link>
              )}
            </div>

            {/* CENTER — EMPTY (logo already absolute center) */}
            <div className="flex-1"></div>

            {/* RIGHT — Login / Logout */}
            <div className="w-20 flex justify-end">
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  className="glitter-new px-3 py-2 text-sm font-semibold
        bg-[#fdc700] text-white rounded-lg shadow"
                >
                  <LogIn size={16} />
                </Link>
              ) : (
                <button
                  onClick={logoutUser}
                  className="glitter-new px-3 py-2 text-sm font-semibold
        bg-[#fdc700] text-white rounded-lg shadow"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>

          </div>


        </div>
      </div>
    </header>
  );
}
