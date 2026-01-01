export default function PostComments({ postDetails }) {
  return (
    <>
      {postDetails?.comments.map((comment) => (
        <>
          <div className="flex mb-4" key={comment?._id}>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-linear-to-r  mr-2 ">
              <div className="w-full h-full rounded-full overflow-hidden bg-white p-px mr-2">
                <img
                  src={`${import.meta.env.VITE_SERVER_BASE_URL}/${
                    comment.user.avatar
                  }`}
                  alt="Saad Hasan"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-semibold text-sm">
                  {comment?.user?.name}
                </span>

                <span className="text-xs text-gray-500 ml-2">
                  {new Date(comment.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm mt-2 text-gray-800">{comment.text}</p>
            </div>
          </div>
        </>
      ))}
    </>
  );
}
