// import { createSlice } from "@reduxjs/toolkit";


// const productSlice =createSlice({
//     name:'product',
//     initialState:{
//         loading:false,
//         product:{}

//     },
//     reducers:{
//         productRequest(state,action){
//             return {
//                 loading:true,
//             }
//         },
//         productSuccess(state,action){
//             return {
//                 loading:false,
//                 product:action.payload.product,
            
//             }
//         },
//         productFail(state,action){
//             return{
//                 loading:false,
//                 error:action.payload

//             }
//         },
//         clearProduct(state) {
//             state.product = {};  // ✅ Clear product on unmount or new selection
//           },
//     }
// });

// const {actions,reducer}= productSlice;

// export const {productRequest,productSuccess,productFail,clearProduct}=actions;
// // export default store;
// export default reducer;
import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: {
        loading: false,
        product: {},
        error: null,  // ✅ Added error state to handle failures properly
        isReviewSubmitted: false,
    },
    reducers: {
        productRequest(state) {
            state.loading = true;
            state.error = null;  // ✅ Reset error on new request
        },
        productSuccess(state, action) {
            state.loading = false;
            state.product = action.payload.product;
            state.error = null;  // ✅ Clear previous errors on success
        },
        productFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        createReviewRequest(state) {
            state.loading = true;
          },
          createReviewSuccess(state) {
            state.loading = false;
            state.isReviewSubmitted = true;
            //console.log("✅ Review submitted - Redux state updated:", state);
          },
          createReviewFail(state, action) {
            state.loading = false;
            state.error = action.payload;
          },
        clearProduct(state) {
            state.product = {};  
            state.error = null;   // ✅ Clear error when clearing product
        },
        clearReviewSubmitted(state) {
            state.isReviewSubmitted = false;
          },
          clearError(state) {
            state.error = null;
          },
    },
});

export const { productRequest, productSuccess, productFail, clearProduct ,
    createReviewRequest, createReviewSuccess, createReviewFail,  clearReviewSubmitted, clearError
} = productSlice.actions;
export default productSlice.reducer;
