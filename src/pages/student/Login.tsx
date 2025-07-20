import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Logged in!");
    }, 2000);
    
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

        {/* Title */}
        <h2 className="text-center text-[22px] font-medium text-gray-800 mb-1">
          Sign in
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          to continue to FOCAS
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="email"
            placeholder="Email or phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#fafafa] text-sm transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#fafafa] text-sm transition"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 cursor-pointer text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <div className="flex justify-end text-xs text-blue-600 font-medium">
            <a href="#" className="hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={!email || !password || loading}
            className={`w-full ${loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium py-3 rounded-xl transition`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="text-sm text-gray-400">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Button */}
        <button
          type="button"
          className="w-full border border-gray-300 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm"
        >
          <img
            src="src/assets/google-icon-logo-svgrepo-com.svg"
            alt="Google"
            className="w-4 h-4"
          />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Don’t have an account?{" "}
          <a href="#" className="text-blue-600 font-medium hover:underline">
            Sign up
          </a>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
