import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function BreadCurms({ Section1, icon1, Section2, icon2, Section3, icon3, Section4, icon4, Section5, icon5 }) {
    return (
        <div>
            <div className=" ">
                <div className="container text-black dark:text-black flex items-center px-6 py-4 mx-auto overflow-x-auto whitespace-nowrap">
                    <Link to={'/'} href="#" className="text-gray-600 dark:text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                    </Link>

                    <span className="mx-5 text-gray-500 dark:text-black rtl:-scale-x-100">
                        {icon1}
                    </span>

                    <a href="#" className="text-gray-600 dark:text-black hover:underline">
                        {Section1}
                    </a>

                    <span className="mx-5 text-gray-500 dark:text-black rtl:-scale-x-100">
                        {icon2}
                    </span>

                    <a href="#" className="text-gray-600 dark:text-black hover:underline">
                        {Section2}
                    </a>

                    <span className="mx-5 text-gray-500 dark:text-black rtl:-scale-x-100">
                        {icon3}
                    </span>

                    <a href="#" className="text-blue-600 dark:text-black hover:underline">
                        {Section3}
                    </a>
                    <span className="mx-5 text-gray-500 dark:text-black rtl:-scale-x-100">
                        {icon4}
                    </span>

                    <a href="#" className="text-blue-600 dark:text-black hover:underline">
                        {Section4}
                    </a>
                    <span className="mx-5 text-gray-500 dark:text-black rtl:-scale-x-100">
                        {icon5}
                    </span>

                    <a href="#" className="text-blue-600 dark:text-black hover:underline">
                        {Section5}
                    </a>
                </div>
            </div>
        </div>
    )
}
