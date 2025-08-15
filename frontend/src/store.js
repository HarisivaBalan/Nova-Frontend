import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import { thunk } from "redux-thunk";
import productsReducer from './slices/productSlice'
import productReducer from './slices/singleproductSlice'
//import { thunk } from "redux-thunk";
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import orderReducer from './slices/orderSlice'
import wishlistReducer from "./slices/wishlistslice";
// import store from "./store";

const reducer = combineReducers({
    productsState:productsReducer,
    productState:productReducer,
    authState:authReducer,
    cartState:cartReducer,
    orderState:orderReducer,
    wishlist:wishlistReducer

})
const store=configureStore({
    reducer,
    //middleware:applyMiddleware(thunk) 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})


// store.subscribe(() => {
//   saveWishlistToStorage(store.getState());
// });

export default store;

