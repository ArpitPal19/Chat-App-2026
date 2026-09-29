import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import assets from "../assets/assets";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(currState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  const handleStateChange = (state) => {
    setCurrState(state);
    setIsDataSubmitted(false);
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-black">
      <div className="w-full max-w-5xl flex items-center justify-between gap-10">
        {/* ================= LEFT SIDE ================= */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center">
            <img src={assets.logo_icon} alt="QuickChat" className="w-32 mb-4" />

            <h1 className="text-white text-5xl font-semibold">QuickChat</h1>

            <p className="text-gray-400 mt-3 text-sm">Chat anytime, anywhere</p>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div
          className="w-full max-w-md
          backdrop-blur-2xl
          bg-white/5
          border border-gray-600
          rounded-xl
          p-8
          shadow-2xl"
        >
          <h2 className="text-white text-2xl font-semibold mb-2">
            {currState === "Sign up" ? "Sign up" : "Login"}
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            {currState === "Sign up"
              ? "Create an account to start chatting"
              : "Login to continue chatting"}
          </p>

          <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
            {/* ================= SIGN UP FIRST STEP ================= */}
            {currState === "Sign up" && !isDataSubmitted && (
              <input
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                type="text"
                placeholder="Full Name"
                required
                className="w-full p-3
                bg-transparent
                border border-gray-600
                rounded-md
                text-white
                placeholder-gray-500
                outline-none
                focus:border-violet-500
                focus:ring-1
                focus:ring-violet-500"
              />
            )}

            {/* ================= EMAIL & PASSWORD ================= */}
            {!isDataSubmitted && (
              <>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full p-3
                  bg-transparent
                  border border-gray-600
                  rounded-md
                  text-white
                  placeholder-gray-500
                  outline-none
                  focus:border-violet-500
                  focus:ring-1
                  focus:ring-violet-500"
                />

                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full p-3
                  bg-transparent
                  border border-gray-600
                  rounded-md
                  text-white
                  placeholder-gray-500
                  outline-none
                  focus:border-violet-500
                  focus:ring-1
                  focus:ring-violet-500"
                />
              </>
            )}

            {/* ================= BIO STEP ================= */}
            {currState === "Sign up" && isDataSubmitted && (
              <textarea
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                rows={4}
                placeholder="Write a short bio..."
                required
                className="w-full p-3
                bg-transparent
                border border-gray-600
                rounded-md
                text-white
                placeholder-gray-500
                outline-none
                resize-none
                focus:border-violet-500
                focus:ring-1
                focus:ring-violet-500"
              />
            )}

            {/* ================= BUTTON ================= */}
            <button
              type="submit"
              className="w-full py-3
              bg-gradient-to-r
              from-purple-400
              to-violet-600
              hover:from-purple-500
              hover:to-violet-700
              text-white
              rounded-md
              font-medium
              transition-all
              cursor-pointer"
            >
              {currState === "Sign up"
                ? isDataSubmitted
                  ? "Create Account"
                  : "Continue"
                : "Login"}
            </button>

            {/* ================= TERMS ================= */}
            {currState === "Sign up" && (
              <div className="flex items-start gap-2 text-xs text-gray-500">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 accent-violet-500"
                />

                <p>Agree to the terms of use & privacy policy.</p>
              </div>
            )}

            {/* ================= SWITCH LOGIN/SIGNUP ================= */}
            <div className="text-center mt-2">
              {currState === "Sign up" ? (
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <span
                    onClick={() => handleStateChange("Login")}
                    className="text-violet-400 hover:text-violet-300
                    font-medium cursor-pointer"
                  >
                    Login here
                  </span>
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <span
                    onClick={() => handleStateChange("Sign up")}
                    className="text-violet-400 hover:text-violet-300
                    font-medium cursor-pointer"
                  >
                    Create account
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
