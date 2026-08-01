import { Link, useNavigate } from "react-router-dom";
import {
  loadingEnd,
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../../components/OAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { IconCar, IconMail, IconLock, IconArrowRight } from "@tabler/icons-react";
import Header from "../../components/Header";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email required" })
    .refine((v) => /\S+@\S+\.\S+/.test(v), { message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password required" }),
});

function SignIn() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const { isLoading, isError } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (formData, e) => {
    const BASE_URL = import.meta.env.VITE_PRODUCTION_BACKEND_URL || "";
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`${BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.accessToken) {
        localStorage.removeItem("accessToken");
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data?.refreshToken) {
        localStorage.removeItem("refreshToken");
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      if (data.succes === false || !res.ok) {
        dispatch(loadingEnd());
        dispatch(signInFailure(data));
        return;
      }
      if (data.isAdmin) {
        dispatch(signInSuccess(data));
        dispatch(loadingEnd());
        navigate("/adminDashboard");
      } else if (data.isUser) {
        dispatch(signInSuccess(data));
        dispatch(loadingEnd());
        navigate("/");
      } else {
        dispatch(loadingEnd());
        dispatch(signInFailure(data));
      }
    } catch (error) {
      dispatch(loadingEnd());
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* ─── Form ─── */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 pt-32">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Card header */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-8">
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <IconCar size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Welcome back</h1>
              <p className="text-slate-400 text-sm mt-1">Sign in to access your account</p>
            </div>

            <div className="px-8 py-8 space-y-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <IconMail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm"
                      placeholder="you@example.com"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <IconLock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      type="password"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm"
                      placeholder="••••••••"
                      {...register("password")}
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <p className="text-slate-500">
                    No account?{" "}
                    <Link to="/signup" className="font-semibold text-green-600 hover:text-green-700">Sign Up</Link>
                  </p>
                  <a href="#" className="font-semibold text-slate-500 hover:text-slate-700">Forgot password?</a>
                </div>

                {isError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 text-center">
                    {isError.message || "Something went wrong. Please try again."}
                  </div>
                )}

                <button
                  id="signin-submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>Sign In <IconArrowRight size={18} /></>
                  )}
                </button>
              </form>

              {/* <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-slate-400 font-medium">Or continue with</span>
                </div>
              </div>
              <OAuth /> */}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
