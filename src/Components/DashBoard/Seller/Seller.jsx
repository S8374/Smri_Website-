import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaTimes, FaBars } from "react-icons/fa";
import useSeller from '../../../Hooks/userRole/useSeller';
import useAuth from '../../../Hooks/useAuth';
import { Helmet } from 'react-helmet-async';

export default function Seller() {
    const [toggled, setToggled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSeller, isSellerLoading] = useSeller();
    const navigate = useNavigate();
    const { user, logOut } = useAuth()

    // Redirect to home if user is not a seller
    useEffect(() => {
        if (!isSellerLoading && isSeller === !true) {
            logOut(); // Log out the user if they're not a seller
            navigate("/"); // Redirect to home page
        }
    }, [isSeller, isSellerLoading, navigate]);

    // Function to check screen size and update state
    const checkScreenSize = () => {
        setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    // Add event listener for window resize
    useEffect(() => {
        checkScreenSize(); // Check on initial render
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return (
        <>
            {/* Toggle Button (Visible only on mobile) */}
            {isMobile && (
                <button className="btn ml-8 items-center" onClick={() => setToggled(!toggled)}>
                    <FaBars className='text-xl' />
                </button>
            )}

            <div className="min-h-screen flex">
                <Helmet>
                    <title>Smri Shop || Seller DashBoard</title>
                </Helmet>
                {/* Sidebar */}
                <Sidebar
                    className="h-screen w-64 flex flex-col"
                    onBackdropClick={() => setToggled(false)}
                    toggled={toggled}
                    breakPoint="md" // Sidebar will toggle on screens smaller than "md" (768px)
                    collapsed={isMobile && !toggled} // Collapse sidebar on mobile when not toggled
                >
                    <div className="">
                        <Menu>
                            {/* Close Button (Visible only on mobile) */}
                            {isMobile && (
                                <MenuItem className="text-xl font-bold text-center py-6 border-b border-gray-700">
                                    <button onClick={() => setToggled(false)} className="text-gray-400 float-right btn hover:text-white">
                                        <FaTimes size={20} />
                                    </button>
                                </MenuItem>
                            )}
                        </Menu>

                        <Menu>
                            <MenuItem component={<Link to="/dashboard/seller/SellerPanel" />} className="hover:bg-gray-700 transition duration-200 ease-in-out">
                                Dashboard
                            </MenuItem>
                            <SubMenu label="Order" className="hover:bg-gray-700 transition duration-200 ease-in-out">
                                <MenuItem component={<Link to="/dashboard/seller/CashOnDelivery" />} className="hover:bg-gray-600 transition duration-200 ease-in-out">
                                    Cash On Delivery
                                </MenuItem>
                                <MenuItem component={<Link to="/dashboard/seller/paymentUser" />} className="hover:bg-gray-600 transition duration-200 ease-in-out">
                                    Payment Order
                                </MenuItem>
                            </SubMenu>
                            <SubMenu label="Manage Products" className="hover:bg-gray-700 transition duration-200 ease-in-out">
                                <MenuItem component={<Link to="/dashboard/seller/sellerProducts" />} className="hover:bg-gray-600 transition duration-200 ease-in-out">
                                    My Products
                                </MenuItem>
                                <MenuItem component={<Link to="/dashboard/addProducts" />} className="hover:bg-gray-600 transition duration-200 ease-in-out">
                                    Add Products
                                </MenuItem>
                            </SubMenu>
                            <SubMenu label="Marketing" className="hover:bg-gray-700 transition duration-200 ease-in-out">
                                <MenuItem className="hover:bg-gray-600 transition duration-200 ease-in-out">New Offer</MenuItem>
                                <MenuItem className="hover:bg-gray-600 transition duration-200 ease-in-out">Coupon List</MenuItem>
                            </SubMenu>
                        </Menu>
                    </div>

                    {/* Bottom Menu (Perfectly Aligned to Bottom) */}
                    <div className="mt-auto border-t border-gray-700">
                        <Menu>
                            <MenuItem component={<Link to="/" />} className="hover:bg-gray-700 transition duration-200 ease-in-out">
                                Back Home
                            </MenuItem>
                        </Menu>
                    </div>
                </Sidebar>

                {/* Main Content */}
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </>
    );
}