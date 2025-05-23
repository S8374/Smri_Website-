import { useQuery } from "@tanstack/react-query";
import useSecure from "../useSequre";
import useAuth from "../useAuth";

export const UseUsers = () => {
  const axiosSecure = useSecure();
  const { user } = useAuth();
  const {
    data: userDetails = [],
    isLoading,
    refetch: refreshUser,
  } = useQuery({
    queryKey: ["users", user?.email], // Ensures query is refetched if email changes
    queryFn: async () => {
      if (!user?.email) return []; // Prevents API calls if no user email
      try {
        const res = await axiosSecure.get(`/api/users/${user.email}`);
        // Ensure the response data is always an array
        return Array.isArray(res.data.data) ? res.data.data : [res.data.data];
      } catch (error) {
        // console.error("Error fetching userDetails items:", error);
        return []; // Return empty array on failure
      }
    },
    enabled: !!user?.email, // Ensures the query runs only when the email is available
  });
  return [userDetails, isLoading, refreshUser];
};