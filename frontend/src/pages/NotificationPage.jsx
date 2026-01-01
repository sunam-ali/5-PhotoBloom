import { useNotifications } from "../hooks/useNotification";
import { formatTimeAgo } from "../utils/formattedTime";

export default function NotificationsPage() {
  const { notifications, isLoading, markAsRead } = useNotifications();
  const serverUrl = import.meta.env.VITE_SERVER_BASE_URL;

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  console.log(notifications)

  return (
    <div className="max-w-[600px] mx-auto bg-white min-h-screen border-x">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Notifications</h1>
        </div>
      </header>

      <div className="notifications-list">
        {notifications?.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              item={notification}
              onRead={() => markAsRead(notification._id)}
              serverUrl={serverUrl}
            />
          ))
        ) : (
          <p className="p-10 text-center text-gray-500">
            No notifications yet.
          </p>
        )}
      </div>
    </div>
  );
}

function NotificationItem({ item, onRead, serverUrl }) {
  return (
    <div
      onClick={onRead}
      className={`flex items-center p-4 border-b border-gray-50 transition-colors cursor-pointer ${
        !item.isRead ? "bg-blue-50/50" : "hover:bg-gray-50"
      }`}
    >
      {/* User Avatar */}
      <div className="relative">
        <div className="w-11 h-11 rounded-full overflow-hidden mr-3 border">
          <img
            src={`${serverUrl}/${item.fromUser?.avatar || "default-avatar.png"}`}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Unread Dot */}
        {!item.isRead && (
          <div className="absolute top-0 right-2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 mr-3">
        <p className="text-sm">
          <span className="font-semibold">{item.sender?.username}</span>{" "}
          {item.type === "like" && "liked your photo."}
          {item.type === "comment" && `commented: "${item.commentText}"`}
          {item.type === "reply" && `replied: "${item.commentText}"`}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatTimeAgo(item.createdAt)}
        </p>
      </div>

      {/* Post Thumbnail */}
      {item.postImage && (
        <div className="w-11 h-11 rounded overflow-hidden shrink-0">
          <img
            src={`${serverUrl}/${item.postImage}`}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
