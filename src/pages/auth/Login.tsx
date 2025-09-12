import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(name, phoneNumber, password);
      
      // Navigate based on role
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo.role?.toLowerCase() === "student") {
        navigate("/student");
      } else if (userInfo.role?.toLowerCase() === "tutor") {
        navigate("/tutor");
      } else if (userInfo.role?.toLowerCase() === "admin") {
        navigate("/admin");
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center px-4 bg-[#f8f9fa]">

      {/* Grid Background with Glossy Overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-xl z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-xl px-8 py-10 font-sans bg-opacity-90 backdrop-blur-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="src/assets/logo.png" alt="FOCAS Logo" className="w-28" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#fafafa] text-sm transition"
            required
            disabled={loading}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#fafafa] text-sm transition"
            required
            disabled={loading}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#fafafa] text-sm transition"
              required
              disabled={loading}
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 cursor-pointer text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <div className="flex justify-end text-xs text-blue-600 font-medium">
            <a href="/forgot-password" className="hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={!name || !phoneNumber || !password || loading}
            className={`w-full ${loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium py-3 rounded-xl transition`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
