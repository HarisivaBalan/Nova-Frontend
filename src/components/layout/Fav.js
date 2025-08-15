// import React from "react";
// import { useSelector } from "react-redux";
// import Card from "./Card"; // Reuse the Card component
// import { Link } from "react-router-dom";

// const Wishlist = () => {
//   const { items: wishlistItems } = useSelector((state) => state.wishlist); // ✅ Use correct key

//   return (
//     <div className="d-flex flex-column min-vh-100">
//     <div className="flex-grow-1">
//     <div className="container mt-4">
//       <h2 className="text-center mb-4">My Favourites ❤️</h2>
//       {wishlistItems.length === 0 ? (
//         <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center">
//           <p>No items in your wishlist.</p>
//           <Link to="/" className="btn btn-primary mt-2">Browse Products</Link>
//         </div>
//       ) : (
//         <div className="row">
//           {wishlistItems.map((product) => (
//             <div key={product._id} className="col-md-4 mb-4">
//               <Card product={product} />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//     </div>
//   </div>
//   );
  
// };

// export default Wishlist;
import React from "react";
import { useSelector } from "react-redux";
import Card from "./Card";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 d-flex flex-column">
        {wishlistItems.length === 0 ? (
          <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: "60vh" }}>
            <img src="/images/emptywishlist.png" alt="Empty Wishlist" style={{ width: "150px", marginBottom: "20px" }} />
            <h2>Your wishlist is empty</h2>
            <p className="mt-2">Looks like you haven’t saved any products yet.</p>
            <Link to="/" className="btn btn-primary mt-3">Browse Products</Link>
          </div>
        ) : (
          <div className="container mt-4">
            <h2 className="text-center mb-4">My Favourites ❤️</h2>
            <div className="row">
              {wishlistItems.map((product) => (
                <div key={product._id} className="col-md-4 mb-4">
                  <Card product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    
    </div>
  );
};

export default Wishlist;

