import styles from "../../index";
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

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "email required" })
    .refine((value) => /\S+@\S+\.\S+/.test(value), {
      message: "Invalid email address",
    }),
  password: z.string().min(1, { message: "password required" }),
});

// export const refreshToken = async (dispatch,getState) => {
//   const { authSlice } = getState();

//   if (!authSlice.refreshToken) {
//     // No refresh token available, handle the situation (e.g., log out the user)
//     dispatch(logout());
//     return;
//   }

//   try {
//     const res = await fetch('/api/auth/refresh', {
//       method: 'POST',
//       credentials: 'include', // Include cookies in the request
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       dispatch(refreshTokenFailure(data));
//       return;
//     }

//     // The server should set the new access token and refresh token in the response cookies
//     dispatch(refreshTokenSuccess(data));
//   } catch (err) {
//     dispatch(signInFailure(err));
//   }
// }

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

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
        localStorage.removeItem(("accessToken"))
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data?.refreshToken) {
        localStorage.removeItem(("refreshToken"))
        localStorage.setItem("refreshToken", data.refreshToken)
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
      dispatch(loadingEnd());
      dispatch(signInFailure("something went wrong"));
    } catch (error) {
      dispatch(loadingEnd());
      dispatch(signInFailure(error));
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-900 rounded-b-[20%] transform scale-x-150 -translate-y-20"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
        >
          <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
              <Link to="/" onClick={() => dispatch(loadingEnd())}>
                <div className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="text"
                    id="email"
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm">
                  <p className="text-gray-600">
                    No account?{" "}
                    <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                      Sign Up
                    </Link>
                  </p>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              {isError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                  <p className="text-sm text-red-600 font-medium text-center">
                    {isError.message || "Something went wrong. Please try again."}
                  </p>
                </div>
              )}

              <button
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <OAuth />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default SignIn;
