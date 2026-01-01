import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import api from "../api/api";
import useAuth from "./useAuth";

const POST_PER_PAGE = 3;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function usePost(postId = null) {
  const { isAuthenticated, user: authUser } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const obserRef = useRef(null);

  // --- INFINITE SCROLL FOR POSTS FEED ---
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPosts,
    error: postsError,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 0 }) => {
      await delay(1500);
      const response = await api.get(
        `/posts/?page=${pageParam}&limit=${POST_PER_PAGE}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // If the API actually returns no more data, stop.
      if (!lastPage || lastPage.length < POST_PER_PAGE) {
        return undefined;
      }

      // If user is guest and we just finished Page 1 (index 0)
      // Return 1 to keep hasNextPage = true, which keeps the observer alive
      return allPages.length;
    },
    initialPageParam: 0,
    onSuccess: (data) => {
      // Mark initial load as complete when we have posts
      if (data?.pages?.[0]?.length > 0 && !initialLoadComplete) {
        setInitialLoadComplete(true);
      }
    },
  });

  const allPosts = postsData?.pages?.flat() || [];

  // Setup intersection observer
  const setupObserver = useCallback(
    (node) => {
      if (obserRef.current) obserRef.current.disconnect();

      // Only attach the observer if we aren't currently loading
      // AND initial load is complete
      if (
        node &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isLoadingPosts &&
        initialLoadComplete
      ) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              if (!isAuthenticated) {
                // Only show popup for non-authenticated users
                // This won't trigger on initial load anymore
                setShowLoginPopup(true);
              } else {
                fetchNextPage();
              }
            }
          },
          { threshold: 0.1, rootMargin: "50px" }
        );

        observer.observe(node);
        obserRef.current = observer;
      }
    },
    [
      hasNextPage,
      isFetchingNextPage,
      isLoadingPosts,
      isAuthenticated,
      fetchNextPage,
      initialLoadComplete,
    ]
  );

  // --- SINGLE POST DETAILS ---
  const {
    data: postDetails,
    isLoading: isPostLoading,
    error: postError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await api.get(`/posts/${postId}`);
      return data;
    },
    enabled: !!postId && isAuthenticated,
  });

  const isMyPost =
    authUser?.id === postDetails?.author?.id ||
    authUser?._id === postDetails?.author?._id;

  const handleLoginRedirect = () => {
    window.scrollTo(0, 0);
  };

  return {
    posts: allPosts,
    hasMore: hasNextPage,
    obserRef: setupObserver,
    showLoginPopup,
    setShowLoginPopup,
    postDetails,
    isPostLoading,
    postError,
    isMyPost,
    isLoadingPosts,
    postsError,
    isFetchingNextPage,
    loadMore: fetchNextPage,
    handleLoginRedirect,
    isAuthenticated,
    initialLoadComplete,
  };
}

export default usePost;
