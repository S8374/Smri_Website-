import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaTimes, FaBars } from "react-icons/fa";
import { GetMassages } from '../../../Hooks/getMassages';
import { Helmet } from 'react-helmet-async';

export default function Admin() {
    const [toggled, setToggled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [userMassages, isLoading] = GetMassages();

    // Function to check screen size and update state
    const checkScreenSize = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    useEffect(() => {
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return (
        <>
            {isMobile && (
                <button className="btn ml-8 items-center" onClick={() => setToggled(!toggled)}>
                    <FaBars className='text-xl' />
                </button>
            )}

            <div className="min-h-screen flex dark:text-black">
                 <Helmet>
                                        <title>Smri Shop || Admin DashBoard</title>
                                        </Helmet>
                <Sidebar
                    className="h-screen w-64 flex flex-col"
                    onBackdropClick={() => setToggled(false)}
                    toggled={toggled}
                    breakPoint="md"
                    collapsed={isMobile && !toggled}
                >
                    <div>
                        <Menu>
                            {isMobile && (
                                <MenuItem className="text-xl font-bold text-center py-6 border-b border-gray-700">
                                    <button onClick={() => setToggled(false)} className="text-gray-400 float-right btn hover:text-white ">
                                        <FaTimes size={20} />
                                    </button>
                                </MenuItem>
                            )}
                        </Menu>

                        <Menu>
                            <MenuItem component={<Link to="/dashboard/admin/panelDashboard" />} className="hover:bg-gray-700 dark:text-black transition duration-200 ease-in-out">
                                Dashboard
                            </MenuItem>
                            <SubMenu label="Manage Users" className="hover:bg-gray-700 dark:text-black transition duration-200 ease-in-out">
                                <MenuItem component={<Link to="/dashboard/admin/manageUsers" />} className="hover:bg-gray-600 dark:text-black transition duration-200 ease-in-out">
                                    All Users
                                </MenuItem>
                                <MenuItem component={<Link to="/dashboard/admin/topSeller" />} className="hover:bg-gray-600 dark:text-black transition duration-200 ease-in-out">
                                    Top Seller
                                </MenuItem>
                            </SubMenu>
                            <SubMenu label="Manage Products" className="hover:bg-gray-700 dark:text-black transition duration-200 ease-in-out">
                                <MenuItem component={<Link to="/dashboard/admin/manageProducts" />} className="hover:bg-gray-600 dark:text-black transition duration-200 ease-in-out">
                                    All Products
                                </MenuItem>
                                <MenuItem component={<Link to="/dashboard/addProducts" />} className="hover:bg-gray-600 dark:text-black transition duration-200 ease-in-out">
                                    Add Products
                                </MenuItem>
                            </SubMenu>
                            <SubMenu label="Marketing" className="hover:bg-gray-700 dark:text-black transition duration-200 ease-in-out">
                                <MenuItem component={<Link to='/dashboard/admin/flashSell'/>} className="hover:bg-gray-600 dark:text-black transition duration-200 ease-in-out">
                                    Flash Sell Time
                                </MenuItem>
                                <MenuItem component={<Link to='/dashboard/admin/coupon' />} className="hover:bg-gray-600 dark:text-black transition duration-200 ease-in-out">
                                    Coupon
                                </MenuItem>
                            </SubMenu>
                            <SubMenu label="Messages" className="hover:bg-gray-700 dark:text-black transition duration-200 ease-in-out">
                                {isLoading ? (
                                    <MenuItem className="text-gray-500">Loading...</MenuItem>
                                ) : userMassages.length > 0 ? (
                                    userMassages.map((chat, index) => (
                                        <MenuItem 
                                            key={index} 
                                            component={<Link to={`/dashboard/admin/messages/${chat.chatId}`} />} 
                                            className="hover:bg-gray-600 dark:text-black transition duration-200 ease-in-out"
                                        >
                                            <div className="flex items-center gap-2">
                                                <img 
                                                    src={chat.photoURL || "https://via.placeholder.com/40"} 
                                                    alt="User" 
                                                    className="w-6 h-6 rounded-full"
                                                />
                                                <span>{chat.userName || "Guest"}</span>
                                            </div>
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem className="text-gray-500 dark:text-black">No messages available</MenuItem>
                                )}
                            </SubMenu>
                        </Menu>
                    </div>

                    <div className="mt-auto border-t border-gray-700">
                        <Menu>
                            <MenuItem component={<Link to='/'/>} className="hover:bg-gray-700 transition duration-200 ease-in-out dark:text-black">Back Home</MenuItem>
                        </Menu>
                    </div>
                </Sidebar>

                <div className="flex-1 p-4 dark:text-black">
                    <Outlet />
                </div>
            </div>
        </>
    );
}