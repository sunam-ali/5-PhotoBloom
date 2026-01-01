import { NavLink } from "react-router-dom";
import DefaultImage from "../../assets/default-avatar.png";
import useAuth from "../../hooks/useAuth";
import Logout from "../auth/Logout.";
import Logo from "./Logo";

const UserInfo = ({ isAuthenticated, user }) => {
  if (!isAuthenticated) return;

  return (
    <div className="flex items-center justify-between pt-4">
      <NavLink to={`/profile/${user?._id}`} className="flex items-center group">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 ">
          <img
            src={
              user?.avatar
                ? `${import.meta.env.VITE_SERVER_BASE_URL}/${user?.avatar}`
                : DefaultImage
            }
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3">
          <p className="font-bold text-sm text-zinc-800">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </NavLink>
      <Logout />
    </div>
  );
};

function FloatingNavbar() {
  const { isAuthenticated, user } = useAuth();
  const navLinkClass = ({ isActive }) =>
    `flex flex-row items-center gap-2 p-2 rounded-lg transition-all duration-150 ${
      isActive
        ? "bg-gradient-to-r from-pink-500 to-rose-400 font-bold text-white shadow-md"
        : "text-zinc-600 hover:bg-zinc-100"
    }`;

  return (
    <aside className="hidden floating-navbar bg-white border-r border-gray-200 px-6 py-4 md:flex flex-col h-screen sticky top-0">
      <Logo />
      {/* Navigation Links */}
      <ul className="space-y-4 flex-1">
        <li>
          <NavLink to="/" className={navLinkClass} end>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-sm">Home</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/notification" className={navLinkClass}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="text-sm">Notifications</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/create-post" className={navLinkClass}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-sm">Create</span>
          </NavLink>
        </li>

        <li>
          <NavLink to={`/profile/${user?._id}`} className={navLinkClass}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-sm">Profile</span>
          </NavLink>
        </li>
      </ul>

      {/* User Info / Footer */}
      <UserInfo user={user} isAuthenticated={isAuthenticated} />
    </aside>
  );
}

export default FloatingNavbar;
