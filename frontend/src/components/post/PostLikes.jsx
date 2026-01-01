import { useState } from "react";
import { Link } from "react-router-dom";
import DefaultAvatar from "../../assets/default-avatar.png";
import { usePostActions } from "../../hooks/usePostActions";
import LoginPopup from "../auth/LoginPopup";

export default function PostLikes({ post }) {
  const { setShowLogin, loggedInUser, showLogin } = usePostActions(post);
  const [showLikesModal, setShowLikesModal] = useState(false);

  return (
    <>
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
      <div className="px-3">
        <div className="flex items-center">
          <div
            className="h-6 flex -space-x-2  cursor-pointer"
            onClick={() => {
              if (!loggedInUser) {
                setShowLogin(true);
                return;
              }
              setShowLikesModal(true);
            }}
          >
            {post?.likes.slice(0, 3).map((likedUser) => (
              <img
                key={likedUser?._id}
                src={
                  likedUser?._id === loggedInUser?._id && loggedInUser?.avatar
                    ? `${import.meta.env.VITE_SERVER_BASE_URL}/${
                        loggedInUser?.avatar
                      }`
                    : likedUser?.avatar
                    ? `${import.meta.env.VITE_SERVER_BASE_URL}/${
                        likedUser?.avatar
                      }`
                    : DefaultAvatar
                }
                alt={likedUser?.name}
                className="w-6 h-6 rounded-full"
              />
            ))}
          </div>
          <p className="text-sm ml-2">
            <span className="font-semibold">{post?.likes.length} likes</span>
          </p>
        </div>
      </div>
      {showLikesModal && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setShowLikesModal(false)}
        >
          <div
            className="bg-white  rounded-xl p-6 w-80 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-zinc-800 ">
                Liked by ❤️
              </h2>
              <button
                onClick={() => setShowLikesModal(false)}
                className="text-xl text-zinc-600 cursor-pointer "
              >
                &times;
              </button>
            </div>
            {post.likes.length === 0 ? (
              <p className="text-sm text-zinc-500">No likes yet.</p>
            ) : (
              <ul className="space-y-2">
                {post.likes.map((likedUser) => (
                  <Link
                    to={`/profile/${likedUser?._id}`}
                    key={likedUser._id}
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={
                        likedUser?._id === loggedInUser?._id &&
                        loggedInUser?.avatar
                          ? `${import.meta.env.VITE_SERVER_BASE_URL}/${
                              loggedInUser?.avatar
                            }`
                          : likedUser?.avatar
                          ? `${import.meta.env.VITE_SERVER_BASE_URL}/${
                              likedUser?.avatar
                            }`
                          : DefaultAvatar
                      }
                      alt={likedUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-zinc-800">
                      {likedUser?._id === loggedInUser?._id
                        ? loggedInUser?.name
                        : likedUser.name}
                    </span>
                  </Link>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
