import { useEffect, useState } from "react";
import useSecure from "../../../../../Hooks/useSequre";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAuth from "../../../../../Hooks/useAuth";
import { FaSpinner } from "react-icons/fa"; // For loading spinner

export default function CashOnDelivery() {
    const axiosSecure = useSecure();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Fetch orders on component mount or when user email changes
    useEffect(() => {
        if (user?.email) {
            setLoading(true);
            setError(null);
            axiosSecure
                .get(`/api/cashOnDelivery/${user.email}`)
                .then((res) => {
                    setOrders(res.data.cashOnDeliveryData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching payment data:", error);
                    setError("Failed to fetch orders. Please try again later.");
                    setLoading(false);
                });
        }
    }, [user?.email, axiosSecure]);

    // Handle order confirmation
    const handleConfirm = (orderId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, confirm it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure
                    .put(`/api/cashOnDelivery/${orderId}`, { status: "Confirmed" })
                    .then((res) => {
                        if (res.data.success) {
                            setOrders(
                                orders.map((order) =>
                                    order._id === orderId ? { ...order, status: "Confirmed" } : order
                                )
                            );
                            toast.success("Order Confirmed");
                        }
                    })
                    .catch((error) => {
                        console.error("Error updating order:", error);
                        toast.error("Failed to confirm order. Please try again.");
                    });
            }
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Cash On Delivery Orders</h2>

            {/* Desktop View - Table Layout */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase">#</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase">Customer</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase">Product</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase">Quantity</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase">Total</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order, index) => (
                                <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-sm text-gray-700">{index + 1}</td>
                                    <td className="p-3">
                                        <p className="text-sm font-medium text-gray-900">{order.user.name}</p>
                                        <p className="text-xs text-gray-500">{order.user.email}</p>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={order.productImage}
                                                alt={order.productTitle}
                                                className="w-10 h-10 rounded-md object-cover"
                                            />
                                            <p className="text-sm text-gray-900">{order.productTitle}</p>
                                        </div>
                                    </td>
                                    <td className="p-3 text-sm text-gray-700">{order.quantity}</td>
                                    <td className="p-3 text-sm text-gray-700">${order.price}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                order.status === "Confirmed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {order.status === "pending" && (
                                            <button
                                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                                                onClick={() => handleConfirm(order._id)}
                                            >
                                                Confirm
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View - Card Layout */}
            <div className="md:hidden space-y-4">
                {orders.length > 0 ? (
                    orders.map((order, index) => (
                        <div key={order._id} className="p-4 bg-white rounded-lg shadow-md">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-gray-900">Order #{index + 1}</h3>
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        order.status === "Confirmed"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <div className="mt-2">
                                <p className="text-sm text-gray-900">
                                    <strong>Customer:</strong> {order.user.name}
                                </p>
                                <p className="text-xs text-gray-500">{order.user.email}</p>
                            </div>
                            <div className="flex gap-3 mt-3">
                                <img
                                    src={order.productImage}
                                    alt={order.productTitle}
                                    className="w-16 h-16 rounded-md object-cover"
                                />
                                <div>
                                    <p className="font-bold text-gray-900">{order.productTitle}</p>
                                    <p className="text-xs text-gray-700">Quantity: {order.quantity}</p>
                                    <p className="text-xs text-gray-700">Total: ${order.price}</p>
                                </div>
                            </div>
                            {order.status === "Pending" && (
                                <button
                                    className="mt-3 w-full px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                                    onClick={() => handleConfirm(order._id)}
                                >
                                    Confirm Order
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No orders found.</p>
                )}
            </div>
        </div>
    );
}