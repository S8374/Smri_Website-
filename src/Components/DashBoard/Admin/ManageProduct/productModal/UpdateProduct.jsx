import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import useSecure from "../../../../../Hooks/useSequre";

export default function UpdateProduct({ selectedProduct }) {
  const axiosSecure = useSecure();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    total_stock: "",
    category: "",
    subcategory: "",
    discount: "",
  });

  // Initialize form data with selected product's values
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        title: selectedProduct.title || "",
        price: selectedProduct.price || "",
        total_stock: selectedProduct.total_stock || "",
        category: selectedProduct.category || "",
        subcategory: selectedProduct.subcategory || "",
        discount: selectedProduct.discount || "",
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send only the updated fields to the backend
      const updatedData = {};
      for (const key in formData) {
        if (formData[key] !== selectedProduct[key]) {
          updatedData[key] = formData[key];
        }
      }

      const response = await axiosSecure.patch(
        `/api/products/${selectedProduct._id}`,
        updatedData
      );

      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          text: "Product updated successfully.",
          icon: "success",
        });
        // Optionally, refresh the product list or close the modal
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update product.",
        icon: "error",
      });
      console.error(error);
    }
  };

  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box">
        {selectedProduct ? (
          <>
            <h3 className="font-bold text-lg">Update Product</h3>
            <form onSubmit={handleSubmit}>
              <label className="block my-2 font-semibold">Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input w-full"
              />

              <label className="block my-2 font-semibold">Price:</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input w-full"
              />

              <label className="block my-2 font-semibold">Total Stock:</label>
              <input
                type="text"
                name="total_stock"
                value={formData.total_stock}
                onChange={handleChange}
                className="input w-full"
              />

              <label className="block my-2 font-semibold">Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="select w-full"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <label className="block my-2 font-semibold">Subcategory:</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="select w-full"
              >
                <option value="" disabled>
                  Select Subcategory
                </option>
                {subcategories.map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
              </select>

              <label className="block my-2 font-semibold">Discount Percentage:</label>
              <select
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="select w-full"
              >
                <option value="" disabled>
                  Select Discount Percentage
                </option>
                {discountPercentageOptions.map((discount) => (
                  <option key={discount.value} value={discount.value}>
                    {discount.label}%
                  </option>
                ))}
              </select>

              <div className="modal-action">
                <button type="submit" className="btn">
                  Update
                </button>
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </form>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </dialog>
  );
}

const discountPercentageOptions = [
  { value: "0", label: "0" },
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "30", label: "30" },
  { value: "40", label: "40" },
  { value: "50", label: "50" },
  { value: "60", label: "60" },
  { value: "70", label: "70" },
  { value: "80", label: "80" },
  { value: "90", label: "90" },
  { value: "100", label: "100" },
];

const categories = [
  { value: "Woman's Fashion", label: "Woman's Fashion" },
  { value: "Man's Fashion", label: "Man's Fashion" },
  { value: "Electronics", label: "Electronics" },
  { value: "Furniture", label: "Furniture" },
  { value: "Medicine", label: "Medicine" },
  { value: "Sport & Outdoors", label: "Sport & Outdoors" },
  { value: "Baby's & Toys", label: "Baby's & Toys" },
  { value: "Health & Beauty", label: "Health & Beauty" },
];

const subcategories = [
  { value: "Dresses", label: "Dresses" },
  { value: "Accessories", label: "Accessories" },
  { value: "Shoes", label: "Shoes" },
  { value: "Mobiles", label: "Mobiles" },
  { value: "Laptops", label: "Laptops" },
  { value: "Chairs", label: "Chairs" },
  { value: "Tables", label: "Tables" },
  { value: "Skincare", label: "Skincare" },
  { value: "Makeup", label: "Makeup" },
  { value: "Shirts", label: "Shirts" },
];