import LoginPopup from "../components/auth/LoginPopup";
import PostCard from "../components/post/PostCard";
import usePost from "../hooks/usePost";

const HomePage = () => {
  const {
    posts,
    hasMore,
    obserRef,
    showLoginPopup,
    setShowLoginPopup,
    isAuthenticated,
    isLoadingPosts,
    isFetchingNextPage,
  } = usePost();

  return (
    <div className="max-w-2xl px-2 sm:mx-auto w-full md:py-10 py-4 min-h-screen">
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <PostCard post={post} key={post._id} />
        ))}
      </div>

      {/* The Observer and Loading Area */}
      <div
        ref={obserRef}
        className="min-h-[120px] flex items-center justify-center py-10"
      >
        {/* Case 1: Initial Loading (First time opening site) */}
        {isLoadingPosts && (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
            <p className="text-gray-500 text-sm">Fetching posts...</p>
          </div>
        )}

        {/* Case 2: We have posts, but we are fetching the NEXT page */}
        {!isLoadingPosts && isFetchingNextPage && (
          <div className="flex items-center text-pink-500 animate-bounce">
            <span className="text-sm font-medium">Loading more posts...</span>
          </div>
        )}

        {/* Case 3: Guest reaches the limit (3 posts) */}
        {!isLoadingPosts &&
          !isFetchingNextPage &&
          hasMore &&
          !isAuthenticated &&
          posts.length >= 3 && (
            <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl w-full bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">
                Enjoying the content?
              </h3>
              <p className="text-gray-500 mb-4">
                Sign in to keep scrolling through the feed!
              </p>
              <button
                onClick={() => setShowLoginPopup(true)}
                className="bg-pink-500 text-white px-10 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Sign In to See More
              </button>
            </div>
          )}

        {/* Case 4: End of the road */}
        {!hasMore && posts.length > 0 && (
          <div className="text-gray-400 font-medium">
            ✨ You're all caught up!
          </div>
        )}
      </div>

      {showLoginPopup && (
        <LoginPopup onClose={() => setShowLoginPopup(false)} />
      )}
    </div>
  );
};

export default HomePage;
