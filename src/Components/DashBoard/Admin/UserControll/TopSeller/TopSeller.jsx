import { useEffect, useState } from "react";
import useSecure from "../../../../../Hooks/useSequre";
import { FaMedal, FaStar } from "react-icons/fa";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import useAdmin from "../../../../../Hooks/userRole/useAdmin";
import useAuth from "../../../../../Hooks/useAuth";

export default function TopSeller() {
  const axiosSecure = useSecure();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user, logOut } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin()
  useEffect(() => {
    axiosSecure
      .get("/api/sellerRank")
      .then((res) => {
        setSellers(res.data.sellerProductCounts || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sellers:", err);
        setError("Failed to load sellers.");
        setLoading(false);
      });
  }, []);

  const getMedal = (index) => {
    if (index === 0) return <FaMedal className="text-orange-600 text-4xl animate-pulse" />;
    if (index === 1) return <FaMedal className="text-gray-400 text-4xl animate-pulse" />;
    if (index === 2) return <FaMedal className="text-yellow-400 text-4xl animate-pulse" />;
    return null;
  };

  const handleOpenModal = (seller) => {
    setSelectedUser(seller);
    document.getElementById('my_modal_1').showModal();
  };
  if(isAdminLoading){
    return <p className="text-center text-gray-500">Loading...</p>
  }
if(isAdmin === !true){
 return logOut()
}
  return (
    <section className="max-w-6xl mx-auto p-8 bg-gradient-to-r dark:text-black from-blue-50 to-blue-100 shadow-lg rounded-xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center dark:text-black">🏆 Top Sellers</h2>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-black">Loading sellers...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : sellers.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-black">No sellers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller, index) => (
            <div
              key={seller._id}
              className="flex items-center justify-between dark:text-black bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out cursor-pointer transform hover:scale-105"
              onClick={() => handleOpenModal(seller)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={seller.profileImage || "https://via.placeholder.com/50"}
                  alt={seller.username}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-4 border-indigo-500"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold flex dark:text-black text-lg md:text-xl text-gray-900 truncate">
                    {seller.username || "Unknown"}
                    <div>{getMedal(index)}</div>
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-black truncate">{seller.email || "No email provided"}</p>
                  <p className="text-sm text-gray-500 dark:text-black flex items-center gap-1">
                    <FaStar className="text-yellow-500" /> {seller.totalProducts || 0} Products
                  </p>
                </div>
              </div>
             
            </div>
          ))}
        </div>
      )}

      {/* User Chart */}
      <h2 className="text-2xl font-semibold dark:text-black text-gray-800 mt-12 mb-4 text-center">📊 Seller Rankings</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={sellers}>
          <XAxis dataKey="username" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="totalProducts" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>

      {/* Modal for Selected User */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          {selectedUser && (
            <>
              <h3 className="font-bold text-lg">User Profile</h3>
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.profileImage}
                  alt={selectedUser.username}
                  className="w-24 h-24 rounded-full border-4 dark:text-black border-indigo-500"
                />
                <div>
                  <p className="text-lg text-gray-700 dark:text-black"><strong>Name:</strong> {selectedUser.username}</p>
                  <p className="text-lg text-gray-700 dark:text-black"><strong>Email:</strong> {selectedUser.email}</p>
                  <p className="text-lg text-gray-700 dark:text-black"><strong>Total Products:</strong> {selectedUser.totalProducts}</p>
                </div>
              </div>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn dark:text-black">Close</button>
                </form>
              </div>
            </>
          )}
        </div>
      </dialog>
    </section>
  );
}
