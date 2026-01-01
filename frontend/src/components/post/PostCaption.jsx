import { useState } from "react";
import { usePostActions } from "../../hooks/usePostActions";

export default function PostCaption({ post }) {
  const { isMyPost, loggedInUser } = usePostActions(post);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const isCaptionLong = post.caption?.length > 100;
  const displayedCaption = showFullCaption
    ? post.caption
    : post.caption.slice(0, 100);

  return (
    <div className="px-3 mt-2 text-sm">
      <p>
        <span className="font-semibold">
          {isMyPost ? loggedInUser?.name : post.user?.name}
        </span>{" "}
        <span>{displayedCaption}</span>
        {isCaptionLong && (
          <button
            onClick={() => setShowFullCaption((prev) => !prev)}
            className=" text-blue-500 font-medium cursor-pointer"
          >
            {showFullCaption ? "...Show Less" : "...Show More"}
          </button>
        )}
      </p>
    </div>
  );
}
