import { CiCircleCheck, CiDeliveryTruck, CiFacebook, CiInstagram, CiLinkedin, CiTwitter } from "react-icons/ci";
import Features from "../Features/Features";
import { SiAudiobookshelf } from "react-icons/si";
import { FcSalesPerformance } from "react-icons/fc";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoGiftOutline } from "react-icons/io5";
import { SiMoneygram } from "react-icons/si";
import { useState } from "react";
import ScrollToTop from "../Scroll/ScrollTop";

const users = [
    // Design Users
    { id: 1, name: "Arthur Melo", role: "Design Director", category: "design", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" },
    { id: 2, name: "Emily Johnson", role: "UI/UX Designer", category: "design", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" },
    { id: 3, name: "Michael Brown", role: "Graphic Designer", category: "design", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" },
  
    // Development Users
    { id: 4, name: "John Doe", role: "Development Lead", category: "development", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" },
    { id: 5, name: "Sarah Lee", role: "Frontend Developer", category: "development", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" },
    { id: 6, name: "David Smith", role: "Backend Developer", category: "development", image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" },
  
    // Marketing Users
    { id: 7, name: "Jane Smith", role: "Marketing Manager", category: "marketing", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" },
    { id: 8, name: "Laura Wilson", role: "SEO Specialist", category: "marketing", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" },
    { id: 9, name: "Chris Evans", role: "Content Strategist", category: "marketing", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" },
  ];
export default function AboutUs() {
    const [activeTab, setActiveTab] = useState('design');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 3;
  
    const filteredUsers = users.filter(user => user.category === activeTab);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    return (
        <div className="space-y-10 barlow text-black">
               <ScrollToTop/>
            <div className="lg:flex">
                <div className="flex items-center justify-center w-full px-6 py-8 lg:h-[32rem] lg:w-1/2">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-semibold text-gray-800 dark:text-black lg:text-4xl">
                            Build Your New <span className="text-green-600 dark:text-blue-400">Idea</span>
                        </h2>
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 lg:text-base">
                            Launced in 2015, Exclusive is South Asia’s premier online shopping makterplace with an active presense in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands and serves 3 millioons customers across the region.                         </p>
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 lg:text-base">
                            Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assotment in categories ranging  from consumer.                        </p>
                        <div className="flex flex-col mt-6 space-y-3 lg:space-y-0 lg:flex-row">
                            <a
                                href="#"
                                className="block px-5 py-2 text-sm font-medium tracking-wider text-center text-white transition-colors duration-300 transform bg-green-400 rounded-md dark:text-white dark:bg-black  hover:bg-gray-700"
                            >
                                Get Started
                            </a>
                            <a
                                href="#"
                                className="block px-5 py-2 text-sm font-medium tracking-wider text-center text-gray-700 transition-colors duration-300 transform bg-gray-200  dark:text-white dark:bg-black rounded-md lg:mx-4 hover:bg-gray-300"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>

                {/* Fixing Image Background */}
                <div
                    className="w-full h-64 lg:w-1/2 lg:h-[32rem] bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://media.istockphoto.com/id/2061836383/photo/items-purchased-through-online-shopping-are-delivered-3d-rendering.jpg?s=612x612&w=0&k=20&c=1utqkVmKKMtM6W-JqtHL6vfhna5ROaGG5qj_MxRZ5yk=')",
                    }}
                >
                    <div className="w-full h-full bg-black opacity-25"></div>
                </div>
            </div>
            <div className="container px-6  mx-auto">


                <div className="grid grid-cols-2 gap-8 mt-8 xl:mt-12 xl:gap-16 md:grid-cols-2 xl:grid-cols-4">
                    <div className="flex flex-col items-center p-6 border space-y-3 text-center  rounded-xl dark:bg-gray-800">
                        <span className="inline-block text-5xl p-3 text-white bg-black dark:text-white dark:bg-black  rounded-full">

                            <FcSalesPerformance />
                        </span>

                        <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">10.5k </h1>

                        <p className="text-gray-500 dark:text-gray-300">
                            Sallers active our site
                        </p>

                    </div>

                    <div className="flex flex-col items-center  border p-6 space-y-3 text-center  rounded-xl dark:bg-gray-800">
                        <span className="inline-block text-5xl p-3  dark:text-white dark:bg-black  text-white bg-black  rounded-full ">
                            <RiMoneyDollarCircleLine />
                        </span>

                        <h1 className="text-xl font-semibold text-black capitalize dark:text-white">33K</h1>

                        <p className="text-gray-500 dark:text-gray-300">
                            Mopnthly Produduct Sale
                        </p>

                    </div>

                    <div className="flex flex-col items-center  border p-6 space-y-3 text-center  rounded-xl dark:bg-gray-800">
                        <span className="inline-block p-3 text-5xl  dark:text-white dark:bg-black  text-white bg-black rounded-full ">
                            <IoGiftOutline />
                        </span>

                        <h1 className="text-xl font-semibold text-black capitalize dark:text-white">40.4K</h1>

                        <p className="text-gray-500 dark:text-gray-300">
                            Customer active in our site
                        </p>


                    </div>
                    <div className="flex flex-col items-center  border p-6 space-y-3 text-center  rounded-xl dark:bg-gray-800">
                        <span className="inline-block p-3 text-5xl text-white bg-black rounded-full  dark:text-white dark:bg-black ">
                            <SiMoneygram />
                        </span>

                        <h1 className="text-xl font-semibold text-black capitalize dark:text-white">25K</h1>

                        <p className="text-gray-500 dark:text-gray-300">
                            Anual gross sale in our site
                        </p>


                    </div>
                </div>
            </div>
            <section className="bg-white dark:text-black">
        <div className="container px-6 py-10 mx-auto">
          <div className="flex items-center justify-center">
            <div className="flex items-center p-1 border border-red-600 dark:border-blue-400 rounded-xl">
              <button 
                onClick={() => { setActiveTab('design'); setCurrentPage(1); }} 
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'design' ? 'text-white bg-green-600  dark:text-white dark:bg-black ' : 'text-blue-600  dark:text-black hover:bg-yellow-600 hover:text-white   '} capitalize md:py-3     rounded-xl md:px-12`}
              >
                Design
              </button>
              <button 
                onClick={() => { setActiveTab('development'); setCurrentPage(1); }} 
                className={`px-4 py-2 mx-4 text-sm font-medium ${activeTab === 'development' ? 'text-white bg-green-600 dark:text-white dark:bg-black'  : 'text-blue-600 dark:text-black hover:bg-yellow-600 hover:text-white'} capitalize md:py-3 rounded-xl md:mx-8 md:px-12`}
              >
                Development
              </button>
              <button 
                onClick={() => { setActiveTab('marketing'); setCurrentPage(1); }} 
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'marketing' ? 'text-white bg-green-600 dark:text-white dark:bg-black' : 'text-blue-600 dark:text-black hover:bg-yellow-600 hover:text-white'} capitalize md:py-3 rounded-xl md:px-12`}
              >
                Marketing
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-3">
            {currentUsers.length > 0 ? (
              currentUsers.map(user => (
                <div key={user.id} className="flex flex-col items-start">
                  <img className="object-cover w-full aspect-square" src={user.image} alt={user.name} />
                  <h1 className="mt-4 text-2xl font-semibold text-gray-700 capitalize dark:text-white">{user.name}</h1>
                  <p className="mt-2 text-gray-500 capitalize dark:text-gray-300">{user.role}</p>
                  <div className="flex mt-3 -mx-2">
                    <a href="#" className="mx-2 text-gray-600 transition-colors duration-300 dark:text-black hover:text-blue-500 dark:hover:text-blue-400" aria-label="Instagram">
                      <CiInstagram/>
                    </a>
                    <a href="#" className="mx-2 text-gray-600 transition-colors duration-300 dark:text-black hover:text-blue-500 dark:hover:text-blue-400" aria-label="Twitter">
                      <CiTwitter/>
                    </a>
                    <a href="#" className="mx-2 text-gray-600 transition-colors duration-300 dark:text-black hover:text-blue-500 dark:hover:text-blue-400" aria-label="LinkedIn">
                      <CiLinkedin/>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-300">No users found in this category.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-4 py-2 text-sm font-medium ${currentPage === i + 1 ? 'text-white bg-green-600' : 'text-blue-600 hover:bg-blue-600 hover:text-white'} rounded-md`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </section>
            <Features icon1={<CiDeliveryTruck />} title1={'FREE AND FAST DELIVERY'} details1={'Free delivery for all orders over $140'} icon2={<SiAudiobookshelf />} title2={'24/7 CUSTOMER SERVICE'} details2={'Friendly 24/7 customer support'} icon3={<CiCircleCheck />} title3={'MONEY BACK GUARANTEE'} details3={'We reurn money within 30 days'} />
        </div>

    );
}
