import { useQuery } from "@tanstack/react-query";
import usePublic from "./usePublic";

const useCoupon = () => {
  const axiosPublic = usePublic();

  const fetchCoupon = async () => {
    const response = await axiosPublic.get("/api/coupons");
    return response.data;
  };

  const {
    data: coupon,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["coupon"],
    queryFn: fetchCoupon,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Do not refetch when window gains focus
  });

  return { coupon, isLoading, isError, error };
};

export default useCoupon;
