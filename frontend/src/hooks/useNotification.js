import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Fetch Notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      return res.data;
    },
  });

  // Mark Read/Unread Mutation
  const toggleReadMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const endpoint = status === "read" ? "read" : "unread";
      const res = await api.patch(`/notifications/${id}/${endpoint}`);
      return res.data;
    },
    // OPTIMISTIC UPDATE: Update UI immediately
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(["notifications"], (old) =>
        old.map((n) => (n._id === id ? { ...n, isRead: status === "read" } : n))
      );

      return { previous };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["notifications"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications,
    isLoading,
    markAsRead: (id) => toggleReadMutation.mutate({ id, status: "read" }),
    markAsUnread: (id) => toggleReadMutation.mutate({ id, status: "unread" }),
  };
};
