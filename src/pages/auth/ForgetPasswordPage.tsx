import React, { useState } from "react";

const ForgetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Password reset link sent to your email!");
    }, 2000);
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center px-4 bg-[#f8f9fa]">

      <div className="absolute inset-0 bg-white/30 backdrop-blur-xl z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-xl px-8 py-10 font-sans bg-opacity-90 backdrop-blur-md">

        <div className="flex justify-center mb-6">
          <img src="src/assets/logo.png" alt="FOCAS Logo" className="w-28" />
        </div>

        <h2 className="text-center text-[22px] font-medium text-gray-800 mb-1">
          Forgot Password
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Enter your registered email address
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#fafafa] text-sm transition"
          />

          <button
            type="submit"
            disabled={!email || loading}
            className={`w-full ${loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium py-3 rounded-xl transition`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Remember your password?{" "}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Back to Login
          </a>
        </p>

      </div>
    </div>
  );
};

export default ForgetPasswordPage;
