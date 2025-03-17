import { ImSpinner9 } from "react-icons/im";
import './Loader.css'
export default function Loader() {
    
    return (
        <div className="flex flex-col z-50 items-center justify-center h-screen bg-white animate-fadeIn">
            <ImSpinner9 className="animate-spin text-5xl text-red-500 drop-shadow-lg transition-all duration-500" />
            <p className="mt-4 text-lg font-semibold text-gray-700 animate-pulse">
                Loading <span className="text-red-500  ">Smri_Shop</span>...
            </p>
        </div>
    );
}


