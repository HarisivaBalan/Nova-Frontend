import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
//import "./BecomeSupplier.css"; // optional custom styles

const categories = [
  "Laptops",
  "Accessories",
  "Food",
  "Snacks",
  "Mobile Phones",
  "Books",
  "Clothes",
  "Shoes",
  "Beauty/Health",
  "Sports",
  "Outdoor",
  "Home",
  "Headphones",
  "Bags",
];

const BecomeSupplier = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.authState || {});

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    originalPrice: "",
    description: "",
    category: "",
    seller: user?.name || "",
    stock: "",
    count: "",
  });

  const [images, setImages] = useState([]);      // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // preview URLs
  const [loading, setLoading] = useState(false);

  const discount = useMemo(() => {
    const price = parseFloat(formData.price);
    const originalPrice = parseFloat(formData.originalPrice);
    if (!originalPrice || !price || originalPrice <= 0) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }, [formData.price, formData.originalPrice]);

  if (!isAuthenticated) {
    return (
      <div className="container my-5 d-flex flex-column align-items-center">
        <h2 className="mb-3">Become a Supplier</h2>
        <p className="text-muted mb-3">
          You need to be logged in to start adding products.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/login")}
        >
          Login to Continue
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // Fields matching your schema
      data.set("name", formData.name);
      data.set("brand", formData.brand);
      data.set("price", formData.price);
      data.set("originalPrice", formData.originalPrice);
      data.set("description", formData.description);
      data.set("category", formData.category);
      data.set("seller", formData.seller || user?.name || "Supplier");
      data.set("stock", formData.stock);
      data.set("count", formData.count || 0);

      // user id (if your backend expects it as `user`)
      if (user?._id) {
        data.set("user", user._id);
      }

      // Images
      images.forEach((file) => {
        data.append("images", file);
      });

      // Adjust URL to match your backend route
      const API_BASE = process.env.REACT_APP_API_BASE_URL || "";
        const { data: res } = await axios.post(
        `${API_BASE}/api/v1/product/new`,
        data,
        {
            withCredentials: true,
            headers: {
            "Content-Type": "multipart/form-data",
            },
        }
        );


      toast.success("Product added successfully! 🎉");
      console.log("Created product:", res);

      // Optionally redirect to My Products page
      navigate("/myproducts");
    } catch (error) {
      console.error("Error creating product:", error);
      const msg =
        error.response?.data?.message ||
        "Something went wrong while adding the product.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="become-supplier-page">
    <div className="become-supplier-card-wrapper">
      <div className="shadow-sm border-0 rounded-4">
            <div className="card-header bg-primary text-white rounded-top-4 py-3 d-flex justify-content-between align-items-center">
             <div style={{ left: "40px", position: "relative" }}>
                <h4 className="mb-0">Become a Supplier</h4>
                <small className="text-light">
                  Add your product and start selling on NovaMart 🚀
                </small>
              </div>
              {user && (
                <span className="badge bg-light text-primary fw-semibold"style={{ right:"20px", position: "relative" }}>
                  {user.name}
                </span>
              )}
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Product Name & Brand */}
                <div className="row">
                  <div className="col-md-7 mb-3">
                    <label className="form-label fw-semibold">Product Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      maxLength={100}
                      placeholder="Eg. Lenovo IdeaPad Slim 5"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <small className="text-muted">
                      Max 100 characters. Make it descriptive ✨
                    </small>
                  </div>
                  <div className="col-md-5 mb-3">
                    <label className="form-label fw-semibold">Brand *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="brand"
                      placeholder="Eg. Lenovo"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Price, Original Price, Discount */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Selling Price (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      min="0"
                      step="0.01"
                      placeholder="Eg. 54999"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Original Price (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="originalPrice"
                      min="0"
                      step="0.01"
                      placeholder="Eg. 69999"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3 d-flex flex-column justify-content-end">
                    <label className="form-label fw-semibold mb-1">Discount</label>
                    <div className="d-flex align-items-center">
                      <span className="badge bg-success fs-6">
                        {discount || 0}% OFF
                      </span>
                      <small className="text-muted ms-2">
                        Auto-calculated
                      </small>
                    </div>
                  </div>
                </div>

                {/* Category & Stock & Count */}
                <div className="row">
                  <div className="col-md-5 mb-3">
                    <label className="form-label fw-semibold">Category *</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Stock *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="stock"
                      min="0"
                      placeholder="Eg. 20"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* <div className="col-md-3 mb-3">
                    <label className="form-label fw-semibold">Count</label>
                    <input
                      type="number"
                      className="form-control"
                      name="count"
                      min="0"
                      placeholder="Eg. 0"
                      value={formData.count}
                      onChange={handleChange}
                    />
                    <small className="text-muted">Optional</small>
                  </div> */}
                </div>

                {/* Seller */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Seller Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="seller"
                    placeholder="Your shop / brand name"
                    value={formData.seller}
                    onChange={handleChange}
                    required
                  />
                  <small className="text-muted">
                    This name will be visible to customers.
                  </small>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description *</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    placeholder="Describe the product, key features, warranty, etc."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* Images */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Product Images *</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    required
                  />
                  <small className="text-muted">
                    Upload 1 or more clear product images.
                  </small>

                  {imagePreviews.length > 0 && (
                    <div className="mt-3 d-flex flex-wrap gap-3">
                      {imagePreviews.map((src, idx) => (
                        <div
                          key={idx}
                          className="image-preview-wrapper rounded-3 shadow-sm"
                        >
                          <img
                            src={src}
                            alt={`preview-${idx}`}
                            className="image-preview"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/myproducts")}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      "Add Product"
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="card-footer bg-light rounded-bottom-4 text-muted small text-center">
              Once approved, your product will be visible to all NovaMart users.
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default BecomeSupplier;
