// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { addToWishlist, removeFromWishlist } from "../../slices/wishlistslice";

// const Card = ({ product }) => {
//   const dispatch = useDispatch();
//   const wishlistItems = useSelector((state) => state.wishlist.items);

//   // Check if the product is in the wishlist
//   const isInWishlist = wishlistItems.some((item) => item._id === product._id);

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [intervalId, setIntervalId] = useState(null);

//   useEffect(() => {
//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [intervalId]);

//   // Function to change the product image automatically
//   const changeImage = () => {
//     if (product?.images?.length) {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % product.images.length);
//     }
//   };

//   const handleMouseOver = () => {
//     if (!intervalId) {
//       const id = setInterval(changeImage, 2000);
//       setIntervalId(id);
//     }
//   };

//   const handleMouseOut = () => {
//     if (intervalId) {
//       clearInterval(intervalId);
//       setIntervalId(null);
//     }
//   };

//   // Wishlist toggle function
//   const toggleWishlist = () => {
//     if (isInWishlist) {
//       dispatch(removeFromWishlist(product._id));
//     } else {
//       dispatch(addToWishlist(product));
//     }
//   };

//   return (
//     <div className="card" id={`card-${product?._id}`}>
//       <div
//         className="image-slider"
//         onMouseOver={handleMouseOver}
//         onMouseOut={handleMouseOut}
//       >
//         {product?.images?.map((image, index) => (
//           <img
//             key={index}
//             src={image.url}
//             alt={`Product ${index + 1}`}
//             className={index === currentIndex ? "active" : ""}
//           />
//         ))}
//         <div className="loading-dots">
//           {product?.images?.map((_, index) => (
//             <span key={index} className={currentIndex === index ? "active" : ""}></span>
//           ))}
//         </div>
//         {/* Wishlist Button */}
//         <div
//           className={`wishlist ${isInWishlist ? "active" : ""}`}
//           style={{
//             color: isInWishlist ? "red" : "gray",
//             fontFamily: "Arial, sans-serif",
//             cursor: "pointer",
//           }}
//           onClick={toggleWishlist}
//         >
//           <i className="fas fa-heart" style={{ color: isInWishlist ? "red" : "gray" }}></i>
//         </div>
//       </div>

//       {/* Card Details */}
//       <div className="card-details">
//         <h3>
//           <Link to={`/product/${product?._id}`}>{product?.brand}</Link>
//         </h3>
//         <div className="card-title">
//           <Link to={`/product/${product?._id}`}>{product?.name}</Link>
//         </div>
//         {/* <div className="price-info">
//           <span className="price">₹{product?.price}</span>
//           {product?.originalPrice && product?.discount && product.originalPrice > product.price ? (
//             <>
//               <span className="original-price">₹{product.originalPrice}</span>
//               <span className="discount">({product.discount}% off)</span>
//             </>
//           ) :(
//             <>
//               <span className="original-price placeholder"></span>
//               <span className="discount placeholder"></span>
//             </>)}
//           <Link to={`/product/${product?._id}`}><button id="cart-button">View Details</button></Link>
//         </div> */}
//         <div className="price-info">
//   <div className="price-wrapper">
//     <span className="price">₹{product?.price}</span>

//     {product?.originalPrice && product?.discount && product.originalPrice > product.price ? (
//       <>
//         <span className="original-price">₹{product.originalPrice}</span>
//         <span className="discount">({product.discount}% off)</span>
//       </>
//     ) : null}
//   </div>

//   <Link to={`/product/${product?._id}`}>
//     <button id="cart-button">View Details</button>
//   </Link>
// </div>

//       </div>
//     </div>
//   );
// };

// export default Card;
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { addToWishlist, removeFromWishlist } from "../../slices/wishlistslice";
// import { motion } from "framer-motion"; // Import Framer Motion

// const Card = ({ product }) => {
//   const dispatch = useDispatch();
//   const wishlistItems = useSelector((state) => state.wishlist.items);
//   const isInWishlist = wishlistItems.some((item) => item._id === product._id);

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [intervalId, setIntervalId] = useState(null);

//   useEffect(() => {
//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [intervalId]);

//   const changeImage = () => {
//     if (product?.images?.length) {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % product.images.length);
//     }
//   };

//   const handleMouseOver = () => {
//     if (!intervalId) {
//       const id = setInterval(changeImage, 2000);
//       setIntervalId(id);
//     }
//   };

//   const handleMouseOut = () => {
//     if (intervalId) {
//       clearInterval(intervalId);
//       setIntervalId(null);
//     }
//   };

//   const toggleWishlist = () => {
//     isInWishlist ? dispatch(removeFromWishlist(product._id)) : dispatch(addToWishlist(product));
//   };

//   return (
//     <motion.div
//       className="card"
//       id={`card-${product?._id}`}
//       initial={{ x: 400, opacity: 0 }} // Slide in from the right
//       animate={{ x: 1, opacity: 1 }}
//       transition={{ duration: 0.10, ease: "easeOut" }}
//       whileHover={{ scale: 1.05 }} // Slight zoom effect on hover
//     >
//       <div
//         className="image-slider"
//         onMouseOver={handleMouseOver}
//         onMouseOut={handleMouseOut}
//       >
//         {product?.images?.map((image, index) => (
//           <motion.img
//             key={index}
//             src={image.url}
//             alt={`Product ${index + 1}`}
//             className={index === currentIndex ? "active" : ""}
//             initial={{ opacity: 0 ,scale:0.9}}
//             animate={{ opacity: index === currentIndex ? 1 : 0 }}
//             transition={{ duration: 0.10 }}
//           />
//         ))}
//         <div className="loading-dots">
//           {product?.images?.map((_, index) => (
//             <span key={index} className={currentIndex === index ? "active" : ""}></span>
//           ))}
//         </div>

//         {/* Wishlist Button */}
//         <motion.div
//           className={`wishlist ${isInWishlist ? "active" : ""}`}
//           style={{ color: isInWishlist ? "red" : "gray", cursor: "pointer" }}
//           onClick={toggleWishlist}
//           whileTap={{ scale: 0.9 }} // Small tap effect
//         >
//           <i className="fas fa-heart" style={{ color: isInWishlist ? "red" : "gray" }}></i>
//         </motion.div>
//       </div>

//       {/* Card Details */}
//       <div className="card-details">
//         <h3>
//           <Link to={`/product/${product?._id}`}>{product?.brand}</Link>
//         </h3>
//         <div className="card-title">
//           <Link to={`/product/${product?._id}`}>{product?.name}</Link>
//         </div>

//         <div className="price-info">
//           <div className="price-wrapper">
//             <span className="price">₹{product?.price}</span>
//             {product?.originalPrice && product?.discount && product.originalPrice > product.price ? (
//               <>
//                 <span className="original-price">₹{product.originalPrice}</span>
//                 <span className="discount">({product.discount}% off)</span>
//               </>
//             ) : null}
//           </div>

//           <Link to={`/product/${product?._id}`}>
//             <motion.button
//               id="cart-button"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               View Details
//             </motion.button>
//           </Link>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Card;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../slices/wishlistslice";
import { motion } from "framer-motion";

const Card = ({ product, index }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item._id === product._id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const changeImage = () => {
    if (product?.images?.length) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }
  };

  const handleMouseOver = () => {
    if (!intervalId) {
      const id = setInterval(changeImage, 2000);
      setIntervalId(id);
    }
  };

  const handleMouseOut = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const toggleWishlist = () => {
    isInWishlist ? dispatch(removeFromWishlist(product._id)) : dispatch(addToWishlist(product));
  };

  // **Updated Animation Variants (Wishlist Removed)**
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 10, delay: index * 0.1 },
    },
    hover: {
      y: -5,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="card"
      id={`card-${product?._id}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover="hover"
    >
      <div className="image-slider" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        {product?.images?.map((image, i) => (
          <motion.img
            key={i}
            src={image.url}
            alt={`Product ${i + 1}`}
            className={i === currentIndex ? "active" : ""}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: i === currentIndex ? 1 : 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        ))}

        <div className="loading-dots">
          {product?.images?.map((_, i) => (
            <span key={i} className={currentIndex === i ? "active" : ""}></span>
          ))}
        </div>

        {/* Wishlist (No Animation Now) */}
        <div
          className={`wishlist ${isInWishlist ? "active" : ""}`}
          style={{ color: isInWishlist ? "red" : "gray", cursor: "pointer" }}
          onClick={toggleWishlist}
        >
          <i className="fas fa-heart"></i>
        </div>
      </div>

      <div className="card-details">
        <h3>
          <Link to={`/product/${product?._id}`}>{product?.brand}</Link>
        </h3>
        <div className="card-title">
          <Link to={`/product/${product?._id}`}>{product?.name}</Link>
        </div>

        <div className="price-info">
          <div className="price-wrapper">
            <span className="price">₹{product?.price}</span>
            {product?.originalPrice && product?.discount && product.originalPrice > product.price ? (
              <>
                <span className="original-price">₹{product.originalPrice}</span>
                <span className="discount">({product.discount}% off)</span>
              </>
            ) : null}
          </div>

          {/* ✅ Fixed Button Issue */}
          <Link to={`/product/${product?._id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="view-details-btn"
              id="cart-button"
            >
              View Details
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
