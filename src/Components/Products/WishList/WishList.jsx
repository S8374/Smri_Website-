import { CiTrash } from "react-icons/ci";
import { FaEye } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import BreadCurms from "../../Design/BreadCurms/BreadCurms";
import Button from "../../Design/Button/Button";
import { UseWishList } from "../../../Hooks/wishList/useWishList";
import useAuth from "../../../Hooks/useAuth";
import useSecure from "../../../Hooks/useSequre";
import toast from "react-hot-toast";
import UseProducts from "../../../Hooks/useProducts";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UseCart } from "../../../Hooks/cart/useCart";
import { v4 as uuidv4 } from "uuid";
import Error from "../../Design/Error/Error";
import { Helmet } from "react-helmet-async";
import ScrollToTop from "../../Design/Scroll/ScrollTop";

export default function WishList() {
    const [wishItems, isLoading, refreshWishItems] = UseWishList();
    const { user } = useAuth();
    const axiosSecure = useSecure();
    const [productList, isProductLoading] = UseProducts();
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [userItems, refetch] = UseCart();
    const guestId = localStorage.getItem('guestId') || uuidv4();
    if (!localStorage.getItem('guestId')) {
        localStorage.setItem('guestId', guestId);
    }
    const handleRemoveFromWishList = (itemId) => {
        axiosSecure
            .delete(`/api/wishItems`, { data: { Product_id: itemId, user_Email: user?.email || 'guest@example.com', user_Uid: user?.uid || guestId } })
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Item removed from wishlist");
                    refreshWishItems();
                }
            })
            .catch((error) => {
                console.error("Error removing item:", error);
                if (error.response && error.response.status === 404) {
                    toast.error("Item not found in wishlist");
                } else {
                    toast.error("Failed to remove item from wishlist");
                }
            });
    };

    const getMostFrequentCategories = () => {
        const categoryCount = {};
        wishItems.forEach(item => {
            const product = productList.find(p => p._id === item.Product_id);
            if (product) {
                categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
            }
        });
        return Object.keys(categoryCount).sort((a, b) => categoryCount[b] - categoryCount[a]);
    };

    const getSuggestedProducts = () => {
        const categories = getMostFrequentCategories();
        const suggested = [];
        categories.forEach(category => {
            const products = productList.filter(p => p.category === category);
            suggested.push(...products);
        });
        return suggested.slice(0, 4); // Limit to 4 products
    };

    const getFallbackProducts = () => {
        const sortedProducts = [...productList].sort((a, b) => {
            const discountA = a.discount_percent || 0;
            const discountB = b.discount_percent || 0;
            return discountB - discountA; // Sort by highest discount
        });
        return sortedProducts.slice(0, 4); // Limit to 4 products
    };

    useEffect(() => {
        if (productList.length > 0) {
            if (wishItems.length > 0) {
                setSuggestedProducts(getSuggestedProducts());
            } else {
                setSuggestedProducts(getFallbackProducts());
            }
        }
    }, [wishItems, productList]);

    if (isLoading || isProductLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    const SkeletonLoader = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
                <div
                    key={index}
                    className="w-full bg-gray-50 rounded-lg shadow-md p-3 animate-pulse"
                >
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="flex flex-col mt-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    const handelAddCart = (product) => {
        const cartItems = {
            title: product.title,
            Discount_price: product.discount_price,
            quantity: 1,
            image: product.images[0],
            price: product.price,
            Product_id: product._id,
            user_Email: user?.email || 'guest@example.com',
            user_Uid: user?.uid || guestId,
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

    return (
        <div className="container mx-auto text-black px-4 py-6">
            <ScrollToTop></ScrollToTop>
            <Helmet>
                <title>Wishlist | E-commerce Store</title>
            </Helmet>
            <BreadCurms icon1={<IoIosArrowForward />} Section1={'WishList'} />
            <div className="mt-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold">WishList</h1>
                    <Link to={'/allProduct'}>
                        <Button Name={'See All'} />
                    </Link>

                </div>
                {wishItems?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {wishItems.map((item) => (
                            <div
                                key={item._id}
                                className="w-full bg-white rounded-lg shadow-md p-3 transition-transform transform hover:scale-105 relative"
                            >
                                <div
                                    className="h-48 bg-gray-700 rounded-t-lg bg-cover bg-center relative"
                                    style={{ backgroundImage: `url(${item.image || 'https://via.placeholder.com/150'})` }}
                                >
                                    {/* Hover-like effects for mobile and desktop */}
                                    <div className="absolute inset-0 flex flex-col justify-between items-center px-3 py-2 bg-opacity-50 opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex justify-between w-full items-center">
                                            <h1 className="text-white text-sm p-1 dark:text-black bg-red-400">{item.discount_price}%</h1>
                                            <div className="space-y-2">
                                                <CiTrash
                                                    onClick={() => handleRemoveFromWishList(item.Product_id)}
                                                    className="text-2xl p-1 cursor-pointer bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <button className="absolute bottom-0 w-full bg-black text-center text-white py-2 cursor-pointer transition duration-300 hover:bg-red-500">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-3">
                                    <span className="text-xl font-bold">{item.title}</span>
                                    <p className="text-xs text-gray-700">ID: {item._id}</p>
                                    <span className="font-bold text-red-600 line-through">${item.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <Error details={'Here’s an updated version of your Helmet component, tailored for your "All Products" page:'} title={'No Wish Items Find'} img={'https://res.cloudinary.com/dx8o5d32h/image/upload/v1742026954/online-shop_ahwesu.png'} />
                    </div>
                )}
            </div>

            {/* Just For You Section */}
            <div className="mt-10">
                <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-8 bg-red-500"></div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Just For You</h1>
                    </div>
                    <Link to={'/allProduct'}>
                        <Button Name={'See All'} />
                    </Link>
                </div>
                {suggestedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {suggestedProducts.map((product) => (
                            <div
                                key={product._id}
                                className="w-full bg-white rounded-lg shadow-md p-3 transition-transform transform hover:scale-105 relative"
                            >
                                <div
                                    className="h-48 bg-gray-700 rounded-t-lg bg-cover bg-center relative"
                                    style={{ backgroundImage: `url(${product.images[0] || 'https://via.placeholder.com/150'})` }}
                                >
                                    {/* Hover-like effects for mobile and desktop */}
                                    <div className="absolute inset-0 flex flex-col justify-between items-center px-3 py-2 bg-opacity-50 opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex justify-between w-full items-center">
                                            <h1 className="text-white text-sm p-1 dark:text-black bg-red-400 ">{product.discount_percent}%</h1>
                                            <Link to={`/ItemsDetails/${product._id}`} className="space-y-2">
                                                <FaEye className="text-2xl p-1 cursor-pointer  dark:text-black bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors" />
                                            </Link>
                                        </div>
                                        <button onClick={() => handelAddCart(product)} className="absolute bottom-0 w-full bg-black text-center text-white py-2 cursor-pointer transition duration-300 hover:bg-red-500">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-3">
                                    <span className="text-xl font-bold">{product.title}</span>
                                    <p className="text-xs text-gray-700">ID: {product._id}</p>
                                    <span className="font-bold text-red-600 line-through">${product.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <SkeletonLoader />
                )}
            </div>
        </div>
    );
}