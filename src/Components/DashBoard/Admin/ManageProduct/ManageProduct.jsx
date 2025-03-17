import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import UseProducts from "../../../../Hooks/useProducts";
import Swal from "sweetalert2";
import useSecure from "../../../../Hooks/useSequre";
import toast from "react-hot-toast";
import UpdateProduct from "./productModal/UpdateProduct";
import { Button } from "@mui/material";

export default function ManageProduct() {
  const [openDropdown, setOpenDropdown] = useState(null); // Track which menu is open
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productList, isLoading, refetch] = UseProducts();
  const axiosSecure = useSecure();

  const toggleMenu = (productId) => {
    setOpenDropdown(openDropdown === productId ? null : productId);
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
        // Perform delete action here
        try {
          await axiosSecure.delete(`/api/products/${product._id}`);
          refetch();
          toast.success("Product deleted successfully!");
        } catch (error) {
          console.error(error);
        }
      }
    });
    setOpenDropdown(null);
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setOpenDropdown(null);
    document.getElementById("my_modal_2").showModal();
  };

  const handleSeeDetails = (product) => {
    setSelectedProduct(product);
    setOpenDropdown(null);
    document.getElementById("my_modal_1").showModal();
  };

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {/* Table Container with Fixed Height and Scroll */}
        <div className="max-h-[70vh] overflow-y-auto">
          <table className="min-w-full">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productList.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={product.images[0] || "https://via.placeholder.com/150"}
                        alt={product.name}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${product.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.total_stock}</td>
                  <td className="px-6 py-4 relative">
                    <button
                      className="text-gray-500 btn btn-xs hover:text-gray-700 focus:outline-none"
                      onClick={() => toggleMenu(product._id)}
                    >
                      <BsThreeDotsVertical />
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdown === product._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                        <ul className="py-2">
                          <li>
                            <Button
                              color="info"
                              size="small"
                              className="w-full text-left px-4 py-2 hover:bg-gray-200"
                              onClick={() => handleSeeDetails(product)}
                            >
                              See Details
                            </Button>
                          </li>
                          <li>
                            <Button
                              color="success"
                              size="small"
                              className="w-full text-left px-4 py-2 hover:bg-gray-200"
                              onClick={() => handleUpdate(product)}
                            >
                              Update Product
                            </Button>
                          </li>
                          <li>
                            <Button
                              color="error"
                              size="small"
                              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
                              onClick={() => handleDelete(product)}
                            >
                              Delete Product
                            </Button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* See Details Modal */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          {selectedProduct ? (
            <>
              <h3 className="font-bold text-lg">{selectedProduct.title}</h3>
              <img
                src={selectedProduct.images[0] || "https://via.placeholder.com/150"}
                alt={selectedProduct.title}
                className="w-full h-48 object-cover rounded-lg my-3"
              />
              <p className="py-2 text-gray-700">{selectedProduct.description}</p>
              <p className="text-lg font-semibold">Price: ${selectedProduct.price}</p>
              <p className="text-gray-600">Stock: {selectedProduct.total_stock}</p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </dialog>

      {/* Update Product Modal */}
      <UpdateProduct selectedProduct={selectedProduct} />
    </div>
  );
}