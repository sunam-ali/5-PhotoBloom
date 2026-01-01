import { useState } from "react";
import { useForm } from "react-hook-form";
import { useProfile } from "../../hooks/useProfile";

export default function ChangePassword() {
  const { changePassword, isChangingPassword, isError, error } = useProfile();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // eslint-disable-next-line react-hooks/incompatible-library
  const newPassword = watch("newPassword");

  const onSubmit = (data) => {
    // Using changePassword from useProfile hook
    changePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          reset();
          alert("Password updated successfully");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm"
    >
      <h2 className="font-medium text-lg mb-4">Change Password</h2>

      {/* Current Password */}
      <PasswordField
        label="Current Password"
        show={showCurrent}
        toggleShow={() => setShowCurrent((p) => !p)}
        register={register("currentPassword", {
          required: "Current password is required",
        })}
        error={errors.currentPassword}
      />

      {/* New Password */}
      <PasswordField
        label="New Password"
        show={showNew}
        toggleShow={() => setShowNew((p) => !p)}
        register={register("newPassword", {
          required: "New password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
          validate: (value, formValues) =>
            value !== formValues.currentPassword ||
            "New password cannot be same as current password",
        })}
        error={errors.newPassword}
      />

      {/* Strength Meter */}
      {newPassword && <PasswordStrength password={newPassword} />}

      <p className="text-xs text-gray-500 mb-3">
        Use at least 8 characters with letters, numbers, and symbols.
      </p>

      {/* Confirm Password */}
      <PasswordField
        label="Confirm New Password"
        show={showConfirm}
        toggleShow={() => setShowConfirm((p) => !p)}
        register={register("confirmPassword", {
          required: "Please confirm password",
          validate: (value, formValues) =>
            value === formValues.newPassword || "Passwords do not match",
        })}
        error={errors.confirmPassword}
      />

      {/* Server Error from Hook */}
      {isError && (
        <p className="text-red-500 text-sm mb-3">
          {error?.response?.data?.message || "Failed to update password"}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isChangingPassword}
        className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition disabled:opacity-50"
      >
        {isChangingPassword ? "Updating..." : "Change Password"}
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          After changing your password, you’ll be logged out of other devices.
        </p>
      </div>
    </form>
  );
}

// --- Sub-Components ---

function PasswordField({ label, show, toggleShow, register, error }) {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className={`form-input pr-10 w-full border p-2 rounded ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={label}
          {...register}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 text-xs font-semibold hover:text-blue-500"
          onClick={toggleShow}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

function PasswordStrength({ password }) {
  const getLevel = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  };

  const level = getLevel();
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];

  return (
    <div className="flex w-full h-1 mb-2 gap-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-1/4 h-full rounded-full transition-colors duration-300 ${
            i < level ? colors[level - 1] : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}
