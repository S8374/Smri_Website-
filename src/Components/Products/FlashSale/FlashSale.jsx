import { useState, useEffect, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useTimer } from "react-timer-hook";
import { IoEyeOutline } from "react-icons/io5";
import UseProducts from "../../../Hooks/useProducts";
import { Link } from "react-router-dom";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import toast from "react-hot-toast";
import useAuth from "../../../Hooks/useAuth";
import useSecure from "../../../Hooks/useSequre";
import Love from "../../IconFuntions/Love/Love";
import { UseCart } from "../../../Hooks/cart/useCart";

export default function FlashSale({ selectedCategory }) {
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [productList, isLoading] = UseProducts();
    const [userItems, refetch] = UseCart();
    const [isMobile, setIsMobile] = useState(false);

    const { user } = useAuth();
    const axiosSecure = useSecure();
    const time = new Date();
    time.setSeconds(time.getSeconds() + 3 * 24 * 60 * 60);

    const { seconds, minutes, hours, days } = useTimer({
        expiryTimestamp: time,
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Mobile devices (up to 768px width)
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isNewProduct = (createdAt) => {
        const productDate = new Date(createdAt);
        const currentDate = new Date();
        return (currentDate - productDate) / (1000 * 60 * 60 * 24) <= 3;
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => setIsDragging(false);

    const scrollLeftHandler = () => sliderRef.current?.scrollBy({ left: -220, behavior: "smooth" });

    const scrollRightHandler = () => sliderRef.current?.scrollBy({ left: 220, behavior: "smooth" });

    const filteredProducts = productList.filter((product) =>
        selectedCategory === "All"
            ? product.discount_percent >= 50
            : (product.subcategory === selectedCategory || product.category === selectedCategory) &&
              product.discount_percent >= 50
    );

    const getProductRating = (reviews) => {
        const reviewCount = reviews?.length || 0;
        if (reviewCount === 1) return 1; // 1 review = 1 star
        if (reviewCount >= 2 && reviewCount <= 3) return 2; // 2-3 reviews = 2 stars
        if (reviewCount >= 4 && reviewCount <= 6) return 4; // 4-6 reviews = 4 stars
        if (reviewCount >= 7) return 5; // 7+ reviews = 5 stars
        return 0; // Default
    };
    const guestId = localStorage.getItem('guestId');
    const handleAddToCart = (product) => {
        const cartItems = {
            title: product.title,
            Discount_price: product.discount_price,
            quantity: 1,
            image: product.images[0],
            price: product.price,
            Product_id: product._id,
            user_Email: user?.email,
            user_Uid: user?.uid || guestId,
            created_Email: product.created_Email,
            created_Uid: product.createdBy,
        };

        axiosSecure
            .post(`/api/cartItems`, cartItems)
            .then(() => {
                toast.success("Item added to cart successfully");
                refetch();
            })
            .catch((error) => {
                toast.error(error.response?.status === 400 ? "Item already added to cart" : "Failed to add item to cart");
            });
    };

    return (
        <div id="flash-sale-section"  className="bg-white barlow rounded-lg w-full mx-auto p-5">
            <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-[#00bf63]"></div>
                <h1 className="text-2xl md:text-4xl font-bold text-black">Today's</h1>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center mt-3 gap-5">
                <div className="flex justify-center items-center lg:items-start gap-3">
                    <h2 className="text-xl md:text-2xl font-semibold text-red-500 dark:text-black">Flash Sales</h2>
                    <div className="text-lg md:text-xl font-semibold text-black px-4 rounded-lg">
                        {days}d : {hours}h : {minutes}m : {seconds}s
                    </div>
                </div>

                <div className="flex items-center gap-3 text-black text-3xl cursor-pointer">
                    <IoIosArrowBack onClick={scrollLeftHandler} className="hover:text-[#00bf63] transition" />
                    <IoIosArrowForward onClick={scrollRightHandler} className="hover:text-[#00bf63] transition" />
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center text-black text-xl font-semibold mt-5">Items not available</div>
            ) : (
                <div
                    ref={sliderRef}
                    className="overflow-hidden mt-8 relative w-full mx-auto flex gap-5 p-2"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseUp}
                    onMouseUp={handleMouseUp}
                    style={{ overflowX: "auto", scrollBehavior: "smooth", scrollbarWidth: "none", whiteSpace: "nowrap" }}
                >
                    {filteredProducts.map((product, index) => (
                        <div key={index} className="w-60 bg-gray-50 flex-shrink-0 rounded-t-lg shadow-md p-3 transition-transform transform hover:scale-105 relative">
                            <div className="h-48 bg-gray-700 rounded-t-lg bg-cover bg-center relative" style={{ backgroundImage: `url(${product.images[0]})` }}>
                                {/* Hover Items */}
                                <div className={`absolute inset-0 flex flex-col justify-between items-center px-3 py-2 bg-opacity-50 ${isMobile ? "opacity-100" : "opacity-0 hover:opacity-100"} transition-opacity duration-300`}>
                                    <div className="flex justify-between w-full items-center">
                                        <h1 className="text-[#dcdcdc] text-sm p-1 bg-red-400">{product.discount_percent}%</h1>
                                        <div className="space-y-2">
                                            <Love product={product} />
                                            <Link to={`/ItemsDetails/${product._id}`}>
                                                <IoEyeOutline className="text-2xl  dark:text-black cursor-pointer p-1 bg-white rounded-full" />
                                            </Link>
                                        </div>
                                    </div>
                                    {
                                                product.total_stock > 0 ? <button onClick={() => handleAddToCart(product)} className="absolute bottom-0 w-full bg-black text-center text-white py-2 cursor-pointer transition duration-300">
                                                    Add to Cart
                                                </button> :
                                                    <button className="absolute bottom-0 w-full bg-black text-center text-white py-2 cursor-pointer transition duration-300">
                                                        Out Of Stock
                                                    </button>
                                            }
                                </div>
                            </div>

                            {/* Product Info */}
                            <Link to={`/ItemsDetails/${product._id}`} className="flex  text-black flex-col mt-3">
                                <span className="text-xl font-bold">{product.title}</span>
                                {isNewProduct(product.createdAt) && <div className="bg-green-500 text-xs px-2 py-1 text-black dark:text-white dark:bg-black rounded-full"><span className="text-white ">New</span></div>}
                                <div className="flex space-x-4  text-black">
                                    <span className="font-bold text-red-600 line-through">${product.price}</span>
                                    <span className="font-bold text-red-600">{product.discount_price}$</span>
                                </div>
                                <div className="flex">
                                    <Rating value={getProductRating(product.review)} readOnly={true} className="text-yellow-500" style={{ maxWidth: 100 }} />
                                    ({product.review.length})
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            <Link to={'/allProduct'} className="flex justify-center mt-10 text-center">
                <button className="px-8 cursor-pointer text-white py-2 bg-[#00bf63]">View All Products</button>
            </Link>
        </div>
    );
}