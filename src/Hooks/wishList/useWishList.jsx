import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import usePublic from "../usePublic";

export const UseWishList = () => {
    const axiosPublic = usePublic();
    const { user } = useAuth();
    
    // Retrieve guest ID from local storage
    const guestId = localStorage.getItem('guestId');
    const userUid = user?.uid || guestId; // Use UID if logged in, otherwise guestId

    const { data: wishItems = [], isLoading, refetch: refreshWishItems } = useQuery({
        queryKey: ['wishItems', userUid], 
        queryFn: async () => {
            try {
                const res = await axiosPublic.get(`/api/wishItems/${userUid}`); // FIXED: Use dynamic URL
                return res.data.data || []; // Ensure data is always an array
            } catch (error) {
                // console.error("Error fetching wishlist items:", error);
                return []; // Return empty array on failure
            }
        },
        enabled: !!userUid, // Runs only if userUid exists
    });

    return [wishItems, isLoading, refreshWishItems];
};
