import { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, NavLink } from 'react-router-dom';
import { IoEyeOutline } from 'react-icons/io5';
import { FaTimesCircle } from 'react-icons/fa';
import { Rating } from '@smastrom/react-rating';
import { Pagination } from '@mui/material';
import UseProducts from '../../../Hooks/useProducts';
import Love from '../../IconFuntions/Love/Love';
import usePublic from '../../../Hooks/usePublic';
import toast from 'react-hot-toast';
import useAuth from '../../../Hooks/useAuth';
import { UseCart } from '../../../Hooks/cart/useCart';
import ScrollToTop from '../../Design/Scroll/ScrollTop';
export default function AllProduct() {
    const [productList, isLoading] = UseProducts();
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [sortBy, setSortBy] = useState('popularity');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [searchSuggestions, setSearchSuggestions] = useState([]); // State for search suggestions
    const axiosPublic = usePublic();
    const { user } = useAuth();
    const [userItems, refetch] = UseCart();
    const categories = [...new Set(productList.map(product => product.category))];
    const subcategories = [...new Set(productList.map(product => product.subcategory))];

    // Generate search suggestions based on the search query
    useEffect(() => {
        if (searchQuery) {
            const suggestions = productList
                .filter(product =>
                    product.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(product => product.title)
                .slice(0, 5); // Show only top 5 suggestions
            setSearchSuggestions(suggestions);
        } else {
            setSearchSuggestions([]); // Clear suggestions if search query is empty
        }
    }, [searchQuery, productList]);

    const filteredProducts = productList
        .filter(product =>
            (selectedCategory ? product.category === selectedCategory : true) &&
            (selectedSubcategory ? product.subcategory === selectedSubcategory : true) &&
            (product.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (product.price >= priceRange[0] && product.price <= priceRange[1])
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'rating': return (b.review[0]?.rating || 0) - (a.review[0]?.rating || 0);
                case 'latest': return new Date(b.createdAt) - new Date(a.createdAt);
                case 'priceLowToHigh': return a.price - b.price;
                case 'priceHighToLow': return b.price - a.price;
                default: return b.popularity - a.popularity;
            }
        });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedSubcategory(null);
    };

    const handleSubcategoryClick = (subcategory) => {
        setSelectedSubcategory(subcategory);
    };

    // const handleWishlistToggle = (productId) => {
    //     setWishlist(prev =>
    //         prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    //     );
    // };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion); // Set the search query to the clicked suggestion
        setSearchSuggestions([]); // Clear suggestions
    };
    const guestId = localStorage.getItem('guestId');
    const handleAddToCart = (product) => {
        const cartItems = {
            title: product.title,
            Discount_price: product.discount_price,
            quantity: 1,
            image: product.images[0],
            price: product.price,
            Product_id: product._id,
            user_Email: user?.email,
            user_Uid: user?.uid || guestId,
            created_Email: product.created_Email,
            created_Uid: product.createdBy,
        };

        axiosPublic
            .post(`/api/cartItems`, cartItems)
            .then(() => {
                toast.success("Item added to cart successfully");
                refetch()
            })
            .catch((error) => {
                toast.error(error.response?.status === 400 ? "Item already added to cart" : "Failed to add item to cart");
            });
    };
    const calculateStarRating = (reviews) => {
        const totalReviews = reviews.length;
        if (totalReviews === 1) return 1;
        if (totalReviews >= 2 && totalReviews <= 3) return 2;
        if (totalReviews >= 4 && totalReviews <= 6) return 4;
        if (totalReviews >= 7) return 5;
        return 0;
    };

    return (
        <div className="container text-black barlow mx-auto px-4 py-6">
            <ScrollToTop />
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-gray-700 to-gray-500 text-black p-8 rounded-lg shadow-md">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl text-white dark:text-black font-bold leading-tight">
                        Shop and <br />
                        <span className="text-yellow-300 dark:text-black">Save Big on Hottest</span> Products
                    </h1>
                </div>
                <div className="text-center md:text-right mt-4 md:mt-0">
                    <h2 className="text-lg text-white dark:text-black ">Discover our latest and greatest products</h2>
                    <button onClick={() =>
                        document.getElementById("allProducts")?.scrollIntoView({ behavior: "smooth" })
                    } className="mt-3 bg-yellow-400 dark:bg-black dark:text-white hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg transition-all duration-300">
                        Shop Now
                    </button>
                </div>
            </div>

            {/* Filter and Sorting Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
                <div className='flex items-center gap-4 w-full md:w-auto'>
                    <h1 className="text-sm md:text-lg font-semibold">Showing results</h1>
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="input input-bordered w-full px-4 py-2 rounded-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <FaTimesCircle
                                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                                onClick={() => setSearchQuery('')}
                            />
                        )}
                        {/* Search Suggestions Dropdown */}
                        {searchSuggestions.length > 0 && (
                            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                                {searchSuggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mt-4 md:mt-0 w-full md:w-auto">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <span className="font-medium">Show:</span>
                        <select
                            className="select select-bordered w-full md:w-32 px-3 py-2 rounded-md"
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        >
                            <option value={12}>All</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <span className="font-medium">Sort by:</span>
                        <select
                            className="select select-bordered w-full md:w-48 px-3 py-2 rounded-md"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="popularity">Sort by Popularity</option>
                            <option value="rating">Sort by Average Rating</option>
                            <option value="latest">Sort by Latest</option>
                            <option value="priceLowToHigh">Sort by Price (Low to High)</option>
                            <option value="priceHighToLow">Sort by Price (High to Low)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row justify-between items-start mt-8">
                {/* Sidebar */}
                <div className="w-full md:w-1/4 bg-white shadow-md rounded-lg p-4 transition-transform duration-300">
                    <Sidebar className='w-36 lg:w-full'>
                        <Menu>
                            <MenuItem onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }}>
                                All Categories
                            </MenuItem>
                            {categories.map((category, index) => (
                                <SubMenu label={category} key={index} onClick={() => handleCategoryClick(category)}>
                                    {subcategories
                                        .filter(sub => productList.some(product => product.category === category && product.subcategory === sub))
                                        .map((sub, subIndex) => (
                                            <MenuItem key={subIndex} onClick={() => handleSubcategoryClick(sub)}>
                                                {sub}
                                            </MenuItem>
                                        ))}
                                </SubMenu>
                            ))}
                        </Menu>
                    </Sidebar>
                    <div className="mt-6">
                        <h1 className="text-lg font-semibold">Filter by Price</h1>
                        <p className='divider'></p>
                        <div className="flex justify-between items-center">
                            <h1>Price: ${priceRange[0]} — ${priceRange[1]}</h1>
                            <button className='btn btn-sm'>Filter</button>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={1000000}
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                            className="range dark:text-white dark:bg-black range-xs"
                        />
                    </div>
                    <div className="mt-6 hidden lg:block">
                        <img src="https://klbtheme.com/machic/wp-content/uploads/2021/10/widget-banner.jpg" alt="Banner" className="rounded-lg h-80 w-full" />
                    </div>
                </div>

                {/* Product Cards */}
                <div id='allProducts' className="w-full md:w-3/4 ">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
                        {isLoading ? (
                            <div className="col-span-full flex justify-center items-center">
                                <span className="loading loading-spinner loading-xl"></span>
                            </div>
                        ) : (
                            currentItems.map((product) => (
                                <div key={product._id} className="w-full bg-white rounded-lg shadow-md md:p-3 p-0 transition-transform transform hover:scale-105 relative">
                                    <div className="h-48 bg-gray-700 rounded-t-lg bg-cover bg-center relative" style={{ backgroundImage: `url(${product.images[0]})` }}>
                                        <div className="absolute inset-0 flex flex-col justify-between items-center px-3 py-2 bg-opacity-50 opacity-100 md:opacity-0 hover:opacity-100 transition-opacity duration-300">
                                            <div className="flex justify-between w-full items-center">
                                                <h1 className="text-white text-sm p-1 bg-red-400">{product.discount_percent}%</h1>
                                                <div className="space-y-2">
                                                    <Love product={product} />
                                                    <NavLink to={`/ItemsDetails/${product._id}`}>
                                                        <IoEyeOutline className="text-2xl cursor-pointer p-1 bg-white rounded-full" />
                                                    </NavLink>
                                                </div>
                                            </div>
                                            {
                                                product.total_stock > 0 ? <button onClick={() => handleAddToCart(product)} className="absolute bottom-0 w-full bg-black text-center text-white py-2 cursor-pointer transition duration-300">
                                                    Add to Cart
                                                </button> :
                                                    <button className="absolute bottom-0 w-full bg-black text-center text-white py-2 cursor-pointer transition duration-300">
                                                        Out Of Stock
                                                    </button>
                                            }

                                        </div>
                                    </div>
                                    <Link className="flex flex-col px-2 cursor-pointer mt-3">
                                        <span className=" text-sm lg:text-lg font-bold">{product.title}</span>
                                        <div className="flex items-center  gap-2">
                                            <span className="font-bold text-red-600 line-through">${product.price}</span>
                                            <span className="font-bold text-green-600">${product.discount_price}</span>
                                        </div>
                                        <div className="flex p-2">
                                            <Rating style={{ maxWidth: 100 }} value={calculateStarRating(product.review)} readOnly />
                                        </div>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-8">
                        <Pagination
                            count={Math.ceil(filteredProducts.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </div>
                </div>
            </div>
            <section className="bg-white mt-7 dark:text-black ">
                <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center">
                    <h2 className="text-2xl font-bold tracking-tight dark:text-black text-gray-800 xl:text-3xl ">
                        Try something really different right now.
                    </h2>

                    <p className="block max-w-4xl mt-4 text-gray-500 dark:text-black">
                        Lorem, ipsum dolor sit amet consectetur
                        adipisicing elit. Esse iure tenetur commodi ipsam error voluptate magni. Adipisci repudiandae ullam commodi
                        iusto reprehenderit suscipit facere voluptatem, eaque maiores minima. Neque, officiis.
                    </p>

                    <div className="mt-6 dark:text-black">
                        <a href="#" className="inline-flex dark:bg-black dark:text-white items-center justify-center w-full px-4 py-2.5 overflow-hidden text-sm text-white transition-colors duration-300 bg-gray-900 rounded-lg shadow sm:w-auto sm:mx-2 hover:bg-gray-700  dark:hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80">
                            <svg className="w-5 h-5 mx-2 fill-current" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve">
                                <g>
                                    <g>
                                        <path d="M407,0H105C47.103,0,0,47.103,0,105v302c0,57.897,47.103,105,105,105h302c57.897,0,105-47.103,105-105V105C512,47.103,464.897,0,407,0z M482,407c0,41.355-33.645,75-75,75H105c-41.355,0-75-33.645-75-75V105c0-41.355,33.645-75,75-75h302c41.355,0,75,33.645,75,75V407z"></path>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M305.646,123.531c-1.729-6.45-5.865-11.842-11.648-15.18c-11.936-6.892-27.256-2.789-34.15,9.151L256,124.166l-3.848-6.665c-6.893-11.937-22.212-16.042-34.15-9.151h-0.001c-11.938,6.893-16.042,22.212-9.15,34.151l18.281,31.664L159.678,291H110.5c-13.785,0-25,11.215-25,25c0,13.785,11.215,25,25,25h189.86l-28.868-50h-54.079l85.735-148.498C306.487,136.719,307.375,129.981,305.646,123.531z"></path>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M401.5,291h-49.178l-55.907-96.834l-28.867,50l86.804,150.348c3.339,5.784,8.729,9.921,15.181,11.65c2.154,0.577,4.339,0.863,6.511,0.863c4.332,0,8.608-1.136,12.461-3.361c11.938-6.893,16.042-22.213,9.149-34.15L381.189,341H401.5c13.785,0,25-11.215,25-25C426.5,302.215,415.285,291,401.5,291z"></path>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M119.264,361l-4.917,8.516c-6.892,11.938-2.787,27.258,9.151,34.15c3.927,2.267,8.219,3.345,12.458,3.344c8.646,0,17.067-4.484,21.693-12.495L176.999,361H119.264z"></path>
                                    </g>
                                </g>
                            </svg>

                            <span className="mx-2">
                                Get it on the App Store
                            </span>
                        </a>

                        <a href="#"
                            className="inline-flex items-center justify-center w-full px-4 py-2.5 mt-4 overflow-hidden text-sm text-white transition-colors duration-300 bg-blue-600 dark:bg-black dark:text-white rounded-lg shadow sm:w-auto sm:mx-2 sm:mt-0 hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                            <svg className="w-5 h-5 mx-2 fill-current" viewBox="-28 0 512 512.00075" xmlns="http://www.w3.org/2000/svg">
                                <path d="m432.320312 215.121094-361.515624-208.722656c-14.777344-8.53125-32.421876-8.53125-47.203126 0-.121093.070312-.230468.148437-.351562.21875-.210938.125-.421875.253906-.628906.390624-14.175782 8.636719-22.621094 23.59375-22.621094 40.269532v417.445312c0 17.066406 8.824219 32.347656 23.601562 40.878906 7.390626 4.265626 15.496094 6.398438 23.601563 6.398438s16.214844-2.132812 23.601563-6.398438l361.519531-208.722656c14.777343-8.53125 23.601562-23.8125 23.601562-40.878906s-8.824219-32.347656-23.605469-40.878906zm-401.941406 253.152344c-.21875-1.097657-.351562-2.273438-.351562-3.550782v-417.445312c0-2.246094.378906-4.203125.984375-5.90625l204.324219 213.121094zm43.824219-425.242188 234.21875 135.226562-52.285156 54.539063zm-6.480469 429.679688 188.410156-196.527344 54.152344 56.484375zm349.585938-201.835938-80.25 46.332031-60.125-62.714843 58.261718-60.773438 82.113282 47.40625c7.75 4.476562 8.589844 11.894531 8.589844 14.875s-.839844 10.398438-8.589844 14.875zm0 0">
                                </path>
                            </svg>

                            <span className="mx-2">
                                Get it on Google Play
                            </span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}