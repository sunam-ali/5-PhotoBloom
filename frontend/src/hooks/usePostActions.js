import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/api";
import useAuth from "./useAuth";

export const usePostActions = (post = null) => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [showLogin, setShowLogin] = useState(false);

  const invalidateData = () => {
    // 1. Invalidate the general list (for home/search pages)
    queryClient.invalidateQueries({ queryKey: ["posts"] });

    // 2. Invalidate the specific post (for the details page)
    if (post?._id) {
      queryClient.invalidateQueries({ queryKey: ["post", post._id] });
    }
  };

  // --- LIKE MUTATION ---
  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/posts/${post?._id}/like`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      invalidateData();
    },
  });

  // --- COMMENT MUTATION ---
  const commentMutation = useMutation({
    mutationFn: async (commentText) => {
      const response = await api.post(`/posts/${post?._id}/comment`, {
        text: commentText,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      invalidateData();
    },
  });

  // --- CREATE POST MUTATION ---
  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post("/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    if (!isAuthenticated) return setShowLogin(true);
    likeMutation.mutate();
  };

  const handleComment = (commentText) => {
    if (!commentText.trim()) return;
    if (!isAuthenticated) return setShowLogin(true);
    return commentMutation.mutateAsync(commentText);
  };

  const handleCreatePost = async (formData) => {
    return createMutation.mutateAsync(formData);
  };

  const handleShare = async () => {
    try {
      const postLink = `${window.location.origin}/post-details/${post?._id}`;
      await navigator.clipboard.writeText(postLink);
      alert("Post link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const alreadyLiked = post?.likes?.some(
    (likedUser) => likedUser._id === user?._id
  );

  const isMyPost = user?._id && post?.user?._id && user._id === post.user._id;

  return {
    handleLike,
    handleComment,
    handleShare,
    handleCreatePost,
    isMyPost,
    alreadyLiked,
    isAuthenticated,
    showLogin,
    setShowLogin,
    isCommenting: commentMutation.isPending,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    loggedInUser: user,
  };
};
