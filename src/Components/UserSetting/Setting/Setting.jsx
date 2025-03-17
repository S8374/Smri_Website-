import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import { Helmet } from "react-helmet-async";

export default function Setting() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logOut } = useAuth();
    const nav = useNavigate()
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    if (!user) {
        logOut();
        nav('/')
    }
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <Helmet>
                <title>Smri Shop || User Setting</title>
            </Helmet>
            {/* Sidebar Toggle Button for Mobile */}
            <button
                onClick={toggleSidebar}
                className="md:hidden   left-4 p-3  rounded-full"
            >
                {isSidebarOpen ? <FaTimes className="text-2xl text-black " /> : <FaBars className="text-2xl text-black" />}
            </button>

            {/* Sidebar (Not Fixed) */}
            <div
                className={`w-64   p-6 rounded-lg transition-all duration-300 ${isSidebarOpen ? "h-auto" : "h-0 overflow-hidden"
                    } md:h-auto`}
            >
                <nav className="space-y-4">
                    <div>
                        <h2 className="text-sm font-medium text-gray-500 mb-2">Manage My Account</h2>
                        <NavLink
                            to="myProfile"
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200 ${isActive ? "bg-gray-300 font-medium" : ""
                                }`
                            }
                        >
                            My Profile
                        </NavLink>
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-gray-500 mb-2">Orders</h2>
                        <NavLink
                            to="returns"
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200 ${isActive ? "bg-gray-300 font-medium" : ""
                                }`
                            }
                        >
                            My Returns
                        </NavLink>
                        <NavLink
                            to="myCollections"
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200 ${isActive ? "bg-gray-300 font-medium" : ""
                                }`
                            }
                        >
                            My Collections
                        </NavLink>
                    </div>
                </nav>
            </div>

            {/* Content Area (Moves Down When Sidebar is Open) */}
            <div className={`flex-1 p-4 md:p-6 transition-all duration-300 ${isSidebarOpen ? "mt-24" : "mt-4"}`}>
                <Outlet />
            </div>
        </div>
    );
}
