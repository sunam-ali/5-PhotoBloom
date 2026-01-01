import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function RegistrationForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/signup`,
        {
          name: data.fullName,
          email: data.email,
          password: data.password,
        },
      );
      const { user, accessToken, refreshToken } = response.data;
      login(user, accessToken, refreshToken);
      navigate("/edit-profile");
    } catch (error) {
      setError("root.random", {
        message: error.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto">
      <div className="mb-2">
        <label htmlFor="email" className="sr-only">
          Email or Mobile
        </label>
        <div className="relative">
          <input
            id="email"
            type="text"
            className="form-input w-full"
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
            {...register("email", {
              required: "Email required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-2">
        <label htmlFor="fullName" className="sr-only">
          Full Name
        </label>
        <div className="relative">
          <input
            id="fullName"
            type="text"
            className="form-input w-full"
            placeholder="Full Name"
            aria-label="Full Name"
            autoComplete="fullName"
            {...register("fullName", { required: "Full name is required" })}
          />
        </div>
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div className="mb-2">
        <label htmlFor="username" className="sr-only">
          Username (optional)
        </label>
        <div className="relative">
          <input
            id="username"
            type="text"
            className="form-input w-full"
            placeholder="Username (optional)"
            aria-label="Username"
            autoComplete="username"
            {...register("username")}
          />
        </div>
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="form-input w-full"
            placeholder="Password"
            aria-label="Password"
            autoComplete="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 text-xs"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-eye-icon lucide-eye"
              >
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-eye-off-icon lucide-eye-off"
              >
                <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                <path d="m2 2 20 20" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {errors?.root?.serverError?.message && (
        <p className="text-red-500 text-xs mb-3">
          {errors.root.serverError.message}
        </p>
      )}

      <div className="mb-2">
        <button type="submit" className="signup-button w-full cursor-pointer">
          Sign up
        </button>
      </div>

      <div className="or-separator">OR</div>

      <div className="mb-4">
        <button
          type="button"
          className="signup-button w-full text-white cursor-pointer"
        >
          Sign up with Google
        </button>
      </div>
    </form>
  );
}
