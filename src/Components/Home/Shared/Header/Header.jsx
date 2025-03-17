import { useState, useRef, useEffect } from 'react';
import { CiHeart, CiShoppingCart, CiUser } from 'react-icons/ci';
import { HiOutlineBellAlert } from "react-icons/hi2";
import { Link, NavLink } from 'react-router-dom';
import Loader from '../../../Loader/Loader';
import useNavigationWithLoader from '../../../../Hooks/useNavigationWithLoader';
import UserProfile from '../../../CreateUser/UserProfile/UserProfile';
import useAuth from '../../../../Hooks/useAuth';
import { UseCart } from '../../../../Hooks/cart/useCart';
import { UseWishList } from '../../../../Hooks/wishList/useWishList';
import Notification from '../../../IconFuntions/Notification/Notification';
import GetMostProducts from '../../../../Hooks/GetCombinatio';
import toast from 'react-hot-toast';

export default function Header() {
    const { loading, handleNavigation } = useNavigationWithLoader();
    const { user } = useAuth();
    const [userItems] = UseCart();
    const [wishItems] = UseWishList();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const notificationRef = useRef(null);
    const [getProducts, isLoading, refetchAll] = GetMostProducts();
    const [newItems, setNewItems] = useState([]); // Store new items added since last click

    // Track new products and update notifications
    useEffect(() => {
        if (getProducts?.length > 0) {
            const lastItem = getProducts[0]; // Get the latest item
            setNewItems((prev) => [lastItem, ...prev]); // Add to new items list
            toast.success(`New item added: ${lastItem.title}`); // Show alert for new item
        }
    }, [getProducts]);

    // Refetch data periodically to check for new items
    useEffect(() => {
        const interval = setInterval(() => {
            refetchAll(); // Refetch data from the backend every 5 seconds
        }, 5000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [refetchAll]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Mark notifications as read when dropdown is opened
    const handleNotificationClick = () => {
        setIsNotificationOpen(!isNotificationOpen);
        setNewItems([]); // Clear new items after clicking the notification icon
    };

    return (
        <>
            {loading && <Loader />}
            {!loading && (
                <div className={`navbar px-4 sticky top-0 z-30  items-center transition-all bg-[#ffdfa9] `}>
                    <Link to={'/'} className="navbar-start">
                        <a className="text-sm flex items-center lg:text-3xl text-black barlow font-semibold uppercase px-1.5">
                            <img src="https://res.cloudinary.com/dx8o5d32h/image/upload/v1742022038/Blue_and_Orange_Illustrative_Online_Shop_Logo_-_Copy-removebg-preview_lptzej.png" alt="" className='max-h-16 mx-auto' />
                            Smri_Shop
                            </a>
                    </Link>

                    <div className="navbar-end flex items-center  space-x-5">
                        {/* Notification Icon */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                className="relative  focus:outline-none"
                                onClick={handleNotificationClick}
                            >
                                <HiOutlineBellAlert className="text-xl text-black lg:text-2xl hover:opacity-70 transition" />
                                {newItems.length > 0 && (
                                    <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        {newItems.length}
                                    </span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {isNotificationOpen && (
                                <Notification
                                    newItems={newItems.slice(0, 3)} // Show only 3 new items
                                />
                            )}
                        </div>

                        {/* Wishlist */}
                        <NavLink className="relative " to="/wishList">
                            <CiHeart className="text-xl text-black lg:text-2xl hover:opacity-70  transition" />
                            <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{wishItems?.length || 0}</span>
                        </NavLink>

                        {/* Cart */}
                        <NavLink className="relative " to="/cart">
                            <CiShoppingCart className="text-xl text-black lg:text-2xl hover:opacity-70  transition" />
                            <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{userItems?.length || 0}</span>
                        </NavLink>

                        {/* Profile */}
                        <div>
                            {user ? <UserProfile /> : <NavLink to='/signUp'><CiUser className='text-xl lg:text-3xl text-black' /></NavLink>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}