import { IoClose, IoSearchOutline } from "react-icons/io5";

export default function Search({setIsSearchOpen}) {
  return (

             <div className="fixed inset-0 flex items-center justify-center bg-opacity-90 backdrop-blur-xl z-50 transition-opacity duration-300 p-4">
                          <div className="bg-opacity-20 backdrop-blur-lg p-6 rounded-xl w-full max-w-md shadow-lg relative border border-white/30">
                              {/* Close Button */}
                              <button 
                                  className="absolute top-0 right-0 text-gray-200 hover:text-red-400 text-3xl transition"
                                  onClick={() => setIsSearchOpen(false)}
                              >
                                  <IoClose />
                              </button>
                              
                              {/* Search Input & Button */}
                              <div className="flex items-center gap-4">
                                  <div className="relative w-full">
                                      <input
                                          type="text"
                                          placeholder="Search for products..."
                                          className="w-full p-4 pl-12 border border-white/30 bg-white/20 text-white placeholder-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg text-lg"
                                      />
                                      <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl" />
                                  </div>
                                  <button className="px-3 py-4 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition">
                                      Search
                                  </button>
                              </div>
                          </div>
                      </div>

  )
}
