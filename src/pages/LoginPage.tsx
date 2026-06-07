import InputField from "../components/ui/InputField";

import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../utils/loginSchema";

import type { LoginSchemaType } from "../utils/loginSchema";

import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,

    handleSubmit,

    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      console.log(data);

      localStorage.setItem("token", "temporary-dev-token");

      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid credentials");

      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Preproute Admin</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            label="Username"
            placeholder="Enter username"
            error={errors.userId?.message}
            {...register("userId")}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register("password")}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
