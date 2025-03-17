import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdmin from "../../../Hooks/userRole/useAdmin";
import useSeller from "../../../Hooks/userRole/useSeller";
import Admin from "../Admin/Admin";
import Seller from "../Seller/Seller";
import ScrollToTop from "../../Design/Scroll/ScrollTop";

export default function DashBoardRoot() {
    const [isAdmin, isAdminLoading] = useAdmin();
    const [isSeller, isSellerLoading] = useSeller();
    const navigate = useNavigate();

    // Redirect to the correct dashboard path based on the user's role
    useEffect(() => {
        if (!isAdminLoading && !isSellerLoading) {
            if (isAdmin) {
                navigate("/dashboard/admin/panelDashboard"); // Redirect to admin dashboard
            } else if (isSeller) {
                navigate("/dashboard/seller/SellerPanel"); // Redirect to seller dashboard
            }
        }
    }, [isAdmin, isAdminLoading, isSeller, isSellerLoading, navigate]);

    return (
        <div className="flex">
            <ScrollToTop />
            <div>
                {isAdmin && !isAdminLoading && <Admin />}
                {isSeller && !isSellerLoading && <Seller />}
            </div>
        </div>
    );
}