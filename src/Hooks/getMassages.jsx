import { useQuery } from "@tanstack/react-query";
import useSecure from "./useSequre";

export const GetMassages = () => {
    const axiosSecure = useSecure();

    const { data:userMassages = [''], isLoading, refetch:refreshMassages } = useQuery({
        queryKey: ['chat-data'], // Ensures query is refetched if email changes
        queryFn: async () => {
            try {
                const res = await axiosSecure.get(`/api/chat-data`);
                return res.data.chats || []; // Ensures data is always an array
            } catch (error) {
                console.error("Error fetching userDetails items:", error);
                return []; // Return empty array on failure
            }
        },
       
    });

    return [userMassages, isLoading, refreshMassages];
};
