import ChangePassword from "../components/profile/ChangePassword";
import UpdateProfileInfo from "../components/profile/UpdateProfileInfo";
import UpdateProfilePicture from "../components/profile/UpdateProfilePicture";

export default function EditProfilePage() {
  return (
    <div className="edit-container">
      <h1 className="text-2xl font-bold mb-8">Edit profile</h1>
      <div className="flex gap-5 max-[1000px]:flex-col">
        <div className="flex-1">
          <UpdateProfilePicture />
          <UpdateProfileInfo />
        </div>
        <div className="flex-1">
          <ChangePassword />
        </div>
      </div>
      <div className="mb-6">
        <p className="text-gray-500 text-sm">
          Certain profile info, like your name, bio and links, is visible to
          everyone.
          <a href="#" className="text-blue-500 ml-1">
            See what profile info is visible
          </a>
        </p>
      </div>
    </div>
  );
}
