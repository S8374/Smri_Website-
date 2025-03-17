import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { CiBank, CiDeliveryTruck, CiHeart } from "react-icons/ci";
import { Link, useNavigate, useParams } from "react-router-dom";
import UseProducts from "../../../Hooks/useProducts";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import UserComments from "../../CreateUser/UserComments/UserComments";
import ScrollToTop from "../../Design/Scroll/ScrollTop";
import toast from "react-hot-toast";
import Love from "../../IconFuntions/Love/Love";
import { Helmet } from "react-helmet-async";

export default function ItemsDetails() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 1000);
    const { id } = useParams();
    const [productList, isLoading, refetch] = UseProducts(); // Correct destructuring
    const [product, setProduct] = useState(productList.find((item) => item._id === id));
    const navigate = useNavigate();
   
    const [quantity, setQuantity] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            setIsTablet(window.innerWidth >= 1000);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const foundProduct = productList.find((item) => item._id === id);
        if (foundProduct) {
            setProduct(foundProduct);
        }
    }, [productList, id]);

    const handleNewComment = (newReview) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            review: [...prevProduct.review, newReview],
        }));
    };

    if (!product) {
        return <div className="text-center text-red-500">Product not found</div>;
    }

    const increaseQuantity = () => {
        if (quantity >= product.total_stock) {
            toast.error("Item availability limited");
            return;
        }
        if (quantity < product.total_stock) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleBuyNow = () => {

        if (quantity === 0) {
            toast.error("Please select quantity before buying.");
            return;
        }
        if (!selectedSize) {
            toast.error("Please select a size before buying.");
            return;
        }
        if (!selectedColor) {
            toast.error("Please select a color before buying.");
            return;
        }
    
        // Prepare the product details to pass to the Payment component
        const productDetails = {
            created_Email:product.created_Email,
            created_Uid:product.createdBy,
            _id: product._id,
            title: product.title,
            image: product.images[0],
            paymentItemsID:product._id,
            price: product.discount_price,
            size: selectedSize,
            color:selectedColor,
            quantity: quantity,
            totalPrice: (product.price * quantity) + (product.discount_percent >= 50 ? 10 : 0), // Include shipping cost if applicable
        };
    
        // Navigate to the Payment component with the product details
        navigate(`/order`, { state: { productDetails } });
    };
    const getProductRating = (reviews) => {
        const reviewCount = reviews?.length || 0;
        if (reviewCount === 1) return 1; // 1 review = 1 star
        if (reviewCount >= 2 && reviewCount <= 3) return 2; // 2-3 reviews = 2 stars
        if (reviewCount >= 4 && reviewCount <= 6) return 4; // 4-6 reviews = 4 stars
        if (reviewCount >= 7) return 5; // 7+ reviews = 5 stars
        return 0; // Default
    };
    return (
        <div>
            <ScrollToTop />
            <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6 bg-white text-black shadow-lg rounded-lg">
                {/* Left - Thumbnails */}
                    <Helmet>
                                <title>Items Details || E-commerce Store</title>
                            </Helmet>
                <div className="w-full md:w-[12%] flex justify-center items-center order-2 md:order-1">
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        loop={true}
                        direction={isTablet ? "vertical" : "horizontal"}
                        spaceBetween={10}
                        slidesPerView={isTablet ? 3 : 2}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper h-[100px] md:h-[80vh] rounded-lg overflow-hidden"
                    >
                        {product.images.map((img, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    className="cursor-pointer border w-full h-full object-cover rounded-md"
                                    src={img}
                                    alt={`Thumbnail ${index + 1}`}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Center - Main Image */}
                <div className="w-full md:w-[55%] flex justify-center items-center order-1 md:order-2">
                    <Swiper
                        style={{ "--swiper-navigation-color": "#000", "--swiper-pagination-color": "#000" }}
                        loop={true}
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="mySwiper2 rounded-lg overflow-hidden"
                    >
                        {product.images.map((img, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    className="w-full h-[300px] md:h-[80vh] object-cover rounded-lg"
                                    src={img}
                                    alt={`Product Image ${index + 1}`}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Right - Product Details */}
                <div className="w-full md:w-[33%] flex flex-col gap-4 order-3">
                    <h1 className="text-lg md:text-2xl font-semibold">{product.title}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                        <Rating
                            value={getProductRating(product.review)}
                            readOnly={true}
                            className="text-yellow-500"
                            style={{ maxWidth: 100 }}
                            size={10}
                        />
                        <p className="text-green-600 font-medium text-sm md:text-base">{product.stock}</p>
                    </div>

                    <h2 className="text-base md:text-xl dark:text-black font-bold text-red-500">${product.discount_price} tk</h2>
                    <p className="text-gray-600 text-sm md:text-base">{product.description}</p>
                    <hr className="my-2" />
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                            <p className="text-gray-700 font-medium">Color:  </p>
                            {product.color.map((col) => (
                                <button
                                    key={col}
                                    className={`px-2 py-1 border rounded-md text-xs md:text-base ${selectedColor === col ? "bg-red-500 text-white" : "text-gray-700"
                                        }`}
                                    onClick={() => setSelectedColor(col)}
                                >
                                    {col}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-gray-700 font-medium">Size:</p>
                            {product.size.map((siz) => (
                                <button
                                    key={siz}
                                    className={`px-2 py-1 border rounded-md text-xs md:text-base ${selectedSize === siz ? "bg-red-500 text-white" : "text-gray-700"
                                        }`}
                                    onClick={() => setSelectedSize(siz)}
                                >
                                    {siz}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center border rounded-md px-2 py-1">
                                <button className="text-lg px-2 cursor-pointer" onClick={decreaseQuantity}>-</button>
                                <span className="px-2 text-sm md:text-base">{quantity}</span>
                                <button className="text-lg cursor-pointer px-2" onClick={increaseQuantity}>+</button>
                            </div>

                            {product.total_stock > 0 ? (
                                <button
                                    onClick={handleBuyNow}
                                    className="bg-black cursor-pointer text-white px-3 py-2 text-sm md:text-base rounded-md hover:bg-gray-800"
                                >
                                    Buy Now
                                </button>
                            ) : (
                                <button className="bg-gray-300 cursor-not-allowed text-gray-600 px-3 py-2 text-sm md:text-base rounded-md">
                                    Out of Stock
                                </button>
                            )}

                            <Love product={product} />
                        </div>
                    </div>

                    <div className="border p-3 rounded-lg mt-3 bg-gray-100">
                        {product.discount_percent >= 50 ? (
                            <div className="flex items-center gap-3">
                                <CiDeliveryTruck className="text-4xl text-gray-600" />
                                <div>
                                    <h1 className="font-medium text-gray-800 text-sm">Delivery Fee: 10 tk</h1>
                                </div>
                            </div>
                        ) : (
                            <Link className="flex items-center cursor-pointer gap-3">
                                <CiDeliveryTruck className="text-4xl text-gray-600" />
                                <div>
                                    <h1 className="font-medium text-gray-800 text-sm">Free Delivery</h1>
                                    <p className="text-gray-500 text-xs">Get free delivery for orders above $50.</p>
                                </div>
                            </Link>
                        )}
                        <hr className="my-2" />
                        <Link className="flex items-center cursor-pointer gap-3">
                            <CiBank className="text-2xl text-gray-600" />
                            <div>
                                <h1 className="font-medium text-gray-800 text-sm">Secure Payment</h1>
                                <p className="text-gray-500 text-xs">100% secure payment via trusted gateways.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            {/* Add comment section */}
            <UserComments product={product} refetch={refetch} handleNewComment={handleNewComment} />
        </div>
    );
}