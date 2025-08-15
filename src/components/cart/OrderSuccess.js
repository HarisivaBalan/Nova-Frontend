import React from "react";
import { useNavigate } from "react-router-dom";


export default function OrderSuccess({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="overlay">
      <div className="order-success-card">
        <svg
          className="success-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="green"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for shopping with us.</p>
        <button className="order-button" onClick={() => navigate("/orders")}>
          Go to Orders
        </button>
        <button className="close-button" onClick={()=>navigate("/")}>
          Close
        </button>
      </div>
    </div>
  );
}
