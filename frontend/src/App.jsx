import { Route, Routes } from "react-router-dom";
import CreatePostPage from "./pages/CreatePostPage";
import EditProfilePage from "./pages/EditProfilePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import NotificationPage from "./pages/NotificationPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import RegistrationPage from "./pages/RegistrationPage";
import PrivateHomeLayout from "./routes/PrivateHomeLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PrivateHomeLayout />}>
        <Route index element={<HomePage />} />
        <Route path="notification" element={<NotificationPage />} />
        <Route path="create-post" element={<CreatePostPage />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route path="edit-profile" element={<EditProfilePage />} />
        <Route path="post-details/:id" element={<PostDetailsPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
