import { useNavigate } from "react-router-dom";
import { usePostActions } from "../../hooks/usePostActions";
import LoginPopup from "../auth/LoginPopup";

export default function CommentsCount({ post }) {
  const navigate = useNavigate();
  const { showLogin, setShowLogin } = usePostActions(post);
  return (
    <>
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
      <div className="px-3 mt-1 ">
        {post?.comments?.length > 0 && (
          <button
            onClick={() => {
              setShowLogin(true);
              navigate(`/post-details/${post._id}`);
            }}
            className="text-gray-500 text-sm cursor-pointer"
          >
            View all {post?.comments.length} comments...
          </button>
        )}
      </div>
    </>
  );
}
