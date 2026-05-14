// import React from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// // import your existing ProductCard if you have one
// // import ProductCard from "../product/ProductCard";
// //import "./MyProducts.css"; // optional, for styles

// const MyProducts = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, user } = useSelector(
//     (state) => state.authState || {}
//   );
//   const { items: myProducts } = useSelector(
//     (state) => state.myProducts || { items: [] }
//   );

//   if (!isAuthenticated) {
//     return (
//       <div className="myproducts-empty-page">
//         <h2>Please login to view your products</h2>
//         <button
//           className="btn btn-primary"
//           onClick={() => navigate("/login")}
//         >
//           Go to Login
//         </button>
//       </div>
//     );
//   }

//   // If user has products → show them
//   if (myProducts && myProducts.length > 0) {
//     return (
//       <div className="container my-4">
//         <h2 className="mb-3">
//           Your Products {user?.name ? `- ${user.name}` : ""}
//         </h2>
//         <div className="row">
//           {myProducts.map((product) => (
//             <div className="col-md-3 col-sm-6 mb-4" key={product._id}>
//               {/* Use your existing product card UI here */}
//               {/* <ProductCard product={product} /> */}
//               <div className="card h-100">
//                 <img
//                   src={product.images?.[0]?.image || "/images/default_product.png"}
//                   className="card-img-top"
//                   alt={product.name}
//                 />
//                 <div className="card-body">
//                   <h6 className="card-title text-truncate">
//                     {product.name}
//                   </h6>
//                   <p className="card-text mb-1">
//                     ₹ {product.price}
//                   </p>
//                   <p className="card-text text-muted small">
//                     {product.category}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // If user has NO products → show interactive empty state
//   return (
//     <div className="d-flex flex-column min-vh-100">
//       <div className="flex-grow-1 d-flex flex-column">
//     <div className="myproducts-empty-page d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
//       <img
//         src="/images/supplier.jpg"
//         alt="No products"
//         style={{ maxWidth: "250px", marginBottom: "20px" }}
//       />
//       <h2 className="mt-7">You haven't added any products yet</h2>
//       <p className="text-muted text-center mb-4" style={{ maxWidth: "400px" }}>
//         Become a supplier on <strong>NovaMart</strong> and start selling your
//         products to thousands of customers.
//       </p>
//       <div className="d-flex gap-3">
//         <button
//           className="btn btn-outline-primary"
//           onClick={() => navigate("/become-supplier")}
//         >
//           Become a Supplier
//         </button>
//       </div>
//     </div>
//     </div>
//     </div>
//   );
// };

// export default MyProducts;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../layout/Loader"; // adjust path if needed

const MyProducts = () => {
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(
    (state) => state.authState || {}
  );

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to style status
  const renderStatusBadge = (status) => {
    const s = (status || "").toLowerCase();

    if (s === "accepted" || s === "approved") {
      return <span className="badge bg-success">Accepted</span>;
    }
    if (s === "rejected") {
      return <span className="badge bg-danger">Rejected</span>;
    }
    // default – pending / waiting
    return <span className="badge bg-warning text-dark">Waiting</span>;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchMyProducts = async () => {
      try {
        setLoading(true);
        const API_BASE = process.env.REACT_APP_API_BASE_URL || "";
        // Adjust URL to match your backend route
        const { data } = await axios.get(`${API_BASE}/api/v1/myproducts`, {
         withCredentials: true,
            });


        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching my products:", err);
        setError(
          err.response?.data?.message ||
            "Something went wrong while fetching your products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [isAuthenticated]);

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="myproducts-empty-page d-flex flex-column align-items-center justify-content-center">
        <h2>Please login to view your products</h2>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return <Loader />;
  }

  // Error state (optional)
  if (error) {
    return (
      <div className="container my-5 text-center">
        <h4 className="text-danger mb-3">Oops!</h4>
        <p className="text-muted mb-3">{error}</p>
        <button
          className="btn btn-outline-secondary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // ✅ If user HAS products – show table-like structure
  if (products && products.length > 0) {
    return (
      <div className="container my-4">
        <h2 className="mb-4">My Products</h2>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={
                          product.images?.[0]?.url ||
                          "/images/default_product.png"
                        }
                        alt={product.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          marginRight: "10px",
                        }}
                      />
                      <div>
                        <div className="fw-semibold">{product.name}</div>
                        <small className="text-muted">
                          {product.brand || ""}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{renderStatusBadge(product.status)}</td>
                  <td>
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-end">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/become-supplier")}
          >
            Add New Product
          </button>
        </div>
      </div>
    );
  }

  // ❌ If user has NO products – show empty state with image + Become Supplier
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 d-flex flex-column">
        <div
          className="myproducts-empty-page d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "60vh" }}
        >
          <img
            src="/images/supplier.jpg"
            alt="No products"
            style={{ maxWidth: "250px", marginBottom: "20px" }}
          />
          <h2 className="mt-4">You haven't added any products yet</h2>
          <p
            className="text-muted text-center mb-4"
            style={{ maxWidth: "400px" }}
          >
            Become a supplier on <strong>NovaMart</strong> and start selling
            your products to thousands of customers.
          </p>
          <div className="d-flex gap-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/become-supplier")}
            >
              Become a Supplier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProducts;
