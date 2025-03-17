import { useQuery } from "@tanstack/react-query";
import useSecure from "./useSequre";

const GetMostProducts = () => {
    const axiosSecure = useSecure();

    const { data: getMostProducts = {}, isLoading, refetch: refetchAll } = useQuery({
        queryKey: ['api/getMostProducts'],
        queryFn: async () => {
            try {
                const response = await axiosSecure.get('/api/getMostProducts');
                return response.data; // Ensure this matches the backend response structure
            } catch (error) {
                console.error("API Error:", error);
                return { success: false, data: [] }; // Fallback structure
            }
        },
        refetchInterval: 1000 * 60 * 5, // 5 minutes
    });

    // Extract the array safely
    const getProducts = getMostProducts?.data || []; // Use the correct key from the backend response

    return [getProducts, isLoading, refetchAll]; // Return the data array, loading state, and refetch function
};

export default GetMostProducts;