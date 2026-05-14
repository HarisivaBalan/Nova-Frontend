import { createSlice } from "@reduxjs/toolkit";

// Load user products from localStorage
const loadMyProductsFromStorage = () => {
  const stored = localStorage.getItem("myProducts");
  return stored ? JSON.parse(stored) : [];
};

const myProductsSlice = createSlice({
  name: "myProducts",
  initialState: {
    items: loadMyProductsFromStorage(), // ✅ Load saved user products
  },
  reducers: {
    addMyProduct: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item._id === product._id);
      if (!exists) {
        state.items.push(product);
        localStorage.setItem("myProducts", JSON.stringify(state.items));
      }
    },
    removeMyProduct: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem("myProducts", JSON.stringify(state.items));
    },
    setMyProducts: (state, action) => {
      // Optional: if you later load from backend
      state.items = action.payload || [];
      localStorage.setItem("myProducts", JSON.stringify(state.items));
    },
    clearMyProducts: (state) => {
      state.items = [];
      localStorage.removeItem("myProducts");
    },
  },
});

export const {
  addMyProduct,
  removeMyProduct,
  clearMyProducts,
  setMyProducts,
} = myProductsSlice.actions;

export default myProductsSlice.reducer;
