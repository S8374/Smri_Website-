import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import useSecure from "../../../Hooks/useSequre";
import { UseUsers } from "../../../Hooks/users/useUsers";
import toast, { Toaster } from "react-hot-toast";

export default function UserProfile() {
  const { user, updateUserEmail, updateUserPassword } = useAuth() || {};
  const axiosSecure = useSecure();
  const [userDetails] = UseUsers();
  const userDetail = userDetails.find((u) => u.email === user?.email);

  const [formData, setFormData] = useState({
    firstName: userDetail?.firstName || "",
    lastName: userDetail?.lastName || "",
    email: user?.email || "",
    address: userDetail?.address || "",
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  useEffect(() => {
    if (userDetail) {
      setFormData({
        firstName: userDetail.firstName || "",
        lastName: userDetail.lastName || "",
        email: userDetail.email || "",
        address: userDetail.address || "",
        newEmail: "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [userDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === "confirmNewPassword" || name === "newPassword") {
        if (updatedData.newPassword && updatedData.confirmNewPassword && updatedData.newPassword !== updatedData.confirmNewPassword) {
          setPasswordError("Passwords do not match");
        } else {
          setPasswordError("");
        }
      }

      return updatedData;
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      if (formData.newEmail) {
        const emailUpdateResult = await updateUserEmail(formData.newEmail, formData.currentPassword);
        if (!emailUpdateResult.success) {
          toast.error(emailUpdateResult.message);
          return;
        }
        toast.success("Email updated successfully!");
      }

      if (formData.newPassword) {
        const passwordUpdateResult = await updateUserPassword(formData.newPassword, formData.currentPassword);
        if (!passwordUpdateResult.success) {
          toast.error(passwordUpdateResult.message);
          return;
        }
        toast.success("Password updated successfully!");
      }

      const res = await axiosSecure.patch("/api/users", formData);
  
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <form onSubmit={handleUpdateProfile} className="max-w-lg mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg">
      <Toaster />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          name="email"
          value={formData.email || user?.email || ""}
          readOnly
          className="input input-bordered w-full bg-gray-200 cursor-not-allowed"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4">
        <input
          type="text"
          name="newEmail"
          placeholder="New Email"
          value={formData.newEmail}
          onChange={handleChange}
          className="input input-bordered w-full"
        />

        {["currentPassword", "newPassword", "confirmNewPassword"].map((field) => (
          <div key={field} className="relative">
            <input
              type={showPasswords[field] ? "text" : "password"}
              name={field}
              placeholder={
                field === "currentPassword"
                  ? "Current Password"
                  : field === "newPassword"
                  ? "New Password"
                  : "Confirm New Password"
              }
              value={formData[field]}
              onChange={handleChange}
              className="input input-bordered w-full pr-10"
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
              onClick={() => togglePasswordVisibility(field)}
            >
              {showPasswords[field] ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        ))}
      </div>

      {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}

      <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
        <button type="submit" className="px-6 py-2 bg-red-400 hover:shadow-lg cursor-pointer text-white rounded-md">
          Update Profile
        </button>
        <button type="button" className="px-6 py-2 bg-gray-400 hover:shadow-lg cursor-pointer text-white rounded-md">
          Cancel
        </button>
      </div>
    </form>
  );
}