import { useState, useRef, useEffect } from "react";
import { CiHeart, CiShoppingCart, CiUser } from "react-icons/ci";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { Link, NavLink } from "react-router-dom";
import Loader from "../../../Loader/Loader";
import useNavigationWithLoader from "../../../../Hooks/useNavigationWithLoader";
import UserProfile from "../../../CreateUser/UserProfile/UserProfile";
import useAuth from "../../../../Hooks/useAuth";
import { UseCart } from "../../../../Hooks/cart/useCart";
import { UseWishList } from "../../../../Hooks/wishList/useWishList";
import Notification from "../../../IconFuntions/Notification/Notification";
import GetMostProducts from "../../../../Hooks/GetCombinatio";
import toast from "react-hot-toast";

export default function Header() {
  const { loading, handleNavigation } = useNavigationWithLoader();
  const { user } = useAuth();
  const [userItems] = UseCart();
  const [wishItems] = UseWishList();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const [getProducts, isLoading, refetchAll] = GetMostProducts();
  const [newItems, setNewItems] = useState([]);

  useEffect(() => {
    if (getProducts?.length > 0) {
      const lastItem = getProducts[0];
      setNewItems((prev) => [lastItem, ...prev]);
      toast.success(`New item added: ${lastItem.title}`, {
        style: {
          background: "#4a5568",
          color: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      });
    }
  }, [getProducts]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetchAll();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetchAll]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setNewItems([]);
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <header className="sticky top-0 z-50 bg-white shadow-sm  ">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo/Brand */}
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="https://res.cloudinary.com/dx8o5d32h/image/upload/v1742022038/Blue_and_Orange_Illustrative_Online_Shop_Logo_-_Copy-removebg-preview_lptzej.png"
                  alt="Smri Shop Logo"
                  className="h-12 w-auto"
                />
                <span className="text-2xl font-bold text-gray-800 tracking-tight">
                  <span className="text-green-500">Smri</span>Shop
                </span>
              </Link>

              {/* Navigation Icons */}
              <div className="flex items-center space-x-6">
                {/* Notification */}
                <div className="relative" ref={notificationRef}>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                    onClick={handleNotificationClick}
                    aria-label="Notifications"
                  >
                    <HiOutlineBellAlert className="text-2xl text-gray-700" />
                    {newItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center">
                        {newItems.length}
                      </span>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Recent Notifications
                        </h3>
                        {newItems.length > 0 ? (
                          newItems.slice(0, 3).map((item, index) => (
                            <div
                              key={index}
                              className="py-2 border-b border-gray-100 last:border-0"
                            >
                              <p className="text-sm text-gray-600">
                                New item: {item.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date().toLocaleTimeString()}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 py-2">
                            No new notifications
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Wishlist */}
                <NavLink
                  to="/wishList"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                  activeClassName="bg-gray-100"
                >
                  <CiHeart className="text-2xl text-gray-700" />
                  {wishItems?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center">
                      {wishItems.length}
                    </span>
                  )}
                </NavLink>

                {/* Cart */}
                <NavLink
                  to="/cart"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                  activeClassName="bg-gray-100"
                >
                  <CiShoppingCart className="text-2xl text-gray-700" />
                  {userItems?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center">
                      {userItems.length}
                    </span>
                  )}
                </NavLink>

                {/* Profile */}
                <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  {user ? (
                    <UserProfile />
                  ) : (
                    <NavLink to="/signUp">
                      <CiUser className="text-2xl text-gray-700" />
                    </NavLink>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  );
}
