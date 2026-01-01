import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      title="logout"
      className="p-2 hover:bg-red-50 rounded-full transition-colors group cursor-pointer"
    >
      <svg
        className="h-5 w-5 text-zinc-500 group-hover:text-red-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M16 13v-2H7V9l-5 3 5 3v-2h9zM20 3H10c-1.103 0-2 .897-2 2v4h2V5h10v14H10v-4H8v4c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z" />
      </svg>
    </button>
  );
}
