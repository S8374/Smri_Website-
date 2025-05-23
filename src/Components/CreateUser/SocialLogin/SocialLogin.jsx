import { FaGoogle } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import usePublic from "../../../Hooks/usePublic";

export default function SocialLogin() {
    const { signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const axiosPublic = usePublic();
    const handleGoogleLogin = () => {
        signInWithGoogle()
            .then(result => {
       
                const userInfo = {
                    username: result?.user?.displayName,
                    email: result.user.email,
                    password: '',
                    role: "user",
                    isActive: true,
                    isAdmin: false,
                    profileImage: result?.user?.photoURL,
                    createdAt: new Date().toISOString(),
                    login: 'social'
                };
                const response = axiosPublic.post("/api/users", userInfo);
              

                if (response) {
                    toast.success('Account Created Succeed')
                    navigate("/"); // Redirect to dashboard
                } else {
                    throw new Error(response.data.error || "Failed to save user information in database.");
                }
            })
            .catch(error => {
                toast.error("Google login failed!");
                // console.error("Google login error:", error);
            });
    };
    return (
        <div className="mt-4 flex flex-col lg:flex-row dark:text-black   items-center justify-between gap-3">
            {/* Google Button */}
            <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full  flex justify-center items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold 
                py-3 rounded-lg shadow-lg hover:from-red-600 dark:text-white dark:bg-black  hover:to-red-700 transform hover:scale-105 transition-all duration-300">
                <FaGoogle className="text-lg " /> Continue with Google
            </button>
        </div>
    );
}
