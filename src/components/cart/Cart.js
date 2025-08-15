import {Fragment} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
import { decreaseCartItemQty, increaseCartItemQty, removeItemFromCart } from '../../slices/cartSlice'
import React from 'react';

export default function Cart(){
    const {items}=useSelector(state=>state.cartState);
    //const[quantity,setQuantity]=useState(1);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const increaseQty = (item) => {
        const count = item.quantity;
        if(item.stock ===0 || count >= item.stock) return;
        dispatch(increaseCartItemQty(item.product))

    }
    const decreaseQty = (item) => {
        const count = item.quantity;
        if (count ===1) return;
        dispatch(decreaseCartItemQty(item.product))
    }
    const checkoutHandler=()=>
    {
        navigate('/login?redirect=shipping')
    }
    return(
        <div className="d-flex flex-column min-vh-100">
        <div className="flex-grow-1">
            {items.length === 0 ? (
                
                     <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center">
                    <img src="/images/emptycart.webp" alt="Empty Cart" style={{ width: "150px", marginBottom: "20px" }} />
                    <h2>Your cart is empty</h2>
                    <p className="mt-2">Looks like you haven’t added anything to your cart yet.</p>
                    <Link to="/" className="btn btn-primary mt-3">
                    Start Shopping
                    </Link>
                </div>
               
                ) :
            <Fragment>
                
            <h2 className="mt-5">Your Cart: <b>{items.length}</b></h2>
            <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8">
                {items.map(item=>{
                    return(
                    <Fragment key={item.id||item.product}>
                        <hr />
                <div className="cart-item">
                    <div className="row">
                        <div className="col-4 col-lg-3">
                            <img src={item.image} alt={item.name} height="90" width="115"/>
                        </div>

                        <div className="col-5 col-lg-3">
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </div>


                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                            <p id="card_item_price">₹{item.price}</p>
                        </div>

                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus"onClick={() => decreaseQty(item)}>-</span>
                                <input type="number" className="form-control count d-inline" value={item.quantity} readOnly />

								<span className="btn btn-primary plus" onClick={() => increaseQty(item)}>+</span>
                            </div>
                        </div>

                        <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                            <i id="delete_cart_item" className="fa fa-trash btn btn-danger"onClick={()=>dispatch(removeItemFromCart(item.product))}></i>
                        </div>

                    </div>
                </div>

            </Fragment>
)})}
                
            </div>

            <div className="col-12 col-lg-3 my-4">
                <div id="order_summary">
                    <h4>Order Summary</h4>
                    <hr />
                    <p>Subtotal:  <span className="order-summary-values">{items.reduce((acc,item)=>(acc+item.quantity),0)}(Units)</span></p>
                    <p>Est. total: <span className="order-summary-values">₹{items.reduce((acc,item)=>(acc+item.quantity*item.price),0)}</span></p>
    
                    <hr />
                    <button id="checkout_btn" className="btn btn-primary btn-block"onClick={checkoutHandler}>Check out</button>
                </div>
            </div>
        </div>
        </Fragment>
    }
    </div>
    </div>
    
       
    )
}