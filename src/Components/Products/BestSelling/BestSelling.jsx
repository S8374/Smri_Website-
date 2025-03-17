import { CiHeart } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";

export default function BestSelling() {
    return (
        <div className="bg-white shadow-md rounded-lg w-full mx-auto p-5">
            {/* Title Section */}
            <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-red-500"></div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Today's</h1>
            </div>

            {/* Flash Sale Section */}
            <div className="flex flex-col lg:flex-row justify-between items-center mt-3 gap-5">
                <div className="flex justify-center items-center lg:items-start gap-3">
                    <h2 className="text-xl md:text-2xl font-semibold text-red-500">Flash Sales</h2>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3 text-gray-700 text-3xl cursor-pointer">
                    <button>View All</button>
                </div>
            </div>

            {/* Product Card Grid - Centered */}
            <div className="mt-8 w-full flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 p-2">
                    {Array.from({ length: 10 }).slice(0, 5).map((_, index) => ( // ✅ Corrected slicing
                        <div key={index} className="w-52 bg-gray-50 flex-shrink-0 rounded-t-lg shadow-md p-3 transition-transform transform hover:scale-105 relative">
                            {/* Image Container */}
                            <div
                                className="h-48 bg-gray-700 rounded-t-lg bg-cover bg-center relative"
                                style={{
                                    backgroundImage:
                                        'url(https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1yYYnN.img?w=612&h=304&q=60&m=6&f=jpg&u=t)',
                                }}
                            >
                                {/* Hover Content */}
                                <div className="absolute inset-0 flex flex-col justify-between items-center px-3 py-2  bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    {/* Top Section: "40%" and icons */}
                                    <div className="flex justify-between w-full items-center">
                                        <h1 className=" "></h1>
                                        <div className="space-y-2">
                                            <CiHeart className="text-2xl p-1 cursor-pointer bg-white rounded-full" />
                                            <IoEyeOutline className="text-2xl cursor-pointer p-1 bg-white rounded-full" />
                                        </div>
                                    </div>

                                   
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col mt-3 ">
                                <span className="text-xl font-bold">Long Chair</span>
                                <p className="text-xs text-gray-700">ID: 23432252</p>
                                <span className="font-bold text-red-600 line-through">$25.99</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
