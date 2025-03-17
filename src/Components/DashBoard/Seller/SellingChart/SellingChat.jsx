import React from 'react';
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import GetMostProducts from "../../../../Hooks/GetCombinatio";
import useAuth from "../../../../Hooks/useAuth";

export default function SellingChart() {
    const { user } = useAuth();
    const [getProducts, isLoading] = GetMostProducts();

    const SellerProducts = getProducts?.filter(product => product.ownerEmail === user?.email) || [];

    if (isLoading) {
        return <p className="text-center text-gray-500">Loading chart data...</p>;
    }

    const totalOrders = SellerProducts.reduce((acc, product) => acc + (product.totalOrders || 0), 0);
    const totalEarnings = SellerProducts.reduce((acc, product) => acc + (product.totalSell || 0), 0);

    return (
        <div className="w-full min-h-screen dark:text-black bg-gray-100 p-6">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto mb-6">
                <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <h3 className="text-gray-600 text-lg font-semibold dark:text-black">Total Sell</h3>
                    <p className="text-2xl font-bold dark:text-black text-indigo-600">${totalEarnings.toLocaleString()}</p>
                    <span className="text-gray-400 text-sm dark:text-black">Jan 1st - Feb 1st</span>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <h3 className="text-gray-600 text-lg font-semibold dark:text-black">Orders</h3>
                    <p className="text-2xl font-bold dark:text-black text-green-600">{totalOrders}</p>
                    <span className="text-gray-400 text-sm dark:text-black">↗︎ 400 (22%)</span>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <h3 className="text-gray-600 text-lg font-semibold dark:text-black">Current Balance</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-black">${totalEarnings.toLocaleString()}</p>
                    <div className="mt-3 flex justify-center gap-4">
                        <button className="btn bg-red-500 text-white px-4 dark:text-white dark:bg-black py-1 rounded">Withdraw</button>
                        <button className="btn bg-green-500 dark:text-white dark:bg-black text-white px-4 py-1 rounded">Deposit</button>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-black mb-4">📊 Your Sales Performance</h2>
                {SellerProducts.length > 0 ? (
                    <div className="w-full h-[450px] dark:text-black">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                                data={SellerProducts}
                                margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                            >
                                <defs>
                                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ff7300" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="title" tick={{ fill: "#4B5563" }} />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "none" }}
                                    itemStyle={{ color: "#333" }}
                                />
                                <Legend wrapperStyle={{ fontSize: "14px" }} />
                                <Area type="monotone" dataKey="totalEarnings" stroke="#ff7300" fill="url(#colorEarnings)" />
                                <Bar dataKey="totalProducts" fill="#8884d8" barSize={30} name="Total Products" />
                                <Bar dataKey="totalOrders" fill="#ffc658" barSize={30} name="Total Orders" />
                                <Line type="monotone" dataKey="totalReviews" stroke="#82ca9d" strokeWidth={3} name="Total Reviews" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center dark:text-black">No products found for your account.</p>
                )}
            </div>
        </div>
    );
}