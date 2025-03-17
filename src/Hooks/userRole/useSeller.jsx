import { useQuery } from "@tanstack/react-query";
import useAuth from "../useAuth";
import useSecure from "../useSequre";

const useSeller = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useSecure();
    
    const { data: isSeller, isPending: isSellerLoading } = useQuery({
        queryKey: [user?.email, 'isSeller'],
        enabled: !!user?.email && !loading, // Ensure user exists before querying
        queryFn: async () => {
            console.log('Checking seller status for user:', user?.email);
            const res = await axiosSecure.get(`/api/users/${user.email}/role`);
            return res?.data?.seller; // Fix return value
        }
    });

    return [isSeller, isSellerLoading];
};

export default useSeller;
