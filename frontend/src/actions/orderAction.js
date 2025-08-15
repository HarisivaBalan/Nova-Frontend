import axios from "axios"
import { createOrderFail, createOrderRequest, createOrderSuccess, orderDetailFail, orderDetailRequest, orderDetailSuccess, userOrderFail, userOrderRequest, userOrderSuccess } from "../slices/orderSlice"

export const createOrder = order =>async(dispatch)=>{
    try{
        dispatch(createOrderRequest())
        const {data}=await axios.post(`${process.env.REACT_APP_API_BASE_URL}/order/new`,order)
        dispatch(createOrderSuccess(data))
    }
    catch(error){
        dispatch(createOrderFail(error.response.data.message))
    }
}
export const userOrders = ()=> async(dispatch)=>{
    try{
        dispatch(userOrderRequest())
        const {data}=await axios.get(`${process.env.REACT_APP_API_BASE_URL}/myorders`)
        dispatch(userOrderSuccess(data))
    }
    catch(error){
        dispatch(userOrderFail(error.response.data.message))
    }
}
export const orderDetail = id=> async(dispatch)=>{
    try{
        dispatch(orderDetailRequest())
        const {data}=await axios.get(`${process.env.REACT_APP_API_BASE_URL}/order/${id}`)
        dispatch(orderDetailSuccess(data))
    }
    catch(error){
        dispatch(orderDetailFail(error.response.data.message))
    }
}