import axios from "axios"
import { addCartItemRequest, addCartItemSuccess } from "../slices/cartSlice"

export const addCartItem =(id,quantity)=>async(dispatch)=>{
    try{
        dispatch(addCartItemRequest())
        const{data}=await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/${id}`)
        dispatch(addCartItemSuccess({
            product:data.product._id,
            name:data.product.name,
            price:data.product.price,
            image:data.product.images[0].url,
            stock:data.product.stock,
            quantity
        }))
    }catch(error){

    }
}