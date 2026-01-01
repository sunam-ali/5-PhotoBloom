import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";
import usePost from "../hooks/usePost";
import { usePostActions } from "../hooks/usePostActions";
import { formatTimeAgo } from "../utils/formattedTime";

export default function PostDetailsPage() {
  const { id } = useParams();
  const inputRef = useRef();
  const [commentText, setCommentText] = useState("");
  const [morePosts, setMorePosts] = useState([]);
  const [showLikesModal, setShowLikesModal] = useState(false); // Modal State Restored

  const { postDetails, isPostLoading, postError } = usePost(id);
  const { handleLike, handleComment, handleShare, alreadyLiked, isCommenting } =
    usePostActions(postDetails);
  console.log(postDetails);

  const serverUrl = import.meta.env.VITE_SERVER_BASE_URL;

  useEffect(() => {
    if (postDetails?.user?._id) {
      api
        .get(`/posts/user/${postDetails.user._id}`)
        .then((res) => {
          const others = res.data.posts.filter(
            (p) => p._id !== postDetails._id
          );
          setMorePosts(others);
        })
        .catch((err) => console.error(err));
    }
  }, [postDetails]);

  const onCommentSubmit = async () => {
    if (!commentText.trim()) return;
    await handleComment(commentText);
    setCommentText("");
  };

  if (isPostLoading) return <p className="text-center p-6">Loading...</p>;
  if (postError)
    return <p className="text-center text-red-500 p-6">Error loading post</p>;
  if (!postDetails) return null;

  return (
    <div className="max-w-6xl w-full py-10 ml-(--sidebar-width) px-4">
      <div className="bg-white border-gray-300 rounded-sm overflow-hidden mb-8 mx-auto max-w-5xl flex flex-col md:flex-row">
        {/* LEFT: Image */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center">
          <img
            src={`${serverUrl}/${postDetails.image}`}
            className="w-full h-full object-cover"
            alt="Post"
          />
        </div>

        {/* RIGHT: Content */}
        <div className="w-full md:w-1/2 flex flex-col bg-white h-[600px]">
          {/* Header */}
          <div className="flex items-center p-4 border-b">
            <Link
              to={`/profile/${postDetails.user._id}`}
              className="flex items-center"
            >
              <img
                src={
                  postDetails.user.avatar
                    ? `${import.meta.env.VITE_SERVER_BASE_URL}/${postDetails.user.avatar}`
                    : "/default-avatar.png"
                }
                className="w-8 h-8 rounded-full object-cover mr-3 border"
              />
              <span className="font-bold text-sm">{postDetails.user.name}</span>
            </Link>
          </div>

          {/* Scrollable Comments */}
          <div className="grow overflow-y-auto p-4 space-y-4">
            <div className="flex text-sm">
              <span className="font-bold mr-2">{postDetails.user.name}</span>
              <p>{postDetails.caption}</p>
            </div>
            {postDetails.comments?.map((c) => (
              <div key={c._id} className="flex text-sm">
                <span className="font-bold mr-2">{c.user?.name}</span>
                <p>{c.text}</p>
              </div>
            ))}
          </div>

          {/* Interaction Bar */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex space-x-4 mb-2">
              <button onClick={handleLike}>
                <HeartIcon active={alreadyLiked} />
              </button>
              <button onClick={() => inputRef.current.focus()}>
                <CommentIcon />
              </button>
              <button onClick={handleShare}>
                <ShareIcon />
              </button>
            </div>
            {/* Clickable Likes Count */}
            <button
              onClick={() => setShowLikesModal(true)}
              className="font-bold text-sm hover:text-gray-600 transition-colors"
            >
              {postDetails.likes?.length || 0} likes
            </button>
            <p className="text-[10px] text-gray-400 uppercase mt-1">
              {formatTimeAgo(postDetails.createdAt)} ago
            </p>
          </div>

          {/* Input */}
          <div className="p-4 border-t flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 outline-none text-sm"
            />
            <button
              onClick={onCommentSubmit}
              disabled={!commentText.trim() || isCommenting}
              className="ml-2 text-blue-500 font-bold text-sm disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* MORE POSTS GRID */}
      <div className="mx-auto max-w-5xl border-t pt-8">
        <h2 className="text-gray-500 text-sm mb-4">
          More posts from <strong>{postDetails.user.name}</strong>
        </h2>
        <div className="grid grid-cols-3 gap-1">
          {morePosts.length > 0 ? (
            morePosts.map((p) => (
              <Link
                key={p._id}
                to={`/post-details/${p._id}`}
                className="aspect-square bg-gray-100"
              >
                <img
                  src={`${serverUrl}/${p.image}`}
                  className="w-full h-full object-cover"
                />
              </Link>
            ))
          ) : (
            <div>No more posts</div>
          )}
        </div>
      </div>

      {/* LIKES MODAL */}
      {showLikesModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowLikesModal(false)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-center flex-1">Likes</h3>
              <button
                onClick={() => setShowLikesModal(false)}
                className="text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {postDetails.likes?.map((u) => (
                <Link
                  key={u._id}
                  to={`/profile/${u._id}`}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-lg"
                >
                  <img
                    src={
                      u.avatar
                        ? `${serverUrl}/${u.avatar}`
                        : "/default-avatar.png"
                    }
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <span className="font-semibold text-sm">{u.name}</span>
                </Link>
              ))}
              {postDetails.likes?.length === 0 && (
                <p className="text-center py-4 text-gray-500">No likes yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Minimal Icons
const HeartIcon = ({ active }) => (
  <svg
    className={`h-6 w-6 ${
      active ? "fill-red-500 stroke-red-500" : "stroke-gray-700"
    }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);
const CommentIcon = () => (
  <svg
    className="h-6 w-6 stroke-gray-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);
const ShareIcon = () => (
  <svg
    className="h-6 w-6 stroke-gray-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>
);
