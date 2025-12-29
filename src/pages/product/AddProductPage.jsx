
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { addProduct } from "../../features/product/productSlice";

export default function AddProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: ""
  });
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files[0]) {
      const file = files[0];
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: "Please select a valid image file (JPG, PNG)"
        }));
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: "Image size must be less than 5MB"
        }));
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setFormData(prev => ({
          ...prev,
          image: base64
        }));
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ""
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        
        image: formData.image || "https://via.placeholder.com/500x400?text=No+Image"
      };

      const result = await dispatch(addProduct(productData));
      
      if (addProduct.fulfilled.match(result)) {
        // Product added successfully, navigate to products page
        navigate("/products");
      } else {
        // Handle error from thunk
        setErrors({ submit: result.payload?.message || "Failed to add product" });
      }
    } catch (error) {
      setErrors({ submit: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-[520px] bg-white rounded-2xl border shadow-sm p-8">

      {/* Header */}
      <div className="text-center mb-8 relative">
        <Link
          to="/products"
          className="absolute left-0 top-1 p-2 rounded-full hover:bg-gray-100"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">
          Add New Product
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to add a new product to your store
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 outline-none
              ${errors.name ? "border-red-400" : "border-gray-300"}`}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Product Details */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            Product Details
          </p>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter product description"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 outline-none
              ${errors.description ? "border-red-400" : "border-gray-300"}`}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 rounded-xl p-4 w-40">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            Pricing
          </p>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 outline-none
              ${errors.price ? "border-red-400" : "border-gray-300"}`}
          />
          {errors.price && (
            <p className="text-xs text-red-500 mt-1">{errors.price}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">
            Product Image
          </p>

          <label
            htmlFor="image"
            className={`h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer
              ${errors.image ? "border-red-400 bg-red-50" : "border-gray-300 hover:bg-gray-100"}`}
          >
            <svg className="h-6 w-6 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-xs text-gray-600">
              Click to upload or drag & drop
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              JPG / PNG • Max 5MB
            </p>

            <input
              type="file"
              id="image"
              name="image"
              accept="image/jpeg,image/png"
              onChange={handleChange}
              className="hidden"
            />
          </label>

          {errors.image && (
            <p className="text-xs text-red-500 mt-1">{errors.image}</p>
          )}
        </div>

        {/* Image Preview */}
        {formData.image && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Image Preview
            </p>
            <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center">
              <img
                src={formData.image}
                alt="Preview"
                className="max-h-[140px] max-w-[200px] object-contain"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="flex-1 py-2.5 rounded-lg border text-sm hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>

      </form>
    </div>
  </div>
);
}