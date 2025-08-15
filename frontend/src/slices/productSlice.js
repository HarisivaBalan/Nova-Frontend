// // import { createSlice } from '@reduxjs/toolkit';
// // const initialState = {
// //   loading: false,
// //     // Holds single product details
// //   products: [], // Holds multiple products (fix)
// //   error: null,
// //   productsCount: 0,
// //   isReviewSubmitted: false,
// //   resPerPage: 0,
// // };
// // const productsSlice = createSlice({
// //   name: 'products',
// //   initialState,
// //   reducers: {
// //     // Fetching multiple products
// //     productsRequest(state) {
// //       state.loading = true;
// //       state.error = null;
// //     },
// //     productsSuccess(state, action) {
// //       state.loading = false;
// //       state.products = action.payload.products;
// //       state.productsCount = action.payload.count;
// //       state.resPerPage = action.payload.resperpage;
// //       state.error = null;
// //     },
// //     productsFail(state, action) {
// //       state.loading = false;
// //       state.error = action.payload;
// //     },

// //     // ✅ New Reducer to merge Laptops & Accessories
// //     mergeProductsSuccess(state, action) {
// //   state.loading = false;
// //   state.products = action.payload.products||[];
// //   state.productsCount = action.payload.productsCount||0; // ✅ Update total product count
// //   state.resPerPage = action.payload.resPerPage||12; // ✅ Ensure per-page count is set
// //   state.error = null;
// // },


// //     // Fetching single product details
// //     productRequest(state) {
// //       state.loading = true;
// //       state.error = null;
// //     },
// //     productSuccess(state, action) {
// //       state.loading = false;
// //       state.product = action.payload;
// //       state.error = null;
// //     },
// //     productFail(state, action) {
// //       state.loading = false;
// //       state.error = action.payload;
// //     },
// //     setCategories: (state, action) => {
// //       console.log("🔄 Updating Redux: ", action.payload); // ✅ Debug Redux update
// //       state.categories = action.payload.categories || []; // ✅ Ensure default
// //       state.totalCategories = action.payload.totalCategories || 0;
// //     },
// //   },
// // });

// // // ✅ Export actions
// // export const { 
// //   productsRequest, productsSuccess, productsFail, 
// //   productRequest, productSuccess, productFail,  
// //   mergeProductsSuccess,setCategories // ✅ Export new merge action
// // } = productsSlice.actions;

// // // ✅ Export the reducer
// // export default productsSlice.reducer;


// // // Export actions
// // ;
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   loading: false,
//   products: [],
//   product: {}, // ✅ Fix: Add product details state
//   error: null,
//   productsCount: 0,
//   isReviewSubmitted: false,
//   resPerPage: 0,
//   categories: [], // ✅ Ensure categories are in initial state
//   totalCategories: 0,
// };

// const productsSlice = createSlice({
//   name: 'products',
//   initialState,
//   reducers: {
//     // Fetching multiple products
//     productsRequest(state) {
//       state.loading = true;
//       state.error = null;
//     },
//     productsSuccess(state, action) {
//       state.loading = false;
//       state.products = action.payload.products || [];
//       state.productsCount = action.payload.count || 0;
//       state.resPerPage = action.payload.resperpage || 6;
//       state.error = null;
//     },
//     productsFail(state, action) {
//       state.loading = false;
//       state.error = action.payload;
//     },

//     // ✅ Merge Products Instead of Overwriting
//     mergeProductsSuccess(state, action) {
//       state.loading = false;
//       state.products = [...state.products, ...action.payload.products]; // ✅ Merge products
//       state.productsCount = action.payload.productsCount || 0;
//       state.resPerPage = action.payload.resPerPage || 6;
//       state.error = null;
//     },

//     // Fetching single product details
//     productRequest(state) {
//       state.loading = true;
//       state.error = null;
//     },
//     productSuccess(state, action) {
//       state.loading = false;
//       state.product = action.payload || {}; // ✅ Ensure product is an object
//       state.error = null;
//     },
//     productFail(state, action) {
//       state.loading = false;
//       state.error = action.payload;
//     },

//     // ✅ Update categories in Redux
//     setCategories: (state, action) => {
//       console.log("🔄 Updating Redux: ", action.payload);
//       state.categories = Array.isArray(action.payload.categories) ? action.payload.categories : [];
//       state.totalCategories = Number(action.payload.totalCategories) || 0;
//     },
//   },
// });

// // ✅ Export actions
// export const { 
//   productsRequest, productsSuccess, productsFail, 
//   productRequest, productSuccess, productFail,  
//   mergeProductsSuccess, setCategories
// } = productsSlice.actions;

// // ✅ Export the reducer
// export default productsSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  products: [],
  product: {}, // ✅ Fix: Ensure product state exists
  error: null,
  productsCount: 0,
  isReviewSubmitted: false,
  resPerPage: 0,
  categories: [], // ✅ Ensure categories exist in initial state
  totalCategories: 0,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // 🔄 Fetching multiple products
    productsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    productsSuccess(state, action) {
      state.loading = false;
      state.products = action.payload.products || [];
      state.productsCount = action.payload.count || 0;
      state.resPerPage = action.payload.resPerPage || 6;
      state.error = null;
    },
    productsFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔄 Merge Products (Fix: Avoid duplicate accumulation)
    mergeProductsSuccess(state, action) {
      state.loading = false;
      state.products = action.payload.products || []; // ✅ Overwrite instead of appending
      state.productsCount = action.payload.productsCount ?? state.productsCount;
      state.resPerPage = action.payload.resPerPage || 6;
      state.error = null;
    },

    // 🔄 Fetching single product details
    productRequest(state) {
      state.loading = true;
      state.error = null;
    },
    productSuccess(state, action) {
      state.loading = false;
      state.product = action.payload || {}; // ✅ Ensure product is an object
      state.error = null;
    },
    productFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔄 Update categories in Redux
    setCategories: (state, action) => {
      // console.log("🔄 Updating Redux categories:", action.payload);
      state.categories = Array.isArray(action.payload.categories) ? action.payload.categories : [];
      state.totalCategories = Number(action.payload.totalCategories) || 0;
    },
  },
});

// ✅ Export actions
export const { 
  productsRequest, productsSuccess, productsFail, 
  productRequest, productSuccess, productFail,  
  mergeProductsSuccess, setCategories
} = productsSlice.actions;

// ✅ Export the reducer
export default productsSlice.reducer;
