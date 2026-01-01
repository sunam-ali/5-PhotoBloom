import ReactDOM from "react-dom";
import { Link } from "react-router-dom";

const LoginPopup = ({ onClose }) => {
  const handleCloseAndScroll = () => {
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg text-center mx-3">
        <h2 className="text-xl font-bold mb-4">Login Required</h2>
        <p className="mb-4">Please log in to see and likes post</p>
        <div className="flex gap-2 items-center justify-center">
          <Link
            to="/login"
            className="bg-pink-500 text-white px-4 py-2 rounded"
          >
            Login
          </Link>
          <button
            onClick={handleCloseAndScroll}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default LoginPopup;
