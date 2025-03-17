import { useEffect, useState } from "react";
import useAuth from "../../../Hooks/useAuth";
import usePublic from "../../../Hooks/usePublic";
import {
  FaDollarSign,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaTicketAlt,
} from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";
import Error from "../../Design/Error/Error";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function UserOrder() {
  const { user , logOut } = useAuth();
  const axiosPublic = usePublic();
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const nav = useNavigate()
  useEffect(() => {
    if (user?.email) {
      axiosPublic
        .get("/api/cashOnDelivery")
        .then((res) => {
          const userOrders = res.data.data.filter(
            (order) => order.user.email === user.email
          );
          setOrders(userOrders);
        })
        .catch((err) =>
          console.error("Error fetching Cash on Delivery orders:", err)
        );

      axiosPublic
        .get("/api/PaymentData")
        .then((res) => {
          const userPayments = res.data.data.filter(
            (payment) => payment.email === user.email
          );
          setPayments(userPayments);
        })
        .catch((err) => console.error("Error fetching Payment Data:", err));

      axiosPublic
        .get("/api/coupons")
        .then((res) => {
          if (
            orders.length >= 3 &&
            orders.some((order) => order.status === "Confirmed")
          ) {
            setCoupon(res.data);
          }
        })
        .catch((err) => console.error("Error fetching Coupons:", err));
    }
  }, [user?.email, axiosPublic, orders]);

  // ✅ Copy function with error handling
  const handleCopy = () => {
    if (coupon?.name) {
      navigator.clipboard.writeText(coupon.name);
      toast.success("Coupon code copied!", {
        position: "top-right",
        duration: 2000,
      });
    } else {
      toast.error("Coupon code not available!", {
        position: "top-right",
        duration: 2000,
      });
    }
  };
  if(!user){
     logOut();
     nav("/");
  }
  return (
    <div className="p-8 min-h-screen bg-gray-50">
         <Helmet>
                      <title>Order || E-commerce Store</title>
                  </Helmet>
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Your Orders
      </h2>

      {/* Coupon Section */}
      {coupon ? (
        <div className="bg-yellow-100 p-6 rounded-xl shadow-lg flex items-center justify-between border-l-4 border-yellow-500 mb-8">
          <div>
            <h3 className="text-2xl font-semibold text-yellow-700 flex items-center">
              <FaTicketAlt className="mr-3 text-yellow-600" /> Exclusive Discount!{" "}
              {coupon.discount}%
            </h3>
            <p className="text-gray-800 flex items-center">
              Use coupon{" "}
              <span
                className="font-bold text-yellow-700 flex items-center cursor-pointer ml-2 bg-white px-3 py-1 rounded-md border border-yellow-500 hover:bg-yellow-200 transition"
                onClick={handleCopy}
              >
                {coupon.name} <IoCopyOutline className="ml-2 text-lg" />
              </span>{" "}
              to get a discount on your next order.
            </p>
          </div>
          <span className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-lg font-semibold shadow-md">
            {coupon.name}
          </span>
        </div>
      ) : (
        <p className="text-lg text-red-500 font-semibold text-center">
          No coupon available at the moment.
        </p>
      )}

      {/* Cash on Delivery Orders */}
      {orders.length > 0 ? (
        <div className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaClipboardList className="mr-3 text-teal-500" /> Cash on Delivery
            Orders
          </h3>
          <ul className="space-y-6">
            {orders.map((order) => (
              <li
                key={order._id}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-teal-500 hover:shadow-2xl transition-transform hover:scale-105"
              >
                <p className="text-xl font-medium text-gray-900">
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p className="text-lg text-gray-800">
                  <strong>Total Price:</strong>
                  <span className="text-teal-500 ml-1">
                    <FaDollarSign className="inline" />
                    {order.totalPrice}
                  </span>
                </p>
                <p
                  className={`text-lg ${order.status === "Confirmed"
                    ? "text-green-600"
                    : "text-red-500"
                    }`}
                >
                  <strong>Status:</strong>
                  {order.status === "Confirmed" ? (
                    <FaCheckCircle className="inline mr-2" />
                  ) : (
                    <FaTimesCircle className="inline mr-2" />
                  )}
                  {order.status}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-700 mt-5 text-lg text-center">

          <Error width="300px"
            height="300px" details={' No Cash on Delivery Orders Found.'} title={'Ops.......'} img={'https://res.cloudinary.com/dx8o5d32h/image/upload/v1742031694/cargo_h2re7m.png'} />
        </p>
      )}

      {/* Payment Data */}
      {payments.length > 0 ? (
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaClipboardList className="mr-3 text-indigo-500" /> Online Payments
          </h3>
          <ul className="space-y-6">
            {payments.map((payment) => (
              <li
                key={payment._id}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 hover:shadow-2xl transition-transform hover:scale-105"
              >
                <p className="text-xl font-medium text-gray-900">
                  <strong>Transaction ID:</strong> {payment.transactionId}
                </p>
                <p className="text-lg text-gray-800">
                  <strong>Amount Paid:</strong>
                  <span className="text-indigo-500 ml-1">
                    <FaDollarSign className="inline" />
                    {payment.price}
                  </span>
                </p>
                <p
                  className={`text-lg ${payment.status === "Completed"
                    ? "text-green-600"
                    : "text-red-500"
                    }`}
                >
                  <strong>Status:</strong>
                  {payment.status === "Completed" ? (
                    <FaCheckCircle className="inline mr-2" />
                  ) : (
                    <FaTimesCircle className="inline mr-2" />
                  )}
                  {payment.status}
                </p>
                <p className="text-lg text-gray-800">
                  <strong>Product:</strong> {payment.productTitle}
                </p>
                <div className="mt-3">
                  <img
                    src={payment.productImage}
                    alt={payment.productTitle}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm transition-transform hover:scale-110"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-700 text-lg mt-10 text-center">

          <Error
            details={'No Online Payments Found.'}
            title={'Ops.......'}
            img={'https://res.cloudinary.com/dx8o5d32h/image/upload/v1742031793/delivery-man_cuogxz.png'}
            width="300px"
            height="300px"
          />

        </p>
      )}
    </div>
  );
}
