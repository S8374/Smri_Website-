import { useQuery } from "@tanstack/react-query";
import usePublic from "./usePublic";

const UseProducts = () => {
    const axiosPublic = usePublic();

    const { data: products = {}, isLoading, refetch } = useQuery({
        queryKey: ['api/products'],
        queryFn: async () => {
            try {
               
                const response = await axiosPublic.get('/api/products',
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }
                ); // ✅ Use correct API route
                return response.data;
            } catch (error) {
                return { success: false, data: [] }; // Ensure consistent return structure
            }
        },
        refetchInterval: 1000 * 60 * 5, // 5 minutes
    });

    // Extract the array safely
    const productList = products?.data || [];

    

    return [productList, isLoading, refetch]; // Return only the data array
};

export default UseProducts;
