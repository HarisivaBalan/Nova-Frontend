import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Logo Section */}
        <div className="footer-logo">
          <h2>
            <span className="icon">&#127869;</span> Nova Mart
          </h2>
          <p>Your one-stop destination for premium products at unbeatable prices</p>
          <div className="social-icons1">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>

        {/* Footer Links Section */}
        <div className="footer-links">
          {/* Pages Links */}
          <div className="pages">
            <h4>Pages</h4>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/orders">Orders</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/delivery">Delivery</a>
              </li>
            </ul>
          </div>

          {/* Utility Pages */}
          <div className="utility-pages">
            <h4>Utility Pages</h4>
            <ul>
              <li>
                <a href="/privacy-policy">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms-and-conditions">Terms and Conditions</a>
              </li>
              <li>
                <a href="/faq">FAQ</a>
              </li>
              <li>
                <a href="/404">404 Not Found</a>
              </li>
              <li>
                <a href="/licenses">Licenses</a>
              </li>
              <li>
                <a href="/return-refund">Return and Refund Policy</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Options Section */}
        <div className="footer-instagram">
          <h4>Payment Options</h4>
          <div className="instagram-images">
            <img src="/images/visa-icon-2048x1313-o6hi8q5l.png" alt="VISA" />
            <img src="/images/Mastercard-Symbol.jpg" alt="MASTER" />
            <img src="/images/pAYNEW.png" alt="PAYPAL" />
            <img src="/images/Google-Pay-hero_1.webp" alt="GPAY" />
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="footer-bottom">
        <p>Copyright © 2023 Hashtag Developer. All Rights Reserved</p>
      </div>
    </footer>
  );
}
