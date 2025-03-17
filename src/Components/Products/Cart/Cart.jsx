import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BreadCurms from "../../Design/BreadCurms/BreadCurms";
import Button from "../../Design/Button/Button";
import { IoIosArrowForward } from "react-icons/io";
import { UseCart } from "../../../Hooks/cart/useCart";
import UseProducts from "../../../Hooks/useProducts";
import ScrollToTop from "../../Design/Scroll/ScrollTop";
import { IoCloseCircleOutline } from "react-icons/io5";
import useSecure from "../../../Hooks/useSequre";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";
import useCoupon from "../../../Hooks/useCoupon";
import { Helmet } from "react-helmet-async";

export default function Cart() {
    const navigate = useNavigate();
    const [userItems = [], refetch] = UseCart();
    const [productList = [], isLoading] = UseProducts();
    const axiosSquire = useSecure();
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const guestId = localStorage.getItem('guestId');
    const { coupon } = useCoupon(); // Fetch coupon data
    const [appliedCoupon, setAppliedCoupon] = useState(null); // State to store applied coupon

    useEffect(() => {
        if (userItems.length > 0 && productList.length > 0) {
            const updatedCart = userItems
                .map((cartItem) => {
                    const product = productList.find((product) => product?._id === cartItem.Product_id);
                    return product ? { ...product, ...cartItem } : null;
                })
                .filter(Boolean);

            setCartItems(updatedCart);
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        }
    }, [userItems, productList]);

    // Loader Component
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
        );
    }

    // Empty Cart Message
    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col justify-center text-black items-center min-h-screen p-4">
                <h1 className="text-2xl font-semibold  text-gray-800 mb-4">Your cart is empty</h1>
                <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <button
                    onClick={() => navigate("/allProduct")}
                    className="px-6 py-2 bg-blue-500 dark:bg-black dark:text-white text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    const handleQuantityChange = (productId, newQuantity) => {
        setCartItems((prevCart) =>
            prevCart.map((item) => {
                if (item._id === productId) {
                    const maxQuantity = item.total_stock;
                    if (newQuantity > maxQuantity) {
                        toast.error(`Only ${maxQuantity} items in stock!`, { duration: 2000 });
                        return { ...item, quantity: maxQuantity };
                    }
                    return { ...item, quantity: Math.max(1, Number(newQuantity)) };
                }
                return item;
            })
        );
    };

    const handleSizeChange = (productId, newSize) => {
        setCartItems((prevCart) =>
            prevCart.map((item) => {
                if (item._id === productId) {
                    if (item.selectedSize === newSize) {
                        toast.error("You have already selected this size!", { duration: 2000 });
                        return item;
                    }
                    return { ...item, selectedSize: newSize };
                }
                return item;
            })
        );
    };

    const handleSaveCart = async () => {
        const changedItems = cartItems.filter((item) => {
            const originalItem = userItems.find((cartItem) => cartItem.Product_id === item.Product_id);
            return originalItem ? originalItem.quantity !== item.quantity || originalItem.selectedSize !== item.selectedSize : true;
        });

        if (changedItems.length === 0) {
            toast.error("Please select a new quantity or size before updating the cart!", { duration: 2000 });
            return;
        }

        const cartUpdateData = changedItems.map((item) => ({
            newSubtotal: item.quantity * item.discount_price,
            userEmail: user?.email,
            userUid: user?.uid,
            productId: item.Product_id,
            newQuantity: item.quantity,
            ...(item.selectedSize && { newSize: item.selectedSize }),
            oldQuantity: userItems.find((cartItem) => cartItem.Product_id === item.Product_id)?.quantity || 0,
        }));

        try {
            await axiosSquire.put(`/api/cartItems`, cartUpdateData);
            await axiosSquire.put(`/api/products`, cartUpdateData);
            toast.success("Cart items updated successfully");
            refetch();
        } catch (error) {
            console.error("Error in updating cart items", error.message);
            toast.error("Failed to update cart items");
        }
    };

    const handleDeleteCart = async (cartItem) => {
        const deleteData = {
            productId: cartItem.Product_id,
            userEmail: cartItem.user_Email,
            userUid: cartItem.user_Uid,
        };

        try {
            const response = await axiosSquire.delete("/api/cartItems", { data: deleteData });
            if (response.data.success) {
                toast.success("Product removed from cart successfully!");
                setCartItems((prevCart) => prevCart.filter((item) => item.Product_id !== cartItem.Product_id));
                refetch();
            } else {
                toast.error(response.data.message || "Failed to delete product from cart.");
            }
        } catch (error) {
            console.error("Error deleting product from cart:", error);
            toast.error("Failed to delete product from cart.");
        }
    };

    const handleReturnShop = async () => {
        try {
            const returnData = cartItems.map((item) => ({
                productId: item.Product_id,
                quantity: item.quantity,
                userEmail: user?.email,
                userUid: user?.uid || guestId,
            }));

            const response = await axiosSquire.post("/api/cartItems/return", returnData);

            if (response.data.success) {
                toast.success("Items returned to shop successfully!");
                setCartItems([]);
                localStorage.removeItem("cartItems");
                refetch();
            } else {
                toast.error(response.data.message || "Failed to return items to shop.");
            }
        } catch (error) {
            console.error("Error returning items to shop:", error);
            toast.error("Failed to return items to shop.");
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

    // Calculate discounted product price
    const calculateDiscountedPrice = (price) => {
        if (appliedCoupon) {
            return price - (price * appliedCoupon.discount) / 100;
        }
        return price;
    };

    // Calculate subtotal, shipping, and total
    const subtotal = cartItems.reduce(
        (acc, product) => acc + product.quantity * calculateDiscountedPrice(product.discount_price || product.price),
        0
    );
    const shipping = 10;
    const total = subtotal + shipping;

    const handelChekout = () => {
        const cartData = cartItems.map((item) => ({
            _id: item._id,
            title: item.title,
            image: item.images[0],
            size: item.selectedSize || item.size,
            price: calculateDiscountedPrice(item.discount_price || item.price), // Apply discount to product price
            quantity: item.quantity,
            totalPrice: calculateDiscountedPrice(item.discount_price || item.price) * item.quantity + 10,
            Product_id: item.Product_id,
            created_Email: item.created_Email,
            created_Uid: item.created_Uid,
            order_Email: user?.email || "guest@example.com",
            order_Uid: guestId,
            order_Name: user?.displayName || "Guest",
            Discount_Price: total,
            appliedCoupon: appliedCoupon, // Pass applied coupon to the payment page
        }));

        navigate("/order", { state: { cartData } });
    };

    return (
        <div className="p-4 md:p-8 min-h-screen text-black">

            <ScrollToTop />

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg p-4">
                <Helmet>
                    <title>Cart || E-commerce Store</title>
                </Helmet>
                <BreadCurms icon1={<IoIosArrowForward />} Section1={"Cart"} />

                <table className="table w-full">
                    <thead>
                        <tr className="text-gray-700 uppercase text-sm">
                            <th></th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Size</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((cartItem, index) => (
                            <tr key={cartItem._id} className="border-b">
                                <td>{index + 1}</td>
                                <td>
                                    <div className="flex relative items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={cartItem.images[0]} alt={cartItem.title} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{cartItem.title}</div>
                                            <div className="text-sm text-gray-500">{cartItem.category}</div>
                                        </div>
                                        <IoCloseCircleOutline
                                            onClick={() => handleDeleteCart(cartItem)}
                                            className="absolute -mt-12 text-xl bg-red-400 rounded-full text-white cursor-pointer -ml-3"
                                        />
                                    </div>
                                </td>
                                <td className="text-gray-600">
                                    ${calculateDiscountedPrice(cartItem.discount_price || cartItem.price).toFixed(2)}
                                </td>
                                <td className="text-gray-600">
                                    <select
                                        value={cartItem.selectedSize || ''}
                                        onChange={(e) => handleSizeChange(cartItem._id, e.target.value)}
                                        className="w-20 outline-none text-center"
                                    >
                                        {Array.isArray(cartItem.size) ? (
                                            cartItem.size.map((size) => (
                                                <option key={size} value={size}>
                                                    {size === "One Size" ? "One Size" : size}
                                                </option>
                                            ))
                                        ) : (
                                            <option value={cartItem.size}>
                                                {cartItem.size === "One Size" ? "One Size" : cartItem.size}
                                            </option>
                                        )}
                                    </select>
                                </td>
                                <td className="text-gray-600">
                                    <input
                                        type="number"
                                        value={cartItem.quantity}
                                        onChange={(e) => handleQuantityChange(cartItem._id, e.target.value)}
                                        className="w-10 outline-none text-center"
                                    />
                                </td>
                                <td className="font-semibold text-gray-800">
                                    ${(
                                        cartItem.quantity *
                                        calculateDiscountedPrice(cartItem.discount_price || cartItem.price)
                                    ).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
                {cartItems.map((cartItem, index) => (
                    <div key={cartItem._id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12">
                                        <img src={cartItem.images[0]} alt={cartItem.title} />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold">{cartItem.title}</div>
                                    <div className="text-sm text-gray-500">{cartItem.category}</div>
                                </div>
                            </div>
                            <IoCloseCircleOutline
                                onClick={() => handleDeleteCart(cartItem)}
                                className="text-xl bg-red-400 dark:text-black rounded-full text-white cursor-pointer"
                            />
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Price:</span>
                                <span className="text-gray-800">
                                    ${calculateDiscountedPrice(cartItem.discount_price || cartItem.price).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Size:</span>
                                <select
                                    value={cartItem.selectedSize || ''}
                                    onChange={(e) => handleSizeChange(cartItem._id, e.target.value)}
                                    className="w-20 outline-none text-center"
                                >
                                    {Array.isArray(cartItem.size) ? (
                                        cartItem.size.map((size) => (
                                            <option key={size} value={size}>
                                                {size === "One Size" ? "One Size" : size}
                                            </option>
                                        ))
                                    ) : (
                                        <option value={cartItem.size}>
                                            {cartItem.size === "One Size" ? "One Size" : cartItem.size}
                                        </option>
                                    )}
                                </select>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Quantity:</span>
                                <input
                                    type="number"
                                    value={cartItem.quantity}
                                    onChange={(e) => handleQuantityChange(cartItem._id, e.target.value)}
                                    className="w-10 outline-none text-center"
                                />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-semibold text-gray-800">
                                    ${(
                                        cartItem.quantity *
                                        calculateDiscountedPrice(cartItem.discount_price || cartItem.price)
                                    ).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Buttons for Return to Shop and Save Cart */}
            <div className="flex justify-between items-center w-full md:w-auto bg-white p-4 rounded-lg mt-4">
                <p onClick={handleReturnShop}>
                    <Button Name={"Return to Shop"} />
                </p>

                <p onClick={handleSaveCart}>
                    <Button Name={"Save Cart"} />
                </p>
            </div>

            {/* Coupon & Cart Total Section */}
            <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                <div className="flex flex-col md:flex-col justify-between gap-4">
                    <form onSubmit={handleApplyCoupon} className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Enter coupon code"
                            name="couponCode"
                            className="input outline-none w-full md:w-64 px-3 py-2"
                        />
                        <button
                            type="submit"
                            className="px-5 bg-red-400 text-white dark:bg-black cursor-pointer hover:shadow-lg py-2"
                        >
                            Apply Coupon
                        </button>
                    </form>
                </div>

                {/* Cart Total Section */}
                <div className="bg-white border shadow-md p-6 rounded-lg w-full md:w-96">
                    <h1 className="text-xl font-semibold text-gray-700 mb-4">Cart Total</h1>
                    <div className="space-y-2 py-2">
                        <div className="flex justify-between text-gray-700">
                            <h1>Subtotal</h1>
                            <h1>${subtotal.toFixed(2)}</h1>
                        </div>
                        <hr />
                        <div className="flex justify-between text-gray-700">
                            <h1>Shipping</h1>
                            <h1>${shipping.toFixed(2)}</h1>
                        </div>
                        {appliedCoupon && (
                            <>
                                <hr />
                                <div className="flex justify-between text-green-600">
                                    <h1>Discount ({appliedCoupon.discount}%)</h1>
                                    <h1>-${(subtotal * appliedCoupon.discount) / 100}</h1>
                                </div>
                            </>
                        )}
                        <hr />
                        <div className="flex justify-between text-gray-900 font-semibold text-lg">
                            <h1>Total</h1>
                            <h1>${total.toFixed(2)}</h1>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={handelChekout}
                            className="px-16 hover:shadow-lg dark:bg-black dark:text-white  cursor-pointer py-2 bg-red-400 items-center mt-4"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}