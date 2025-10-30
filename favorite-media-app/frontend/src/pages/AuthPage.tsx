import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api"; // ✅ Uses your centralized axios instance

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Form fields
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Detect mode from URL
  useEffect(() => {
    if (location.state?.isLogin !== undefined) {
      setIsLogin(location.state.isLogin);
    } else if (location.pathname.includes("login")) {
      setIsLogin(true);
    } else if (location.pathname.includes("signup")) {
      setIsLogin(false);
    }
  }, [location]);

  // ✅ Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        // Login
        const res = await API.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("token", res.data.token);
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => navigate("/my-media"), 1200);
      } else {
        // Signup
        const res = await API.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        setMessage("✅ Account created! You can now login.");
        setTimeout(() => setIsLogin(true), 1200);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const errorMsg =
        err.response?.data?.error ||
        (isLogin ? "❌ Invalid email or password" : "❌ Registration failed");
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-4 sm:px-6 md:px-10">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden">
        {/* Header Tabs */}
        <div className="flex justify-center space-x-6 mb-6 sm:mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`text-base sm:text-lg font-semibold transition-all ${
              isLogin ? "text-blue-600" : "text-gray-400 hover:text-blue-400"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`text-base sm:text-lg font-semibold transition-all ${
              !isLogin ? "text-blue-600" : "text-gray-400 hover:text-blue-400"
            }`}
          >
            Signup
          </button>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center mb-4 p-2 rounded-lg text-sm sm:text-base ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Animated Forms */}
        <div className="relative min-h-[380px] sm:min-h-[420px]">
          <AnimatePresence mode="wait">
            {isLogin ? (
              // ✅ Login Form
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <h2 className="text-2xl sm:text-3xl font-semibold text-center text-blue-600 mb-4 sm:mb-6">
                  Welcome Back 👋
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-gray-600 font-medium text-sm sm:text-base">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 mt-1 focus:ring-2 focus:ring-blue-300 outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium text-sm sm:text-base">
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 mt-1 focus:ring-2 focus:ring-blue-300 outline-none"
                      placeholder="Enter your password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Don’t have an account?{" "}
                  <span
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 font-medium cursor-pointer hover:underline"
                  >
                    Sign up
                  </span>
                </p>
              </motion.div>
            ) : (
              // ✅ Signup Form
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <h2 className="text-2xl sm:text-3xl font-semibold text-center text-blue-600 mb-4 sm:mb-6">
                  Create Account ✨
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-gray-600 font-medium text-sm sm:text-base">
                      Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 mt-1 focus:ring-2 focus:ring-blue-300 outline-none"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium text-sm sm:text-base">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 mt-1 focus:ring-2 focus:ring-blue-300 outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium text-sm sm:text-base">
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 mt-1 focus:ring-2 focus:ring-blue-300 outline-none"
                      placeholder="Create a password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
                  >
                    {loading ? "Creating..." : "Signup"}
                  </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Already have an account?{" "}
                  <span
                    onClick={() => setIsLogin(true)}
                    className="text-blue-600 font-medium cursor-pointer hover:underline"
                  >
                    Login
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;