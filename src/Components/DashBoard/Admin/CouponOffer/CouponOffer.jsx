// Frontend (React + Axios + TailwindCSS)
import { useEffect, useState } from "react";
import useSecure from "../../../../Hooks/useSequre";
import useAuth from "../../../../Hooks/useAuth";
import useAdmin from "../../../../Hooks/userRole/useAdmin";
import { useNavigate } from "react-router-dom";

export default function CouponOffer() {
  const axiosSecure = useSecure();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState("");
  const [error, setError] = useState("");
  const { user, logOut } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin() ;
  const nav = useNavigate()
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await axiosSecure.get("/api/coupons");
        if (response.data) {
          setCoupon(response.data.name || "");
          setDiscount(response.data.discount || "");
        }
      } catch (error) {
        console.error("Error fetching coupon:", error);
      }
    };
    fetchCoupon();
  }, [axiosSecure]);

  const handleCouponChange = (e) => {
    const value = e.target.value.toUpperCase();
    const regex = /^[A-Z0-9]*$/;
    if (!regex.test(value)) return;
    setCoupon(value);
  };

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    if (!/^\d{0,3}$/.test(value)) return;
    setDiscount(value);
  };

  const handleSaveCoupon = async () => {
    if (coupon.length !== 8) return alert("Coupon must be exactly 8 characters long!");
    if (!discount || discount < 1 || discount > 100) return alert("Discount must be between 1% and 100%.");
    try {
      const response = await axiosSecure.put("/api/coupons", {
        name: coupon,
        discount: parseInt(discount),
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error saving coupon:", error);
      alert("Failed to save coupon. Try again!");
    }
  };
  if(isAdminLoading){
     return <h1> Loading........</h1>
  }
if(isAdmin === !true){
  return logOut() &&  nav('/') ;
}
  return (
    <div>
      <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
        <legend className="fieldset-legend">Manage Coupon</legend>
        <div className="join">
          <input
            type="text"
            className="input join-item uppercase"
            placeholder="Enter 8-character coupon"
            value={coupon}
            onChange={handleCouponChange}
            maxLength={8}
          />
          <input
            type="number"
            className="input join-item"
            placeholder="Discount %"
            value={discount}
            onChange={handleDiscountChange}
            min="1"
            max="100"
          />
          <button className="btn join-item" onClick={handleSaveCoupon} disabled={coupon.length !== 8 || !discount || discount < 1 || discount > 100}>
            Save
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </fieldset>
    </div>
  );
}
