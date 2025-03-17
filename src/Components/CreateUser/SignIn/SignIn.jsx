import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useNavigationWithLoader from "../../../Hooks/useNavigationWithLoader";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../Hooks/useAuth";
import useImageUpload from "../../../Hooks/useImageUpload";
import usePublic from "../../../Hooks/usePublic";
import toast from "react-hot-toast";
import ScrollToTop from "../../Design/Scroll/ScrollTop";
import { Helmet } from "react-helmet-async";

export default function SignIn() {
    const { handleNavigation } = useNavigationWithLoader(); // Custom hook
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm(); // React Hook Form
    const { updateUserProfile, createUser, loading } = useAuth();
    const { uploadImage, uploading } = useImageUpload(); // Using the hook
    const nav = useNavigate();
    const axiosPublic = usePublic();

    const onSubmit = async (data) => {
        if (!data.profileImage[0]) {
            return; // Validation is handled by react-hook-form
        }

        try {
            // Upload image using the hook
            const profileImageUrl = await uploadImage(data.profileImage[0]);

            if (!profileImageUrl) {
                throw new Error("Failed to upload profile image.");
            }

            // Check if email already exists in Firebase
            try {
                await createUser(data.email, data.password);
            } catch (firebaseError) {
                if (firebaseError.code === "auth/email-already-in-use") {
                    throw new Error("Email already used in Firebase.");
                }
                throw firebaseError;
            }

            // Update user profile with username & uploaded profile image URL
            await updateUserProfile(data.username, profileImageUrl);

            // Store user info in MongoDB via API
            const userInfo = {
                username: data.username,
                email: data.email,
                password: data.password,
                role: "user",
                isActive: true,
                isAdmin: false,
                profileImage: profileImageUrl,
                createdAt: new Date().toISOString(),
            };

            const response = await axiosPublic.post("/api/users", userInfo);
     

            if (response.data.success) {
                toast.success('Account Created Succeed')
                nav("/"); // Redirect to dashboard
            } else {
                throw new Error(response.data.error || "Failed to save user information in database.");
            }
        } catch (error) {
            console.error("Error:", error);
            throw error; // Let react-hook-form handle the error
        }
    };

    return (
        <div className="flex min-h-screen text-black bg-gray-100">
            <Helmet>
                <title>SignUp || E-commerce Store</title>
            </Helmet>
            <ScrollToTop />
            {/* Left Side (Image) */}
            <div className="hidden lg:flex items-center justify-center flex-1 bg-white">
                <div className="max-w-md text-center">
                    <img
                        src="https://res.cloudinary.com/dbuvwq6ns/image/upload/v1739563734/Untitled_design__5_-removebg-preview_owbl3w.png"
                        alt="Sign Up"
                        className="w-full h-auto"
                    />
                </div>
            </div>

            {/* Right Side (Form) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-semibold mb-2 text-black text-center">Create Account</h1>
                    <h1 className="text-sm font-medium mb-6 text-gray-500 dark:text-black text-center">
                        Join our community with full-time access and for free!
                    </h1>

                    {/* Social Login */}
                    <SocialLogin />

                    <div className="mt-4 text-sm text-gray-600 dark:text-black  text-center">
                        <p>or sign up with email</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block dark:text-black  text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                {...register("username", { required: "Username is required" })}
                                className="mt-1 dark:text-black  p-2 w-full border dark:bg-[#F9FAFB] rounded-md focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address",
                                    },
                                })}
                                className="mt-1 dark:text-black  p-2 w-full dark:bg-[#F9FAFB] border rounded-md focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm dark:text-black  font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                                        message:
                                            "Weak password! Use at least 6 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
                                    },
                                })}
                                className="mt-1 dark:text-black  dark:bg-[#F9FAFB] p-2 w-full border rounded-md focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Profile Image Upload */}
                        <div>
                            <label className="block text-sm font-medium dark:text-black  text-gray-700">Profile Image</label>
                            <input
                                type="file"
                                {...register("profileImage", { required: "Profile image is required" })}
                                className="mt-1 p-2 dark:text-black  dark:bg-[#F9FAFB] w-full border rounded-md focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
                            />
                            {errors.profileImage && (
                                <p className="text-red-500 text-xs mt-1">{errors.profileImage.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || uploading}
                            className="w-full bg-black dark:text-black  text-white p-2 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 transition   duration-300 flex items-center justify-center"
                        >
                            {isSubmitting || uploading ? (
                                <>
                                    <AiOutlineLoading3Quarters className="animate-spin dark:text-black  mr-2" />
                                    Processing...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-4 text-sm dark:text-black  text-gray-600 text-center">
                        <p>
                            Already have an account?{" "}
                            <NavLink
                                to="/signin"
                                onClick={() => handleNavigation("/signin")}
                                className="text-black hover:underline"
                            >
                                Click Here
                            </NavLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}