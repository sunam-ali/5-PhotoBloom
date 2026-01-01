import { useState } from "react";
import { useForm } from "react-hook-form";
import DefaultAvatar from "../../assets/default-avatar.png";
import { useProfile } from "../../hooks/useProfile";

export default function UpdateProfilePicture() {
  const { profileData, updateAvatar, isUploadingAvatar } = useProfile();
  const { register, handleSubmit, reset, watch } = useForm();
  // eslint-disable-next-line react-hooks/incompatible-library
  const avatarFile = watch("avatar")?.[0];

  const [preview, setPreview] = useState(null);

  const onSubmit = (data) => {
    const file = data.avatar[0];
    if (file) {
      updateAvatar(file, {
        onSuccess: () => {
          reset();
          setPreview(null);
        },
      });
    }
  };

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    reset();
    setPreview(null);
  };

  const avatarSrc =
    preview ||
    (profileData?.avatar
      ? `http://localhost:3000/${profileData.avatar}`
      : DefaultAvatar);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6">
      <div className="sm:flex items-center flex-col">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border border-gray-300">
          <img
            src={avatarSrc}
            alt="Profile"
            className="w-full h-full object-cover "
          />
        </div>
        <div>
          <h2 className="font-semibold text-base">{profileData?.name}</h2>
          <p className="text-gray-500">{profileData?.email}</p>
        </div>

        {!avatarFile ? (
          <>
            <label
              htmlFor="avatar"
              className=" cursor-pointer bg-gray-100 text-gray-700 p-2 mt-1.5 rounded-md text-sm font-medium hover:bg-gray-200 transition"
            >
              Change photo
            </label>

            <input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              {...register("avatar", {
                required: true,
                onChange: handlePreview,
              })}
            />
          </>
        ) : (
          <div className=" flex items-center justify-center gap-2 mt-1.5">
            <button
              type="submit"
              disabled={isUploadingAvatar}
              className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition disabled:opacity-50"
            >
              {isUploadingAvatar ? "Uploading..." : "Confirm"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isUploadingAvatar}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
