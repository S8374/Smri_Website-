import { useQuery } from "@tanstack/react-query"
import useAuth from "../useAuth"
import useSecure from "../useSequre";

export const UseCart = () => {
  const {user}=useAuth() ;
  const axiosSquire = useSecure();
  const guestId = localStorage.getItem('guestId');
  const uid = user?.uid || guestId
  const { data: userItems  ,refetch,isLoading } = useQuery({
    queryKey: ['cart', uid], // Use user.uid instead of user.id
    queryFn: async () => {
      try {
        const response = await axiosSquire.get(`/api/cart/${uid}`);
        return response.data.cartItems; // Return only the cart items
      } catch (error) {
        console.error(error);
      }
    },
  });
  
  return [userItems ,refetch ,isLoading]
}
