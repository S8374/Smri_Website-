import { NavLink, useNavigate } from "react-router-dom";
import useNavigationWithLoader from "../../../Hooks/useNavigationWithLoader";
import Loader from "../../Loader/Loader";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../Hooks/useAuth";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";  // Loading spinner icon
import toast from "react-hot-toast";
import ScrollToTop from "../../Design/Scroll/ScrollTop";
import { Helmet } from "react-helmet-async";

export default function Register() {
    const { loading, handleNavigation } = useNavigationWithLoader(); // Use the hook
    const { signIn } = useAuth();  // Assume signIn function is available in useAuth
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);  // Track submit status

    // Handle the form submission for login
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        setIsSubmitting(true);  // Start loading

        try {
            // Trigger the login process with the email and password
            await signIn(email, password);

            // Redirect to a different page after successful login (e.g., dashboard or home)
            navigate("/");
            toast.success('Login Succeed')
        } catch (error) {
            // Handle login error (e.g., show an error message)
            // console.error("Login failed", error);
        } finally {
            setIsSubmitting(false);  // Stop loading
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="flex h-screen">
               <Helmet>
                            <title>Login || E-commerce Store</title>
                        </Helmet>
             <ScrollToTop/>
            <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
                <div className="max-w-md text-center">
                    <img src="https://res.cloudinary.com/dbuvwq6ns/image/upload/v1739564251/Untitled_design__4_-removebg-preview_q0hya6.png" alt="Logo" />
                </div>
            </div>

            <div className="w-full bg-gray-100 text-black lg:w-1/2 flex items-center justify-center">
                <div className="max-w-md w-full p-6">
                    <h1 className="text-3xl font-semibold mb-6 text-black text-center">Login Now</h1>

                    <h1 className="text-sm font-semibold mb-6 dark:text-black  text-gray-500 text-center">Join our Community with lifetime access</h1>
                    <SocialLogin />
                    <div className="mt-4 text-sm text-gray-600 dark:text-black  text-center">
                        <p>or log in with email</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label htmlFor="email" className="block dark:text-black  text-sm font-medium text-gray-700">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required 
                                className="mt-1 dark:text-black  dark:bg-[#F9FAFB] p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" 
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                required 
                                className="mt-1 dark:bg-[#F9FAFB] p-2 w-full border rounded-md focus:border-gray-200 dark:text-black  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" 
                            />
                        </div>
                        <div>
                            <button 
                                type="submit" 
                                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                                disabled={isSubmitting}  // Disable button while submitting
                            >
                                {isSubmitting ? (
                                    <AiOutlineLoading3Quarters className="animate-spin dark:text-black text-white mx-auto" size={24} />
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 text-sm  text-black text-center">
                        <p>Don't have an account? <NavLink to={'/signup'} onClick={() => handleNavigation('/signup')} className="text-black hover:underline">Sign up here</NavLink></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
