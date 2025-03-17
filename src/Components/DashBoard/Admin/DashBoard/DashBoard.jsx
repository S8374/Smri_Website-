import GetMostProducts from "../../../../Hooks/GetCombinatio";
import { UseUsers } from "../../../../Hooks/users/useUsers";
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
    ResponsiveContainer,
} from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashBoard() {
    const [getProducts, isLoading, refetchAll] = GetMostProducts();
    const totalOrders = Array.isArray(getProducts) ? getProducts.reduce((acc, product) => acc + product.totalOrders, 0) : 0;
    const totalEarnings = Array.isArray(getProducts) ? getProducts.reduce((acc, product) => acc + product.totalSell, 0) : 0;

    // Ensure getProducts is an array and map data properly
    const chartData = Array.isArray(getProducts)
        ? getProducts.map((product, index) => ({
            name: product.title,
            totalOrders: product.totalOrders,
            color: COLORS[index % COLORS.length], // Assign a color dynamically
        }))
        : [];

    return (
        <div className="p-6 bg-gray-100 w-full min-h-screen">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 shadow-lg bg-white rounded-lg p-6 mb-8">
                <div className="stat flex flex-col items-center text-center p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md">
                    <div className="stat-title text-lg sm:text-xl font-semibold">Total Sell</div>
                    <div className="stat-value text-3xl font-bold">${totalEarnings.toLocaleString()}</div>
                    <div className="stat-desc text-sm opacity-90">Total earnings from sales</div>
                </div>
                <div className="stat flex flex-col items-center text-center p-6 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-xl shadow-md">
                    <div className="stat-title text-lg sm:text-xl font-semibold">Total Orders</div>
                    <div className="stat-value text-3xl font-bold">{totalOrders}</div>
                    <div className="stat-desc text-sm opacity-90">Total orders placed</div>
                </div>
                <div className="stat flex items-center justify-center bg-white rounded-xl shadow-md p-6">
                <ResponsiveContainer width={250} height={250}>
    <PieChart>
        <Pie
            data={chartData}
            dataKey="totalOrders"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            label={({ name }) => name} // Show only order product title by default
        >
            {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
        </Pie>
        <Tooltip 
            formatter={(value, name) => [`Orders: ${value}`, `${name}`]} 
            cursor={false} // Hide hover effect or cursor change
        />
    </PieChart>
</ResponsiveContainer>

                </div>
            </div>

            <div className="mb-8 w-full overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Product Insights</h2>
                <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 14 }} />
                        <Area type="monotone" dataKey="totalProducts" fill="#8884d8" stroke="#8884d8" />
                        <Line type="monotone" dataKey="totalOrders" stroke="#ff7300" strokeWidth={2} />
                        <Line type="monotone" dataKey="totalEarnings" stroke="#82ca9d" strokeWidth={2} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}