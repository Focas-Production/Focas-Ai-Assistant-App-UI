import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Person {
  id: number;
  name: string;
  phoneNumber: string;
  role: string;
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Get admin people data from localStorage
    const adminPeopleData = localStorage.getItem('adminPeopleData');
    let people: Person[] = [];
    
    if (adminPeopleData) {
      people = JSON.parse(adminPeopleData);
    }

    // Check if person exists in the admin list
    const person = people.find(p => 
      p.name.toLowerCase() === name.toLowerCase() && 
      p.phoneNumber === phoneNumber
    );

    setTimeout(() => {
      setLoading(false);
      
      if (!person) {
        alert("Person not found! Please check your name and phone number, or contact admin to be added to the system.");
        return;
      }

      // Check if password matches the person's role
      if (password.toLowerCase() === person.role.toLowerCase()) {
        // Store user info in localStorage
        localStorage.setItem("userInfo", JSON.stringify({
          name: person.name,
          phoneNumber: person.phoneNumber,
          role: person.role
        }));
        
        // Navigate based on role
        if (person.role.toLowerCase() === "student") {
          navigate("/student");
        } else if (person.role.toLowerCase() === "tutor") {
          navigate("/tutor");
        } else if (person.role.toLowerCase() === "admin") {
          navigate("/admin");
        }
      } else {
        alert(`Invalid password! Use '${person.role.toLowerCase()}' as password for ${person.name}.`);
      }
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
        {/* <h2 className="text-center text-[22px] font-medium text-gray-800 mb-1">
          Sign in
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          to continue to FOCAS
        </p> */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#fafafa] text-sm transition"
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#fafafa] text-sm transition"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#fafafa] text-sm transition"
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 cursor-pointer text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Password hint */}
          {/* <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Login Instructions:</p>
            <p>• Enter your exact name and phone number</p>
            <p>• Use your role as password (student/tutor/admin)</p>
            <p>• Contact admin if you're not in the system</p>
          </div> */}

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
        {/* <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 font-medium hover:underline">
            Sign up
          </a>
        </p> */}

      </div>
    </div>
  );
};

export default LoginPage;
