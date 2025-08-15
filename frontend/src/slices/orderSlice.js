import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    orderDetail: {},
    userOrders: [],
    loading: false,
    error: null // Ensure error is in the state
};

// Create the slice
const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        createOrderRequest(state) {
            state.loading = true;
        },
        createOrderSuccess(state, action) {
            state.loading = false; // Set loading to false after success
            state.orderDetail = action.payload.order;
        },
        createOrderFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        userOrderRequest(state) {
            state.loading = true;
        },
        userOrderSuccess(state, action) {
            state.loading = false; // Set loading to false after success
            state.userOrders = action.payload.orders;
        },
        userOrderFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        orderDetailRequest(state) {
            state.loading = true;
        },
        orderDetailSuccess(state, action) {
            state.loading = false; // Set loading to false after success
            state.orderDetail = action.payload.order;
        },
        orderDetailFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

// Export actions
export const { createOrderFail, createOrderRequest, createOrderSuccess, clearError,
    userOrderRequest,userOrderSuccess,userOrderFail,
    orderDetailFail,orderDetailRequest,orderDetailSuccess
 } = orderSlice.actions;

// Export the reducer to configure the store
export default orderSlice.reducer;
