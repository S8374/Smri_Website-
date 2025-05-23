import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { BsMessenger } from "react-icons/bs";
import Header from "../Components/Home/Shared/Header/Header";
import Footer from "../Components/Footer/Footer";
import ChatBox from "../Components/ChatBox/Chat/ChatBox";
import SubHeader from "../Components/Home/Shared/SubHeader/SubHeader";
import { Helmet } from "react-helmet-async";
import useAuth from "../Hooks/useAuth";
import Modal from "../Components/Design/modal/modal";

export default function Root() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    // Set a timer to check user authentication every 1 minute
    const interval = setInterval(() => {
      if (!user) {
        setShowLoginModal(true); // Show login modal if user is not authenticated
      }
    }, 60000); // 1 minute = 60,000 milliseconds

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [user]);

  const handleCloseLoginModal = () => {
    setShowLoginModal(false); // Close the login modal
  };

  return (
    <div className=" mx-auto bg-white relative" >
      {/* SEO Optimization */}
      <Helmet>
        <title>Smri Shop - Best Online Store for Fashion & Accessories</title>
        <meta
          name="description"
          content="Shop the best fashion deals online. Get 50% off on all swimsuits and enjoy free express delivery. Limited time offer!"
        />
        <meta
          name="keywords"
          content="fashion, online shopping, swimsuits, discount sale, best deals"
        />
        <meta name="author" content="Smri Shop" />
        <meta property="og:title" content="Smri Shop - Best Online Store" />
        <meta
          property="og:description"
          content="Get the latest fashion trends with massive discounts. Free express shipping available!"
        />
        <meta property="og:image" content="https://yourwebsite.com/og-image.jpg" />
        <meta property="og:url" content="https://yourwebsite.com/" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourwebsite.com/" />
      </Helmet>

      {/* Top Announcement Banner */}
      <div className="flex flex-col md:flex-row justify-between barlow items-center text-sm bg-black text-white px-4 py-2">
        <div className="hidden md:block"></div>

        <div className="text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <h1 className="text-base md:text-lg font-semibold">
              Summer Sale For All Swim Suits & Free Express Delivery - OFF 50%!
            </h1>
            <button
              onClick={() =>
                document.getElementById("flash-sale-section")?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-green-500 hover:opacity-80 cursor-pointer text-white font-bold px-4 py-1 rounded-md transition"
            >
              Shop Now!
            </button>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mt-2 md:mt-0">
          <label htmlFor="language-select" className="sr-only">
            Choose a language
          </label>
          <select
            id="language-select"
            defaultValue="Pick a Language"
            className="select select-ghost bg-black text-white px-3 py-1 rounded-md"
          >
            <option disabled>Pick a Language</option>
            <option>English</option>
          </select>
        </div>
      </div>

      {/* Navigation Components */}
      <Header />
      <SubHeader />
      <Outlet />
      <Footer />

      {/* Messenger Icon */}
      <div className="fixed bottom-10 right-10 z-50">
        <button
          onClick={toggleChat}
          aria-label="Open Messenger Chat"
          className="bg-blue-600 dark:bg-black dark:border-black text-white p-3 rounded-full shadow-lg hover:scale-110 transition"
        >
          <BsMessenger size={28} />
        </button>
      </div>

      {/* Chat Modal */}
      {isChatOpen && <ChatBox toggleChat={toggleChat} />}

      {/* Login Modal */}
      {showLoginModal && (
        <Modal onClose={handleCloseLoginModal}>
          <div className="text-center text-black p-6">
            <h2 className="text-2xl text-black font-semibold mb-4">Please Log In</h2>
            <p className="text-black mb-6">
              To access more features and services, please log in to your account.
            </p>
            <button
              onClick={() => {
                handleCloseLoginModal(); // Close the modal
              }}
              className="px-6 py-2 bg-blue-500 text-white dark:bg-black dark:text-white rounded-lg hover:bg-blue-600 transition"
            >
              ok
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}