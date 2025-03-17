import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useSecure from "../../../Hooks/useSequre";
import useAuth from "../../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function StripePayment({ totalPrice, product, quantity, userDetail }) {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useSecure();
    const [cardError, setCardError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();
    const guestId = localStorage.getItem('guestId')
    // Retrieve guest details from localStorage
   
    const guestDetails =  JSON.parse(localStorage.getItem(`guestInfo_${guestId}`)) || {};

    // Determine current user details
    const currentUser = user || guestDetails;



    // Fetch client secret from backend
    useEffect(() => {
        if (totalPrice > 0) {
            axiosSecure
                .post("/api/PaymentIntent", { price: totalPrice })
                .then((res) => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch((err) => {
                    console.error("Error fetching client secret:", err);
                    toast.error("Failed to initialize payment.");
                });
        }
    }, [axiosSecure, totalPrice]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.error("Stripe.js has not loaded yet.");
            return;
        }

        setProcessing(true);
        setCardError("");
        setSuccessMessage("");

        const card = elements.getElement(CardElement);
        if (!card) {
            setProcessing(false);
            return;
        }

        try {
            // Collect additional billing details
            const billingDetails = {
                name: currentUser?.displayName || "Guest User",
                email: currentUser?.email || "guest@example.com",
                address: {
                    line1: "123 Main St",
                    city: "New York",
                    state: "NY",
                    postal_code: "10001",
                    country: "US",
                },
            };

            // Create payment method with billing details
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card,
                billing_details: billingDetails,
            });

            if (error) {
                setCardError(error.message);
                toast.error(error.message);
                setProcessing(false);
                return;
            }

          

            // Confirm card payment
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
            });

            if (confirmError) {
                setCardError(confirmError.message);
                toast.error(confirmError.message);
                setProcessing(false);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                setTransactionId(paymentIntent.id);
                setSuccessMessage("Payment successful! ✅");

                // Handle single product (from ItemsDetails) or multiple products (from Cart)
                const paymentItems = Array.isArray(product) ? product : [product];
           
                // Save payment data for each product
                for (const item of paymentItems) {
                    const payment = {
                        email: currentUser?.email || "guest@example.com",
                        price: item.totalPrice || item.price * item.quantity,
                        transactionId: paymentIntent.id,
                        date: new Date(),
                        paymentItemsID: item?.paymentItemsID || item?.Product_id ||"N/A",
                        productTitle: item.title || "N/A",
                        productImage: item.image || "N/A",
                        status: "pending",
                        quantity: item.quantity || 1,
                        created_Email: item.created_Email,
                        created_Uid: item.createdBy,
                        user: currentUser,
                    };


                    const res = await axiosSecure.patch("/api/PaymentData", payment);
                    if (res.data?.insertedId || res.data?.updated) {
                        toast.success(`Payment saved successfully for ${item.title}!`);
                    } else {
                        toast.error(`Failed to save payment data for ${item.title}.`);
                    }
                }

                navigate("/");
            }
        } catch (err) {
            setCardError("An unexpected error occurred. Please try again.");
            toast.error("Payment failed. Please try again.");
            console.error("Payment error:", err);
        }

        setProcessing(false);
    };

    return (
        <div className="max-w-lg mx-auto p-6 dark:text-black bg-white rounded-lg shadow-lg">
            <Toaster />
            <h2 className="text-xl font-semibold dark:text-black text-gray-700 mb-4">Total Price : {totalPrice} tk</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border border-gray-300 p-3 rounded-md">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#424770",
                                    "::placeholder": { color: "#aab7c4" },
                                },
                                invalid: { color: "#9e2146" },
                            },
                        }}
                    />
                </div>

                {cardError && <p className="text-red-500 text-sm">{cardError}</p>}
                {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

                <button
                    className={`w-full py-2 text-white  font-semibold rounded-md transition ${
                        processing ? "bg-gray-400 dark:bg-black cursor-not-allowed" : "bg-blue-600  dark:bg-black hover:bg-blue-700"
                    }`}
                    type="submit"
                    disabled={!stripe || processing}
                >
                    {processing ? "Processing..." : "Pay Now"}
                </button>
            </form>
        </div>
    );
}
