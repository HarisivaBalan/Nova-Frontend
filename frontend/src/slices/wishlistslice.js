import { createSlice } from "@reduxjs/toolkit";

// Load wishlist from localStorage
const loadWishlistFromStorage = () => {
  const storedWishlist = localStorage.getItem("wishlist");
  return storedWishlist ? JSON.parse(storedWishlist) : [];
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: loadWishlistFromStorage(), // ✅ Load saved wishlist
  },
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item._id === product._id);
      if (!exists) {
        state.items.push(product);
        localStorage.setItem("wishlist", JSON.stringify(state.items)); // ✅ Save to localStorage
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem("wishlist", JSON.stringify(state.items)); // ✅ Update localStorage
    },
    clearWishlist: (state) => {
      state.items = []; // ✅ Clear wishlist
      localStorage.removeItem("wishlist");
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
