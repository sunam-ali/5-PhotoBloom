import PostComments from "./PostComments";

export default function PostDetails({ postDetails }) {
  return (
    <>
      <div className="bg-white border rounded-sm overflow-hidden mb-8 mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-black flex items-center">
            <img
              src={
                postDetails.user.avatar
                  ? `${import.meta.env.VITE_SERVER_BASE_URL}/${
                      postDetails.user.avatar
                    }`
                  : "/default-avatar.png"
              }
              alt="Post image"
              className="w-full post-image"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col">
            <PostDetails postDetails={postDetails} />
            <div className="p-3">
              <p className="text-sm ">{postDetails.caption}</p>
            </div>
            <div className="comments-section grow p-3 border-b">
              <h3 className="font-bold pb-4">Comments</h3>
              <PostComments postDetails={postDetails} />
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
