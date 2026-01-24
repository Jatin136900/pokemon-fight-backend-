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

  // ✅ scroll detect
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
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between relative">

          {/* Mobile Menu Button */}
          {/* <div className="flex md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg bg-black/70 hover:bg-black/80 text-white shadow"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div> */}

          {/* Logo Center */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="
        h-[48px] 
        w-[160px] 
        md:h-[120px] 
        md:w-[250px]
        object-contain
        hover:scale-110 
        transition-transform
      "
              />
            </Link>
          </div>


          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex ml-auto">
            {!isLoggedIn ? (
              <Link
                to="/login"
                className="glitter-new flex items-center gap-2 px-6 py-2.5 font-semibold rounded-lg
            bg-[#fdc700] text-white
            backdrop-blur-md shadow-lg border border-none
            transition-all hover:scale-105"
              >
                <LogIn size={18} />
                Login
              </Link>
            ) : (
              <button
                onClick={logoutUser}
                className="glitter-new flex items-center gap-2 px-6 py-2.5 font-semibold rounded-lg
            bg-[#fdc700] text-white
            backdrop-blur-md shadow-lg border 
            transition-all hover:scale-105"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Auth Button */}
          <div className="flex md:hidden">
            {!isLoggedIn ? (
              <Link
                to="/login"
                className="glitter-new px-4 py-2 text-sm font-semibold
           bg-[#fdc700] text-white
            rounded-lg backdrop-blur-md shadow border border-none"
              >
                <LogIn size={16} />
              </Link>
            ) : (
              <button
                onClick={logoutUser}
                className="glitter-new px-4 py-2 text-sm font-semibold
           bg-[#fdc700] text-white
            rounded-lg backdrop-blur-md shadow border border-none"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Dropdown */}
      {/* <div
        className={`md:hidden transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          } bg-black/80 backdrop-blur-lg`}
      >
        <nav className="px-6 py-4">
          {!isLoggedIn ? (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="glitter-new block px-4 py-3
         bg-[#fdc700] text-white
          rounded-lg shadow"
            >
              <LogIn size={18} /> Login
            </Link>
          ) : (
            <button
              onClick={() => {
                logoutUser();
                setOpen(false);
              }}
              className="glitter-new w-full px-4 py-3
         bg-[#fdc700] text-white
          rounded-lg shadow"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </nav>
      </div> */}
    </header>

  );
}
