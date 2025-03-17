/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import UseProducts from "../../../Hooks/useProducts";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import axios from "axios";
import toast from "react-hot-toast";
import { UseCart } from "../../../Hooks/cart/useCart";
import Love from "../../IconFuntions/Love/Love";

export default function Products({ selectedCategory }) {
    const [productList, isLoading, refreshProducts] = UseProducts();
    const [currentPage, setCurrentPage] = useState(0);
    const { user } = useAuth();
    const productsPerPage = 8;
    const [userItems, refetch] = UseCart();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024); // Tablet and mobile devices (up to 1024px width)
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Filter products based on category and discount percentage
    const filteredProducts = productList.filter((product) => {
        if (selectedCategory === "All") {
            return product.discount_percent < 50;
        } else if (product.subcategory === selectedCategory) {
            return product.discount_percent < 50;
        } else {
            return product.category === selectedCategory && product.discount_percent < 50;
        }
    });

    // Calculate total pages
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Ensure current page is within range
    const startIndex = currentPage * productsPerPage;
    const visibleProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

    // Navigation Functions
    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);
        }
    };
    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };
    const guestId = localStorage.getItem('guestId');
    // Add item to cart
    const handelAddCart = (product) => {
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

        axios.post(`${import.meta.env.VITE_LIVE_LINK}/api/cartItems`, cartItems)
            .then(res => {
                toast.success('Item added to cart successfully');
                refetch();
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    toast.error('Item already added to cart');
                } else {
                    toast.error('Failed to add item to cart');
                }
            });
    };

    // Calculate star rating based on number of reviews
    const calculateStarRating = (reviews) => {
        const totalReviews = reviews.length;
        if (totalReviews === 1) return 1;
        if (totalReviews >= 2 && totalReviews <= 3) return 2;
        if (totalReviews >= 4 && totalReviews <= 6) return 4;
        if (totalReviews >= 7) return 5;
        return 0;
    };

    return (
        <div id="product-section" className="bg-white text-black barlow shadow-md rounded-lg w-full mx-auto p-5">
            {/* Title Section */}
            <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-green-500"></div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-black">Our Products</h1>
            </div>

            {filteredProducts.length === 0 ? (
                // No Products Available Message
                <div className="text-center text-gray-500 text-lg mt-10">
                    No products available in this category.
                </div>
            ) : (
                <>
                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-3">
                        <h2 className="text-xl md:text-2xl font-semibold text-red-500 dark:text-black">Explore Our Products</h2>
                        <div className="flex items-center gap-3 text-gray-700 text-3xl cursor-pointer">
                            <IoIosArrowBack onClick={prevPage} className={`hover:text-red-500 transition ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} />
                            <IoIosArrowForward onClick={nextPage} className={`hover:text-red-500 transition ${currentPage >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`} />
                        </div>
                    </div>

                    {/* Product Card Grid */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-5">
                        {visibleProducts.map((product) => {
                            const totalRatings = product.review?.length || 0;
                            const avgRating = calculateStarRating(product.review);

                            return (
                                <div key={product._id} className="bg-gray-50 rounded-t-lg shadow-md p-0 lg:p-3 transition-transform transform hover:scale-105 relative w-full">
                                    {/* Image Container */}
                                    <div
                                        className="h-48 bg-gray-700 rounded-t-lg bg-cover bg-center relative"
                                        style={{ backgroundImage: `url(${product.images[0]})` }}
                                    >
                                        {/* Hover Content */}
                                        <div className={`absolute inset-0 flex flex-col justify-between items-center px-3 py-2 bg-opacity-50 ${isMobile ? 'opacity-100' : 'opacity-0 hover:opacity-100'} transition-opacity duration-300`}>
                                            <div className="flex justify-between w-full items-center">
                                                <h1 className="text-white text-sm p-1 bg-red-400">{product.discount_percent}%</h1>
                                                <div className="space-y-2">
                                                    <Love product={product} />
                                                    <NavLink state={{ fromProducts: true }} to={`/ItemsDetails/${product._id}`}>
                                                        <IoEyeOutline className="text-2xl cursor-pointer p-1 bg-white dark:text-black rounded-full" />
                                                    </NavLink>
                                                </div>
                                            </div>
                                            {/* Bottom Section: Add to Cart button */}
                                            {
                                                product.total_stock > 0 ? <button onClick={() => handelAddCart(product)} className="absolute bottom-0 w-full bg-black text-center text-white py-2 cursor-pointer transition duration-300">
                                                    Add to Cart
                                                </button> :
                                                    <button className="absolute disabled:btn bottom-0 w-full bg-black text-center text-white py-2 cursor-pointer transition duration-300">
                                                        Out Of Stock
                                                    </button>
                                            }
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <Link to={`/ItemsDetails/${product._id}`} className="flex flex-col cursor-pointer mt-3 p-2 lg:p-0">
                                        <span className="text-sm lg:text-xl font-bold">{product.title}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-red-600 line-through">${product.price}</span>
                                            <span className="font-bold text-green-600">${product.discount_price}</span>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex">
                                            <Rating style={{ maxWidth: 100 }} value={avgRating} readOnly /> ({product.review.length})
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {/* View All Button */}
                    <Link to={'/allProduct'} className="flex justify-center mt-10">
                        <button className="px-8 cursor-pointer py-2 bg-red-400">View All Products</button>
                    </Link>
                </>
            )}
        </div>
    );
}