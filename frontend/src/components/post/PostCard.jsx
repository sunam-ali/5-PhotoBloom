import { useRef } from "react";
import AddComment from "./AddComment";
import CommentsCount from "./CommentsCount";
import PostActions from "./PostActions";
import PostCaption from "./PostCaption";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";
import PostLikes from "./PostLikes";

export default function PostCard({ post }) {
  const inputRef = useRef();
  return (
    <article className="pb-4 mb-4 max-w-[560px] mx-auto border border-gray-200  rounded-md bg-white">
      {/* Post Header */}
      <PostHeader post={post} />
      {/* Post Image */}
      <PostImage post={post} />
      {/* Post Actions */}
      <PostActions post={post} inputRef={inputRef} />
      {/* Likes */}
      <PostLikes post={post} />
      {/* Caption */}
      <PostCaption post={post} />
      {/* Comments Link */}
      <CommentsCount post={post} />
      {/* Add Comment Input */}
      <AddComment post={post} inputRef={inputRef} />
    </article>
  );
}
