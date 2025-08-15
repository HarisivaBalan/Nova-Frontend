// import React, { useState } from "react";
// import Search from "./Search";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { Dropdown, Image } from "react-bootstrap";
// import { logout } from "../../actions/userActions";
// import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";

// export default function Header() {
//   const { isAuthenticated} = useSelector((state) => state.authState|| {});
//   const {user} = useSelector(state => state.authState ||{});
//   const { items: cartItems } = useSelector((state) => state.cartState);
//   const wishlistState = useSelector((state) => state.wishlist || { items: [] }); // ✅ Match key from store.js
//   const { items: wishlistItems } = wishlistState;
  
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   let closeTimeout = null;
//   const handleProtectedClick = (e, path) => {
//     if (!isAuthenticated) {
//       e.preventDefault();
//       toast.error("Login first to access this feature!", {
//         position: "top-center",
//         autoClose: 3000,
//       });
//     } else {
//       navigate(path);
//     }
//   };
//   const handleMouseEnter = () => {
//     if (closeTimeout) clearTimeout(closeTimeout); // Cancel closing if hovered again
//     setIsDropdownOpen(true);
//   };

//   // const handleMouseLeave = () => {
//   //   closeTimeout = setTimeout(() => {
//   //     setIsDropdownOpen(false);
//   //   }, 50000); // Delay closing by 5s
//   // };
//   // const handleMouseLeave = (e) => {
//   //   if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
//   //     closeTimeout = setTimeout(() => {
//   //       setIsDropdownOpen(false);
//   //     }, 5000); // Delay closing by 5s
//   //   }
//   // };
//   const handleMouseLeave = (e) => {
//     if (!e.relatedTarget || !(e.relatedTarget instanceof Node) || !e.currentTarget.contains(e.relatedTarget)) {
//       closeTimeout = setTimeout(() => {
//         setIsDropdownOpen(false);
//       }, 5000); // Delay closing by 5s
//     }
//   };
  
  

//   const logoutHandler = () => {
//     dispatch(logout());
//     toast.success("Logged out successfully!", {
//       position: "top-center",
//       autoClose: 3000,
//     });
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
//       <div className="container-fluid">
//         <div className="navbar-container">
//           {/* Logo */}
//           <div className="navbar-brand navbar-logo">
//             <Link to="/">
//               <img src="/images/logol.png" alt="Logo" />
//             </Link>
//           </div>

//           <Search />

//           {/* Profile & Cart Section */}
//           <div className="profile-cart d-flex align-items-center">
//             {/* Profile Dropdown */}
//             <div
//               className="profile-dropdown me-3"
//               onMouseEnter={() => setIsDropdownOpen(true)}
//               onMouseLeave={(e) => {
//                 if (!e.currentTarget.contains(e.relatedTarget)) {
//                   setIsDropdownOpen(false);
//                 }
//               }}
//             >
//               <Dropdown className="d-inline d-flex align-items-center" show={isDropdownOpen}>
//                 <Dropdown.Toggle
//                   style={{
//                     backgroundColor: "transparent",
//                     color: "inherit",
//                     border: "none",
//                     padding: 0,
//                     margin: "0px",
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                   className="d-flex align-items-center dropdown-toggle"
//                 >
//                   <figure
//                     className="avatar avatar-nav me-2"
//                     onMouseEnter={() => setIsHovered(true)}
//                     onMouseLeave={() => setIsHovered(false)}
//                     style={{
//                       transition: "transform 0.3s ease-in-out",
//                       transform: isHovered ? "translateY(-5px)" : "translateY(0)",
//                     }}
//                   >
//                     <Image width="30px" src={user?.avatar ?? "./images/default_avatar.png"} />
//                   </figure>
//                   <span className="ms-2 truncate-text">{isAuthenticated ? `😊 Hi, ${user?.name}` : "Login"}</span>
//                   <i
//                     className={`ms-1 fas ${isDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
//                     style={{ transition: "transform 0.2s ease-in-out" }}
//                   ></i>
//                 </Dropdown.Toggle>

//                 {/* Keep dropdown open while inside menu */}
//                 <Dropdown.Menu
//                   onMouseEnter={handleMouseEnter}
//                   onMouseLeave={handleMouseLeave}
//                   style={{
//                     top: "-2px", // Moves dropdown slightly upward
//                     overflow: "hidden", // Prevents unnecessary scrolling
//                     minWidth: "180px", // Ensures dropdown doesn't collapse
//                     minHeight: "120px", // Prevents layout shifting
//                   }}
                
//                 >
//                   <Dropdown.Item className="text-dark" onClick={(e) => handleProtectedClick(e, "/myprofile")}>
//                     Profile
//                   </Dropdown.Item>
//                   <Dropdown.Item className="text-dark" onClick={(e) => handleProtectedClick(e, "/orders")}>
//                     My Orders
//                   </Dropdown.Item>
//                   <Dropdown.Item className="text-dark" onClick={() => navigate("/wishlist")}>
//                     My Favourites ❤️ ({wishlistItems.length})
//                   </Dropdown.Item>
//                   {isAuthenticated ? (
//                     <Dropdown.Item className="text-danger" onClick={logoutHandler}>
//                       Logout
//                     </Dropdown.Item>
//                   ) : (
//                     <Dropdown.Item className="text-primary" onClick={() => navigate("/login")}>
//                       Login
//                     </Dropdown.Item>
//                   )}
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>

//             {/* Cart */}
//             <div className="cart">
//               <Link className="nav-link" to="/cart">
//                 <i className="fas fa-shopping-cart"></i> Cart
//                 <span className="ml-1" id="cart_count">
//                   {cartItems.length}
//                 </span>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
import React, { useState } from "react";
import Search from "./Search";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Image } from "react-bootstrap";
import { logout } from "../../actions/userActions";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export default function Header() {
  const { isAuthenticated } = useSelector((state) => state.authState || {});
  const { user } = useSelector((state) => state.authState || {});
  const { items: cartItems } = useSelector((state) => state.cartState);
  const wishlistState = useSelector((state) => state.wishlist || { items: [] });
  const { items: wishlistItems } = wishlistState;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  let dropdownTimeout = null;

const handleMouseEnter = () => {
  clearTimeout(dropdownTimeout);
  setIsDropdownOpen(true);
};

const handleMouseLeave = () => {
  dropdownTimeout = setTimeout(() => {
    setIsDropdownOpen(false);
  }, 200); // Delay hiding by 500ms
};
  const handleProtectedClick = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error("Login first to access this feature!", {
        position: "top-center",
        autoClose: 3000,
      });
    } else {
      navigate(path);
    }
  };

  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logged out successfully!", {
      position: "top-center",
      autoClose: 3000,
    });
  };
  const formatName = (name) => {
    if (!name) return "";
  
    if (name.length <= 10) return name;
  
    const words = name.split(" ");
    if (words.length > 1) {
      return `${words[0]}\n${words.slice(1).join(" ")}`; // Split on space
    }
  
    // If no spaces and too long, split manually
    return name.slice(0, 10) + "\n" + name.slice(10);
  };
  

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-brand navbar-logo">
            <Link to="/">
              <img src="/images/logol.png" alt="Logo" />
            </Link>
          </div>

          <Search />

          {/* Profile & Cart Section */}
          <div className="profile-cart d-flex align-items-center">
            {/* Profile Dropdown */}
            <div
              className="profile-dropdown me-3"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Dropdown className="d-inline d-flex align-items-center" show={isDropdownOpen}>
                <Dropdown.Toggle
                  style={{
                    backgroundColor: "transparent",
                    color: "inherit",
                    border: "none",
                    padding: 0,
                    margin: "0px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  className="d-flex align-items-center dropdown-toggle"
                >
                  <figure
                    className="avatar avatar-nav me-2"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                    }}
                  >
                    <Image width="30px" src={user?.avatar ?? "./images/default_avatar.png"} />
                  </figure>
                  {/* <span className="ms-2 truncate-text">
                    {isAuthenticated ? `😊 Hi, ${user?.name}` : "Login"}
                  </span> */}
                  <span className="ms-2 user-greeting">
                    {isAuthenticated ? `😊 Hi,\n${formatName(user?.name)}` : "Login"}
                  </span>

                  <i
                    className={`ms-1 fas ${isDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
                    style={{ transition: "transform 0.2s ease-in-out" }}
                  ></i>
                </Dropdown.Toggle>

                <Dropdown.Menu
                  style={{
                    top: "-2px",
                    overflow: "hidden",
                    minWidth: "180px",
                    minHeight: "120px",
                  }}
                >
                  <Dropdown.Item className="text-dark" onClick={(e) => handleProtectedClick(e, "/myprofile")}>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item className="text-dark" onClick={(e) => handleProtectedClick(e, "/orders")}>
                    My Orders
                  </Dropdown.Item>
                  <Dropdown.Item className="text-dark" onClick={() => navigate("/wishlist")}>
                    My Favourites ❤️ ({wishlistItems.length})
                  </Dropdown.Item>
                  {isAuthenticated ? (
                    <Dropdown.Item className="text-danger" onClick={logoutHandler}>
                      Logout
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item className="text-primary" onClick={() => navigate("/login")}>
                      Login
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* Cart */}
            <div className="cart">
              <Link className="nav-link" to="/cart">
                <i className="fas fa-shopping-cart"></i> Cart
                <span className="ml-1" id="cart_count">
                  {cartItems.length}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
