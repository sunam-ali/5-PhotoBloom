/* eslint-disable react-hooks/incompatible-library */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DefaultImage from "../assets/default-avatar.png";
import { usePostActions } from "../hooks/usePostActions";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const {
    handleCreatePost,
    isCreating,
    createError,
    loggedInUser: user,
  } = usePostActions();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [preview, setPreview] = useState(null);
  const caption = watch("caption") || "";
  const imageFile = watch("image")?.[0];

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("caption", data.caption);
      formData.append("image", data.image[0]);

      await handleCreatePost(formData);
      reset();
      setPreview(null);
      navigate("/");
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-auto flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-y-gray-300 flex items-center justify-between px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-1 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>
        <h1 className="text-base font-semibold">Create new post</h1>
        <button
          type="submit"
          disabled={!imageFile || isCreating}
          className="text-blue-500 font-semibold disabled:text-gray-400 cursor-pointer"
        >
          {isCreating ? "Posting..." : "Post"}
        </button>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Side - Image Preview */}
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center relative">
          {preview ? (
            <>
              <img
                src={preview}
                alt="Upload preview"
                className="w-full h-full object-cover absolute"
              />
              <span
                className="bg-red-500/80 p-2 m-4 rounded-full text-white text-xs relative cursor-pointer"
                onClick={() => setPreview(null)}
              >
                Remove Photo
              </span>
            </>
          ) : (
            <label className="cursor-pointer text-white rounded-md text-sm bg-black/80 p-2 m-4">
              Click to upload image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register("image", {
                  required: "Image is required",
                  onChange: handleImageChange,
                })}
              />
            </label>
          )}
          {errors.image && (
            <p className="absolute bottom-4 text-red-500 text-xs">
              {errors.image.message}
            </p>
          )}
        </div>

        {/* Right Side - Post Details */}
        <div className="w-full md:w-1/2 bg-white flex flex-col">
          <div className="flex items-center p-4 border-b border-y-gray-300 ">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
              <img
                src={
                  user?.avatar
                    ? `${import.meta.env.VITE_SERVER_BASE_URL}/${user?.avatar}`
                    : DefaultImage
                }
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="ml-3 font-semibold text-sm">{user?.name}</span>
          </div>

          <div className="p-4 border-b border-y-gray-300 grow">
            <p className="font-medium text-base mb-2">Caption Section</p>
            <textarea
              className="w-full caption-input border-0 outline-none text-sm resize-none"
              placeholder="Write a caption..."
              rows={4}
              {...register("caption", {
                maxLength: {
                  value: 2200,
                  message: "Caption cannot exceed 2200 characters",
                },
              })}
            />
            <div className="flex justify-between items-center mt-2">
              <button type="button" className="text-gray-400">
                🙂
              </button>
              <span className="text-gray-400 text-xs">
                {caption.length}/2,200
              </span>
            </div>
            {errors.caption && (
              <p className="text-red-500 text-xs mt-1">
                {errors.caption.message}
              </p>
            )}
          </div>

          {/* UI Buttons */}
          <div className="flex flex-col">
            {[
              "Add location",
              "Add collaborators",
              "Accessibility",
              "Advanced settings",
            ].map((item) => (
              <button
                key={item}
                type="button"
                className="flex items-center justify-between p-4 border-b border-y-gray-300"
              >
                <span className="text-base text-gray-600">{item}</span>
                <span className="text-gray-400">›</span>
              </button>
            ))}
          </div>

          {/* API Error Message */}
          {createError && (
            <p className="text-red-500 text-xs text-center p-2">
              {createError?.response?.data?.message || "Failed to create post"}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
