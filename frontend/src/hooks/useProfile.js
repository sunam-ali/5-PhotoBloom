import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import useAuth from "./useAuth"; 

export const useProfile = (userId = null) => {
  const { user: authUser, setUser } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", userId || "me"],
    queryFn: async () => {
      const endpoint = userId ? `/posts/user/${userId}` : "/users/me";
      const { data } = await api.get(endpoint);
      if (!userId) {
        setUser(data);
      }
      return data;
    },
    enabled: true,
  });

  // 2. Update Profile Info (PATCH /users/me)
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const { data } = await api.patch("/users/me", updatedData);
      setUser(data)
      return data;
    },
    onSuccess: () => {
      // Refresh 'me' profile data immediately
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });

  // 3. Change Password (PATCH /users/me/password)
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData) => {
      const { data } = await api.patch("/users/me/password", passwordData);
      return data;
    },
  });

  // 4. Update Avatar (PATCH /users/me/avatar)
  const updateAvatarMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await api.patch("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });

  const isMyProfile =
    !userId || userId === authUser?._id || userId === authUser?.id;

  return {
    // State
    profileData: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,

    isMyProfile,
    // Actions
    updateProfile: updateProfileMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
    updateAvatar: updateAvatarMutation.mutateAsync,

    // Status helpers
    isUpdating: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isUploadingAvatar: updateAvatarMutation.isPending,
  };
};
