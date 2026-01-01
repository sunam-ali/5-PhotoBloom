import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProfile } from "../../hooks/useProfile";

function UpdateProfileInfo() {
  const { profileData, updateProfile, isUpdating, isError } = useProfile();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: profileData?.name || "",
      website: profileData?.website || "",
      bio: profileData?.bio || "",
      gender: profileData?.gender || "",
    },
  });

  // Sync data when hook finishes loading
  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData.name,
        website: profileData.website,
        bio: profileData.bio,
        gender: profileData.gender,
      });
    }
  }, [profileData, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const bio = watch("bio") || "";

  const onSubmit = (data) => {
    updateProfile(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
      {/* Name with Error handling */}
      <InputField
        label="Name"
        placeholder="Enter your name"
        register={register("name", { required: "Name is required" })}
        error={errors.name}
      />

      {/* Website */}
      <div className="bg-white p-6 rounded-lg">
        <label className="block mb-2 font-medium">Website</label>
        <input
          type="text"
          className={`form-input w-full border p-2 rounded ${
            errors.website ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="https://yourwebsite.com"
          {...register("website")}
        />
        {errors.website && (
          <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>
        )}
      </div>

      {/* Bio with Char Count Error */}
      <div className="bg-white p-6 rounded-lg">
        <label className="block mb-2 font-medium">Bio</label>
        <textarea
          className={`form-input resize-none h-24 w-full border p-2 rounded ${
            errors.bio ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Add bio under 150 words"
          {...register("bio", {
            maxLength: {
              value: 150,
              message: "Bio cannot exceed 150 characters",
            },
          })}
        />
        <div className="flex justify-between mt-1 text-xs">
          <span className={errors.bio ? "text-red-500" : "text-gray-500"}>
            {bio.length} / 150
          </span>
          {errors.bio && (
            <span className="text-red-500">{errors.bio.message}</span>
          )}
        </div>
      </div>

      {/* Gender */}
      <div className="bg-white p-6 rounded-lg">
        <label className="block mb-2 font-medium">Gender</label>
        <select
          className="form-input w-full border border-gray-300 p-2 rounded"
          {...register("gender")}
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* API Mutation Error */}
      {isError && (
        <p className="text-red-500 text-sm text-center font-medium">
          Error: Could not save profile changes.
        </p>
      )}

      {/* Submit */}
      <div className="flex justify-end my-3">
        <button
          type="submit"
          disabled={isUpdating}
          className="bg-blue-100 cursor-pointer text-blue-500 px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition disabled:opacity-50"
        >
          {isUpdating ? "Saving..." : "Submit"}
        </button>
      </div>
    </form>
  );
}

// Updated InputField to handle error prop
function InputField({ label, placeholder, register, error }) {
  return (
    <div className="bg-white rounded-lg p-6">
      <label className="block mb-2 font-medium">{label}</label>
      <input
        type="text"
        className={`form-input w-full border p-2 rounded ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
        {...register}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

export default UpdateProfileInfo;
