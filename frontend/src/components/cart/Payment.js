import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { orderCompleted } from "../../slices/cartSlice";
import CheckoutSteps from "./CheckoutSteps";
import MetaData from "../layout/MetaData";
import { createOrder } from "../../actions/orderAction";
import { clearError as clearOrderError } from "../../slices/orderSlice";
//import { validateShipping } from "../cart/Shipping";

export default function Payment() {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { user } = useSelector(state => state.authState);
    const { items: cartItems, shippingInfo } = useSelector(state => state.cartState);
    const orderError = useSelector(state => state.orderState.error);
    
    const [loading, setLoading] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);
    useEffect(() => {
        const storedOrderInfo = sessionStorage.getItem("orderInfo");
        if (storedOrderInfo) {
            setOrderInfo(JSON.parse(storedOrderInfo));
        } else {
            toast.error("Order information is missing!");
            navigate("/cart");
        }
    }, [navigate]);
    
    
    useEffect(() => {
        if (orderError) {
            toast.error(orderError, {
                position: "top-center",
                onOpen: () => dispatch(clearOrderError()),
            });
        }
    }, [orderError, dispatch]);
    

    if (!orderInfo) return null; // Prevent rendering if orderInfo is missing
    if (!user || !user.name || !user.email) {
        toast.error("User info missing, please login again.");
        navigate("/login");
        return null;
    }
    
    const amount = Math.round(orderInfo.totalPrice * 100); // Convert to smallest currency unit

    const paymentData = {
        amount,
        shipping: {
            name: user.name,
            address: {
                city: shippingInfo.city,
                postal_code: shippingInfo.postalCode,
                country: shippingInfo.country,
                state: shippingInfo.state,
                line1: shippingInfo.address,
            },
            phone: shippingInfo.phoneNo,
        },
    };

    const order = {
        orderItems: cartItems,
        shippingInfo,
        itemsPrice: orderInfo.itemsPrice,
        shippingPrice: orderInfo.shippingPrice,
        taxPrice: orderInfo.taxPrice,
        totalPrice: orderInfo.totalPrice,
    };

    // const submitHandler = async (e) => {
    //     e.preventDefault();

        

    //     document.querySelector("#pay_btn").disabled = true;
    //     setLoading(true);

    //     try {
    //         const { data } = await axios.post("/api/v1/payment/process", paymentData);
    //         const clientSecret = data.client_secret;

    //         const result = await stripe.confirmCardPayment(clientSecret, {
    //             payment_method: {
    //                 card: elements.getElement(CardNumberElement),
    //                 billing_details: {
    //                     name: user.name,
    //                     email: user.email,
    //                 },
    //             },
    //         });

    //         if (result.error) {
    //             toast.error(result.error.message, { position: "top-center" });
    //             document.querySelector("#pay_btn").disabled = false;
    //             setLoading(false);
    //         } else {
    //             if (result.paymentIntent.status === "succeeded") {
    //                 toast.success("Payment Success!", { position: "top-center" });

    //                 order.paymentInfo = {
    //                     id: result.paymentIntent.id,
    //                     status: result.paymentIntent.status,
    //                 };

    //                 dispatch(orderCompleted());
    //                 dispatch(createOrder(order));
    //                 setTimeout(() => navigate("/order/success"), 500);
    //             } else {
    //                 toast.warning("Payment failed. Please try again.", { position: "top-center" });
    //                 document.querySelector("#pay_btn").disabled = false;
    //                 setLoading(false);
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Payment error:", error);
    //         toast.error("Something went wrong. Please try again.", { position: "top-center" });
    //         document.querySelector("#pay_btn").disabled = false;
    //         setLoading(false);
    //     }
    // };
    const submitHandler = async (e) => {
        e.preventDefault();
    
        // Disable the payment button and set loading state to true
        setLoading(true);
    
        try {
            // Send payment request to backend
            const { data } = await axios.post("/api/v1/payment/process", paymentData);
            const clientSecret = data.client_secret;
    
            // Use Stripe to confirm the payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                    },
                },
            });
    
            if (result.error) {
                // Handle error scenario
                toast.error(result.error.message, { position: "top-center" });
            } else if (result.paymentIntent.status === "succeeded") {
                // Handle success scenario
                toast.success("Payment Success!", { position: "top-center" });
    
                // Update order with payment details
                order.paymentInfo = {
                    id: result.paymentIntent.id,
                    status: result.paymentIntent.status,
                };
    
                // Dispatch actions for order completion and creation
                dispatch(orderCompleted());
                dispatch(createOrder(order));
    
                // Redirect to success page
                setTimeout(() => navigate("/order/success"), 500);
            } else {
                // Handle payment failure
                toast.warning("Payment failed. Please try again.", { position: "top-center" });
            }
        } catch (error) {
            // Handle unexpected errors
            console.error("Payment error:", error);
            toast.error("Something went wrong. Please try again.", { position: "top-center" });
        } finally {
            // Reset loading state and re-enable the button
            setLoading(false);
            

        }
    };
    

    return (
        <>
            <MetaData title="Payment" />
            <CheckoutSteps shipping confirmOrder payment />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-4">Card Info</h1>
                        <div className="form-group">
                            <label htmlFor="card_num_field">Card Number</label>
                            <CardNumberElement id="card_num_field" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="card_exp_field">Card Expiry</label>
                            <CardExpiryElement id="card_exp_field" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="card_cvc_field">Card CVC</label>
                            <CardCvcElement id="card_cvc_field" className="form-control" />
                        </div>
                        <button
                            id="pay_btn"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : `Pay ₹${orderInfo.totalPrice}`}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
