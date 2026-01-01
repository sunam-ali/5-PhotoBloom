import { useParams } from "react-router-dom";
import PostList from "../components/profile/PostList";
import ProfileHeader from "../components/profile/ProfileHeader";
import { useProfile } from "../hooks/useProfile";

export default function ProfilePage() {
  const { id } = useParams();

  const { profileData, isLoading, isError, error, isMyProfile } =
    useProfile(id);

  if (isLoading) {
    return <div className="p-10 text-center">Profile Data is Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-red-500 p-10 text-center">
        {error?.message || "Failed to load profile"}
      </div>
    );
  }

  return (
    <div className="main-container flex-auto">
      <div className="profile-container p-4">
        {/* Profile Header using profileData from hook */}
        <ProfileHeader
          user={profileData?.user}
          postLength={profileData?.postsCount}
          isMyProfile={isMyProfile}
        />

        {/* Post List Section */}
        <section className="mt-8">
          <h3 className="font-semibold text-lg mb-4">Posts</h3>
          {profileData?.posts?.length > 0 ? (
            <PostList posts={profileData?.posts} />
          ) : (
            <p className="text-gray-500">No posts found.</p>
          )}
        </section>
      </div>
    </div>
  );
}
