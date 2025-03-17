import { useState } from "react";
import useAuth from "../../../../../Hooks/useAuth";
import useProducts from "../../../../../Hooks/useProducts";
import UpdateProduct from "../../../Admin/ManageProduct/productModal/UpdateProduct";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useSecure from "../../../../../Hooks/useSequre";

export default function SellerProduct() {
    const { user } = useAuth();
    const [productList, isLoading, refetch] = useProducts();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const axiosSecure = useSecure();

    if (isLoading) {
        return <p className="text-center text-lg">Loading...</p>;
    }

    const handleUpdate = (product) => {
        setSelectedProduct(product);
        document.getElementById("my_modal_2").showModal();
    };

    const handleDelete = async (product) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/api/products/${product._id}`);
                    refetch();
                    toast.success("Product deleted successfully!");
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    const sellerProducts = productList?.filter(product => product.created_Email === user?.email);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-center dark:text-black">Your Listed Products</h2>
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border border-gray-300 dark:text-black bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-100 dark:text-black text-gray-700">
                        <tr className="text-left">
                            <th className="border p-3">Image</th>
                            <th className="border p-3">Title</th>
                            <th className="border p-3">Stock</th>
                            <th className="border p-3">Price</th>
                            <th className="border p-3">Discount</th>
                            <th className="border p-3">Category</th>
                            <th className="border p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellerProducts.length > 0 ? (
                            sellerProducts.map((product) => (
                                <tr key={product._id} className="border dark:text-black hover:bg-gray-50 transition">
                                    <td className="border p-3">
                                        <img src={product.images[0]} alt={product.title} className="w-14 h-14 object-cover rounded-md" />
                                    </td>
                                    <td className="border dark:text-black p-3 font-semibold">{product.title}</td>
                                    <td className="border dark:text-black p-3">{product.stock}</td>
                                    <td className="border p-3 dark:text-black text-blue-600 font-medium">${product.price}</td>
                                    <td className="border p-3 dark:text-black text-green-600">
                                        -{product.discount_percent}% (${product.discount_price})
                                    </td>
                                    <td className="border p-3">{product.category}</td>
                                    <td className="border p-3">
                                        <button onClick={() => handleUpdate(product)} className="px-3 py-1 bg-blue-500 dark:bg-black text-white rounded hover:bg-blue-600">Edit</button>
                                        <button onClick={() => handleDelete(product)} className="ml-2 px-3 py-1 bg-red-500 dark:bg-black text-white rounded hover:bg-red-600">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center dark:text-black p-5 text-gray-500">No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="md:hidden grid gap-4">
                {sellerProducts.length > 0 ? (
                    sellerProducts.map((product) => (
                        <div key={product._id} className="bg-white dark:text-black shadow-md rounded-lg p-4">
                            <img src={product.images[0]} alt={product.title} className="w-full h-40 object-cover rounded-md" />
                            <h3 className="text-lg font-semibold mt-2 dark:text-black">{product.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-black">Stock: {product.stock}</p>
                            <p className="text-blue-600 font-medium dark:text-black">${product.price}</p>
                            <p className="text-green-600 dark:text-black">-{product.discount_percent}% (${product.discount_price})</p>
                            <p className="text-sm text-gray-600 dark:text-black">Category: {product.category}</p>
                            <div className="mt-3 flex gap-2">
                                <button onClick={() => handleUpdate(product)} className="w-full py-2 bg-blue-500 text-white dark:bg-black rounded hover:bg-blue-600">Edit</button>
                                <button onClick={() => handleDelete(product)} className="w-full py-2 bg-red-500 text-white dark:bg-black rounded hover:bg-red-600">Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-black">No products found</p>
                )}
            </div>
            <UpdateProduct selectedProduct={selectedProduct} />
        </div>
    );
}