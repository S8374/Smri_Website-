import { useLocation } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useSecure from "../../Hooks/useSequre";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import PaymentModal from "./PaymentModal/PaymentModal";
import { UseUsers } from "../../Hooks/users/useUsers";
import Swal from 'sweetalert2';
import useCoupon from "../../Hooks/useCoupon";
import { Helmet } from "react-helmet-async";

export default function Payment() {
    const location = useLocation();
    const { user } = useAuth();
    const axiosSecure = useSecure();
    const [userDetails, isLoading, refreshUser] = UseUsers();
    const [saveInfo, setSaveInfo] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [guestUserInfo, setGuestUserInfo] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        apartment: '',
        city: ''
    });
    const { coupon } = useCoupon(); // Fetch coupon data
    const [appliedCoupon, setAppliedCoupon] = useState(null); // State to store applied coupon
    const userDetail = user ? userDetails.find((u) => u.email === user.email) : null;
    const guestId = localStorage.getItem('guestId') || crypto.randomUUID(); // Generate a unique guest ID if not exists
    // Handle both single product and multiple products
    const productDetails = location.state?.productDetails; // Single product from ItemsDetails
    const cartData = location.state?.cartData; // Multiple products from Cart
    const OrderProduct = cartData || productDetails || 'NA';

    // Calculate discounted price for productDetails
    const calculateDiscountedPrice = (price) => {
        if (appliedCoupon) {
            return price - (price * appliedCoupon.discount) / 100;
        }
        return price;
    };

    // Calculate total price based on whether it's a single product or multiple products
    const subtotal = cartData
        ? cartData.reduce((acc, item) => acc + item.price * item.quantity, 0)
        : productDetails
            ? calculateDiscountedPrice(productDetails.price) * productDetails.quantity
            : 0;
    const shipping = 10;
    const totalPrice = subtotal + shipping;

    // Load guest user data from local storage on component mount
    useEffect(() => {
        const savedGuestInfo = localStorage.getItem(`guestInfo_${guestId}`);
        if (savedGuestInfo) {
            setGuestUserInfo(JSON.parse(savedGuestInfo));
        }
    }, [guestId]);

    const saveInformations = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const userInfo = {
            firstName: formData.get("name"),
            email: formData.get("email"),
            address: formData.get("address"),
            phone: formData.get("phone"),
            apartment: formData.get("apartment"),
            city: formData.get("city"),
        };

        if (saveInfo && user) {
            try {
                const response = await axiosSecure.patch("/api/users", userInfo);
                if (response.data.success) {
                    toast.success("Information saved successfully!");
                } else {
                    toast.error("Failed to save information.");
                }
            } catch (error) {
                toast.error("An error occurred while saving information.");
                console.error("Error saving user info:", error);
            }
        } else if (!user) {
            setGuestUserInfo(userInfo);
            localStorage.setItem(`guestInfo_${guestId}`, JSON.stringify(userInfo)); // Save guest info to local storage
            toast.success("Information saved for this order!");
        } else {
            toast.error("Information not saved.");
        }
    };

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        const enteredCouponCode = e.target.couponCode.value;
        if (coupon && coupon.name === enteredCouponCode) {
            setAppliedCoupon(coupon); // Apply the coupon
            toast.success(`Coupon applied! You got ${coupon.discount}% off.`);
        } else {
            setAppliedCoupon(null); // Reset applied coupon
            toast.error("Invalid coupon code!");
        }
    };

    const handlePlaceOrder = () => {
        const form = document.querySelector('form');
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error'); // Add error class for styling
            } else {
                input.classList.remove('error'); // Remove error class if valid
            }
        });

        if (!paymentMethod) {
            isValid = false;
            toast.error("Please select a payment method.");
        }

        if (!isValid) {
            toast.error("Please fill out all required fields.");
            return;
        }
        if (paymentMethod === "bank") {
            // Open the Stripe payment modal
            document.getElementById("bank_payment_modal").showModal();
        } else {
            // Handle Cash on Delivery
            const paymentItems = Array.isArray(OrderProduct) ? OrderProduct : [OrderProduct];
            
            Swal.fire({
                title: "Are you sure?",
                text: "You want to confirm order!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, confirm it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    for (const item of paymentItems) {
                        const order = {
                            email: user?.email || "guest@example.com",
                            price: item.totalPrice || item.price * item.quantity,
                            date: new Date(),
                            paymentItemsID: item?.Product_id || item?.paymentItemsID || "N/A",
                            productTitle: item.title || "N/A",
                            productImage: item.image || "N/A",
                            status: "pending",
                            quantity: item.quantity || 1,
                            created_Email: item.created_Email,
                            created_Uid: item.created_Uid,
                            user: user,
                        };

                       
                        axiosSecure.patch('/api/cashOnDelivery', order)
                            .then(res => {
                                toast.success('Order placed successfully');
                                if (user) refreshUser();
                                localStorage.removeItem(`guestInfo_${guestId}`); // Clear guest info after order confirmation
                            })
                            .catch(err => {
                                toast.error('Failed to place order');
                                console.error("Error placing order:", err);
                            });

                        Swal.fire({
                            title: "Confirmed!",
                            text: "Your order has been placed.",
                            icon: "success"
                        });
                    }

                }
            });
        }
    };

    if (isLoading) {
        return <div>Loading...</div>; // or some other fallback UI
    }

    return (
        <div className="p-4 md:p-6 space-y-8">
            <Toaster />
            <Helmet>
                <title>Order || E-commerce Store</title>
            </Helmet>
            <h2 className="text-2xl font-bold dark:text-black text-center mb-8">Payment Details</h2>

            <div className="flex flex-col md:flex-row justify-between gap-8">
                {/* Left - Payment Form */}
                <div className="flex-1">
                    <form onSubmit={saveInformations} className="space-y-4 p-4 dark:text-black md:p-6 bg-white  rounded-lg shadow-md">
                        <input defaultValue={user ? user.displayName : guestUserInfo.firstName} className="border-none outline-none dark:bg-[#dcdcdc] bg-gray-100 w-full p-3 rounded-md" type="text" placeholder="Full Name" name="name" required />
                        <input readOnly defaultValue={user ? user.email : 'guestemail@gmail.com'} className="border-none dark:bg-[#dcdcdc]  outline-none input-disabled bg-gray-100 w-full p-3 cursor-not-allowed rounded-md" type="email" placeholder="Email" name="email" required />
                        <input defaultValue={user ? userDetail?.address : guestUserInfo.address} className="border-none dark:bg-[#dcdcdc] outline-none bg-gray-100 w-full p-3 rounded-md" type="text" placeholder="Street Address*" name="address" required />
                        <input defaultValue={user ? userDetail?.phone : guestUserInfo.phone} className="border-none outline-none dark:bg-[#dcdcdc] bg-gray-100 w-full p-3 rounded-md" type="number" placeholder="Phone Number" name="phone" required />
                        <input defaultValue={user ? userDetail?.apartment : guestUserInfo.apartment} className="border-none outline-none dark:bg-[#dcdcdc] bg-gray-100 w-full p-3 rounded-md" type="text" placeholder="Apartment, floor, etc. (optional)" name="apartment" />
                        <input defaultValue={user ? userDetail?.city : guestUserInfo.city} className="border-none outline-none dark:bg-[#dcdcdc] bg-gray-100 w-full p-3 rounded-md" type="text" placeholder="Town/City*" name="city" required />

                        {user && (
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} className="checkbox checkbox-error dark:bg-[#dcdcdc]" />
                                <label htmlFor="remember" className="text-gray-700 dark:text-black">Save this information for faster check-out next time</label>
                            </div>
                        )}

                        <button type="submit" className="w-full md:w-auto px-12   bg-red-400 py-2 cursor-pointer text-white dark:bg-black dark:text-white mt-6 hover:shadow-lg rounded-md">Save Information</button>
                    </form>
                </div>

                {/* Right - Order Summary */}
                <div className="flex-1 p-4 md:p-6 dark:text-black bg-white rounded-lg shadow-md space-y-6">
                    <h3 className="text-lg font-semibold">Order Summary</h3>

                    {cartData ? (
                        cartData.map((item) => (
                            <div key={item._id} className="flex justify-between items-center gap-4">
                                <div className="avatar items-center">
                                    <div className="w-16 rounded-lg">
                                        <img src={item.image} alt="Product" />
                                    </div>
                                    <div>
                                        <p className="font-bold ml-4">{item.title}</p>
                                        <p className="text-sm text-gray-600 dark:text-black">Size: {item.size || "N/A"}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-bold dark:text-black">{item.price}tk</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-between items-center gap-4">
                            <div className="avatar items-center">
                                <div className="w-16 rounded-lg">
                                    <img src={productDetails.image} alt="Product" />
                                </div>
                                <div>
                                    <p className="font-bold ml-4">{productDetails.title}</p>
                                    <p className="text-sm dark:text-black text-gray-600">Size: {productDetails.size || "N/A"}</p>
                                    <p className="text-sm text-gray-600 dark:text-black">Color: {productDetails.color || "N/A"}</p>
                                </div>
                            </div>

                            <div>
                                <p className="font-bold dark:text-black">{calculateDiscountedPrice(productDetails.price)}tk</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2 text-gray-700 text-sm dark:text-black">
                        <div className="flex justify-between">
                            <p>Quantity:</p>
                            <p>{cartData ? cartData.reduce((acc, item) => acc + item.quantity, 0) : productDetails.quantity}</p>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <p>Subtotal:</p>
                            <p>{subtotal}tk</p>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <p>Shipping:</p>
                            <p>10tk</p>
                        </div>
                        {appliedCoupon && productDetails && (
                            <>
                                <hr />
                                <div className="flex justify-between dark:text-black text-green-600">
                                    <p>Discount ({appliedCoupon.discount}%):</p>
                                    <p>-{(productDetails.price * productDetails.quantity * appliedCoupon.discount) / 100}tk</p>
                                </div>
                            </>
                        )}
                        <hr />
                        <div className="flex justify-between text-lg font-bold">
                            <p>Total:</p>
                            <p>{totalPrice}tk</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="flex text-black dark:text-black  items-center gap-2">
                            <input
                                type="checkbox"
                                checked={paymentMethod === "bank"}
                                onChange={() => setPaymentMethod("bank")}
                                className="checkbox checkbox-error "
                            />
                            Bank Payment
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={paymentMethod === "cod"}
                                onChange={() => setPaymentMethod("cod")}
                                className="checkbox checkbox-error"
                            />
                            Cash On Delivery
                        </label>
                    </div>

                    {/* Show Coupon Input Field Only for Single Product */}
                    {productDetails && (
                        <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Enter coupon code"
                                name="couponCode"
                                className="input input-bordered dark:bg-[#dcdcdc] w-full px-3 py-2"
                            />
                            <button
                                type="submit"
                                className="px-12 py-2 dark:text-white dark:bg-black bg-red-400 hover:shadow-lg cursor-pointer text-white rounded-md"
                            >
                                Apply
                            </button>
                        </form>
                    )}

                    <button
                        onClick={handlePlaceOrder}
                        className="w-full md:w-auto px-12 dark:text-white dark:bg-black bg-red-400 py-2 cursor-pointer text-white mt-6 hover:shadow-lg rounded-md"
                    >
                        Place Order
                    </button>
                </div>
            </div>
            <PaymentModal userDetail={userDetail} totalPrice={totalPrice} product={cartData || productDetails} quantity={cartData ? cartData.reduce((acc, item) => acc + item.quantity, 0) : productDetails.quantity} />
        </div>
    );
}