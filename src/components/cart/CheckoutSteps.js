import React from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutSteps({ shipping, confirmOrder, payment }) {
    const navigate = useNavigate();

    const handleNavigation = (step) => {
        if (step === "shipping" && shipping) {
            navigate("/shipping"); 
        } else if (step === "confirmOrder" && confirmOrder) {
            navigate("/order/confirm"); 
        } else if (step === "payment" && payment) {
            navigate("/payment"); 
        }
    };

    return (
        <div className="checkout-progress d-flex justify-content-center mt-5">
            <div
                className={`step-container ${shipping ? "active" : "inactive"}`}
                onClick={() => handleNavigation("shipping")}
                style={{ cursor: shipping ? "pointer" : "not-allowed" }}
            >
                <div className="step-circle">1</div>
                <div className="step-label">Shipping Info</div>
            </div>

            <div
                className={`step-line ${confirmOrder ? "active-line" : "inactive-line"}`}
            ></div>

            <div
                className={`step-container ${confirmOrder ? "active" : "inactive"}`}
                onClick={() => handleNavigation("confirmOrder")}
                style={{ cursor: confirmOrder ? "pointer" : "not-allowed" }}
            >
                <div className="step-circle">2</div>
                <div className="step-label">Confirm Order</div>
            </div>

            <div
                className={`step-line ${payment ? "active-line" : "inactive-line"}`}
            ></div>

            <div
                className={`step-container ${payment ? "active" : "inactive"}`}
                onClick={() => handleNavigation("payment")}
                style={{ cursor: payment ? "pointer" : "not-allowed" }}
            >
                <div className="step-circle">3</div>
                <div className="step-label">Payment</div>
            </div>
        </div>
    );
}

