import { Link } from "react-router-dom";
import DefaultAvatar from "../../assets/default-avatar.png";
import { usePostActions } from "../../hooks/usePostActions";

export default function PostHeader({ post }) {
  const { isMyPost, loggedInUser } = usePostActions(post);
  return (
    <div className="flex items-center p-3">
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <Link to={`/profile/${post?.user?._id}`}>
          <img
            src={
              isMyPost && loggedInUser?.avatar
                ? `${import.meta.env.VITE_SERVER_BASE_URL}/${loggedInUser?.avatar}`
                : post.user?.avatar
                ? `${import.meta.env.VITE_SERVER_BASE_URL}/${post.user?.avatar}`
                : DefaultAvatar
            }
            className="w-full h-full object-cover"
            alt="user avatar"
          />
        </Link>
      </div>
      <div className="ml-2">
        <Link to={`/profile/${post?.user?._id}`}>
          <p className="font-semibold text-sm">
            {isMyPost ? loggedInUser?.name : post?.user?.name}
          </p>
        </Link>
        <span className="text-gray-500 text-xs">
          • {new Date(post.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
