import { useEffect, useState } from "react";
import useAuth from "../../../../../Hooks/useAuth";
import useSecure from "../../../../../Hooks/useSequre";
import { Button } from "@mui/material";

export default function PaymentUsers() {
    const axiosSecure = useSecure();
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
  

    // Fetch payment data
    useEffect(() => {
        if (user?.email) {
            axiosSecure.get(`/api/PaymentData`, {
                params: { created_Email: user.email } // Pass user.email as created_Email
            })
            .then(res => {
                setPayments(res.data.data);
            })
            .catch(error => console.error("Error fetching payment data:", error));
        }
    }, [user?.email, axiosSecure]);

    // Handle Confirm Order
    const handleConfirmOrder = async (paymentId) => {
        try {
            const response = await axiosSecure.put(`/api/PaymentData/${paymentId}`);
            if (response.data.success) {
                alert("Order confirmed successfully!");
                // Update the local state to reflect the confirmed status
                setPayments(prevPayments =>
                    prevPayments.map(payment =>
                        payment._id === paymentId ? { ...payment, status: "confirmed" } : payment
                    )
                );
            } else {
                alert("Failed to confirm order.");
            }
        } catch (error) {
            console.error("Error confirming order:", error);
            alert("An error occurred while confirming the order.");
        }
    };

    return (
        <div className="p-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="table w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment._id} className="border-t border-gray-300">
                                <td className="flex items-center gap-3 p-2">
                                    <img src={payment.productImage} alt={payment.productTitle} className="h-12 w-12 object-cover rounded" />
                                    <span>{payment.productTitle}</span>
                                </td>
                                <td>${payment.price}</td>
                                <td>{payment.quantity}</td>
                                <td>{payment.transactionId}</td>
                                <td>{new Date(payment.date).toLocaleDateString()}</td>
                                <td>{payment.status}</td>
                                <td>
                                    {payment.status === 'pending' ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleConfirmOrder(payment._id)}
                                        >
                                            Confirm
                                        </Button>
                                    ) : (
                                        <Button variant="contained" color="success" disabled>
                                            Done
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    {payments.map((payment) => (
                        <div key={payment._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <img src={payment.productImage} alt={payment.productTitle} className="h-12 w-12 object-cover rounded" />
                                <div>
                                    <h3 className="text-lg font-semibold">{payment.productTitle}</h3>
                                    <p className="text-sm text-gray-500">{payment.transactionId}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Price: ${payment.price}</p>
                            <p className="text-sm text-gray-600">Quantity: {payment.quantity}</p>
                            <p className="text-sm text-gray-600">Date: {new Date(payment.date).toLocaleDateString()}</p>
                            <p className={`text-sm font-semibold ${payment.status === 'pending' ? 'text-red-500' : 'text-green-500'}`}>
                                Status: {payment.status}
                            </p>

                            <div className="mt-4">
                                {payment.status === 'pending' ? (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={() => handleConfirmOrder(payment._id)}
                                    >
                                        Confirm
                                    </Button>
                                ) : (
                                    <Button variant="contained" color="success" fullWidth disabled>
                                        Done
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
