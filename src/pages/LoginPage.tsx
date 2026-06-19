import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../utils/loginSchema";
import type { LoginSchemaType } from "../utils/loginSchema";
import { login } from "../services/authService";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setLoading(true);
    try {
      const response = await login(data.userId, data.password);

      const token = response.data?.token || response.token;
      
      if (token) {
        localStorage.setItem("token", token);
        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        toast.error("Authentication failed. No token returned.");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Invalid credentials";
      toast.error(errorMsg);
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      
      <div className="hidden md:flex md:w-1/2 bg-slate-50 items-center justify-center p-12 relative overflow-hidden select-none border-r border-slate-100">
        <div className="max-w-md w-full flex flex-col items-center">
          
          <svg
            viewBox="0 0 400 350"
            fill="none"
            className="w-full h-auto drop-shadow-md"
            xmlns="http://www.w3.org/2000/svg"
          >
            
            <path
              d="M60 120 M55 125 L65 125 M60 120 L60 130"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M340 160 M335 165 L345 165 M340 160 L340 170"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="280" cy="110" r="4" stroke="#94a3b8" strokeWidth="2" />

            <rect x="40" y="195" width="320" height="8" rx="4" fill="#64748b" />
            <line x1="45" y1="203" x2="45" y2="250" stroke="#94a3b8" strokeWidth="2" />
            <line x1="120" y1="203" x2="120" y2="250" stroke="#94a3b8" strokeWidth="2" />
            <line x1="270" y1="203" x2="270" y2="250" stroke="#94a3b8" strokeWidth="2" />
            <line x1="330" y1="203" x2="330" y2="250" stroke="#94a3b8" strokeWidth="2" />

            <path
              d="M60 160 L145 160 L160 195 L65 195 Z"
              fill="#e2e8f0"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M145 160 L140 195"
              stroke="#cbd5e1"
              strokeWidth="2"
            />

            <path
              d="M200 185 C220 185 240 190 250 200 C258 208 260 220 250 230 C240 240 220 235 200 235 Z"
              fill="#ffffff"
              stroke="#475569"
              strokeWidth="2"
            />

            <ellipse cx="200" cy="250" rx="30" ry="8" fill="#3b82f6" opacity="0.3" />
            <path
              d="M175 248 L225 248"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <rect x="182" y="243" width="36" height="5" fill="#93c5fd" />

            <rect
              x="185" y="125" width="30" height="118"
              rx="4"
              fill="#ffffff"
              stroke="#475569"
              strokeWidth="2"
            />

            <path d="M185 198 L215 198" stroke="#475569" strokeWidth="2" />

            <circle cx="192" cy="165" r="2.5" fill="#0f172a" />
            <circle cx="208" cy="165" r="2.5" fill="#0f172a" />
            <path
              d="M197 170 Q200 173 203 170"
              stroke="#0f172a"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            <rect x="175" y="120" width="50" height="8" rx="2" fill="#93c5fd" />
            <polygon points="200,98 235,110 200,122 165,110" fill="#3b82f6" stroke="#475569" strokeWidth="2" />
            
            <path d="M200 110 L238 122 L238 135" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <circle cx="238" cy="137" r="2.5" fill="#3b82f6" />
          </svg>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-slate-50 md:bg-white">
        <div className="w-full max-w-[460px] bg-white md:bg-transparent rounded-2xl border border-slate-100 md:border-none p-8 md:p-0 shadow-lg md:shadow-none">
          
          <div className="flex items-center gap-2 mb-10 select-none">
            <svg
              viewBox="0 0 160 50"
              fill="none"
              className="h-10 w-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              
              <path
                d="M10 32 C 10 18, 50 12, 60 14 C 70 16, 90 28, 100 28 C 110 28, 130 14, 150 14"
                stroke="#1e3a8a"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M10 32 C 10 18, 50 12, 60 14 C 70 16, 90 28, 100 28 C 110 28, 130 14, 150 14"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="10" cy="32" r="4.5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="150" cy="14" r="4.5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.5" />

              <text
                x="14"
                y="40"
                fill="#2563eb"
                fontWeight="800"
                fontSize="24"
                fontFamily="'Inter', sans-serif"
              >
                P
              </text>
              <text
                x="30"
                y="40"
                fill="#2563eb"
                fontWeight="800"
                fontSize="24"
                fontFamily="'Inter', sans-serif"
              >
                reproute
              </text>
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">Login</h2>
          <p className="text-slate-500 text-sm mb-8">
            Use your company provided Login credentials
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">
                User ID
              </label>
              <input
                type="text"
                placeholder="Enter User ID"
                {...register("userId")}
                className={`w-full h-12 px-4 rounded-xl border ${
                  errors.userId ? "border-red-400" : "border-slate-200"
                } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition outline-none`}
              />
              {errors.userId && (
                <p className="text-red-500 text-xs mt-1">{errors.userId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                {...register("password")}
                className={`w-full h-12 px-4 rounded-xl border ${
                  errors.password ? "border-red-400" : "border-slate-200"
                } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition outline-none`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-between items-center text-sm">
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  toast.error("Please contact your IT administrator to reset your password.");
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center shadow-sm disabled:bg-blue-400 cursor-pointer"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
