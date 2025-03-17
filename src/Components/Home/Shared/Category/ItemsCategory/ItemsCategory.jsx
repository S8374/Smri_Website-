import { useState, useRef } from "react";
import { FaShapes } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import UseProducts from "../../../../../Hooks/useProducts";

export default function ItemsCategory({ selectedCategory, setSelectedCategory }) {
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [productList, isLoading, refetch] = UseProducts();

    // Extract unique categories and subcategories
    const categories = [...new Set(productList.map(product => product.category))];
    const subcategories = [...new Set(productList.map(product => product.subcategory))];

    // Handle category selection
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    // Mouse Dragging Handlers
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Adjust scroll speed here
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Arrow Navigation
    const scrollLeftHandler = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -220, behavior: "smooth" });
        }
    };

    const scrollRightHandler = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 220, behavior: "smooth" });
        }
    };

    return (
        <div className="bg-white shadow-md barlow rounded-lg text-black w-full mx-auto p-5">
            {/* Title Section */}
            <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-green-500"></div>
                <h1 className="text-2xl md:text-3xl font-bold text-black">Browse By Category</h1>
            </div>

            {/* Category Navigation Buttons */}
            <div className="flex flex-row lg:flex-row justify-between items-center mt-3 gap-5">
                <div className="flex justify-center items-center lg:items-start gap-3">
                    <h2 className="text-xl md:text-2xl font-semibold text-red-500">Categories</h2>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3 text-gray-700 text-3xl cursor-pointer">
                    <IoIosArrowBack onClick={scrollLeftHandler} className="hover:text-red-500 transition" />
                    <IoIosArrowForward onClick={scrollRightHandler} className="hover:text-red-500 transition" />
                </div>
            </div>

            {/* Category Slider */}
            <div
                ref={sliderRef}
                className="overflow-hidden mt-8 relative w-full mx-auto flex gap-5 p-2"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
                onMouseUp={handleMouseUp}
                style={{
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    scrollbarWidth: "none",
                    display: "flex",
                    whiteSpace: "nowrap",
                }}
            >
                {/* All Category */}
                <div
                    onClick={() => handleCategoryClick('All')}
                    className={`cursor-pointer flex text-lg sm:text-xl  flex-col justify-center items-center h-36 lg:h-52 w-56 bg-white rounded-lg shadow-lg   transition-transform transform duration-300 ${selectedCategory === 'All' ? "text-green-400  border dark:text-[#FFDFA9]" : "text-black "
                        }`}
                >

                    <h1 className="px-2">All Categories</h1>
                </div>

                {/* Other Categories */}
                {categories.map((category, index) => (
                    <div
                        key={index}
                        onClick={() => handleCategoryClick(category)}
                        className={`cursor-pointer text-lg sm:text-xl flex flex-col justify-center items-center h-36 lg:h-52 w-56 bg-white rounded-lg shadow-lg transition-transform transform duration-300 ${selectedCategory === category ? "text-green-400 border dark:text-[#FFDFA9]" : "text-gray-700"
                            }`}
                    >

                        <h1 className="px-2">{category}</h1>
                    </div>
                ))}
            </div>
        </div>
    );
}