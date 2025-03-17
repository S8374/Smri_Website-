import { useQuery } from "@tanstack/react-query"
import useSecure from "./useSequre"

export const GetPaymentsData = () => {
    const axiosSecure = useSecure()
    const {data:payment_Data ,isLoading , refetch:refreshPayments } = useQuery({
        queryKey: ['payments'],
        queryFn: async () => {
            try {
                const res = await axiosSecure.get('/api/payments')
                return res.data.payments
            } catch (error) {
                console.error('Error fetching payments:', error)
                return []
            }
        }
    })
  return [payment_Data,isLoading,refreshPayments]
}
