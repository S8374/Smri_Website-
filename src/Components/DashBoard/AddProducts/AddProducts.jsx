import React, { useState } from 'react';
import Select from 'react-select';
import useSecure from '../../../Hooks/useSequre';
import useImageUpload from '../../../Hooks/useImageUpload';
import useAuth from '../../../Hooks/useAuth';

export default function AddProducts() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [stock, setStock] = useState('');
  const [totalStock, setTotalStock] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState(null);
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [commentsAllowed, setCommentsAllowed] = useState('');
  const [images, setImages] = useState([]);
  const axiosSecure = useSecure();
  const { uploadImage, uploading } = useImageUpload();
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const imageUrls = await Promise.all(images.map(file => uploadImage(file)));

    const formData = {
      title,
      stock,
      total_stock: parseInt(totalStock, 10),
      price: parseFloat(price),
      discount_price: parseFloat(discountPrice),
      discount_percent: discountPercent ? discountPercent.value : null,
      description,
      color: colors.map(color => color.value),
      size: sizes.map(size => size.value),
      review: commentsAllowed === "Yes" ? [{ comment: "Sample comment", user: "Sample user" }] : [],
      images: imageUrls.filter(url => url != null),
      category: category ? category.value : null,
      subcategory: subcategory ? subcategory.value : null,
      createdBy: user.uid,
      created_Email: user.email,
      createdAt: new Date().toISOString(),
    };

    axiosSecure.post('/api/products', formData)
      .then((res) => {
      
        // Reset form fields
        setTitle('');
        setStock('');
        setTotalStock('');
        setPrice('');
        setDiscountPrice('');
        setDiscountPercent(null);
        setDescription('');
        setColors([]);
        setSizes([]);
        setCategory(null);
        setSubcategory(null);
        setCommentsAllowed('');
        setImages([]);
      })
      .catch((err) => {
        console.error('Error adding product:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-semibold mb-4">Add Products Page</h1>

      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Product Title */}
          <label className="floating-label">
            <span>Your Product Title</span>
            <input
              type="text"
              placeholder="Your Product Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-md w-full"
              required
            />
          </label>

          {/* Stock Quantity */}
          <select
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="select w-full"
            required
          >
            <option value="" disabled>Select Stock Quantity</option>
            <option>In Stock</option>
            <option>Out of Stock</option>
          </select>

          {/* Colors (Multi-Select) */}
          <Select
            isMulti
            name="colors"
            placeholder="Select colors..."
            options={colorsOptions}
            value={colors}
            onChange={setColors}
            className="basic-multi-select w-full"
            classNamePrefix="select"
            required
          />
        </div>

        {/* Other Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {/* Categories */}
          <Select
            name="category"
            placeholder="Select a Category"
            options={categories}
            value={category}
            onChange={setCategory}
            className="basic-single w-full"
            classNamePrefix="select"
            required
          />

          {/* Sub Categories */}
          <Select
            name="subcategory"
            placeholder="Select a Sub Category"
            options={subcategories}
            value={subcategory}
            onChange={setSubcategory}
            className="basic-single w-full"
            classNamePrefix="select"
            required
          />

          {/* Sizes (Multi-Select) */}
          <Select
            isMulti
            name="size"
            placeholder="Select sizes..."
            options={sizesOptions}
            value={sizes}
            onChange={setSizes}
            className="basic-single w-full"
            classNamePrefix="select"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {/* Total Product Available */}
          <label className="floating-label">
            <span>Total Product Available</span>
            <input
              type="number"
              placeholder="Total product Available"
              value={totalStock}
              onChange={(e) => setTotalStock(e.target.value)}
              className="input input-md w-full"
              required
            />
          </label>

          {/* Product Price */}
          <label className="floating-label">
            <span>Your Product Price</span>
            <input
              type="number"
              placeholder="Your Product Price $"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input input-md w-full"
              required
            />
          </label>

          {/* Discount Price */}
          <label className="floating-label">
            <span>Your Discount Price</span>
            <input
              type="number"
              placeholder="Your Discount Price"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="input input-md w-full"
              required
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {/* Discount Percentage */}
          <Select
            name="discount_percent"
            placeholder="Select a Discount Percentage..."
            options={discountPercentageOptions}
            value={discountPercent}
            onChange={setDiscountPercent}
            className="basic-multi-select w-full"
            classNamePrefix="select"
            required
          />

          {/* Comments Allowed */}
          <select
            value={commentsAllowed}
            onChange={(e) => setCommentsAllowed(e.target.value)}
            className="select w-full"
            required
          >
            <option value="" disabled>Comments Allowed</option>
            <option>Yes</option>
            <option>No</option>
          </select>

          {/* File Input */}
          <input
            type="file"
            placeholder="Choose Product Images"
            onChange={handleFileChange}
            className="file-input w-full"
            multiple
            required
          />
        </div>

        {/* Display Selected Images */}
        {images.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Selected Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea mt-4 w-full textarea-neutral"
          required
        ></textarea>

        {/* Submit Button */}
        <button type="submit" className="btn w-full mt-4" disabled={loading || uploading}>
          {loading || uploading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

// Options for dropdowns
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
  { value: "Shirts", label: "Shirts" }
];

const colorsOptions = [
  { value: "Red", label: "Red" },
  { value: "Blue", label: "Blue" },
  { value: "Green", label: "Green" },
  { value: "Yellow", label: "Yellow" }
];

const sizesOptions = [
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" }
];

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
  { value: "100", label: "100" }
];