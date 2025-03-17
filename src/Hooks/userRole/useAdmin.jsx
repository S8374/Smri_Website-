import { useQuery } from "@tanstack/react-query";
import useAuth from "../useAuth";
import useSecure from "../useSequre";

const useAdmin = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useSecure();
    
    const { data: isAdmin, isPending: isAdminLoading } = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        enabled: !!user?.email && !loading, // Ensure user is available before querying
        queryFn: async () => {
            
            const res = await axiosSecure.get(`/api/users/${user.email}/role`);
            return res?.data?.admin; // Fix return value
        }
    });

    return [isAdmin, isAdminLoading];
};

export default useAdmin;
