import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import useSecure from "../../../Hooks/useSequre";
import { UseUsers } from "../../../Hooks/users/useUsers";

export default function UserProfile() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logOut, user } = useAuth();
  const axiosSecure = useSecure();
  const [userDetails, isLoading, refreshUser] = UseUsers();
  const nav = useNavigate();
  // Extract user details safely
  const currentUser = userDetails?.[0] || {};
  const { role, statusRequest } = currentUser;

  const handelRequest = () => {
    if (statusRequest === "want seller") {
      Swal.fire({
        title: "Request Pending",
        text: "Your request has already been submitted, please wait.",
        icon: "info",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You want to request a seller role!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch("/api/users", {
            email: user.email,
            statusRequest: "want seller",
          })
          .then((res) => {
            Swal.fire({
              title: "Success!",
              text: "Your request has been successfully submitted to the admin.",
              icon: "success",
            });
            refreshUser(); // Refresh user details after request submission
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: "Failed to submit your request. Please try again.",
              icon: "error",
            });
          });
      }
    });
  };
  const handelLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logOut();
      nav();
    }
  };
  return (
    <div>
      <div className="relative text-black">
        <div
          className="cursor-pointer flex items-center gap-2"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <img
            src={user.photoURL || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-6 h-6 rounded-full border"
          />
        </div>
        {isProfileOpen && (
          <ul className="absolute right-0 mt-2 w-48 barlow capitalize text-lg bg-white shadow-md rounded-lg p-2 z-50">
            <li className="p-2 text-black hover:bg-gray-100">
              <NavLink to="/setting">Manage My Account</NavLink>
            </li>
            <li className="p-2 text-black hover:bg-gray-100">
              <NavLink to="/myOrder">My Order</NavLink>
            </li>

            {/* Hide request option if user is already a seller */}
            {role !== "seller" && role !== "admin" && (
              <li
                onClick={handelRequest}
                className="p-2 text-black hover:bg-gray-100"
              >
                <NavLink>Request for seller</NavLink>
              </li>
            )}

            {(role === "admin" || role === "seller") && (
              <li className="p-2 text-black hover:bg-gray-100">
                <NavLink to="/dashboard">Go Dashboard</NavLink>
              </li>
            )}

            <li className="p-2  hover:bg-gray-100 text-red-500">
              <button onClick={handelLogout}>Logout</button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
