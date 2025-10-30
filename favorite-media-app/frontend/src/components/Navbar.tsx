import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Check auth status whenever route changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location]);

  // ✅ Listen for auth changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/auth/login");
  };

  // ✅ Public + Auth-specific nav items
  const publicItems = [{ name: "Home", path: "/" }];
  const privateItems = [
    { name: "My Media", path: "/my-media" },
    { name: "Add Media", path: "/add-media" },
  ];

  const navItems = isAuthenticated
    ? [...publicItems, ...privateItems]
    : publicItems;

  return (
    <motion.nav
      className="bg-gradient-to-r from-blue-50 to-gray-50 shadow-md sticky top-0 z-50"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center h-20">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/clapperboard.png"
            alt="logo"
            height={45}
            width={45}
            className="object-contain"
          />
          <h2
            className="text-2xl sm:text-3xl text-blue-600 font-semibold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Media Verse
          </h2>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 items-center">
          {navItems.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className="hover:text-blue-500 transition text-lg font-medium"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {name}
            </Link>
          ))}

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-600 transition"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/auth/login"
                state={{ isLogin: true }}
                className="hover:text-blue-500 transition text-lg font-medium"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <motion.div
          className="md:hidden bg-white shadow-inner border-t border-gray-200 py-3"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {navItems.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 text-gray-700 text-lg font-medium hover:text-blue-600 transition"
            >
              {name}
            </Link>
          ))}

          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-6 py-3 text-red-600 text-lg font-medium hover:text-red-700 transition"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/auth/login"
                state={{ isLogin: true }}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 text-gray-700 text-lg font-medium hover:text-blue-600 transition"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Login
              </Link>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;