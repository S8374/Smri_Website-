import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { IoIosArrowForward } from "react-icons/io";
import UseProducts from "../../../../../Hooks/useProducts";

export default function SideBarCategory({ setSelectedCategory }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedCategory, setSelected] = useState("All"); // Default selected category
    const [productList, isLoading, refetch] = UseProducts();

    // Extract categories dynamically
    const categories = [...new Set(productList.map(product => product.category))];

    // Function to get subcategories based on the selected category
    const getSubcategories = (category) => {
        return [...new Set(productList.filter(product => product.category === category).map(product => product.subcategory))];
    };

    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSelect = (category) => {
        setSelected(category);  // Update local state
        setSelectedCategory(category);  // Update parent state
    };

    return (
        <div className=" relative h-[300px] text-black sm:h-[500px] flex">
            <div className={`h-full ${isCollapsed ? "w-0 overflow-hidden" : "w-64"}`}>
                <Sidebar className="h-full bg-white text-lg shadow-md barlow">
                    <Menu className="h-full overflow-y-auto max-h-[500px]">
                        <MenuItem 
                            onClick={() => handleSelect("All")} 
                            className={selectedCategory === "All" ? "text-[#00bf63]" : ""}
                        >
                            All Categories
                        </MenuItem>
                        
                        {categories.map((category, index) => (
                            <SubMenu
                                key={index}
                                label={category}
                                className={selectedCategory === category ? "text-[#00bf63]" : ""}
                            >
                                {getSubcategories(category).map((subcategory, subIndex) => (
                                    <MenuItem
                                        key={subIndex}
                                        onClick={() => handleSelect(subcategory)}
                                        className={selectedCategory === subcategory ? "text-[#00bf63]" : ""}
                                    >
                                        {subcategory}
                                    </MenuItem>
                                ))}
                            </SubMenu>
                        ))}
                    </Menu>
                </Sidebar>
            </div>

            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`absolute z-10 top-5 text-4xl lg:hidden ${isCollapsed ? "left-2 rotate-180" : "left-64"}`}
            >
                <IoIosArrowForward />
            </button>
        </div>
    );
}